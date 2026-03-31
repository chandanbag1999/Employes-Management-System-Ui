# Navigation Module

## Overview

The Navigation Module provides centralized navigation configuration with role-based access control for the sidebar menu.

## Files

| File | Purpose |
|------|---------|
| [`src/config/navigation.ts`](../../src/config/navigation.ts:1) | Navigation configuration |

---

## Navigation Configuration

### [`src/config/navigation.ts`](../../src/config/navigation.ts:1)

**Purpose**: Defines navigation structure, menu items, and role-based filtering.

### Type Definitions

```typescript
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

type Role = 'SuperAdmin' | 'HRAdmin' | 'Manager' | 'Employee';
```

### Navigation Groups

```typescript
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
```

### Role-Based Filtering

```typescript
export const getNavForRole = (role: Role): NavGroup[] => {
  return navigationConfig
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.roles.includes(role)),
    }))
    .filter((group) => group.items.length > 0);
};
```

### Icon Mapping (in Sidebar)

```typescript
const iconMap: Record<string, React.FC<{ className?: string }>> = {
  LayoutDashboard, Users, Building2, Clock, CalendarDays,
  Wallet, TrendingUp, BarChart3, Shield,
};
```

---

## Navigation Structure

### Group: Overview

| Item | Path | Icon | Roles |
|------|------|------|-------|
| Dashboard | `/` | LayoutDashboard | All |

### Group: People

| Item | Path | Icon | Roles |
|------|------|------|-------|
| Employees | `/employees` | Users | SuperAdmin, HRAdmin, Manager |
| Departments | `/departments` | Building2 | SuperAdmin, HRAdmin |

### Group: Time & Leave

| Item | Path | Icon | Roles |
|------|------|------|-------|
| Attendance | `/attendance` | Clock | All |
| Leaves | `/leaves` | CalendarDays | All |

### Group: Compensation

| Item | Path | Icon | Roles |
|------|------|------|-------|
| Payroll | `/payroll` | Wallet | SuperAdmin, HRAdmin |

### Group: Growth

| Item | Path | Icon | Roles |
|------|------|------|-------|
| Performance | `/performance` | TrendingUp | All |

### Group: Analytics

| Item | Path | Icon | Roles |
|------|------|------|-------|
| Reports | `/reports` | BarChart3 | SuperAdmin, HRAdmin, Manager |

### Group: Administration

| Item | Path | Icon | Roles |
|------|------|------|-------|
| User Management | `/users` | Shield | SuperAdmin |

---

## Role Access Matrix

| Page | SuperAdmin | HRAdmin | Manager | Employee |
|------|------------|----------|---------|----------|
| Dashboard | ✅ | ✅ | ✅ | ✅ |
| Employees | ✅ | ✅ | ✅ | ❌ |
| Departments | ✅ | ✅ | ❌ | ❌ |
| Attendance | ✅ | ✅ | ✅ | ✅ |
| Leaves | ✅ | ✅ | ✅ | ✅ |
| Payroll | ✅ | ✅ | ❌ | ❌ |
| Performance | ✅ | ✅ | ✅ | ✅ |
| Reports | ✅ | ✅ | ✅ | ❌ |
| Users | ✅ | ❌ | ❌ | ❌ |

---

## Usage in Components

### Sidebar Usage

```typescript
const AppSidebar = () => {
  const { user } = useAuthStore();
  
  if (!user) return null;

  const navGroups = getNavForRole(user.role);

  return (
    <aside>
      {navGroups.map((group) => (
        <div key={group.label}>
          <p className="text-[11px] uppercase font-semibold">{group.label}</p>
          <div>
            {group.items.map((item) => (
              <Link key={item.path} to={item.path}>
                <Icon className="w-[18px] h-[18px]" />
                <span>{item.title}</span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
};
```

---

## Related Documentation

- [Layout Module](../Layout/Layout_Module.md)
- [Authentication Module](../Authentication/Authentication_Module.md)
- [Core Application Module](../Core/Core_Application_Module.md)

---

*Last Updated: 2026-03-31*
