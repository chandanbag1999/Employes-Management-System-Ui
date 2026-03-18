// src/pages/Employees.jsx
import React, { useState, useMemo } from 'react';
import { 
  Search, Plus, MoreVertical, Filter, Building2, Briefcase, 
  Mail, Phone, ChevronRight, CheckCircle2, XCircle,
  Sparkles, Loader2, Wand2, FileText, TrendingUp, X
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { generateWithGemini } from '../services/gemini';

const API_BASE_URL = "https://emp-mgmt-api.runasp.net/api";

export default function Employees({ employees, departments, isAdmin, authToken, fetchEmployees, searchQuery, setSearchQuery }) {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [modalError, setModalError] = useState('');
  
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [openEmpMenuId, setOpenEmpMenuId] = useState(null);

  const [aiResult, setAiResult] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeAiAction, setActiveAiAction] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState(''); 
  const [deptFilter, setDeptFilter] = useState(''); 

  const extractApiError = (errorData) => {
    let errorMsg = "Operation failed. Backend rejected the request.";
    if (errorData?.errors && typeof errorData.errors === 'object' && Object.keys(errorData.errors).length > 0) {
        const firstErrKey = Object.keys(errorData.errors)[0];
        errorMsg = Array.isArray(errorData.errors[firstErrKey]) ? errorData.errors[firstErrKey][0] : errorData.errors[firstErrKey];
    } else if (errorData?.message) errorMsg = errorData.message;
    else if (errorData?.title) errorMsg = errorData.title;
    return errorMsg;
  };

  const handleSaveEmployee = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    setModalError('');
    
    const formData = new FormData(e.target);
    const deptId = formData.get('departmentId');

    if (!deptId) {
      setModalError('Please select a valid department.');
      setIsCreating(false); return;
    }
    
    const payload = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      position: formData.get('position'),
      salary: parseFloat(formData.get('salary')), 
      isActive: formData.get('isActive') === 'true', 
      departmentId: parseInt(deptId, 10)
    };

    const empId = editingEmployee?.id ?? editingEmployee?.Id;
    const url = editingEmployee ? `${API_BASE_URL}/Employee/${empId}` : `${API_BASE_URL}/Employee`;
    const method = editingEmployee ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        await fetchEmployees(); 
        setIsAddModalOpen(false);
        setEditingEmployee(null);
      } else {
        const errorData = await res.json().catch(() => null);
        setModalError(extractApiError(errorData));
      }
    } catch (error) {
      setModalError("Server is unreachable.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteEmployee = async () => {
    if (!employeeToDelete) return;
    const empId = employeeToDelete.id ?? employeeToDelete.Id;
    try {
      const res = await fetch(`${API_BASE_URL}/Employee/${empId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (res.ok) {
        await fetchEmployees();
        setEmployeeToDelete(null);
        setSelectedEmployee(null);
      } else {
        alert("Failed to delete employee.");
      }
    } catch (e) {
      alert("Error connecting to server while deleting.");
    } finally {
      setEmployeeToDelete(null);
    }
  };

  const handleAIGeneration = async (employee, actionType) => {
    setIsGenerating(true);
    setActiveAiAction(actionType);
    setAiResult('');
    
    const empName = employee.name ?? employee.Name ?? employee.firstName ?? employee.FirstName ?? 'Employee';
    const empPos = employee.position ?? employee.Position ?? 'their role';
    const empDept = employee.departmentName ?? employee.DepartmentName ?? 'organization';
    const empJoin = employee.joinDate ?? employee.JoinDate ?? 'recently';

    let prompt = '';
    if (actionType === 'review') {
      prompt = `You are an HR expert. Write a short, professional performance review draft (2 short paragraphs) for ${empName}, a ${empPos} in the ${empDept} department. They joined on ${empJoin}. Highlight their likely contributions to the team and suggest one realistic area for continuous growth. Keep it realistic but encouraging.`;
    } else if (actionType === 'growth') {
      prompt = `You are a career coach. Suggest a brief, actionable 3-step career growth plan for ${empName}, currently a ${empPos} in the ${empDept} department. Focus on specific technical or leadership skills they should acquire over the next 6-12 months to get to the next level.`;
    } else if (actionType === 'welcome') {
      prompt = `Write a fun, enthusiastic welcome email to the team introducing ${empName}, our new ${empPos} in ${empDept}. Mention we are excited to have their expertise on board. Keep it under 100 words.`;
    }

    const response = await generateWithGemini(prompt);
    setAiResult(response);
    setIsGenerating(false);
    setActiveAiAction('');
    setIsCopied(false); 
  };

  const handleCopyText = () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(aiResult);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = aiResult;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const formatAIResult = (text) => {
    return text.split('\n').map((line, i) => {
      if (!line.trim()) return <div key={i} className="h-2" />;
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={i} className="text-sm text-slate-700 leading-relaxed">
          {parts.map((part, j) => 
            part.startsWith('**') && part.endsWith('**') ? <strong key={j} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong> : part
          )}
        </p>
      );
    });
  };

  const filteredEmployees = useMemo(() => {
    let filtered = employees;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(emp => {
        const name = String(emp.name ?? emp.Name ?? emp.firstName ?? emp.FirstName ?? '');
        const position = String(emp.position ?? emp.Position ?? '');
        const departmentName = String(emp.departmentName ?? emp.DepartmentName ?? '');
        
        return name.toLowerCase().includes(query) ||
               position.toLowerCase().includes(query) ||
               departmentName.toLowerCase().includes(query);
      });
    }

    if (statusFilter) {
      filtered = filtered.filter(emp => {
        const rawActive = emp.isActive ?? emp.IsActive;
        const isEmpActive = rawActive === undefined ? true : (rawActive === true || String(rawActive).toLowerCase() === 'true');
        if (statusFilter === 'Active') return isEmpActive;
        if (statusFilter === 'Inactive') return !isEmpActive;
        return true;
      });
    }

    if (deptFilter) {
      const selectedDept = departments.find(d => String(d.id ?? d.Id) === String(deptFilter));
      const selectedDeptName = String(selectedDept?.name ?? selectedDept?.Name ?? '').toLowerCase();

      filtered = filtered.filter(emp => {
        const empDeptId = String(emp.departmentId ?? emp.DepartmentId ?? '');
        const empDeptName = String(emp.departmentName ?? emp.DepartmentName ?? '').toLowerCase();
        return empDeptId === String(deptFilter) || (selectedDeptName && empDeptName === selectedDeptName);
      });
    }

    return filtered;
  }, [employees, searchQuery, statusFilter, deptFilter, departments]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Global overlay for dropdowns */}
      {(openEmpMenuId || isFilterMenuOpen) && (
        <div className="fixed inset-0 z-10" onClick={() => { setOpenEmpMenuId(null); setIsFilterMenuOpen(false); }}></div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-20">
        <div className="relative flex-1 max-w-md">
          <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input type="text" placeholder="Search by name, position, or department..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm shadow-sm focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition-all outline-none" />
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm transition-colors"
            >
              <Filter className="w-4 h-4" /> Filters
              {(statusFilter || deptFilter) && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border border-white"></span>
              )}
            </button>

            {isFilterMenuOpen && (
              <div className="absolute right-0 sm:left-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 p-4 z-30 animate-in fade-in zoom-in-95 duration-100">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-bold text-slate-900">Filter By</h4>
                  {(statusFilter || deptFilter) && (
                    <button onClick={() => { setStatusFilter(''); setDeptFilter(''); }} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors">Clear All</button>
                  )}
                </div>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-500">Status</label>
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition-all">
                      <option value="">All Statuses</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-500">Department</label>
                    <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition-all">
                      <option value="">All Departments</option>
                      {departments.map(dept => <option key={dept.id ?? dept.Id} value={dept.id ?? dept.Id}>{dept.name ?? dept.Name}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {isAdmin && (
            <button onClick={() => { setEditingEmployee(null); setIsAddModalOpen(true); setModalError(''); }}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-transparent rounded-xl text-sm font-medium text-white shadow-md transition-colors relative z-20">
              <Plus className="w-4 h-4" /> Add Employee
            </button>
          )}
        </div>
      </div>

      <div className="hidden lg:block bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Position & Dept</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Contact</th>
                {isAdmin && <th className="px-6 py-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.map((employee) => {
                 const empId = employee.id ?? employee.Id;
                 const empName = employee.name ?? employee.Name ?? employee.firstName ?? employee.FirstName ?? 'Unknown';
                 const empPos = employee.position ?? employee.Position ?? 'No Position';
                 const empDept = employee.departmentName ?? employee.DepartmentName ?? 'No Dept';
                 const empActive = employee.isActive ?? employee.IsActive ?? true;
                 const empEmail = employee.email ?? employee.Email ?? '';
                 const empPhone = employee.phone ?? employee.Phone ?? '';

                 return (
                  <tr key={empId} onClick={() => { setSelectedEmployee(employee); setAiResult(''); }} className="hover:bg-slate-50/80 transition-colors group cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(empName)}&background=random`} alt="avatar" className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm" />
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{empName}</p>
                          <p className="text-xs text-slate-500 mt-0.5">ID: EMP-{String(empId || '').padStart(4, '0')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-900">{empPos}</p>
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1"><Briefcase className="w-3 h-3" /> {empDept}</p>
                    </td>
                    <td className="px-6 py-4"><Badge status={empActive ? 'Active' : 'Inactive'} /></td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-xs text-slate-600"><Mail className="w-3.5 h-3.5 text-slate-400" /> {empEmail}</div>
                        <div className="flex items-center gap-2 text-xs text-slate-600"><Phone className="w-3.5 h-3.5 text-slate-400" /> {empPhone}</div>
                      </div>
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 text-right relative">
                        <button onClick={(e) => { e.stopPropagation(); setOpenEmpMenuId(openEmpMenuId === empId ? null : empId); }}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all focus:opacity-100">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                        {openEmpMenuId === empId && (
                          <div className="absolute right-10 top-1/2 -translate-y-1/2 mt-0 w-36 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-30 animate-in fade-in zoom-in-95 duration-100">
                            <button onClick={(e) => { e.stopPropagation(); setEditingEmployee(employee); setIsAddModalOpen(true); setModalError(''); setOpenEmpMenuId(null); }}
                              className="w-full text-left px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors">Edit Details</button>
                            <button onClick={(e) => { e.stopPropagation(); setEmployeeToDelete(employee); setOpenEmpMenuId(null); }}
                              className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">Delete</button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                 );
              })}
              {filteredEmployees.length === 0 && (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-500">No employees found matching your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
        {filteredEmployees.map((employee) => {
           const empId = employee.id ?? employee.Id;
           const empName = employee.name ?? employee.Name ?? employee.firstName ?? employee.FirstName ?? 'Unknown';
           const empPos = employee.position ?? employee.Position ?? 'No Position';
           const empDept = employee.departmentName ?? employee.DepartmentName ?? 'No Dept';
           const empActive = employee.isActive ?? employee.IsActive ?? true;
           
           return (
            <div key={empId} onClick={() => { setSelectedEmployee(employee); setAiResult(''); }} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all relative group cursor-pointer">
              {isAdmin && (
                <div className="absolute top-4 right-4 z-20">
                  <button onClick={(e) => { e.stopPropagation(); setOpenEmpMenuId(openEmpMenuId === empId ? null : empId); }} className="p-1.5 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  {openEmpMenuId === empId && (
                    <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-lg border border-slate-100 py-1 animate-in fade-in zoom-in-95 duration-100">
                      <button onClick={(e) => { e.stopPropagation(); setEditingEmployee(employee); setIsAddModalOpen(true); setModalError(''); setOpenEmpMenuId(null); }} className="w-full text-left px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors">Edit Details</button>
                      <button onClick={(e) => { e.stopPropagation(); setEmployeeToDelete(employee); setOpenEmpMenuId(null); }} className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">Delete</button>
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex items-start gap-4 mb-4">
                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(empName)}&background=random`} alt="avatar" className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md" />
                <div className="pr-8">
                  <h3 className="text-base font-bold text-slate-900">{empName}</h3>
                  <p className="text-sm font-medium text-indigo-600">{empPos}</p>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> {empDept}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Badge status={empActive ? 'Active' : 'Inactive'} />
                <div className="flex items-center gap-2">
                  <a href={`mailto:${employee.email || employee.Email || ''}`} onClick={e => e.stopPropagation()} className="p-2 bg-slate-50 text-slate-600 rounded-full hover:bg-indigo-50 hover:text-indigo-600 transition-colors"><Mail className="w-4 h-4" /></a>
                  <a href={`tel:${employee.phone || employee.Phone || ''}`} onClick={e => e.stopPropagation()} className="p-2 bg-slate-50 text-slate-600 rounded-full hover:bg-indigo-50 hover:text-indigo-600 transition-colors"><Phone className="w-4 h-4" /></a>
                </div>
              </div>
            </div>
           );
        })}
      </div>

      {/* --- MODALS --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => !isCreating && setIsAddModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">{editingEmployee ? 'Edit Employee' : 'Add New Employee'}</h2>
              <button onClick={() => setIsAddModalOpen(false)} disabled={isCreating} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors disabled:opacity-50"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveEmployee} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto hide-scrollbar">
              {modalError && <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-medium flex items-start gap-2"><XCircle className="w-4 h-4 shrink-0 mt-0.5" /><span>{modalError}</span></div>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5"><label className="text-xs font-medium text-slate-500 ml-1">First Name</label><input name="firstName" type="text" defaultValue={editingEmployee?.firstName || editingEmployee?.FirstName || (editingEmployee?.name || editingEmployee?.Name || '').split(' ')[0] || ''} required disabled={isCreating} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition-all outline-none text-sm text-slate-700 disabled:opacity-60" placeholder="e.g. John" /></div>
                <div className="space-y-1.5"><label className="text-xs font-medium text-slate-500 ml-1">Last Name</label><input name="lastName" type="text" defaultValue={editingEmployee?.lastName || editingEmployee?.LastName || (editingEmployee?.name || editingEmployee?.Name || '').split(' ').slice(1).join(' ') || ''} required disabled={isCreating} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition-all outline-none text-sm text-slate-700 disabled:opacity-60" placeholder="e.g. Doe" /></div>
                <div className="space-y-1.5"><label className="text-xs font-medium text-slate-500 ml-1">Email</label><input name="email" type="email" defaultValue={editingEmployee?.email || editingEmployee?.Email || ''} required disabled={isCreating} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition-all outline-none text-sm text-slate-700 disabled:opacity-60" placeholder="john@company.com" /></div>
                <div className="space-y-1.5"><label className="text-xs font-medium text-slate-500 ml-1">Phone</label><input name="phone" type="tel" defaultValue={editingEmployee?.phone || editingEmployee?.Phone || ''} required disabled={isCreating} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition-all outline-none text-sm text-slate-700 disabled:opacity-60" placeholder="+1 (555) 000-0000" /></div>
                <div className="space-y-1.5"><label className="text-xs font-medium text-slate-500 ml-1">Position</label><input name="position" type="text" defaultValue={editingEmployee?.position || editingEmployee?.Position || ''} required disabled={isCreating} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition-all outline-none text-sm text-slate-700 disabled:opacity-60" placeholder="e.g. Senior Developer" /></div>
                <div className="space-y-1.5"><label className="text-xs font-medium text-slate-500 ml-1">Salary</label><input name="salary" type="number" min="0" step="0.01" defaultValue={editingEmployee?.salary || editingEmployee?.Salary || ''} required disabled={isCreating} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition-all outline-none text-sm text-slate-700 disabled:opacity-60" placeholder="e.g. 50000" /></div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-500 ml-1">Department</label>
                  <select name="departmentId" defaultValue={editingEmployee?.departmentId || editingEmployee?.DepartmentId || ''} required disabled={isCreating} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition-all outline-none text-sm text-slate-700 disabled:opacity-60">
                    <option value="">Select Department...</option>
                    {departments.map(dept => <option key={dept.id ?? dept.Id} value={dept.id ?? dept.Id}>{dept.name ?? dept.Name}</option>)}
                  </select>
                </div>
                {editingEmployee && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-500 ml-1">Status</label>
                    <select name="isActive" defaultValue={(editingEmployee?.isActive ?? editingEmployee?.IsActive ?? true) ? 'true' : 'false'} required disabled={isCreating} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition-all outline-none text-sm text-slate-700 disabled:opacity-60">
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                )}
              </div>
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 mt-6 sticky bottom-0 bg-white">
                <button type="button" disabled={isCreating} onClick={() => setIsAddModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={isCreating} className="px-6 py-2.5 bg-[#fbd34d] hover:bg-[#facc15] text-slate-900 rounded-xl text-sm font-semibold shadow-md shadow-yellow-200 transition-all disabled:opacity-70 flex items-center justify-center gap-2">
                  {isCreating && <Loader2 className="w-4 h-4 animate-spin text-slate-700" />} {isCreating ? 'Saving...' : (editingEmployee ? 'Update Details' : 'Create Employee')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {employeeToDelete && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setEmployeeToDelete(null)} />
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-xl p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-red-100"><XCircle className="w-6 h-6" /></div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Remove Employee?</h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">Are you sure you want to delete <strong className="text-slate-800">{employeeToDelete.name ?? employeeToDelete.Name ?? employeeToDelete.firstName ?? employeeToDelete.FirstName}</strong>? This cannot be undone.</p>
            <div className="flex items-center gap-3">
              <button onClick={() => setEmployeeToDelete(null)} className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
              <button onClick={handleDeleteEmployee} className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md shadow-red-200 transition-all">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* AI Assistant Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setSelectedEmployee(null)} />
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-full animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
              <div className="flex items-center gap-5">
                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedEmployee.name ?? selectedEmployee.Name ?? selectedEmployee.firstName ?? selectedEmployee.FirstName ?? 'E')}&background=random`} alt="avatar" className="w-16 h-16 rounded-full border-4 border-white shadow-md object-cover" />
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{selectedEmployee.name ?? selectedEmployee.Name ?? selectedEmployee.firstName ?? selectedEmployee.FirstName ?? 'Unknown'}</h2>
                  <p className="text-sm font-medium text-indigo-600 mb-1">{selectedEmployee.position ?? selectedEmployee.Position ?? 'No Position'}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> {selectedEmployee.departmentName ?? selectedEmployee.DepartmentName ?? 'No Dept'}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {selectedEmployee.email ?? selectedEmployee.Email ?? 'No Email'}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedEmployee(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="p-6 overflow-y-auto bg-slate-50/30">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-1">
                <div className="bg-gradient-to-r from-indigo-50/50 to-purple-50/50 rounded-xl p-5 border border-indigo-100/50">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2 text-indigo-900">
                      <div className="p-1.5 bg-indigo-100 rounded-lg text-indigo-600"><Sparkles className="w-4 h-4" /></div>
                      <h3 className="font-bold text-sm tracking-tight">HR AI Assistant</h3>
                    </div>
                    <p className="text-xs font-medium text-indigo-400">Powered by Gemini</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-2">
                    <button disabled={isGenerating} onClick={() => handleAIGeneration(selectedEmployee, 'review')} className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border ${activeAiAction === 'review' ? 'border-indigo-400 shadow-sm' : 'border-slate-200'} rounded-xl hover:border-indigo-300 hover:shadow-sm transition-all disabled:opacity-50 text-slate-700 hover:text-indigo-700 text-xs font-medium`}><FileText className="w-4 h-4" /> Performance Review</button>
                    <button disabled={isGenerating} onClick={() => handleAIGeneration(selectedEmployee, 'growth')} className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border ${activeAiAction === 'growth' ? 'border-indigo-400 shadow-sm' : 'border-slate-200'} rounded-xl hover:border-indigo-300 hover:shadow-sm transition-all disabled:opacity-50 text-slate-700 hover:text-indigo-700 text-xs font-medium`}><TrendingUp className="w-4 h-4" /> Growth Plan</button>
                    <button disabled={isGenerating} onClick={() => handleAIGeneration(selectedEmployee, 'welcome')} className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border ${activeAiAction === 'welcome' ? 'border-indigo-400 shadow-sm' : 'border-slate-200'} rounded-xl hover:border-indigo-300 hover:shadow-sm transition-all disabled:opacity-50 text-slate-700 hover:text-indigo-700 text-xs font-medium`}><Wand2 className="w-4 h-4" /> Welcome Email</button>
                  </div>

                  <div className={`transition-all duration-500 overflow-hidden ${isGenerating || aiResult ? 'max-h-[500px] mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-inner relative min-h-[150px]">
                      {aiResult && !isGenerating && (
                        <button onClick={handleCopyText} className="absolute top-4 right-4 p-2 flex items-center gap-1.5 text-xs font-medium bg-slate-50 hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 rounded-lg border border-slate-200 transition-all z-10">
                          {isCopied ? <><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Copied!</> : <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg> Copy</>}
                        </button>
                      )}

                      {isGenerating ? (
                        <div className="flex flex-col items-center justify-center h-full text-indigo-500 space-y-3 py-8">
                          <Loader2 className="w-8 h-8 animate-spin" />
                          <span className="text-xs font-medium animate-pulse text-slate-500">
                            {activeAiAction === 'review' && 'Drafting professional performance review...'}
                            {activeAiAction === 'growth' && 'Structuring actionable growth plan...'}
                            {activeAiAction === 'welcome' && 'Writing enthusiastic welcome email...'}
                          </span>
                        </div>
                      ) : (
                        <div className="animate-in fade-in duration-500 prose prose-sm max-w-none text-slate-600 pt-2">
                          {formatAIResult(aiResult)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};