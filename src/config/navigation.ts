import type { Role } from '@/types';

export interface NavItem {
  title: string;
  path: string;
  icon: string;
  roles: Role[];
  badge?: number;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const navigationConfig: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { title: 'Dashboard', path: '/', icon: 'LayoutDashboard', roles: ['SuperAdmin', 'HRAdmin', 'Manager', 'Employee'] },
    ],
  },
  {
    label: 'People',
    items: [
      { title: 'Employees', path: '/employees', icon: 'Users', roles: ['SuperAdmin', 'HRAdmin', 'Manager'] },
      { title: 'Departments', path: '/departments', icon: 'Building2', roles: ['SuperAdmin', 'HRAdmin'] },
    ],
  },
  {
    label: 'Time & Leave',
    items: [
      { title: 'Attendance', path: '/attendance', icon: 'Clock', roles: ['SuperAdmin', 'HRAdmin', 'Manager', 'Employee'] },
      { title: 'Leaves', path: '/leaves', icon: 'CalendarDays', roles: ['SuperAdmin', 'HRAdmin', 'Manager', 'Employee'] },
    ],
  },
  {
    label: 'Compensation',
    items: [
      { title: 'Payroll', path: '/payroll', icon: 'Wallet', roles: ['SuperAdmin', 'HRAdmin'] },
    ],
  },
  {
    label: 'Growth',
    items: [
      { title: 'Performance', path: '/performance', icon: 'TrendingUp', roles: ['SuperAdmin', 'HRAdmin', 'Manager', 'Employee'] },
    ],
  },
  {
    label: 'Analytics',
    items: [
      { title: 'Reports', path: '/reports', icon: 'BarChart3', roles: ['SuperAdmin', 'HRAdmin', 'Manager'] },
    ],
  },
  {
    label: 'Administration',
    items: [
      { title: 'User Management', path: '/users', icon: 'Shield', roles: ['SuperAdmin'] },
    ],
  },
];

export const getNavForRole = (role: Role): NavGroup[] => {
  return navigationConfig
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.roles.includes(role)),
    }))
    .filter((group) => group.items.length > 0);
};
