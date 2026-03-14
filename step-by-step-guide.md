# 🏗️ Employee Management System — Frontend Build Guide
## Learn → Understand → Implement (Yourself)

This guide teaches you **what, why, and how** for every piece. You implement it. No copy-paste — build your own understanding.

---

# 📐 STEP 0: Understand the Architecture First (Before Any Code)

## WHAT is a Single Page Application (SPA)?

In a normal website, when you click a link → browser makes a **new request to server** → server sends a **whole new HTML page** → browser throws away old page → renders new one. This causes **full page reloads** (white flash, slow).

In an SPA, you have **ONE `index.html` file**. When user clicks "Employees" or "Dashboard", you **don't reload the page**. Instead:
1. JavaScript **catches the click**
2. **Clears the content area** (a `<div>`)
3. **Renders new content** into that same div
4. **Updates the URL** (using `#/employees`) so the back button works

> [!TIP]
> **Real-world analogy**: Think of a TV. The TV (index.html) stays the same — you just change the channel (page content). You don't buy a new TV every time you want to watch something else.

## WHY SPA for this project?

1. **No build step needed** — React/Angular need `npm`, webpack, transpilation. Your frontend is just files you open in a browser.
2. **Feels like a real app** — No page flickers. Instant navigation. This is how HR software (BambooHR, Workday) works.
3. **Backend-focused engineers do this** — You're proving you can consume APIs cleanly. You don't need a massive framework for that.

## HOW does the URL routing work?

```
https://myapp.com/index.html#/login       → Shows login page
https://myapp.com/index.html#/dashboard   → Shows dashboard
https://myapp.com/index.html#/employees   → Shows employee list
```

The `#` (hash) is the key. Everything after `#` is called a **fragment**. The browser **never sends the fragment to the server** — it's entirely client-side. JavaScript can read it with `window.location.hash`.

```
Browser event: window.onhashchange
↓
Your router reads: window.location.hash → "#/employees"
↓
Finds matching page function: routes['#/employees'] → renderEmployeesPage()
↓
That function generates HTML and puts it inside: document.getElementById('app').innerHTML = html
```

> [!IMPORTANT]
> This is exactly how Gmail worked before modern frameworks existed. Hash routing is battle-tested, simple, and perfect for framework-free SPAs.

---

# 📁 STEP 1: Create Your Folder Structure

## WHAT are we creating?

```
EmployeeManagementUI/
├── index.html                  ← The ONE HTML file (SPA shell)
├── css/
│   └── style.css               ← Your custom styles
├── js/
│   ├── config.js               ← Settings (API URL, constants)
│   ├── api.js                  ← HTTP client (talks to your .NET API)
│   ├── auth.js                 ← Login/logout/token management
│   ├── router.js               ← Hash-based page navigation
│   ├── utils.js                ← Shared helpers (toast, date format)
│   ├── components/
│   │   ├── sidebar.js          ← Left navigation menu
│   │   ├── topbar.js           ← Top header bar
│   │   ├── statsCard.js        ← Dashboard stat boxes
│   │   ├── dataTable.js        ← Reusable data table
│   │   └── modal.js            ← Popup dialogs
│   └── pages/
│       ├── login.js            ← Login page
│       ├── register.js         ← Register page
│       ├── dashboard.js        ← Dashboard home
│       ├── employees.js        ← Employee management
│       └── departments.js      ← Department management
```

## WHY this structure?

This mirrors how **enterprise frontend projects** are organized:

| Folder | Purpose | Real Company Equivalent |
|---|---|---|
| `js/config.js` | Centralized settings | Environment configs (dev/staging/prod) |
| `js/api.js` | API communication layer | API service / HTTP interceptors |
| `js/auth.js` | Authentication state | Auth service / Auth provider |
| `js/router.js` | Navigation | React Router / Angular Router |
| `js/components/` | Reusable UI pieces | React components / Angular components |
| `js/pages/` | Full page renderers | Page components / Route views |

> [!TIP]
> **In an interview**, if someone asks "How did you structure your frontend?" — you say: *"I separated concerns — API layer, auth layer, router, reusable components, and page-level modules. Each file has a single responsibility."* That's the **Single Responsibility Principle (SRP)** from SOLID — applied to frontend.

## HOW to create it?

Open your terminal in the `EmployeeManagementUI/` folder and run:

```powershell
mkdir css
mkdir js
mkdir js\components
mkdir js\pages
```

Then create empty files — you'll fill them step by step:

```powershell
# Create empty files
New-Item index.html
New-Item css\style.css
New-Item js\config.js
New-Item js\api.js
New-Item js\auth.js
New-Item js\router.js
New-Item js\utils.js
New-Item js\components\sidebar.js
New-Item js\components\topbar.js
New-Item js\components\statsCard.js
New-Item js\components\dataTable.js
New-Item js\components\modal.js
New-Item js\pages\login.js
New-Item js\pages\register.js
New-Item js\pages\dashboard.js
New-Item js\pages\employees.js
New-Item js\pages\departments.js
```

---

# ⚙️ STEP 2: Build `config.js` — The Settings Hub

## WHAT is this file?

A single place for **all app-wide settings**. Instead of writing `'https://localhost:5001/api'` in 15 different files, you write it ONCE here and import it everywhere.

## WHY do we need it?

1. **One change, everywhere updated** — When you deploy to production, you change ONE line (the URL), not 15 files.
2. **No magic strings** — `CONFIG.STORAGE_KEYS.TOKEN` is self-documenting. `'ems_token'` scattered everywhere is not.
3. **Enterprise pattern** — Every real project has a config/environment file. `.env` in Node, `appsettings.json` in .NET (you already have this!).

## HOW to build it?

Think about WHAT settings your app needs:

```
1. API Base URL          → Where does your backend live?
2. LocalStorage keys     → What keys do you use to store token, username, role?
3. Role names            → "Admin", "User" — avoid hardcoding strings
4. Page size             → How many rows per table page?
5. Toast duration        → How long should notifications show?
```

Now create a `CONFIG` object:

```javascript
const CONFIG = {
    API_BASE_URL: 'https://localhost:5001/api',  // Change for production

    STORAGE_KEYS: {
        TOKEN: 'ems_token',        // JWT token
        USERNAME: 'ems_username',  // Logged-in user's name
        ROLE: 'ems_role',          // "Admin" or "User"
    },

    ROLES: {
        ADMIN: 'Admin',
        USER: 'User',
    },

    PAGE_SIZE: 10,
    TOAST_DURATION: 3500,  // milliseconds
};
```

> [!NOTE]
> **Why `const CONFIG` and not `let` or `var`?** Because configuration should **never be reassigned**. `const` prevents accidental `CONFIG = somethingElse`. The object's properties can still be read, but the reference can't change.

> [!TIP]
> **Interview connection**: Your backend's `appsettings.json` does the exact same thing — stores `JwtSettings:Secret`, `ConnectionStrings:DefaultConnection`. This is `config.js` = frontend's `appsettings.json`.

---

# 🌐 STEP 3: Build `api.js` — The HTTP Client

## WHAT is this file?

A **centralized function** that handles ALL communication with your .NET API. Every API call in the entire app goes through this one function.

## WHY centralize API calls?

Imagine you have 15 API calls scattered across your app. Each one needs to:
- Set the `Content-Type: application/json` header
- Attach the `Authorization: Bearer <token>` header
- Parse the JSON response
- Handle 401 Unauthorized (token expired → redirect to login)
- Handle network errors

If you write that 15 times, you have **15 places to maintain**. If the token header format changes, you fix 15 files. That's a nightmare.

Instead, write ONE `fetchApi()` function and call it everywhere:

```javascript
// Instead of this (BAD — repeated everywhere):
const res = await fetch('https://localhost:5001/api/employee', {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('ems_token')
    }
});

// You do this (GOOD — centralized):
const employees = await fetchApi('/employee');
```

## HOW to build it?

Your `fetchApi` function needs to do 5 things:

### Step 3.1: The function signature

```javascript
async function fetchApi(endpoint, method = 'GET', body = null) { ... }
```

- `endpoint` — just the path like `'/employee'` or `'/auth/login'` (NOT the full URL)
- `method` — GET, POST, PUT, DELETE (default GET because most calls are GET)
- `body` — the data to send (for POST/PUT). `null` for GET/DELETE.

### Step 3.2: Build the full URL

```javascript
const url = CONFIG.API_BASE_URL + endpoint;
// Result: "https://localhost:5001/api" + "/employee" = "https://localhost:5001/api/employee"
```

### Step 3.3: Build the headers

```javascript
const headers = { 'Content-Type': 'application/json' };

const token = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN);
if (token) {
    headers['Authorization'] = `Bearer ${token}`;
}
```

> [!IMPORTANT]
> **Why check `if (token)` before adding the header?** Because `/auth/login` and `/auth/register` are `[AllowAnonymous]` — they don't need a token. When the user hasn't logged in yet, there's no token in localStorage, so we shouldn't send a broken header.

### Step 3.4: Build the fetch options and make the call

```javascript
const options = {
    method: method,
    headers: headers,
};

if (body) {
    options.body = JSON.stringify(body);
}

const response = await fetch(url, options);
```

> [!NOTE]
> **Why `JSON.stringify(body)`?** The `fetch` API sends raw text over the network. Your JavaScript object `{ firstName: "Rahul", ... }` needs to be converted to a JSON string `'{"firstName":"Rahul",...}'` before sending. Your .NET backend's `[FromBody]` deserializer expects JSON format.

### Step 3.5: Handle the response

```javascript
// If server returned 401 Unauthorized → token expired or invalid
if (response.status === 401) {
    // Clear stored credentials
    localStorage.removeItem(CONFIG.STORAGE_KEYS.TOKEN);
    localStorage.removeItem(CONFIG.STORAGE_KEYS.USERNAME);
    localStorage.removeItem(CONFIG.STORAGE_KEYS.ROLE);
    // Redirect to login
    window.location.hash = '#/login';
    throw new Error('Session expired. Please login again.');
}

// If response has content, parse it as JSON
// Some responses (like 204 No Content) have no body
const text = await response.text();
const data = text ? JSON.parse(text) : null;

// If not OK (400, 404, 409, 500, etc.), throw with server's error message
if (!response.ok) {
    throw new Error(data?.message || 'Something went wrong');
}

return data;
```

### The complete mental model

```
Your Page Code             →  fetchApi('/employee')
                            ↓
api.js fetchApi()          →  Builds URL + headers + body
                            ↓
fetch()                    →  Sends HTTP request to .NET API
                            ↓
.NET API                   →  Processes request, returns JSON
                            ↓
api.js fetchApi()          →  Checks status, parses JSON, handles errors
                            ↓
Your Page Code             ←  Gets back clean JavaScript object
```

> [!TIP]
> **Interview gold**: *"I built a centralized API client that auto-attaches the JWT token, handles 401 redirects, and provides a clean interface to all pages. It's like an HTTP interceptor in Angular or an Axios instance in React."*

---

# 🔐 STEP 4: Build `auth.js` — Authentication Manager

## WHAT is this file?

Manages the entire auth lifecycle: login, register, logout, and checking who's currently logged in.

## WHY is auth separate from api.js?

**Separation of Concerns**:
- `api.js` = "HOW to talk to the server" (generic HTTP client)
- `auth.js` = "WHO is the user and WHAT can they do" (domain logic)

These are different responsibilities. `api.js` doesn't care whether you're calling `/employee` or `/auth/login`. `auth.js` specifically knows about tokens, roles, and user identity.

## HOW to build it?

Your `Auth` module needs these functions:

### Step 4.1: `login(email, password)`

```
1. Call fetchApi('/auth/login', 'POST', { email, password })
2. If successful, API returns: { token: "eyJ...", userName: "Chandan", role: "Admin" }
3. Store all three values in localStorage
4. Navigate to #/dashboard
```

> [!NOTE]
> **Why localStorage?** Because HTTP is **stateless** — each request is independent. The server doesn't remember you between requests. So YOU must store the token in the browser and send it with every request. `localStorage` persists across tabs and browser restarts (unlike `sessionStorage` which dies when you close the tab).

### Step 4.2: `register(username, email, password)`

```
1. Call fetchApi('/auth/register', 'POST', { userName, email, password })
2. If successful, API returns same shape: { token, userName, role }
3. Store all three in localStorage (auto-login after registration)
4. Navigate to #/dashboard
```

### Step 4.3: `logout()`

```
1. Remove token, username, role from localStorage
2. Navigate to #/login
```

### Step 4.4: Helper getters

```javascript
function isLoggedIn()  { return !!localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN); }
function getToken()    { return localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN); }
function getUserName() { return localStorage.getItem(CONFIG.STORAGE_KEYS.USERNAME); }
function getRole()     { return localStorage.getItem(CONFIG.STORAGE_KEYS.ROLE); }
function isAdmin()     { return getRole() === CONFIG.ROLES.ADMIN; }
```

> [!IMPORTANT]
> **What does `!!` mean?** It converts any value to a boolean. `localStorage.getItem()` returns `null` if the key doesn't exist, or the value string if it does. `!!null` = `false`, `!!"eyJ..."` = `true`. So `isLoggedIn()` returns `true` only if a token exists.

### The auth flow mental model

```
User types email/password → clicks "Login"
    ↓
auth.login(email, password)
    ↓
fetchApi('/auth/login', 'POST', { email, password })
    ↓
.NET AuthController.Login() → AuthService.LoginAsync()
    → Checks password hash → Generates JWT token
    ↓
Returns: { token: "eyJhbG...", userName: "Chandan", role: "Admin" }
    ↓
auth.js stores in localStorage:
    ems_token    = "eyJhbG..."
    ems_username = "Chandan"
    ems_role     = "Admin"
    ↓
window.location.hash = '#/dashboard'  → Router picks up → renders Dashboard
    ↓
Dashboard calls fetchApi('/employee') → api.js reads token from localStorage
    → Attaches "Authorization: Bearer eyJhbG..." header
    → .NET validates JWT → Returns employee data
```

---

# 🧭 STEP 5: Build `router.js` — The Navigator

## WHAT is this file?

A lightweight page router that listens for URL hash changes and renders the correct page.

## WHY build a router?

Without a router, your SPA is just a blob of JavaScript. Users can't:
- Use the **back button** (they'd leave your app entirely)
- **Bookmark** a specific page
- **Share a link** to the employees page

The router makes your SPA behave like a multi-page website while being a single page.

## HOW to build it?

### Step 5.1: Define your route map

```javascript
const routes = {
    '#/login':       renderLoginPage,
    '#/register':    renderRegisterPage,
    '#/dashboard':   renderDashboardPage,
    '#/employees':   renderEmployeesPage,
    '#/departments': renderDepartmentsPage,
};
```

This is a JavaScript object (a mapping). Key = URL hash, Value = the function that renders that page.

### Step 5.2: The routing function

```javascript
function handleRouteChange() {
    const hash = window.location.hash || '#/login';

    // AUTH GUARD: If not logged in and trying to access protected pages → redirect
    if (!Auth.isLoggedIn() && hash !== '#/login' && hash !== '#/register') {
        window.location.hash = '#/login';
        return;
    }

    // If logged in and trying to access login/register → redirect to dashboard
    if (Auth.isLoggedIn() && (hash === '#/login' || hash === '#/register')) {
        window.location.hash = '#/dashboard';
        return;
    }

    // Find the matching page function
    const renderPage = routes[hash];

    if (renderPage) {
        renderPage();  // Call the page rendering function
    } else {
        // 404 — unknown route, go to dashboard
        window.location.hash = '#/dashboard';
    }
}
```

> [!IMPORTANT]
> **Auth guards** are critical. Without them, anyone could type `#/dashboard` in the URL and see the dashboard without logging in. The guard checks `isLoggedIn()` before rendering any protected page. This is the same concept as `[Authorize]` on your .NET controllers — but on the client side.

### Step 5.3: Listen for changes

```javascript
// When hash changes (user clicks nav link or uses back button)
window.addEventListener('hashchange', handleRouteChange);

// When page first loads
window.addEventListener('DOMContentLoaded', handleRouteChange);
```

### The routing mental model

```
User clicks "Employees" in sidebar
    ↓
<a href="#/employees"> changes the URL to index.html#/employees
    ↓
Browser fires 'hashchange' event
    ↓
handleRouteChange() reads window.location.hash → "#/employees"
    ↓
Auth guard checks: isLoggedIn()? → YES ✓
    ↓
Finds routes['#/employees'] → renderEmployeesPage function
    ↓
renderEmployeesPage() runs → fetches data from API → generates HTML
    ↓
Sets document.getElementById('app').innerHTML = generatedHTML
    ↓
User sees the employees table (no page reload!)
```

---

# 🛠️ STEP 6: Build `utils.js` — Shared Helpers

## WHAT is this file?

Small, reusable utility functions used across multiple pages.

## WHY separate utils?

The **DRY Principle** (Don't Repeat Yourself). If you format a date in employees page AND dashboard AND department detail view, you'd write the same code 3 times. Instead, write `formatDate()` once in utils.js and use it everywhere.

## HOW to build it?

### Toast Notifications

```
showToast(message, type)
- type: 'success' (green), 'error' (red), 'warning' (yellow)
- Creates a small popup at top-right
- Auto-disappears after CONFIG.TOAST_DURATION ms
- Uses CSS transitions for smooth slide-in/out
```

**How it works**:
1. Create a `<div>` element with the message
2. Add appropriate CSS classes (green bg for success, red for error)
3. Append to a `#toast-container` div in your HTML
4. Use `setTimeout()` to remove it after 3.5 seconds

### Date Formatting

```javascript
function formatDate(isoString) {
    return new Date(isoString).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric'
    });
    // "2024-03-15T00:00:00" → "15 Mar 2024"
}
```

### Currency Formatting

```javascript
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency', currency: 'INR'
    }).format(amount);
    // 75000 → "₹75,000.00"
}
```

> [!TIP]
> `Intl.NumberFormat` is a **built-in browser API** — no library needed. It handles locale-specific formatting (Indian comma system: 1,00,000 vs Western: 100,000).

---

# 📄 STEP 7: Build `index.html` — The SPA Shell

## WHAT is this file?

The ONE HTML file your entire app lives in. It loads Tailwind, your CSS, all your JS files, and has a container `<div>` where page content gets rendered.

## WHY only one HTML file?

Because this is an SPA. The HTML file is just a **shell** — a skeleton that provides:
1. The `<head>` (Tailwind CDN, fonts, your CSS)
2. A `<div id="app">` where JavaScript injects page content
3. A `<div id="toast-container">` for notifications
4. `<script>` tags loading all your JS files **in the right order**

## HOW to build it?

### The structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EMS — Employee Management System</title>

    <!-- Tailwind CSS v3 via CDN -->
    <script src="https://cdn.tailwindcss.com"></script>

    <!-- Google Fonts: Inter -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <!-- Your custom styles -->
    <link rel="stylesheet" href="css/style.css">
</head>
<body class="font-['Inter'] bg-gray-50 text-gray-800">

    <!-- Main app container — JS will render pages here -->
    <div id="app"></div>

    <!-- Toast notifications container (fixed position, top-right) -->
    <div id="toast-container" class="fixed top-4 right-4 z-50 flex flex-col gap-2"></div>

    <!-- JS files — ORDER MATTERS! -->
    <script src="js/config.js"></script>     <!-- 1. Config first (no dependencies) -->
    <script src="js/utils.js"></script>      <!-- 2. Utils (depends on config) -->
    <script src="js/api.js"></script>        <!-- 3. API client (depends on config) -->
    <script src="js/auth.js"></script>       <!-- 4. Auth (depends on api + config) -->

    <!-- Components -->
    <script src="js/components/sidebar.js"></script>
    <script src="js/components/topbar.js"></script>
    <script src="js/components/statsCard.js"></script>
    <script src="js/components/dataTable.js"></script>
    <script src="js/components/modal.js"></script>

    <!-- Pages -->
    <script src="js/pages/login.js"></script>
    <script src="js/pages/register.js"></script>
    <script src="js/pages/dashboard.js"></script>
    <script src="js/pages/employees.js"></script>
    <script src="js/pages/departments.js"></script>

    <!-- Router LAST (depends on all pages being defined) -->
    <script src="js/router.js"></script>
</body>
</html>
```

> [!IMPORTANT]
> **Script order matters!** Since we're NOT using ES modules (import/export), all scripts share the global scope. `config.js` must load first because `api.js` uses `CONFIG.API_BASE_URL`. `router.js` loads last because it needs ALL page functions to be defined already.

---

# 🧱 STEP 8: Build Reusable Components

## The Component Pattern

Every component follows the same pattern:

```javascript
function createComponentName(config) {
    // 1. Build HTML string using template literals
    // 2. Return the HTML string
}
```

Then in your page:
```javascript
document.getElementById('app').innerHTML = `
    ${createSidebar(currentPage)}
    ${createTopbar(pageTitle)}
    <main> ... page content ... </main>
`;
```

### 8.1 Sidebar Component (`components/sidebar.js`)

**WHAT**: The left navigation panel that appears on every dashboard page.

**WHY reusable**: It appears on Dashboard, Employees, AND Departments pages — all three. Write it once.

**HOW**:
```javascript
function createSidebar(activePage) {
    // activePage = 'dashboard' | 'employees' | 'departments'
    // Use this to highlight the active nav link

    const navItems = [
        { id: 'dashboard',   label: 'Dashboard',   icon: '📊', hash: '#/dashboard' },
        { id: 'employees',   label: 'Employees',   icon: '👥', hash: '#/employees' },
        { id: 'departments', label: 'Departments',  icon: '🏢', hash: '#/departments' },
    ];

    // Build nav links HTML, adding 'active' styles to current page
    // Return the full sidebar HTML with logo, nav links, and logout button
}
```

**Key design**:
- Dark background (`bg-slate-900` or `bg-slate-800`)
- White text
- Active link has a different background color (indigo/violet)
- Fixed position on the left, full height
- Width: `w-64` (256px)

### 8.2 Topbar Component (`components/topbar.js`)

**WHAT**: The top bar showing page title, user info, and logout button.

**HOW**:
```javascript
function createTopbar(pageTitle) {
    const userName = Auth.getUserName();
    const role = Auth.getRole();

    // Return HTML with:
    // - pageTitle on the left
    // - User initials circle + name + role badge + logout button on the right
}
```

**Key design**: Role badge uses color: Admin = `bg-purple-100 text-purple-700`, User = `bg-blue-100 text-blue-700`

### 8.3 Stats Card (`components/statsCard.js`)

**WHAT**: A card showing a metric — like "Total Employees: 42".

**HOW**:
```javascript
function createStatsCard({ title, value, icon, color }) {
    // Returns a card with:
    // - Icon on the left
    // - Title (muted text) + Value (large bold number) on the right
    // - color determines the accent (border-left or icon bg color)
}
```

### 8.4 Data Table (`components/dataTable.js`)  — THE MOST IMPORTANT COMPONENT

**WHAT**: A reusable table that you configure with columns and data. Used for BOTH employees and departments lists.

**WHY this is the key to reusability**:

```javascript
// For employees page:
createDataTable({
    columns: [
        { key: 'firstName', label: 'First Name' },
        { key: 'email',     label: 'Email' },
        { key: 'position',  label: 'Position' },
        { key: 'salary',    label: 'Salary', format: formatCurrency },
    ],
    data: employeesArray,
    actions: isAdmin() ? ['edit', 'delete'] : [],
    onEdit: (employee) => openEditModal(employee),
    onDelete: (employee) => openDeleteModal(employee),
});

// For departments page — SAME component, different config:
createDataTable({
    columns: [
        { key: 'name',          label: 'Name' },
        { key: 'description',   label: 'Description' },
        { key: 'employeeCount', label: 'Employees' },
    ],
    data: departmentsArray,
    actions: isAdmin() ? ['edit', 'delete'] : [],
    onEdit: (dept) => openEditDeptModal(dept),
    onDelete: (dept) => openDeleteDeptModal(dept),
});
```

**HOW it works internally**:
1. Takes the `columns` config and creates `<th>` headers
2. Takes the `data` array and creates `<tr>` rows, reading `item[column.key]` for each cell
3. If `column.format` exists (like `formatCurrency`), applies it to the cell value
4. If `actions` includes 'edit'/'delete', adds action buttons column
5. Adds a search bar that filters rows by text matching
6. Optionally paginates (page size from CONFIG)

> [!TIP]
> **Interview gold**: *"My DataTable component is fully configuration-driven. To add a new entity table (like 'Projects'), I just pass a new columns array and data — zero component code changes. This is the Open/Closed Principle from SOLID."*

### 8.5 Modal Component (`components/modal.js`)

**WHAT**: A popup dialog for forms (add/edit) and confirmations (delete).

**HOW**:
```javascript
function openModal({ title, bodyHTML, onConfirm, confirmText = 'Save' }) {
    // 1. Create overlay <div> (dark semi-transparent background)
    // 2. Create modal box with title, bodyHTML content, and buttons
    // 3. Append to document.body
    // 4. Add click listener on overlay to close
    // 5. Add click listener on confirm button to call onConfirm()
}

function closeModal() {
    // Remove the modal elements from DOM
}
```

**Usage for create employee**:
```javascript
openModal({
    title: 'Add New Employee',
    bodyHTML: `
        <form id="employee-form">
            <input name="firstName" placeholder="First Name" required>
            <input name="email" type="email" placeholder="Email" required>
            ... more fields ...
        </form>
    `,
    onConfirm: async () => {
        const form = document.getElementById('employee-form');
        const data = Object.fromEntries(new FormData(form));
        await fetchApi('/employee', 'POST', data);
        showToast('Employee added!', 'success');
        closeModal();
        renderEmployeesPage();  // Refresh the list
    }
});
```

---

# 📄 STEP 9: Build the Pages

## 9.1 Login Page (`pages/login.js`)

**Layout**: Full-screen, split design. Left half = brand/illustration (dark bg with app title), Right half = login form (white bg).

**Form fields** (must match your backend's `LoginDto`):
- Email (type="email", required)
- Password (type="password", minlength=8, required)

**On submit**:
1. Prevent default form submission (`e.preventDefault()`)
2. Get form values
3. Call `Auth.login(email, password)` (which calls `fetchApi('/auth/login', 'POST', ...)`)
4. If success → auto-redirects to `#/dashboard`
5. If error → show toast with error message

**Important UX**:
- Show loading spinner on button while API call is in progress
- Disable button while loading (prevent double-submit)
- Show "Register here" link → `<a href="#/register">`

## 9.2 Register Page (`pages/register.js`)

Same layout as login. Fields (match `RegisterDto`):
- Username (minlength=3, maxlength=50)
- Email
- Password (minlength=8)

## 9.3 Dashboard Page (`pages/dashboard.js`)

**Layout**: Uses the app shell layout:

```
┌────────────┬──────────────────────────────────┐
│            │  Topbar (page title + user info)  │
│  Sidebar   ├──────────────────────────────────┤
│            │                                   │
│  Dashboard │  Stats Cards Row                  │
│  Employees │  ┌──────┐ ┌──────┐ ┌──────┐     │
│  Departments│  │ 42   │ │ 38   │ │ 6    │     │
│            │  │ Total │ │Active│ │Depts │     │
│            │  └──────┘ └──────┘ └──────┘     │
│            │                                   │
│            │  Recent Employees Table           │
│            │  ┌──────────────────────────┐     │
│            │  │ Name │ Email │ Dept │ ... │    │
│            │  │ ...  │ ...   │ ...  │ ... │    │
│            │  └──────────────────────────┘     │
└────────────┴──────────────────────────────────┘
```

**On page load**:
1. Fetch all employees: `fetchApi('/employee')`
2. Fetch all departments: `fetchApi('/department')`
3. Calculate stats: total, active count, department count
4. Render stats cards + recent employees table (last 5 by hire date)

## 9.4 Employees Page (`pages/employees.js`)

**Layout**: App shell + data table with full CRUD.

**On page load**:
1. Fetch all employees
2. Fetch all departments (for the filter dropdown + create/edit form dropdown)
3. Render DataTable with employee data
4. If Admin → show "Add Employee" button

**Add Employee** (Admin only):
- Open modal with form fields matching `CreateEmployeeDto`:
  - FirstName, LastName, Email, Phone, Position, Salary, HireDate, DepartmentId (dropdown)
- On submit → `fetchApi('/employee', 'POST', formData)`

**Edit Employee** (Admin only):
- Open modal pre-filled with existing values
- Uses `UpdateEmployeeDto` fields (same as Create but with IsActive toggle)
- On submit → `fetchApi('/employee/{id}', 'PUT', formData)`

**Delete Employee** (Admin only):
- Open confirmation modal: "Are you sure you want to delete John Doe?"
- On confirm → `fetchApi('/employee/{id}', 'DELETE')`

**Department filter**:
- Dropdown at top that filters the table
- When selected → `fetchApi('/employee/department/{deptId}')` — your backend already supports this!

## 9.5 Departments Page (`pages/departments.js`)

Same pattern as employees but simpler. Only 2 fields: Name, Description.

**Special handling for delete**: Your backend returns `409 Conflict` with message "Cannot delete department because employees are assigned to it." Catch this and show as a warning toast.

---

# 🎨 STEP 10: Build `css/style.css` — Custom Styles

## WHAT goes here?

Tailwind handles 95% of styling inline. This CSS file handles what Tailwind can't:

1. **Custom animations** (fade-in, slide-in for toasts/modals)
2. **The Inter font default** 
3. **Scrollbar styling** (thin, custom colors)
4. **Transition classes** for smooth page changes

**Key CSS to write**:

```css
/* Fade-in animation for page content */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
}
.animate-fade-in { animation: fadeIn 0.3s ease-out; }

/* Slide-in for toasts */
@keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to   { transform: translateX(0); opacity: 1; }
}
.animate-slide-in { animation: slideIn 0.3s ease-out; }

/* Custom scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-thumb { background: #94a3b8; border-radius: 3px; }
```

---

# 🔒 STEP 11: Role-Based UI — The Enterprise Pattern

## WHAT is this?

Showing/hiding UI elements based on the user's role. **Admin** sees all actions. **User** can only view data.

## WHY is this important?

Your backend already enforces this with `[Authorize(Roles = "Admin")]`. Even if a User tried to POST to `/employee`, the API would return 403 Forbidden. But the UI should **not even show** the button — that's the standard. Don't confuse users with buttons they can't use.

## HOW to implement it?

Simple conditional in your HTML templates:

```javascript
// In your employees page:
const addButton = Auth.isAdmin()
    ? `<button onclick="openAddEmployeeModal()" class="bg-indigo-600 text-white px-4 py-2 rounded-lg">
         + Add Employee
       </button>`
    : '';

// In your data table actions column:
const actionButtons = Auth.isAdmin()
    ? `<button onclick="editEmployee(${emp.id})">✏️</button>
       <button onclick="deleteEmployee(${emp.id})">🗑️</button>`
    : `<button onclick="viewEmployee(${emp.id})">👁️</button>`;
```

> [!IMPORTANT]
> **Client-side role checks are for UX only — NOT security.** Anyone can open browser DevTools and unhide the button. The REAL security is your `[Authorize(Roles = "Admin")]` on the backend. Frontend role checks prevent *accidental* access. Backend role checks prevent *malicious* access. You need BOTH.

---

# 🚀 STEP 12: Implementation Order (What to Build First)

Build in this exact order — each step depends on the previous:

| # | File | Why this order? |
|---|---|---|
| 1 | `index.html` + `css/style.css` | The shell must exist first |
| 2 | `js/config.js` | Everyone depends on this |
| 3 | `js/utils.js` | Toast/format functions used everywhere |
| 4 | `js/api.js` | HTTP client needed for everything |
| 5 | `js/auth.js` | Auth needed before any protected page |
| 6 | `js/pages/login.js` | First thing users see |
| 7 | `js/pages/register.js` | Alt auth page |
| 8 | `js/router.js` | Now you can navigate between login ↔ register |
| 9 | **⚡ TEST HERE** | Start your .NET API, open index.html, try login/register |
| 10 | `js/components/sidebar.js` | Needed for all dashboard pages |
| 11 | `js/components/topbar.js` | Needed for all dashboard pages |
| 12 | `js/components/statsCard.js` | Needed for dashboard |
| 13 | `js/pages/dashboard.js` | First page after login |
| 14 | **⚡ TEST HERE** | Login → should see dashboard with stats |
| 15 | `js/components/modal.js` | Needed for CRUD |
| 16 | `js/components/dataTable.js` | Needed for list pages |
| 17 | `js/pages/employees.js` | Main CRUD page |
| 18 | **⚡ TEST HERE** | Full employee CRUD test |
| 19 | `js/pages/departments.js` | Simpler CRUD page |
| 20 | **⚡ TEST HERE** | Full department CRUD + conflict test |

> [!TIP]
> Notice the **⚡ TEST HERE** checkpoints. Don't build everything and test at the end — test as you go. This is how professional developers work.

---

# 🎤 How to Explain This in an Interview

When HR or a tech interviewer asks about this project:

> *"I built a full-stack Employee Management System. The backend is a .NET 8 Web API with JWT authentication, role-based authorization, PostgreSQL database, and a clean layered architecture with Repository and Service patterns.*
>
> *For the frontend, I built a Single Page Application using vanilla HTML, Tailwind CSS, and JavaScript — no framework. I chose this because the goal was to demonstrate I can consume RESTful APIs, handle JWT auth flows, and build reusable components without framework abstractions hiding the fundamentals.*
>
> *The frontend has a centralized API client that auto-attaches JWT tokens, a hash-based router with auth guards, and reusable components like a configuration-driven DataTable and Modal. The UI is role-aware — Admin users see CRUD actions while regular users only see read access. This mirrors the backend's `[Authorize(Roles)]` but on the UI layer for better UX."*

---

**Now go build it. Step by step. File by file. Test at every checkpoint. Come back to me when you're stuck on any step — I'll explain deeper.** 💪
