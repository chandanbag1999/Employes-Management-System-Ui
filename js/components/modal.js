function openModal({ title, bodyHTML, onConfirm, confirmText = 'Save', confirmClass = 'bg-indigo-600 hover:bg-indigo-700' }) {
    // Remove any existing modal first
    closeModal();

    const modal = document.createElement('div');
    modal.id = 'app-modal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4';

    modal.innerHTML = `
        <!-- Dark backdrop -->
        <div id="modal-backdrop" class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

        <!-- Modal box -->
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg 
                    animate-fade-in max-h-[90vh] flex flex-col">
            
            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 class="text-lg font-semibold text-gray-800">${title}</h2>
                <button onclick="closeModal()" 
                        class="w-8 h-8 flex items-center justify-center rounded-lg 
                               text-gray-400 hover:text-gray-600 hover:bg-gray-100">✕</button>
            </div>

            <!-- Body (scrollable) -->
            <div class="px-6 py-4 overflow-y-auto flex-1">
                ${bodyHTML}
            </div>

            <!-- Footer buttons -->
            <div class="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
                <button onclick="closeModal()" 
                        class="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 
                               hover:bg-gray-200 rounded-lg transition-colors">
                    Cancel
                </button>
                <button id="modal-confirm-btn"
                        class="px-4 py-2 text-sm font-medium text-white ${confirmClass} 
                               rounded-lg transition-colors">
                    ${confirmText}
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Backdrop click to close
    document.getElementById('modal-backdrop').addEventListener('click', closeModal);

    // Keyboard Escape to close
    document.addEventListener('keydown', handleEscapeKey);

    // Wire confirm button
    document.getElementById('modal-confirm-btn').addEventListener('click', onConfirm);
}

function closeModal() {
    const modal = document.getElementById('app-modal');
    if (modal) modal.remove();
    document.removeEventListener('keydown', handleEscapeKey);
}

function handleEscapeKey(e) {
    if (e.key === 'Escape') closeModal();
}
