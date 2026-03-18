// src/components/common/Badge.jsx
import React from 'react';

export const Badge = ({ status }) => {
  const styles = {
    'Active': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'On Leave': 'bg-amber-50 text-amber-700 border-amber-200',
    'Inactive': 'bg-slate-50 text-slate-700 border-slate-200',
    'Admin': 'bg-purple-50 text-purple-700 border-purple-200',
    'User': 'bg-blue-50 text-blue-700 border-blue-200' 
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status] || styles['Inactive']}`}>
      {status}
    </span>
  );
};