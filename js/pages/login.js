function renderLoginPage() {
    document.getElementById('app').innerHTML = `
        <div class="min-h-screen flex flex-col lg:flex-row animate-fade-in">

            <!-- LEFT SIDE — Branding (hidden on mobile) -->
            <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 
                        flex-col items-center justify-center p-8 sm:p-12 text-white">
                <div class="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center 
                            text-3xl font-bold mb-6">E</div>
                <h1 class="text-3xl sm:text-4xl font-bold mb-3 text-center">EMS Portal</h1>
                <p class="text-slate-400 text-center text-base sm:text-lg max-w-sm">
                    Manage your workforce efficiently. All your HR operations in one place.
                </p>
                <div class="mt-12 grid grid-cols-2 gap-4 w-full max-w-xs text-sm text-slate-400">
                    <div class="bg-white/5 rounded-xl p-4 text-center">
                        <div class="text-2xl font-bold text-white mb-1">CRUD</div>
                        <div>Employee Ops</div>
                    </div>
                    <div class="bg-white/5 rounded-xl p-4 text-center">
                        <div class="text-2xl font-bold text-white mb-1">JWT</div>
                        <div>Secure Auth</div>
                    </div>
                </div>
            </div>

            <!-- RIGHT SIDE — Login Form -->
            <div class="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen lg:min-h-auto">
                <div class="w-full max-w-md">
                    
                    <div class="mb-8">
                        <h2 class="text-2xl sm:text-3xl font-bold text-gray-800">Welcome back</h2>
                        <p class="text-gray-500 mt-2 text-sm sm:text-base">Sign in to your account</p>
                    </div>

                    <!-- Error message box (hidden by default) -->
                    <div id="login-error" 
                         class="hidden bg-red-50 border border-red-200 text-red-700 
                                px-4 py-3 rounded-lg text-sm mb-4">
                    </div>

                    <form id="login-form" class="space-y-4 sm:space-y-5">

                        <!-- Email -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input type="email" name="email" required
                                   placeholder="you@company.com"
                                   class="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm
                                          focus:outline-none focus:ring-2 focus:ring-indigo-500 
                                          focus:border-transparent transition-all">
                        </div>

                        <!-- Password -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input type="password" name="password" required minlength="8"
                                   placeholder="Min. 8 characters"
                                   class="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm
                                          focus:outline-none focus:ring-2 focus:ring-indigo-500 
                                          focus:border-transparent transition-all">
                        </div>

                        <!-- Submit Button -->
                        <button type="submit" id="login-btn"
                                class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold 
                                       py-3 px-4 rounded-xl transition-colors duration-200 mt-6 h-11">
                            Sign In
                        </button>
                    </form>

                    <p class="text-center text-sm text-gray-500 mt-6">
                        Don't have an account? 
                        <a href="#/register" class="text-indigo-600 font-medium hover:underline">
                            Register here
                        </a>
                    </p>
                </div>
            </div>
        </div>
    `;

    // Wire up form submit AFTER rendering
    document.getElementById('login-form').addEventListener('submit', handleLoginSubmit);
}

async function handleLoginSubmit(e) {
    e.preventDefault(); // Stop default form POST behavior

    const form = e.target;
    const email = form.email.value.trim();
    const password = form.password.value;

    const btn = document.getElementById('login-btn');
    const errorBox = document.getElementById('login-error');

    // Show loading state
    btn.disabled = true;
    btn.textContent = 'Signing in...';
    errorBox.classList.add('hidden');

    try {
        await login(email, password); // auth.js function
        // login() will redirect to #/dashboard on success
    } catch (error) {
        // Show error message
        errorBox.textContent = error.message;
        errorBox.classList.remove('hidden');
    } finally {
        // Always restore button
        btn.disabled = false;
        btn.textContent = 'Sign In';
    }
};
