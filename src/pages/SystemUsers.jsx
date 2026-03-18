// src/pages/SystemUsers.jsx
import React, { useState } from 'react';
import { Plus, MoreVertical, X, XCircle, Loader2 } from 'lucide-react';
import { Badge } from '../components/common/Badge';

const API_BASE_URL = "https://emp-mgmt-api.runasp.net/api";

export default function SystemUsers({ systemUsers, isAdmin, authToken, fetchSystemUsers }) {
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isSavingUser, setIsSavingUser] = useState(false);
  const [userModalError, setUserModalError] = useState('');
  const [userToDelete, setUserToDelete] = useState(null);
  const [openUserMenuId, setOpenUserMenuId] = useState(null);

  if (!isAdmin) return null; // Security check

  const extractApiError = (errorData) => {
    let errorMsg = "Operation failed. Backend rejected the request.";
    if (errorData?.errors && typeof errorData.errors === 'object' && Object.keys(errorData.errors).length > 0) {
        const firstErrKey = Object.keys(errorData.errors)[0];
        errorMsg = Array.isArray(errorData.errors[firstErrKey]) ? errorData.errors[firstErrKey][0] : errorData.errors[firstErrKey];
    } else if (errorData?.message) errorMsg = errorData.message;
    else if (errorData?.title) errorMsg = errorData.title;
    return errorMsg;
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    setIsSavingUser(true);
    setUserModalError('');

    const formData = new FormData(e.target);
    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      role: formData.get('role') 
    };

    if (!editingUser) {
      payload.password = formData.get('password');
    }

    const userId = editingUser?.id ?? editingUser?.Id;
    const url = editingUser ? `${API_BASE_URL}/Auth/users/${userId}` : `${API_BASE_URL}/Auth/register`;
    const method = editingUser ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        await fetchSystemUsers();
        setIsUserModalOpen(false);
        setEditingUser(null);
      } else {
        const errorData = await res.json().catch(() => null);
        setUserModalError(extractApiError(errorData));
      }
    } catch (error) {
      setUserModalError("Server is unreachable.");
    } finally {
      setIsSavingUser(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    const userId = userToDelete.id ?? userToDelete.Id;
    try {
      const res = await fetch(`${API_BASE_URL}/Auth/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (res.ok) {
        await fetchSystemUsers();
        setUserToDelete(null);
      } else {
        alert("Failed to delete user. Admin cannot delete themselves or server rejected.");
      }
    } catch (e) {
      alert("Error connecting to server while deleting.");
    } finally {
      setUserToDelete(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {openUserMenuId && (
        <div className="fixed inset-0 z-10" onClick={() => setOpenUserMenuId(null)}></div>
      )}

      <div className="flex items-center justify-between mb-6 relative z-20">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">System Users</h2>
          <p className="text-sm text-slate-500 mt-1">Manage user access and roles</p>
        </div>
        <button onClick={() => { setEditingUser(null); setIsUserModalOpen(true); setUserModalError(''); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 rounded-xl text-sm font-medium text-white shadow-md transition-colors relative z-20">
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                <th className="px-6 py-4">User Details</th>
                <th className="px-6 py-4">System Role</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {systemUsers.map((user) => {
                const userId = user.id ?? user.Id;
                const userName = user.name ?? user.Name ?? user.firstName ?? user.FirstName ?? 'User';
                const userRoleVal = user.role ?? user.Role ?? 'User';
                const userEmail = user.email ?? user.Email ?? '';

                return (
                  <tr key={userId} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=random`} alt="avatar" className="w-10 h-10 rounded-full border border-slate-200 shadow-sm" />
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{userName}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{userEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><Badge status={userRoleVal} /></td>
                    <td className="px-6 py-4 text-right relative">
                      <button onClick={(e) => { e.stopPropagation(); setOpenUserMenuId(openUserMenuId === userId ? null : userId); }} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all focus:opacity-100">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      {openUserMenuId === userId && (
                        <div className="absolute right-10 top-1/2 -translate-y-1/2 mt-0 w-36 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-30 animate-in fade-in zoom-in-95 duration-100">
                          <button onClick={(e) => { e.stopPropagation(); setEditingUser(user); setIsUserModalOpen(true); setUserModalError(''); setOpenUserMenuId(null); }} className="w-full text-left px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors">Edit Details</button>
                          <button onClick={(e) => { e.stopPropagation(); setUserToDelete(user); setOpenUserMenuId(null); }} className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">Delete</button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => !isSavingUser && setIsUserModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">{editingUser ? 'Edit System User' : 'Add New User'}</h2>
              <button onClick={() => setIsUserModalOpen(false)} disabled={isSavingUser} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors disabled:opacity-50"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveUser} className="p-6 space-y-5">
              {userModalError && <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-medium flex items-start gap-2"><XCircle className="w-4 h-4 shrink-0 mt-0.5" /><span>{userModalError}</span></div>}
              <div className="space-y-1.5"><label className="text-xs font-medium text-slate-500 ml-1">Full Name</label><input name="name" type="text" defaultValue={editingUser?.name || editingUser?.Name || editingUser?.firstName || editingUser?.FirstName || ''} required disabled={isSavingUser} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition-all outline-none text-sm text-slate-700 disabled:opacity-60" placeholder="e.g. Alex Admin" /></div>
              <div className="space-y-1.5"><label className="text-xs font-medium text-slate-500 ml-1">Email Address</label><input name="email" type="email" defaultValue={editingUser?.email || editingUser?.Email || ''} required disabled={isSavingUser} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition-all outline-none text-sm text-slate-700 disabled:opacity-60" placeholder="name@company.com" /></div>
              {!editingUser && (<div className="space-y-1.5"><label className="text-xs font-medium text-slate-500 ml-1">Password</label><input name="password" type="password" required disabled={isSavingUser} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition-all outline-none text-sm text-slate-700 disabled:opacity-60" placeholder="••••••••" /></div>)}
              <div className="space-y-1.5"><label className="text-xs font-medium text-slate-500 ml-1">System Role</label><select name="role" defaultValue={editingUser?.role || editingUser?.Role || 'User'} required disabled={isSavingUser} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition-all outline-none text-sm text-slate-700 disabled:opacity-60"><option value="User">Normal User</option><option value="Admin">System Administrator</option></select></div>
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 mt-6">
                <button type="button" disabled={isSavingUser} onClick={() => setIsUserModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={isSavingUser} className="px-6 py-2.5 bg-[#fbd34d] hover:bg-[#facc15] text-slate-900 rounded-xl text-sm font-semibold shadow-md shadow-yellow-200 transition-all disabled:opacity-70 flex items-center justify-center gap-2">
                  {isSavingUser && <Loader2 className="w-4 h-4 animate-spin text-slate-700" />} {isSavingUser ? 'Saving...' : (editingUser ? 'Update Details' : 'Create User')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {userToDelete && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setUserToDelete(null)} />
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-xl p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-red-100"><XCircle className="w-6 h-6" /></div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Delete System User?</h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">Are you sure you want to delete <strong className="text-slate-800">{userToDelete.name ?? userToDelete.Name ?? userToDelete.email ?? userToDelete.Email}</strong>? They will lose access immediately.</p>
            <div className="flex items-center gap-3">
              <button onClick={() => setUserToDelete(null)} className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
              <button onClick={handleDeleteUser} className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md shadow-red-200 transition-all">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};