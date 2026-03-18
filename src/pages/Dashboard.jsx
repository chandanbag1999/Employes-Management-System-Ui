import React from 'react';
import { ChevronRight, Briefcase } from 'lucide-react';
import { Badge } from '../components/common/Badge';

export default function Dashboard({ derivedStats, employees, setSearchQuery, setActiveTab, setSelectedEmployee, setAiResult }) {
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 4 Info Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {derivedStats.map((stat, idx) => (
          <div key={idx} onClick={() => { setSearchQuery(''); setActiveTab(stat.targetTab); }}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} group-hover:scale-110 transition-transform`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
              <p className="text-sm font-medium text-slate-500 mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Recent Employees Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Recent Employees</h3>
          <button onClick={() => setActiveTab('employees')} className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1">
            View Directory <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Position & Dept</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.slice(0, 5).map((employee) => {
                 const empId = employee.id ?? employee.Id;
                 const empName = employee.name ?? employee.Name ?? employee.firstName ?? employee.FirstName ?? 'Unknown';
                 const empPos = employee.position ?? employee.Position ?? 'No Position';
                 const empDept = employee.departmentName ?? employee.DepartmentName ?? 'No Dept';
                 const empActive = employee.isActive ?? employee.IsActive ?? true;
                 
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
                    <td className="px-6 py-4">
                      <Badge status={empActive ? 'Active' : 'Inactive'} />
                    </td>
                  </tr>
                 );
              })}
              {employees.length === 0 && (
                <tr><td colSpan="3" className="px-6 py-12 text-center text-slate-500">No employees added yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}