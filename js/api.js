async function fetchApi(endpoint, method = "GET", body = null) {

    const url = CONFIG.API_BASE_URL + endpoint;

    const headers = {
        "Content-Type": "application/json",
    };

    const token = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN);
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    };

    const options = {
        method: method,
        headers: headers,
    };

    if (body) {
        options.body = JSON.stringify(body);
    };

    const response = await fetch(url, options);

    // 401 = token expired or invalid
    if (response.status === 401) {
        localStorage.removeItem(CONFIG.STORAGE_KEYS.TOKEN);
        localStorage.removeItem(CONFIG.STORAGE_KEYS.USERNAME);
        localStorage.removeItem(CONFIG.STORAGE_KEYS.ROLE);
        window.location.hash = '#/login';
        throw new Error("Session expired. Please login again.");
    };

    // Parse response (some responses like DELETE have no body)
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
        throw new Error(data?.message || "Something went wrong");
    };

    return data;
};