import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5185/api/v1';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
});

// Variables to handle multiple simultaneous requests when token expires
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: any) => void;
}> = [];

// Helper to process the queue of failed requests
const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Request interceptor - Add Access Token
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('ems-token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

// Response interceptor - Handle 401 and Silent Refresh
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // If error is 401 and we haven't already retried this request
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {

            if (isRefreshing) {
                // If a refresh is already happening, put this request in a queue to wait
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                    .then(token => {
                        originalRequest.headers.Authorization = 'Bearer ' + token;
                        return api(originalRequest);
                    })
                    .catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Get refresh token (Assuming you store it in local storage)
                const refreshToken = localStorage.getItem('ems-refresh-token');
                if (!refreshToken) throw new Error('No refresh token available');

                // Call backend refresh endpoint (Use axios directly to avoid interceptor loop)
                const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
                const newAccessToken = data.data.accessToken;
                const newRefreshToken = data.data.refreshToken;

                // Update tokens in local storage
                localStorage.setItem('ems-token', newAccessToken);
                localStorage.setItem('ems-refresh-token', newRefreshToken);

                // Update auth store state manually (if using Zustand persist, it's stored under 'ems-auth')
                const authStateStr = localStorage.getItem('ems-auth');
                if (authStateStr) {
                    const authState = JSON.parse(authStateStr);
                    authState.state.token = newAccessToken;
                    authState.state.refreshToken = newRefreshToken;
                    localStorage.setItem('ems-auth', JSON.stringify(authState));
                }

                // Attach new token and process waiting requests
                api.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;
                originalRequest.headers.Authorization = 'Bearer ' + newAccessToken;

                processQueue(null, newAccessToken);

                return api(originalRequest); // Retry the original failed request
            } catch (err) {
                processQueue(err, null);
                // Refresh token also failed/expired -> Force Logout
                console.warn('[API] Refresh token expired. Logging out.');
                localStorage.removeItem('ems-token');
                localStorage.removeItem('ems-refresh-token');
                localStorage.removeItem('ems-auth');
                window.location.href = '/login';
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;