function openModal({ title, bodyHTML, onConfirm, confirmText = 'Save', confirmClass = 'bg-indigo-600 hover:bg-indigo-700' }) {
    // Remove any existing modal first
    closeModal();

    const modal = document.createElement('div');
    modal.id = 'app-modal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-fade-in';

    modal.innerHTML = `
        <!-- Dark backdrop -->
        <div id="modal-backdrop" class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

        <!-- Modal box - responsive sizing -->
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-2xl
                    max-h-[85vh] sm:max-h-[90vh] flex flex-col">
            
            <!-- Header - sticky on scroll -->
            <div class="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 flex-shrink-0">
                <h2 class="text-base sm:text-lg font-semibold text-gray-800 pr-2">${title}</h2>
                <button onclick="closeModal()" 
                        class="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0
                               text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">✕</button>
            </div>

            <!-- Body (scrollable) - improved spacing -->
            <div class="px-4 sm:px-6 py-4 sm:py-5 overflow-y-auto flex-1">
                ${bodyHTML}
            </div>

            <!-- Footer buttons - sticky on scroll -->
            <div class="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100 flex-shrink-0 bg-gray-50">
                <button onclick="closeModal()" 
                        class="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 
                               hover:bg-gray-200 rounded-lg transition-colors">
                    Cancel
                </button>
                <button id="modal-confirm-btn"
                        class="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white ${confirmClass} 
                               rounded-lg transition-colors">
                    ${confirmText}
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

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
    document.body.style.overflow = 'auto';
    document.removeEventListener('keydown', handleEscapeKey);
}

function handleEscapeKey(e) {
    if (e.key === 'Escape') closeModal();
}
