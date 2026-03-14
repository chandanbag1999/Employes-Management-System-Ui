function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');

    // Choose color based on type
    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
    };

    const bgColor = colors[type] || 'bg-gray-700';

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `${bgColor} text-white px-5 py-3 rounded-lg shadow-lg text-sm 
                       font-medium animate-slide-in flex items-center gap-2 min-w-64`;
    toast.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" class="ml-auto text-white opacity-70 hover:opacity-100">✕</button>
    `;

    container.appendChild(toast);

    // Auto-remove after duration
    setTimeout(() => {
        toast.remove();
    }, CONFIG.TOAST_DURATION);
};


function formatDate(isoString) {
    if (!isoString) return '—';
    return new Date(isoString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
    // "2024-03-15T00:00:00" → "15 Mar 2024"
};

function formatCurrency(amount) {
    if (amount == null) return '—';
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount);
    // 75000 → "₹75,000"
};

function showLoading(elementId) {
    const el = document.getElementById(elementId);
    if (el) el.innerHTML = `
        <div class="flex items-center justify-center py-20">
            <div class="w-10 h-10 border-4 border-indigo-500 border-t-transparent 
                        rounded-full animate-spin"></div>
        </div>
    `;
};

function getInitials(name) {
    if (!name) return '?';
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2); // Max 2 letters
    // "Chandan Bag" → "CB"
    // "Rahul"       → "R"
};





