function renderStatsCard({ title, value, icon, colorClass }) {
    // colorClass example: 'bg-indigo-500', 'bg-green-500', 'bg-orange-500'
    return `
        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 
                    flex items-center gap-4 hover:shadow-md transition-shadow duration-200">
            
            <div class="w-12 h-12 ${colorClass} rounded-xl flex items-center 
                        justify-center text-2xl flex-shrink-0">
                ${icon}
            </div>

            <div>
                <div class="text-sm text-gray-500 font-medium">${title}</div>
                <div class="text-2xl font-bold text-gray-800">${value}</div>
            </div>
        </div>
    `;
}
