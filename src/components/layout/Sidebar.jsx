// src/components/layout/Sidebar.jsx
import React from 'react';
import { Building2, X, Lock } from 'lucide-react';

export default function Sidebar({ isMobileMenuOpen, setIsMobileMenuOpen, activeTab, setActiveTab, currentUserName, currentUserEmail, handleLogout, navItems }) {
  return (
    <aside className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-white border-r border-slate-200 shadow-sm transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col`}>
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-indigo-200 shadow-lg">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-900">Crextio</span>
        </div>
        <button className="lg:hidden p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Main Menu</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? 'bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100/50' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
              <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />{item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100 mt-auto">
        <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl border border-slate-100">
          <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(currentUserName)}&background=random`} alt="User" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">{currentUserName}</p>
            <p className="text-xs text-slate-500 truncate">{currentUserEmail}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors">
          <Lock className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </aside>
  );
}