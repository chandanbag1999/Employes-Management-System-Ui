// src/pages/Departments.jsx
import React, { useState } from 'react';
import { Plus, MoreVertical, Building2, Users, ChevronRight, X, XCircle, Loader2 } from 'lucide-react';

const API_BASE_URL = "https://emp-mgmt-api.runasp.net/api";

export default function Departments({ departments, employees, isAdmin, authToken, fetchDepartments, setSearchQuery, setActiveTab }) {
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [isSavingDept, setIsSavingDept] = useState(false);
  const [deptModalError, setDeptModalError] = useState('');
  const [deptToDelete, setDeptToDelete] = useState(null);
  const [openDeptMenuId, setOpenDeptMenuId] = useState(null);

  const extractApiError = (errorData) => {
    let errorMsg = "Operation failed. Backend rejected the request.";
    if (errorData?.errors && typeof errorData.errors === 'object' && Object.keys(errorData.errors).length > 0) {
        const firstErrKey = Object.keys(errorData.errors)[0];
        errorMsg = Array.isArray(errorData.errors[firstErrKey]) ? errorData.errors[firstErrKey][0] : errorData.errors[firstErrKey];
    } else if (errorData?.message) errorMsg = errorData.message;
    else if (errorData?.title) errorMsg = errorData.title;
    return errorMsg;
  };

  const handleSaveDepartment = async (e) => {
    e.preventDefault();
    setIsSavingDept(true);
    setDeptModalError('');
    
    const formData = new FormData(e.target);
    const payload = {
      name: formData.get('name'),
      description: formData.get('description') || null 
    };

    const deptId = editingDept?.id ?? editingDept?.Id;
    const url = editingDept ? `${API_BASE_URL}/Department/${deptId}` : `${API_BASE_URL}/Department`;
    const method = editingDept ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        await fetchDepartments();
        setIsDeptModalOpen(false);
        setEditingDept(null);
      } else {
        const errorData = await res.json().catch(() => null);
        setDeptModalError(extractApiError(errorData));
      }
    } catch (error) {
      setDeptModalError("Server is unreachable.");
    } finally {
      setIsSavingDept(false);
    }
  };

  const handleDeleteDepartment = async () => {
    if (!deptToDelete) return;
    const deptId = deptToDelete.id ?? deptToDelete.Id;
    try {
      const res = await fetch(`${API_BASE_URL}/Department/${deptId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (res.ok) {
        await fetchDepartments();
        setDeptToDelete(null);
      } else {
        alert("Failed to delete department. It might have active employees.");
      }
    } catch (e) {
      alert("Error connecting to server while deleting.");
    } finally {
      setDeptToDelete(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {openDeptMenuId && (
        <div className="fixed inset-0 z-10" onClick={() => setOpenDeptMenuId(null)}></div>
      )}

      <div className="flex items-center justify-between mb-6 relative z-20">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Departments</h2>
          <p className="text-sm text-slate-500 mt-1">Manage your organization's departments</p>
        </div>
        {isAdmin && (
          <button onClick={() => { setEditingDept(null); setIsDeptModalOpen(true); setDeptModalError(''); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 rounded-xl text-sm font-medium text-white shadow-md transition-colors relative z-20">
            <Plus className="w-4 h-4" /> Add Department
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {departments.map((dept) => {
          const deptId = dept.id ?? dept.Id;
          const deptName = dept.name ?? dept.Name ?? 'Unnamed';
          const deptDesc = dept.description ?? dept.Description;
          const empCount = employees.filter(e => (e.departmentId ?? e.DepartmentId) === deptId || (e.departmentName ?? e.DepartmentName) === deptName).length;
          
          return (
            <div key={deptId} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-6 group cursor-pointer relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-50 rounded-full blur-3xl group-hover:bg-indigo-100 transition-colors z-0"></div>
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:scale-110 transition-transform"><Building2 className="w-6 h-6" /></div>
                  {isAdmin && (
                    <div className="relative">
                      <button onClick={(e) => { e.stopPropagation(); setOpenDeptMenuId(openDeptMenuId === deptId ? null : deptId); }} className="p-1.5 text-slate-400 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      {openDeptMenuId === deptId && (
                        <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-30 animate-in fade-in zoom-in-95 duration-100">
                          <button onClick={(e) => { e.stopPropagation(); setEditingDept(dept); setIsDeptModalOpen(true); setDeptModalError(''); setOpenDeptMenuId(null); }} className="w-full text-left px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors">Edit Details</button>
                          <button onClick={(e) => { e.stopPropagation(); setDeptToDelete(dept); setOpenDeptMenuId(null); }} className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">Delete</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 mb-1">{deptName}</h3>
                <p className="text-xs font-medium text-slate-400 mb-1">ID: DEPT-{String(deptId || '').padStart(3, '0')}</p>
                {deptDesc ? <p className="text-xs text-slate-500 line-clamp-2 mt-2 h-8">{deptDesc}</p> : <div className="h-8 mt-2"></div>}
                
                <div onClick={() => { setSearchQuery(deptName); setActiveTab('employees'); }} className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between cursor-pointer group/link">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-400 group-hover/link:text-indigo-600 transition-colors" />
                    <span className="text-sm font-medium text-slate-700 group-hover/link:text-indigo-600 transition-colors">{empCount} Employees</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      {isDeptModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => !isSavingDept && setIsDeptModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">{editingDept ? 'Edit Department' : 'Add New Department'}</h2>
              <button onClick={() => setIsDeptModalOpen(false)} disabled={isSavingDept} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors disabled:opacity-50"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveDepartment} className="p-6 space-y-5">
              {deptModalError && <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-medium flex items-start gap-2"><XCircle className="w-4 h-4 shrink-0 mt-0.5" /><span>{deptModalError}</span></div>}
              <div className="space-y-1.5"><label className="text-xs font-medium text-slate-500 ml-1">Department Name *</label><input name="name" type="text" defaultValue={editingDept?.name || editingDept?.Name || ''} required disabled={isSavingDept} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition-all outline-none text-sm text-slate-700 disabled:opacity-60" placeholder="e.g. Human Resources" /></div>
              <div className="space-y-1.5"><label className="text-xs font-medium text-slate-500 ml-1">Description (Optional)</label><textarea name="description" defaultValue={editingDept?.description || editingDept?.Description || ''} rows="3" disabled={isSavingDept} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition-all outline-none text-sm text-slate-700 disabled:opacity-60 resize-none" placeholder="What does this department do?" /></div>
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 mt-6">
                <button type="button" disabled={isSavingDept} onClick={() => setIsDeptModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={isSavingDept} className="px-6 py-2.5 bg-[#fbd34d] hover:bg-[#facc15] text-slate-900 rounded-xl text-sm font-semibold shadow-md shadow-yellow-200 transition-all disabled:opacity-70 flex items-center justify-center gap-2">
                  {isSavingDept && <Loader2 className="w-4 h-4 animate-spin text-slate-700" />} {isSavingDept ? 'Saving...' : (editingDept ? 'Update Details' : 'Save Department')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deptToDelete && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setDeptToDelete(null)} />
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-xl p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-red-100"><XCircle className="w-6 h-6" /></div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Department?</h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">Are you sure you want to delete <strong className="text-slate-800">{deptToDelete.name ?? deptToDelete.Name}</strong>? This action cannot be undone.</p>
            <div className="flex items-center gap-3">
              <button onClick={() => setDeptToDelete(null)} className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
              <button onClick={handleDeleteDepartment} className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md shadow-red-200 transition-all">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};