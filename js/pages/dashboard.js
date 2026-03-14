async function renderDashboardPage() {
    // 1. First show loading state
    showLoading('app');

    try {
        // 2. Fetch data from API (parallel = faster!)
        const [employees, departments] = await Promise.all([
            fetchApi('/employee'),
            fetchApi('/department'),
        ]);

        // 3. Calculate stats
        const totalEmployees = employees.length;
        const activeEmployees = employees.filter(e => e.isActive).length;
        const totalDepartments = departments.length;
        const recentEmployees = [...employees]
            .sort((a, b) => new Date(b.hireDate) - new Date(a.hireDate))
            .slice(0, 5);

        // 4. Render the full page
        document.getElementById('app').innerHTML = `
            <div class="flex min-h-screen bg-gray-50">
                ${renderSidebar('dashboard')}

                <div class="flex-1 ml-64">
                    ${renderTopbar('Dashboard')}
                    
                    <main class="pt-20 px-6 pb-6 animate-fade-in">

                        <!-- Stats Cards Row -->
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                            ${renderStatsCard({ title: 'Total Employees', value: totalEmployees, icon: '👥', colorClass: 'bg-indigo-100' })}
                            ${renderStatsCard({ title: 'Active Employees', value: activeEmployees, icon: '✅', colorClass: 'bg-green-100' })}
                            ${renderStatsCard({ title: 'Departments', value: totalDepartments, icon: '🏢', colorClass: 'bg-orange-100' })}
                        </div>

                        <!-- Recent Hires Table -->
                        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm">
                            <div class="px-6 py-4 border-b border-gray-100">
                                <h2 class="font-semibold text-gray-800">Recent Hires</h2>
                                <p class="text-sm text-gray-500">Last 5 employees added</p>
                            </div>
                            <div class="p-4">
                                ${renderDataTable({
                                    columns: [
                                        { key: 'firstName', label: 'First Name' },
                                        { key: 'lastName',  label: 'Last Name' },
                                        { key: 'position',  label: 'Position' },
                                        { key: 'departmentName', label: 'Department' },
                                        { key: 'hireDate',  label: 'Hire Date', format: formatDate },
                                    ],
                                    data: recentEmployees,
                                    emptyMessage: 'No employees yet.',
                                })}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        `;

    } catch (error) {
        showToast(error.message, 'error');
    }
};
