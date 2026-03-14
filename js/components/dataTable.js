function renderDataTable({ columns, data, onEdit = null, onDelete = null, emptyMessage = 'No records found.' }) {
    // Empty state
    if (!data || data.length === 0) {
        return `
            <div class="text-center py-16 text-gray-400">
                <div class="text-5xl mb-3">📭</div>
                <div class="font-medium">${emptyMessage}</div>
            </div>
        `;
    }

    // Table headers from columns config
    const headers = columns.map(col =>
        `<th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
            ${col.label}
        </th>`
    ).join('');

    // Action header (only if edit or delete exists)
    const hasActions = onEdit || onDelete;
    const actionHeader = hasActions
        ? `<th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>`
        : '';

    // Table rows
    const rows = data.map((row, index) => {
        // Build cells
        const cells = columns.map(col => {
            const rawValue = row[col.key];
            const displayValue = col.format ? col.format(rawValue) : (rawValue ?? '—');
            return `<td class="px-4 py-3 text-sm text-gray-700">${displayValue}</td>`;
        }).join('');

        // Action buttons (only if Admin — pages pass onEdit/onDelete only for admins)
        const actionCell = hasActions ? `
            <td class="px-4 py-3 text-right">
                <div class="flex items-center justify-end gap-2">
                    ${onEdit ? `
                        <button onclick="handleTableEditByIndex(${index})"
                                class="px-3 py-1.5 text-xs font-medium text-indigo-600 
                                       bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
                            Edit
                        </button>` : ''}
                    ${onDelete ? `
                        <button onclick="handleTableDeleteByIndex(${index})"
                                class="px-3 py-1.5 text-xs font-medium text-red-600 
                                       bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                            Delete
                        </button>` : ''}
                </div>
            </td>
        ` : '';

        // Zebra striping — alternate row colors
        const rowBg = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';

        return `
            <tr class="${rowBg} hover:bg-indigo-50 transition-colors duration-100">
                ${cells}
                ${actionCell}
            </tr>
        `;
    }).join('');

    // Save callbacks and rows globally for simple inline button handlers
    window._tableEditCallback = onEdit;
    window._tableDeleteCallback = onDelete;
    window._tableRows = data;

    return `
        <div class="overflow-x-auto rounded-xl border border-gray-200">
            <table class="w-full border-collapse">
                <thead class="bg-gray-50 border-b border-gray-200">
                    <tr>
                        ${headers}
                        ${actionHeader}
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    ${rows}
                </tbody>
            </table>
        </div>
    `;
}

// Use row index from button click to get safe row object
function handleTableEditByIndex(index) {
    const row = window._tableRows?.[index];
    if (row && window._tableEditCallback) window._tableEditCallback(row);
}

// Use row index from button click to get safe row object
function handleTableDeleteByIndex(index) {
    const row = window._tableRows?.[index];
    if (row && window._tableDeleteCallback) window._tableDeleteCallback(row);
}
