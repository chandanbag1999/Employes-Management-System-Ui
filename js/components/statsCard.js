function renderStatsCard({ title, value, icon, colorClass }) {
    // colorClass example: 'bg-indigo-500', 'bg-green-500', 'bg-orange-500'
    return `
        <div class="bg-white rounded-xl p-4 sm:p-5 md:p-6 shadow-sm border border-gray-100 
                    flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 
                    hover:shadow-md transition-shadow duration-200">
            
            <div class="w-10 h-10 sm:w-12 sm:h-12 ${colorClass} rounded-lg flex items-center 
                        justify-center text-xl sm:text-2xl flex-shrink-0">
                ${icon}
            </div>

            <div class="text-center sm:text-left flex-1 min-w-0">
                <div class="text-xs sm:text-sm text-gray-500 font-medium">${title}</div>
                <div class="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">${value}</div>
            </div>
        </div>
    `;
}
