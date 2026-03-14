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
               class="flex items-center gap-3 px-4 py-3 rounded-lg mx-2 text-sm font-medium
                      transition-all duration-200 
                      ${isActive 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-slate-400 hover:bg-slate-700 hover:text-white'}">
                <span class="text-lg">${item.icon}</span>
                <span>${item.label}</span>
            </a>
        `;
    }).join('');

    return `
        <aside class="w-64 min-h-screen bg-slate-900 flex flex-col fixed left-0 top-0 z-40">
            
            <!-- Logo / App Title -->
            <div class="flex items-center gap-3 px-6 py-5 border-b border-slate-700">
                <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">E</div>
                <div>
                    <div class="text-white font-semibold text-sm">EMS Portal</div>
                    <div class="text-slate-400 text-xs">Employee Management</div>
                </div>
            </div>

            <!-- Navigation Links -->
            <nav class="flex-1 py-4 flex flex-col gap-1">
                ${navLinks}
            </nav>

            <!-- Bottom: Logged in user info -->
            <div class="px-4 py-4 border-t border-slate-700">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-indigo-500 rounded-full flex items-center 
                                justify-center text-white text-xs font-bold">
                        ${getInitials(getUserName())}
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="text-white text-sm font-medium truncate">${getUserName()}</div>
                        <div class="text-slate-400 text-xs">${getRole()}</div>
                    </div>
                </div>
            </div>
        </aside>
    `;
}
