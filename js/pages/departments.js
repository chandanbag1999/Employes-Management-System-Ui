// Render departments page
async function renderDepartmentsPage() {
    showLoading('app');

    try {
        const departments = await fetchApi('/department');

        document.getElementById('app').innerHTML = `
            <div class="flex min-h-screen bg-gray-50">
                ${renderSidebar('departments')}
                <div class="flex-1 ml-64">
                    ${renderTopbar('Departments')}
                    <main class="pt-20 px-6 pb-6 animate-fade-in">

                        <!-- Header -->
                        <div class="flex items-center justify-between mb-6">
                            <div>
                                <h2 class="text-xl font-bold text-gray-800">All Departments</h2>
                                <p class="text-sm text-gray-500">${departments.length} total departments</p>
                            </div>
                            ${isAdmin() ? `
                                <button onclick="openAddDepartmentModal()"
                                        class="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 
                                               text-white text-sm font-medium px-4 py-2.5 rounded-xl 
                                               transition-colors">
                                    <span>+</span> Add Department
                                </button>` : ''}
                        </div>

                        <!-- Search -->
                        <div class="mb-4">
                            <input type="text" id="department-search"
                                   placeholder="Search by department name or description..."
                                   oninput="filterDepartments(this.value)"
                                   class="w-full max-w-sm px-4 py-2.5 border border-gray-300 rounded-xl 
                                          text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        </div>

                        <!-- Table -->
                        <div id="department-table-container" class="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
                            ${renderDataTable({
                                columns: [
                                    { key: 'name',          label: 'Department Name' },
                                    { key: 'description',   label: 'Description' },
                                    { key: 'employeeCount', label: 'Employees' },
                                ],
                                data: departments,
                                onEdit:   isAdmin() ? openEditDepartmentModal : null,
                                onDelete: isAdmin() ? confirmDeleteDepartment : null,
                            })}
                        </div>

                    </main>
                </div>
            </div>
        `;

        // Save full list for search filter
        window._allDepartmentsData = departments;

    } catch (error) {
        showToast(error.message, 'error');
    }
};

// Filter departments by name or description
function filterDepartments(query) {
    const q = query.toLowerCase();

    const filtered = window._allDepartmentsData.filter(dept =>
        dept.name.toLowerCase().includes(q) ||
        (dept.description || '').toLowerCase().includes(q)
    );

    document.getElementById('department-table-container').innerHTML =
        renderDataTable({
            columns: [
                { key: 'name',          label: 'Department Name' },
                { key: 'description',   label: 'Description' },
                { key: 'employeeCount', label: 'Employees' },
            ],
            data: filtered,
            onEdit:   isAdmin() ? openEditDepartmentModal : null,
            onDelete: isAdmin() ? confirmDeleteDepartment : null,
            emptyMessage: 'No departments match your search.',
        });
};

// Build form HTML for add/edit department
function buildDepartmentFormHTML(dept = null) {
    return `
        <form id="department-form" class="space-y-4">

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Department Name *</label>
                <input name="name" required minlength="2" maxlength="100"
                       value="${dept?.name || ''}"
                       placeholder="e.g. Engineering"
                       class="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm 
                              focus:outline-none focus:ring-2 focus:ring-indigo-500">
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="description" rows="4" maxlength="500"
                          placeholder="Optional department description"
                          class="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm 
                                 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none">${dept?.description || ''}</textarea>
            </div>
        </form>
    `;
};

// Open modal to add a new department
function openAddDepartmentModal() {
    openModal({
        title: 'Add New Department',
        bodyHTML: buildDepartmentFormHTML(),
        confirmText: 'Add Department',
        onConfirm: async () => {
            const form = document.getElementById('department-form');
            if (!form.reportValidity()) return;

            const formData = new FormData(form);
            const body = {
                name: formData.get('name')?.toString().trim(),
                description: formData.get('description')?.toString().trim() || null,
            };

            try {
                await fetchApi('/department', 'POST', body);
                closeModal();
                showToast('Department added successfully!', 'success');
                renderDepartmentsPage();
            } catch (error) {
                showToast(error.message, 'error');
            }
        }
    });
};

// Open modal to edit selected department
function openEditDepartmentModal(dept) {
    openModal({
        title: 'Edit Department',
        bodyHTML: buildDepartmentFormHTML(dept),
        confirmText: 'Save Changes',
        onConfirm: async () => {
            const form = document.getElementById('department-form');
            if (!form.reportValidity()) return;

            const formData = new FormData(form);
            const body = {
                name: formData.get('name')?.toString().trim(),
                description: formData.get('description')?.toString().trim() || null,
            };

            try {
                await fetchApi(`/department/${dept.id}`, 'PUT', body);
                closeModal();
                showToast('Department updated!', 'success');
                renderDepartmentsPage();
            } catch (error) {
                showToast(error.message, 'error');
            }
        }
    });
};

// Open confirmation modal before delete
function confirmDeleteDepartment(dept) {
    openModal({
        title: 'Delete Department',
        bodyHTML: `
            <div class="text-center py-4">
                <div class="text-5xl mb-4">⚠️</div>
                <p class="text-gray-700">Are you sure you want to delete</p>
                <p class="font-bold text-gray-900 text-lg">${dept.name}?</p>
                <p class="text-sm text-gray-500 mt-2">This action cannot be undone.</p>
            </div>
        `,
        confirmText: 'Yes, Delete',
        confirmClass: 'bg-red-600 hover:bg-red-700',
        onConfirm: async () => {
            try {
                await fetchApi(`/department/${dept.id}`, 'DELETE');
                closeModal();
                showToast('Department deleted.', 'success');
                renderDepartmentsPage();
            } catch (error) {
                if (error.message.includes('Cannot delete department')) {
                    showToast(error.message, 'warning');
                } else {
                    showToast(error.message, 'error');
                }
            }
        }
    });
};
