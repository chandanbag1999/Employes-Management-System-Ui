import React, { useState } from 'react';
import { Eye, EyeOff, Loader2, Building2, X } from 'lucide-react';
import { parseJwt } from '../utils/auth';

const API_BASE_URL = "https://emp-mgmt-api.runasp.net/api";

export default function Auth({ onLoginSuccess }) {
  const [authMode, setAuthMode] = useState('login'); 
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError('');
    
    try {
      const endpoint = authMode === 'login' ? '/Auth/login' : '/Auth/register';
      const payload = authMode === 'login' 
        ? { email, password } 
        : { name: fullName, email, password };

      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const textData = await res.text();
      let data = {};
      try {
        data = textData ? JSON.parse(textData) : {};
      } catch (err) {
        if (res.ok) data = { Token: textData };
      }

      if (res.ok) {
        const receivedToken = data.token || data.Token || data.jwt;
        if (receivedToken) {
          const decodedToken = parseJwt(receivedToken);
          // App.jsx ko token aur user details bhej do
          onLoginSuccess(receivedToken, decodedToken);
        } else {
          setAuthError('Login successful, but no token received from server.');
        }
      } else {
        let errorMessage = "Authentication failed. Please check your credentials.";
        if (data.errors && typeof data.errors === 'object' && Object.keys(data.errors).length > 0) {
          const firstErrorKey = Object.keys(data.errors)[0];
          const firstErrorList = data.errors[firstErrorKey];
          errorMessage = Array.isArray(firstErrorList) ? firstErrorList[0] : firstErrorList;
        } 
        else if (data.message) errorMessage = data.message;
        else if (data.Message) errorMessage = data.Message;
        else if (data.title) errorMessage = data.title; 
        else if (typeof data === 'string' && data) errorMessage = data;

        setAuthError(errorMessage);
      }
    } catch (error) {
      console.error("Auth Error:", error);
      setAuthError('Server is not reachable. Please ensure your backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-200/50 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-[1300px] h-[85vh] min-h-[700px] bg-gradient-to-bl from-slate-50 via-[#f8f9fa] to-[#fef2cd] rounded-[2.5rem] shadow-2xl overflow-hidden flex relative border border-white/60">
        
        {/* Left Panel - Form */}
        <div className="w-full lg:w-[45%] flex flex-col p-8 sm:p-12 relative z-10 overflow-y-auto hide-scrollbar">
          <div className="mb-10 lg:mb-auto">
            <button className="px-6 py-2 border border-slate-300 text-slate-600 rounded-full font-medium text-sm hover:bg-white/50 transition-colors">
              Crextio
            </button>
          </div>

          <div className="max-w-[380px] w-full mx-auto my-auto">
            <h2 className="text-3xl sm:text-[2rem] font-light text-slate-900 mb-2 tracking-tight">
              {authMode === 'login' ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="text-slate-500 text-sm mb-6 font-medium">
              {authMode === 'login' ? 'Sign in to access your dashboard' : 'Sign up and get 30 day free trial'}
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
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="amelielaurent7622@gmail.com" required
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

              {authMode === 'login' && (
                <div className="flex justify-end px-2">
                  <a href="#" className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors">Forgot password?</a>
                </div>
              )}

              <button type="submit" disabled={isLoading} className="w-full mt-4 py-4 px-4 bg-[#fbd34d] hover:bg-[#facc15] text-slate-900 rounded-full text-sm font-semibold shadow-md shadow-yellow-200 transition-all disabled:opacity-70 flex items-center justify-center gap-2">
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {authMode === 'login' ? 'Sign In' : 'Submit'}
              </button>
            </form>
          </div>

          <div className="mt-10 lg:mt-auto flex items-center justify-between text-[11px] sm:text-xs font-medium text-slate-500">
            <p>
              {authMode === 'login' ? "Don't have an account? " : "Have any account? "}
              <button onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} className="text-slate-900 underline underline-offset-2 hover:text-slate-600 transition-colors">
                {authMode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
            <a href="#" className="hover:text-slate-900 underline underline-offset-2 transition-colors">Terms & Conditions</a>
          </div>
        </div>

        {/* Right Panel - Beautiful Image & Premium Widgets (EXACTLY AS BEFORE) */}
        <div className="hidden lg:block lg:w-[55%] p-4 pl-0">
          <div className="w-full h-full rounded-[2rem] overflow-hidden relative group">
            <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop" alt="Office Team" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
            <button className="absolute top-6 right-6 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-slate-50 transition-colors z-20">
              <X className="w-5 h-5 text-slate-400" />
            </button>

            <div className="absolute top-12 left-10 z-20 animate-in slide-in-from-left-8 fade-in duration-1000 delay-100 hover:-translate-y-2 hover:drop-shadow-2xl transition-all duration-500 cursor-default">
              <div className="bg-[#fbd34d] px-5 py-4 rounded-2xl shadow-xl w-64 relative">
                <h4 className="font-semibold text-slate-900 text-sm">Task Review With Team</h4>
                <p className="text-slate-700 text-xs mt-0.5">09:30am-10:00am</p>
                <div className="absolute top-4 right-4 w-2 h-2 bg-slate-900 rounded-full animate-pulse"></div>
              </div>
              <div className="bg-[#2d2d2d] px-5 py-4 rounded-2xl shadow-xl w-64 absolute -bottom-4 -z-10 -right-4 flex justify-between items-end pb-3 opacity-90">
                 <p className="text-white/70 text-xs pl-2">09:30am-10:00am</p>
                 <div className="w-2 h-2 bg-[#fbd34d] rounded-full mb-1"></div>
              </div>
            </div>

            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 w-full max-w-md animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-300 hover:-translate-y-2 transition-all duration-500 cursor-default">
              <div className="bg-white/10 backdrop-blur-md border border-white/30 rounded-3xl p-6 pb-12 shadow-2xl relative translate-x-8">
                <div className="flex justify-between items-center text-white mb-2 pr-8">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <span key={day} className="text-[10px] font-medium opacity-80">{day}</span>
                  ))}
                </div>
                <div className="flex justify-between items-center text-white font-semibold pr-8 text-lg">
                  <span>22</span><span>23</span><span>24</span><span>25</span><span>26</span><span>27</span><span className="opacity-50">28</span>
                </div>
                <div className="absolute bottom-6 right-8 flex gap-1.5 opacity-40">
                  {[...Array(15)].map((_, i) => (
                    <div key={i} className="w-0.5 h-6 bg-white rotate-[30deg]"></div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl p-5 shadow-2xl absolute -bottom-8 left-0 w-64 border border-slate-100">
                <div className="absolute top-5 right-5 w-2 h-2 bg-[#fbd34d] rounded-full animate-pulse"></div>
                <h4 className="font-semibold text-slate-900 text-sm">Daily Meeting</h4>
                <p className="text-slate-500 text-xs mt-0.5 mb-4">12:00pm-01:00pm</p>
                <div className="flex -space-x-2">
                  <img src="https://i.pravatar.cc/100?u=1" className="w-7 h-7 rounded-full border-2 border-white hover:z-10 hover:scale-110 transition-transform" alt="Avatar"/>
                  <img src="https://i.pravatar.cc/100?u=2" className="w-7 h-7 rounded-full border-2 border-white hover:z-10 hover:scale-110 transition-transform" alt="Avatar"/>
                  <img src="https://i.pravatar.cc/100?u=3" className="w-7 h-7 rounded-full border-2 border-white hover:z-10 hover:scale-110 transition-transform" alt="Avatar"/>
                  <img src="https://i.pravatar.cc/100?u=4" className="w-7 h-7 rounded-full border-2 border-white hover:z-10 hover:scale-110 transition-transform" alt="Avatar"/>
                </div>
              </div>
            </div>

            <div className="absolute top-1/2 right-12 -translate-y-1/2 flex flex-col gap-3 animate-in fade-in duration-1000 delay-500">
              <img src="https://i.pravatar.cc/150?u=5" className="w-16 h-16 rounded-full border-[3px] border-white shadow-xl object-cover -translate-x-8 hover:scale-110 transition-transform cursor-pointer" alt="Avatar"/>
              <img src="https://i.pravatar.cc/150?u=6" className="w-12 h-12 rounded-full border-[3px] border-white shadow-xl object-cover translate-x-4 hover:scale-110 transition-transform cursor-pointer" alt="Avatar"/>
              <img src="https://i.pravatar.cc/150?u=7" className="w-10 h-10 rounded-full border-2 border-white shadow-xl object-cover -translate-x-4 hover:scale-110 transition-transform cursor-pointer" alt="Avatar"/>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}