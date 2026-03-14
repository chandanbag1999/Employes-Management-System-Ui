function renderTopbar(pageTitle) {
    const isAdminUser = isAdmin();

    // Role badge color: Admin = purple, User = blue
    const roleBadge = isAdminUser
        ? `<span class="bg-purple-100 text-purple-700 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">Admin</span>`
        : `<span class="bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">User</span>`;

    return `
        <header class="h-16 bg-white border-b border-gray-200 flex items-center 
                       justify-between px-3 sm:px-4 md:px-6 fixed top-0 right-0 left-0 lg:left-80 z-30">
            
            <!-- Left: menu + page title -->
            <div class="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <button
                    onclick="toggleSidebar()"
                    aria-label="Open menu"
                    class="lg:hidden w-9 h-9 rounded-lg border border-gray-200 text-gray-600 
                           hover:bg-gray-50 flex items-center justify-center flex-shrink-0 transition-colors">
                    ☰
                </button>

                <h1 class="text-base sm:text-lg font-semibold text-gray-800 truncate">${pageTitle}</h1>
            </div>

            <!-- Right side: user info + logout -->
            <div class="flex items-center gap-1 sm:gap-3 ml-2 flex-shrink-0">
                <div class="hidden sm:flex items-center">
                    ${roleBadge}
                </div>

                <div class="flex items-center gap-1.5 sm:gap-2">
                    <div class="w-8 h-8 bg-indigo-600 rounded-full flex items-center 
                                justify-center text-white text-xs font-bold flex-shrink-0">
                        ${getInitials(getUserName())}
                    </div>
                    <span class="text-sm font-medium text-gray-700 hidden md:inline truncate">${getUserName()}</span>
                </div>

                <button 
                    onclick="logout()"
                    class="flex items-center gap-1 text-gray-500 hover:text-red-600 
                           transition-colors duration-200 px-2 sm:px-3 py-1.5 rounded-lg 
                           hover:bg-red-50 flex-shrink-0">
                    <span class="text-base">⎋</span>
                    <span class="hidden sm:inline text-sm">Logout</span>
                </button>
            </div>
        </header>
    `;
};
