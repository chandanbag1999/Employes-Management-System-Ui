function renderTopbar(pageTitle) {
    const role = getRole();
    const isAdminUser = isAdmin();

    // Role badge color: Admin = purple, User = blue
    const roleBadge = isAdminUser
        ? `<span class="bg-purple-100 text-purple-700 text-xs font-semibold px-2.5 py-1 rounded-full">Admin</span>`
        : `<span class="bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">User</span>`;

    return `
        <header class="h-16 bg-white border-b border-gray-200 flex items-center 
                       justify-between px-6 fixed top-0 right-0 left-64 z-30">
            
            <!-- Page Title -->
            <h1 class="text-lg font-semibold text-gray-800">${pageTitle}</h1>

            <!-- Right side: user info + logout -->
            <div class="flex items-center gap-4">
                ${roleBadge}

                <div class="flex items-center gap-2">
                    <div class="w-8 h-8 bg-indigo-600 rounded-full flex items-center 
                                justify-center text-white text-sm font-bold">
                        ${getInitials(getUserName())}
                    </div>
                    <span class="text-sm font-medium text-gray-700">${getUserName()}</span>
                </div>

                <button 
                    onclick="logout()"
                    class="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 
                           transition-colors duration-200 px-3 py-1.5 rounded-lg 
                           hover:bg-red-50">
                    <span>⎋</span>
                    <span>Logout</span>
                </button>
            </div>
        </header>
    `;
};
