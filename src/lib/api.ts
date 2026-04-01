import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5185/api/v1';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
});

let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: any) => void;
}> = [];

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

// ✅ ROOT FIX: Token ko multiple sources se dhundo
const getAccessToken = (): string | null => {
    // Source 1: Direct localStorage key (login ke waqt set hota hai)
    const directToken = localStorage.getItem('ems-token');
    if (directToken) return directToken;

    // Source 2: Zustand persist store (ems-auth key mein)
    try {
        const authStateStr = localStorage.getItem('ems-auth');
        if (authStateStr) {
            const parsed = JSON.parse(authStateStr);
            const token = parsed?.state?.token;
            if (token) {
                // ✅ Sync back to direct key taaki aage direct mile
                localStorage.setItem('ems-token', token);
                return token;
            }
        }
    } catch {
        // JSON parse fail — ignore
    }

    return null;
};

// ✅ App startup pe token sync karo immediately
const syncTokensOnStartup = () => {
    try {
        const authStateStr = localStorage.getItem('ems-auth');
        if (authStateStr) {
            const parsed = JSON.parse(authStateStr);
            const token = parsed?.state?.token;
            const refreshToken = parsed?.state?.refreshToken;

            if (token && !localStorage.getItem('ems-token')) {
                localStorage.setItem('ems-token', token);
            }
            if (refreshToken && !localStorage.getItem('ems-refresh-token')) {
                localStorage.setItem('ems-refresh-token', refreshToken);
            }

            // Axios default header bhi set karo
            if (token) {
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            }
        }
    } catch {
        // Ignore
    }
};

// ✅ Module load hote hi sync karo
syncTokensOnStartup();

// Request interceptor
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = getAccessToken();
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {

            if (isRefreshing) {
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
                const refreshToken = localStorage.getItem('ems-refresh-token');
                if (!refreshToken) throw new Error('No refresh token available');

                const { data } = await axios.post(
                    `${API_BASE_URL}/auth/refresh`,
                    { refreshToken }
                );
                const newAccessToken = data.data.accessToken;
                const newRefreshToken = data.data.refreshToken;

                // ✅ Teeno jagah update karo
                localStorage.setItem('ems-token', newAccessToken);
                localStorage.setItem('ems-refresh-token', newRefreshToken);

                try {
                    const authStateStr = localStorage.getItem('ems-auth');
                    if (authStateStr) {
                        const authState = JSON.parse(authStateStr);
                        if (authState?.state) {
                            authState.state.token = newAccessToken;
                            authState.state.refreshToken = newRefreshToken;
                            localStorage.setItem('ems-auth', JSON.stringify(authState));
                        }
                    }
                } catch {
                    // Ignore parse error
                }

                api.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;
                originalRequest.headers.Authorization = 'Bearer ' + newAccessToken;

                processQueue(null, newAccessToken);
                return api(originalRequest);

            } catch (err) {
                processQueue(err, null);
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