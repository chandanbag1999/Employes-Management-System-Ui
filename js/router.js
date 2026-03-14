const routes = {
    '#/login':       renderLoginPage,
    '#/register':    renderRegisterPage,
    '#/dashboard':   renderDashboardPage,
    '#/employees':   renderEmployeesPage,
    '#/departments': renderDepartmentsPage,
};

function handleRouteChange() {
    // Always close mobile drawer on route change
    if (typeof closeSidebar === 'function') {
        closeSidebar();
    }

    const hash = window.location.hash || '#/login';

    // AUTH GUARD 1: Not logged in + trying to access a protected page
    if (!isLoggedIn() && hash !== '#/login' && hash !== '#/register') {
        window.location.hash = '#/login';
        return; // Stop here
    };

    // AUTH GUARD 2: Already logged in + trying to visit login/register
    if (isLoggedIn() && (hash === '#/login' || hash === '#/register')) {
        window.location.hash = '#/dashboard';
        return; // Stop here
    };

    // Find the matching page function
    const renderPage = routes[hash];

    if (renderPage) {
        renderPage(); // Call the page to render itself
    } else {
        window.location.hash = '#/dashboard'; // Unknown route → go home
    };
};

// When hash changes (user clicks a nav link, back/forward button)
window.addEventListener('hashchange', handleRouteChange);

// When page first loads (user opens index.html fresh)
window.addEventListener('DOMContentLoaded', handleRouteChange);


