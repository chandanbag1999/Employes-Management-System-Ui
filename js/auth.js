async function login(email, password) {
    // Call the api 
    const data = await fetchApi("/auth/login", "POST", { email, password });

    // Store everything in LocalStorage
    localStorage.setItem(CONFIG.STORAGE_KEYS.TOKEN, data.token);
    localStorage.setItem(CONFIG.STORAGE_KEYS.USERNAME, data.userName);
    localStorage.setItem(CONFIG.STORAGE_KEYS.ROLE, data.role);

    // Go to dashbord
    window.location.hash = "#/dashboard";
};

async function register(userName, email, password) {
    // Call the api
    const data = await fetchApi('/auth/register', 'POST', { userName, email, password });

    // Auto-login after register (store and redirect)
    localStorage.setItem(CONFIG.STORAGE_KEYS.TOKEN, data.token);
    localStorage.setItem(CONFIG.STORAGE_KEYS.USERNAME, data.userName);
    localStorage.setItem(CONFIG.STORAGE_KEYS.ROLE, data.role);

    window.location.hash = '#/dashboard';
};

function logout() {
    localStorage.removeItem(CONFIG.STORAGE_KEYS.TOKEN);
    localStorage.removeItem(CONFIG.STORAGE_KEYS.USERNAME);
    localStorage.removeItem(CONFIG.STORAGE_KEYS.ROLE);

    window.location.hash = '#/login';
};

// Helper Method
function isLoggedIn() {
    return !!localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN);
};

function getUserName() {
    return localStorage.getItem(CONFIG.STORAGE_KEYS.USERNAME);
};

function getRole() {
    return localStorage.getItem(CONFIG.STORAGE_KEYS.ROLE);
};

function isAdmin() {
    return getRole() === CONFIG.ROLES.ADMIN;
};
