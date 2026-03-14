function renderSidebar(activePage) {
    // activePage = 'dashboard' | 'employees' | 'departments'
    // Used to highlight which nav link is currently active

    const navItems = [
        { id: 'dashboard',   label: 'Dashboard',    icon: '📊', hash: '#/dashboard'   },
        { id: 'employees',   label: 'Employees',    icon: '👥', hash: '#/employees'   },
        { id: 'departments', label: 'Departments',  icon: '🏢', hash: '#/departments' },
    ];

    // Build each nav link — active one gets special styling
    const navLinks = navItems.map(item => {
        const isActive = item.id === activePage;
        return `
            <a href="${item.hash}"
               onclick="closeSidebar()"
               class="flex items-center gap-3 px-3 sm:px-4 py-3 rounded-lg mx-2 text-sm font-medium
                      transition-all duration-200 
                      ${isActive 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-slate-400 hover:bg-slate-700 hover:text-white'}">
                <span class="text-lg flex-shrink-0">${item.icon}</span>
                <span class="truncate">${item.label}</span>
            </a>
        `;
    }).join('');

    return `
        <!-- Mobile backdrop (visible only when sidebar is open) -->
        <div id="sidebar-overlay"
             class="fixed inset-0 bg-black/40 z-40 hidden lg:hidden"
             onclick="closeSidebar()"></div>

        <!-- Sidebar: drawer on mobile, fixed on desktop -->
        <aside id="app-sidebar"
               class="w-56 sm:w-64 min-h-screen bg-slate-900 flex flex-col fixed left-0 top-0 z-50
                      transform -translate-x-full lg:translate-x-0 transition-transform duration-300">
            
            <!-- Logo / App Title -->
            <div class="flex items-center gap-3 px-4 sm:px-6 py-5 border-b border-slate-700 flex-shrink-0">
                <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">E</div>
                <div class="min-w-0">
                    <div class="text-white font-semibold text-sm truncate">EMS Portal</div>
                    <div class="text-slate-400 text-xs truncate">Employee Management</div>
                </div>
            </div>

            <!-- Navigation Links -->
            <nav class="flex-1 py-4 flex flex-col gap-1 overflow-y-auto">
                ${navLinks}
            </nav>

            <!-- Bottom: Logged in user info -->
            <div class="px-3 sm:px-4 py-4 border-t border-slate-700 flex-shrink-0">
                <div class="flex items-center gap-3 min-w-0">
                    <div class="w-8 h-8 bg-indigo-500 rounded-full flex items-center 
                                justify-center text-white text-xs font-bold flex-shrink-0">
                        ${getInitials(getUserName())}
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="text-white text-sm font-medium truncate">${getUserName()}</div>
                        <div class="text-slate-400 text-xs truncate">${getRole()}</div>
                    </div>
                </div>
            </div>
        </aside>
    `;
}

// Open sidebar drawer on mobile
function openSidebar() {
    const sidebar = document.getElementById('app-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (!sidebar || !overlay) return;

    sidebar.classList.remove('-translate-x-full');
    overlay.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
}

// Close sidebar drawer on mobile
function closeSidebar() {
    const sidebar = document.getElementById('app-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (!sidebar || !overlay) return;

    sidebar.classList.add('-translate-x-full');
    overlay.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
}

// Toggle sidebar drawer on mobile
function toggleSidebar() {
    const sidebar = document.getElementById('app-sidebar');
    if (!sidebar) return;

    const isClosed = sidebar.classList.contains('-translate-x-full');
    if (isClosed) openSidebar();
    else closeSidebar();
}

// Safety: if screen becomes desktop, clean mobile overlay/scroll lock
window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) {
        const overlay = document.getElementById('sidebar-overlay');
        if (overlay) overlay.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    }
});
