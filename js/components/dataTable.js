function renderDataTable({ columns, data, onEdit = null, onDelete = null, emptyMessage = 'No records found.' }) {
    // Empty state
    if (!data || data.length === 0) {
        return `
            <div class="text-center py-12 sm:py-16 text-gray-400">
                <div class="text-4xl sm:text-5xl mb-3">📭</div>
                <div class="font-medium text-sm sm:text-base">${emptyMessage}</div>
            </div>
        `;
    }

    // Detect if we're on mobile view based on column count
    const isMobileView = window.innerWidth < 768;
    
    if (isMobileView) {
        // Card view for mobile - much more readable
        const cards = data.map((row, index) => {
            const cardContent = columns.map(col => {
                const rawValue = row[col.key];
                const displayValue = col.format ? col.format(rawValue) : (rawValue ?? '—');
                return `
                    <div class="flex justify-between items-start pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                        <span class="text-xs font-semibold text-gray-500 uppercase">${col.label}</span>
                        <span class="text-sm text-gray-700 font-medium text-right flex-1 ml-2">${displayValue}</span>
                    </div>
                `;
            }).join('');

            const actionButtons = `
                <div class="mt-3 pt-3 border-t border-gray-100 flex gap-2">
                    ${onEdit ? `
                        <button onclick="handleTableEditByIndex(${index})"
                                class="flex-1 px-3 py-2 text-xs font-medium text-indigo-600 
                                       bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
                            Edit
                        </button>` : ''}
                    ${onDelete ? `
                        <button onclick="handleTableDeleteByIndex(${index})"
                                class="flex-1 px-3 py-2 text-xs font-medium text-red-600 
                                       bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                            Delete
                        </button>` : ''}
                </div>
            `;

            return `
                <div class="bg-white rounded-lg border border-gray-200 p-4 mb-3 hover:shadow-md transition-shadow">
                    ${cardContent}
                    ${onEdit || onDelete ? actionButtons : ''}
                </div>
            `;
        }).join('');

        window._tableEditCallback = onEdit;
        window._tableDeleteCallback = onDelete;
        window._tableRows = data;

        return `<div class="space-y-2">${cards}</div>`;
    } else {
        // Table view for desktop
        const headers = columns.map(col =>
            `<th class="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                ${col.label}
            </th>`
        ).join('');

        const hasActions = onEdit || onDelete;
        const actionHeader = hasActions
            ? `<th class="px-3 sm:px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>`
            : '';

        const rows = data.map((row, index) => {
            const cells = columns.map(col => {
                const rawValue = row[col.key];
                const displayValue = col.format ? col.format(rawValue) : (rawValue ?? '—');
                return `<td class="px-3 sm:px-4 py-3 text-sm text-gray-700">${displayValue}</td>`;
            }).join('');

            const actionCell = hasActions ? `
                <td class="px-3 sm:px-4 py-3 text-right">
                    <div class="flex items-center justify-end gap-2 flex-wrap">
                        ${onEdit ? `
                            <button onclick="handleTableEditByIndex(${index})"
                                    class="px-2 sm:px-3 py-1.5 text-xs font-medium text-indigo-600 
                                           bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors whitespace-nowrap">
                                Edit
                            </button>` : ''}
                        ${onDelete ? `
                            <button onclick="handleTableDeleteByIndex(${index})"
                                    class="px-2 sm:px-3 py-1.5 text-xs font-medium text-red-600 
                                           bg-red-50 hover:bg-red-100 rounded-lg transition-colors whitespace-nowrap">
                                Delete
                            </button>` : ''}
                    </div>
                </td>
            ` : '';

            const rowBg = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';

            return `
                <tr class="${rowBg} hover:bg-indigo-50 transition-colors duration-100">
                    ${cells}
                    ${actionCell}
                </tr>
            `;
        }).join('');

        window._tableEditCallback = onEdit;
        window._tableDeleteCallback = onDelete;
        window._tableRows = data;

        return `
            <div class="overflow-x-auto rounded-xl border border-gray-200">
                <table class="w-full border-collapse text-sm">
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
