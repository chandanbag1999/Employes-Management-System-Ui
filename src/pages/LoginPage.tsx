import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Loader2, X } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom'; // Better than window.location.href

export default function LoginPage() {
  const { login, register, error: authError, isLoading, clearError } = useAuthStore();
  const navigate = useNavigate();

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  // Clear errors when switching modes
  useEffect(() => {
    clearError();
  }, [authMode, clearError]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let success = false;

    if (authMode === 'login') {
      success = await login(email, password);
    } else {
      success = await register(fullName, email, password);
    }

    if (success) {
      navigate('/'); // React Router navigation is faster than window.location.href
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-200/50 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-[1300px] h-[85vh] min-h-[700px] bg-gradient-to-bl from-slate-50 via-[#f8f9fa] to-[#fef2cd] rounded-[2.5rem] shadow-2xl overflow-hidden flex relative border border-white/60">

        {/* Left Panel - Form */}
        <div className="w-full lg:w-[45%] flex flex-col p-8 sm:p-12 relative z-10 overflow-y-auto hide-scrollbar">
          <div className="mb-10 lg:mb-auto">
            <button className="px-6 py-2 border border-slate-300 text-slate-600 rounded-full font-medium text-sm hover:bg-white/50 transition-colors">
              EMS System
            </button>
          </div>

          <div className="max-w-[380px] w-full mx-auto my-auto">
            <h2 className="text-3xl sm:text-[2rem] font-light text-slate-900 mb-2 tracking-tight">
              {authMode === 'login' ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="text-slate-500 text-sm mb-6 font-medium">
              {authMode === 'login' ? 'Sign in to access your dashboard' : 'Sign up to manage your workflow'}
            </p>

            {authError && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-medium">
                {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-5">
              {authMode === 'register' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400 ml-2">Full name</label>
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Amélie Laurent" required
                    className="w-full px-6 py-4 bg-white/80 backdrop-blur-sm border-transparent rounded-full focus:bg-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition-all outline-none text-sm text-slate-700 shadow-sm" />
                </div>
              )}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 ml-2">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" required
                  className="w-full px-6 py-4 bg-white/80 backdrop-blur-sm border-transparent rounded-full focus:bg-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition-all outline-none text-sm text-slate-700 shadow-sm" />
              </div>
              <div className="space-y-1.5 relative">
                <label className="text-xs font-medium text-slate-400 ml-2">Password</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••••••••••" required
                    className="w-full pl-6 pr-12 py-4 bg-white/80 backdrop-blur-sm border-transparent rounded-full focus:bg-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition-all outline-none text-sm text-slate-700 shadow-sm tracking-widest" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={isLoading} className="w-full mt-4 py-4 px-4 bg-[#fbd34d] hover:bg-[#facc15] text-slate-900 rounded-full text-sm font-semibold shadow-md shadow-yellow-200 transition-all disabled:opacity-70 flex items-center justify-center gap-2">
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {authMode === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            </form>
          </div>

          <div className="mt-10 lg:mt-auto flex items-center justify-between text-[11px] sm:text-xs font-medium text-slate-500">
            <p>
              {authMode === 'login' ? "Don't have an account? " : "Have an account? "}
              <button onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} className="text-slate-900 underline underline-offset-2 hover:text-slate-600 transition-colors">
                {authMode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>

        {/* Right Panel - Image (Kept exactly same as yours) */}
        <div className="hidden lg:block lg:w-[55%] p-4 pl-0">
          <div className="w-full h-full rounded-[2rem] overflow-hidden relative group">
            <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop" alt="Office Team" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  );
}