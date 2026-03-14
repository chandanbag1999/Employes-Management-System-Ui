async function renderEmployeesPage() {
    showLoading('app');

    try {
        const [employees, departments] = await Promise.all([
            fetchApi('/employee'),
            fetchApi('/department'),
        ]);

        // Store globally for use by modal functions
        window._allDepartments = departments;

        document.getElementById('app').innerHTML = `
            <div class="flex min-h-screen bg-gray-50">
                ${renderSidebar('employees')}
                <div class="flex-1 lg:ml-64">
                    ${renderTopbar('Employees')}
                    <main class="pt-20 px-3 sm:px-4 md:px-6 pb-6 animate-fade-in">

                        <!-- Page Header: Title + Add Button -->
                        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
                            <div class="min-w-0">
                                <h2 class="text-xl sm:text-2xl font-bold text-gray-800">All Employees</h2>
                                <p class="text-xs sm:text-sm text-gray-500 mt-1">${employees.length} total employees</p>
                            </div>
                            ${isAdmin() ? `
                                <button onclick="openAddEmployeeModal()"
                                        class="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 
                                               text-white text-sm font-medium px-4 py-2.5 rounded-xl 
                                               w-full sm:w-auto transition-colors flex-shrink-0">
                                    <span>+</span> <span>Add Employee</span>
                                </button>` : ''}
                        </div>

                        <!-- Search Bar -->
                        <div class="mb-4 flex flex-col sm:flex-row gap-2">
                            <input type="text" id="employee-search"
                                   placeholder="Search by name, email, or position..."
                                   oninput="filterEmployees(this.value)"
                                   class="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl 
                                          text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all">
                        </div>

                        <!-- Table Container -->
                        <div id="employee-table-container" class="bg-white rounded-2xl border border-gray-200 shadow-sm p-3 sm:p-4">
                            ${renderDataTable({
                                columns: [
                                    { key: 'firstName',      label: 'First Name' },
                                    { key: 'lastName',       label: 'Last Name'  },
                                    { key: 'email',          label: 'Email'      },
                                    { key: 'position',       label: 'Position'   },
                                    { key: 'departmentName', label: 'Department' },
                                    { key: 'salary',         label: 'Salary',    format: formatCurrency },
                                    { key: 'hireDate',       label: 'Hire Date', format: formatDate     },
                                ],
                                data: employees,
                                onEdit:   isAdmin() ? openEditEmployeeModal   : null,
                                onDelete: isAdmin() ? confirmDeleteEmployee   : null,
                            })}
                        </div>

                    </main>
                </div>
            </div>
        `;

        // Store employees for search filtering
        window._allEmployees = employees;

    } catch (error) {
        showToast(error.message, 'error');
    }
};

function filterEmployees(query) {
    const filtered = window._allEmployees.filter(emp => {
        const q = query.toLowerCase();
        return (
            emp.firstName.toLowerCase().includes(q) ||
            emp.lastName.toLowerCase().includes(q)  ||
            emp.email.toLowerCase().includes(q)     ||
            emp.position.toLowerCase().includes(q)
        );
    });

    document.getElementById('employee-table-container').innerHTML =
        renderDataTable({
            columns: [
                { key: 'firstName',      label: 'First Name' },
                { key: 'lastName',       label: 'Last Name'  },
                { key: 'email',          label: 'Email'      },
                { key: 'position',       label: 'Position'   },
                { key: 'departmentName', label: 'Department' },
                { key: 'salary',         label: 'Salary',    format: formatCurrency },
                { key: 'hireDate',       label: 'Hire Date', format: formatDate     },
            ],
            data: filtered,
            onEdit:   isAdmin() ? openEditEmployeeModal : null,
            onDelete: isAdmin() ? confirmDeleteEmployee : null,
            emptyMessage: 'No employees match your search.',
        });
};

function buildDepartmentOptions(selectedId = null) {
    return window._allDepartments.map(dept =>
        `<option value="${dept.id}" ${dept.id === selectedId ? 'selected' : ''}>
            ${dept.name}
        </option>`
    ).join('');
};

function buildEmployeeFormHTML(emp = null) {
    // emp = null for Add, emp = existing data for Edit
    return `
        <form id="employee-form" class="space-y-4">

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                    <input name="firstName" required minlength="2" maxlength="50"
                           value="${emp?.firstName || ''}"
                           class="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm 
                                  focus:outline-none focus:ring-2 focus:ring-indigo-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                    <input name="lastName" required minlength="2" maxlength="50"
                           value="${emp?.lastName || ''}"
                           class="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm 
                                  focus:outline-none focus:ring-2 focus:ring-indigo-500">
                </div>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input type="email" name="email" required value="${emp?.email || ''}"
                       class="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm 
                              focus:outline-none focus:ring-2 focus:ring-indigo-500">
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <input type="tel" name="phone" required minlength="10" value="${emp?.phone || ''}"
                       placeholder="+91 98765 43210"
                       class="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm 
                              focus:outline-none focus:ring-2 focus:ring-indigo-500">
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Position *</label>
                <input name="position" required value="${emp?.position || ''}"
                       class="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm 
                              focus:outline-none focus:ring-2 focus:ring-indigo-500">
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Salary (₹) *</label>
                    <input type="number" name="salary" required min="1" value="${emp?.salary || ''}"
                           class="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm 
                                  focus:outline-none focus:ring-2 focus:ring-indigo-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Hire Date *</label>
                    <input type="date" name="hireDate" required
                           value="${emp?.hireDate ? emp.hireDate.split('T')[0] : ''}"
                           class="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm 
                                  focus:outline-none focus:ring-2 focus:ring-indigo-500">
                </div>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                <select name="departmentId" required
                        class="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm 
                               focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="">Select department</option>
                    ${buildDepartmentOptions(emp?.departmentId)}
                </select>
            </div>

            ${emp ? `
                <div class="flex items-center gap-2">
                    <input type="checkbox" name="isActive" id="isActive" 
                           ${emp.isActive ? 'checked' : ''}
                           class="w-4 h-4 accent-indigo-600">
                    <label for="isActive" class="text-sm text-gray-700">Active Employee</label>
                </div>` : ''}
        </form>
    `;
};

function openAddEmployeeModal() {
    openModal({
        title: 'Add New Employee',
        bodyHTML: buildEmployeeFormHTML(),
        confirmText: 'Add Employee',
        onConfirm: async () => {
            const form = document.getElementById('employee-form');
            if (!form.reportValidity()) return; // HTML5 validation

            const formData = new FormData(form);
            const body = {
                firstName:    formData.get('firstName'),
                lastName:     formData.get('lastName'),
                email:        formData.get('email'),
                phone:        formData.get('phone'),
                position:     formData.get('position'),
                salary:       parseFloat(formData.get('salary')),
                hireDate:     formData.get('hireDate'),
                departmentId: parseInt(formData.get('departmentId')),
            };

            try {
                await fetchApi('/employee', 'POST', body);
                closeModal();
                showToast('Employee added successfully!', 'success');
                renderEmployeesPage(); // Refresh list
            } catch (error) {
                showToast(error.message, 'error');
            }
        }
    });
}

function openEditEmployeeModal(emp) {
    openModal({
        title: 'Edit Employee',
        bodyHTML: buildEmployeeFormHTML(emp),
        confirmText: 'Save Changes',
        onConfirm: async () => {
            const form = document.getElementById('employee-form');
            if (!form.reportValidity()) return;

            const formData = new FormData(form);
            const body = {
                firstName:    formData.get('firstName'),
                lastName:     formData.get('lastName'),
                email:        formData.get('email'),
                phone:        formData.get('phone'),
                position:     formData.get('position'),
                salary:       parseFloat(formData.get('salary')),
                departmentId: parseInt(formData.get('departmentId')),
                isActive:     formData.get('isActive') === 'on',
            };

            try {
                await fetchApi(`/employee/${emp.id}`, 'PUT', body);
                closeModal();
                showToast('Employee updated!', 'success');
                renderEmployeesPage();
            } catch (error) {
                showToast(error.message, 'error');
            }
        }
    });
}

function confirmDeleteEmployee(emp) {
    openModal({
        title: 'Delete Employee',
        bodyHTML: `
            <div class="text-center py-4">
                <div class="text-5xl mb-4">⚠️</div>
                <p class="text-gray-700">Are you sure you want to delete</p>
                <p class="font-bold text-gray-900 text-lg">${emp.firstName} ${emp.lastName}?</p>
                <p class="text-sm text-gray-500 mt-2">This action cannot be undone.</p>
            </div>
        `,
        confirmText: 'Yes, Delete',
        confirmClass: 'bg-red-600 hover:bg-red-700',
        onConfirm: async () => {
            try {
                await fetchApi(`/employee/${emp.id}`, 'DELETE');
                closeModal();
                showToast('Employee deleted.', 'success');
                renderEmployeesPage();
            } catch (error) {
                showToast(error.message, 'error');
            }
        }
    });
};







