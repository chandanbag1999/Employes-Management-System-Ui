// src/App.jsx
import React, { useState, useEffect } from 'react';
// 🐛 FIX: CheckCircle2 aur Briefcase ko yahan import list mein add kar diya gaya hai
import { Users, LayoutDashboard, Settings, Building2, ShieldCheck, CheckCircle2, Briefcase } from 'lucide-react';

import { parseJwt } from './utils/auth';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';

import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Departments from './pages/Departments';
import SystemUsers from './pages/SystemUsers';

const API_BASE_URL = "https://emp-mgmt-api.runasp.net/api"; 

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState(localStorage.getItem('token') || null);
  const [currentUser, setCurrentUser] = useState(null);
  
  const [activeTab, setActiveTab] = useState('employees');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [systemUsers, setSystemUsers] = useState([]);

  const userRole = currentUser?.role || currentUser?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 'User';
  const isAdmin = userRole.toLowerCase() === 'admin';

  useEffect(() => {
    if (authToken) {
      const decodedToken = parseJwt(authToken);
      if (!decodedToken) {
        handleLogout();
        return;
      }
      setCurrentUser(decodedToken);
      setIsAuthenticated(true);
      fetchDepartments();
      fetchEmployees();
      
      const isAdminRole = (decodedToken?.role || decodedToken?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'])?.toLowerCase() === 'admin';
      if (isAdminRole) fetchSystemUsers();
    }
  }, [authToken]);

  const extractArrayData = (data) => {
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.$values)) return data.$values;
    if (data && Array.isArray(data.data)) return data.data;
    return [];
  };

  const fetchSystemUsers = async () => {
    const fallbackData = [
      { id: '1', name: 'System Admin', email: 'admin@crextio.inc', role: 'Admin' },
      { id: '2', name: 'Amélie Laurent', email: 'amelie@crextio.inc', role: 'User' },
      { id: '3', name: 'David Kim', email: 'david@crextio.inc', role: 'User' }
    ];
    try {
      const res = await fetch(`${API_BASE_URL}/Auth/users`, { headers: { 'Authorization': `Bearer ${authToken}` } });
      if (res.ok) setSystemUsers(extractArrayData(await res.json()));
      else setSystemUsers(fallbackData); 
    } catch (error) { setSystemUsers(fallbackData); }
  };

  const fetchDepartments = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/Department`, { headers: { 'Authorization': `Bearer ${authToken}` } });
      if (res.ok) setDepartments(extractArrayData(await res.json()));
    } catch (error) { console.error(error); }
  };

  const fetchEmployees = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/Employee`, { headers: { 'Authorization': `Bearer ${authToken}` } });
      if (res.ok) setEmployees(extractArrayData(await res.json()));
    } catch (error) { console.error(error); }
  };

  const handleLoginSuccess = (token, decoded) => {
    setAuthToken(token);
    setCurrentUser(decoded);
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setAuthToken(null);
    setCurrentUser(null);
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  const activeEmployeeCount = employees.filter(e => (e.isActive ?? e.IsActive ?? true)).length;
  const derivedStats = [
    { label: 'Total Employees', value: String(employees.length), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', targetTab: 'employees' },
    { label: 'Active Now', value: String(activeEmployeeCount), icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', targetTab: 'employees' },
    { label: 'Departments', value: String(departments.length), icon: Building2, color: 'text-amber-600', bg: 'bg-amber-50', targetTab: 'departments' },
    { label: isAdmin ? 'System Users' : 'Open Roles', value: isAdmin ? String(systemUsers.length) : '8', icon: isAdmin ? ShieldCheck : Briefcase, color: 'text-purple-600', bg: 'bg-purple-50', targetTab: isAdmin ? 'users' : 'employees' }, 
  ];

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'departments', label: 'Departments', icon: Building2 },
    ...(isAdmin ? [{ id: 'users', label: 'System Users', icon: ShieldCheck }] : []),
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  if (!isAuthenticated) {
    return <Auth onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex">
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden transition-opacity backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      <Sidebar 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        currentUserName={currentUser?.name || currentUser?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || 'User'} 
        currentUserEmail={currentUser?.email || currentUser?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || ''} 
        handleLogout={handleLogout} 
        navItems={navItems} 
      />

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header 
          activeTab={activeTab} 
          setIsMobileMenuOpen={setIsMobileMenuOpen} 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          setActiveTab={setActiveTab} 
        />

        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 relative">
          {activeTab === 'dashboard' && (
            <Dashboard 
              derivedStats={derivedStats} 
              employees={employees} 
              setSearchQuery={setSearchQuery} 
              setActiveTab={setActiveTab} 
            />
          )}

          {activeTab === 'employees' && (
            <Employees 
              employees={employees} 
              departments={departments} 
              isAdmin={isAdmin} 
              authToken={authToken} 
              fetchEmployees={fetchEmployees}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          )}

          {activeTab === 'departments' && (
            <Departments 
              departments={departments} 
              employees={employees} 
              isAdmin={isAdmin} 
              authToken={authToken} 
              fetchDepartments={fetchDepartments}
              setSearchQuery={setSearchQuery}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'users' && isAdmin && (
            <SystemUsers 
              systemUsers={systemUsers} 
              isAdmin={isAdmin} 
              authToken={authToken} 
              fetchSystemUsers={fetchSystemUsers} 
            />
          )}

          {activeTab === 'settings' && (
            <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center animate-in fade-in zoom-in-95 duration-300">
               <Settings className="w-16 h-16 text-slate-300 mx-auto mb-4" />
               <h2 className="text-2xl font-bold text-slate-900 mb-2">System Settings</h2>
               <p className="text-slate-500">Configuration panel. Manage departments, roles, and company policies.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}