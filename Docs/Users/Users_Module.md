# Users Module

## Overview

The Users Module handles system user management including viewing users, changing roles, and activating/deactivating accounts. Access is restricted to SuperAdmin role only.

## Files

| File | Purpose |
|------|---------|
| [`src/pages/UsersPage.tsx`](../../src/pages/UsersPage.tsx:1) | Main user management page |
| [`src/services/userService.ts`](../../src/services/userService.ts:1) | User API service |

---

## UsersPage Component

### [`UsersPage.tsx`](../../src/pages/UsersPage.tsx:1)

**Purpose**: Main user management page with user list and role management.

### Page Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│  User Management                                       [🔒 Admin Only]│
│  Manage system users and roles.                                         │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  User          │ Role            │ Status      │ Active             │ │
│  │  ──────────────┼─────────────────┼─────────────┼────────────────── │ │
│  │  👤 John D     │ [SuperAdmin ▼]  │ [Active]    │ [🔘]              │ │
│  │     john@...   │                 │             │                   │ │
│  │  ──────────────┼─────────────────┼─────────────┼────────────────── │ │
│  │  👤 Jane S     │ [HRAdmin ▼]    │ [Active]    │ [🔘]              │ │
│  │     jane@...   │                 │             │                   │ │
│  │  ──────────────┼─────────────────┼─────────────┼────────────────── │ │
│  │  👤 Bob W      │ [Employee ▼]   │ [Inactive]  │ [   ]              │ │
│  │     bob@...    │                 │             │                   │ │
│  └───────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

### Features

1. **User List**: Display all system users
2. **Role Management**: Dropdown to change user roles
3. **User Status**: Display active/inactive status
4. **Toggle Activation**: Switch to activate/deactivate users
5. **Admin Badge**: Indicator showing restricted access

### State Management

```typescript
const [users, setUsers] = useState<UserDto[]>([]);
const [loading, setLoading] = useState(true);
```

### Data Fetching

```typescript
useEffect(() => {
  fetchUsers();
}, []);

const fetchUsers = async () => {
  try {
    setLoading(true);
    const data = await userService.getAll();
    setUsers(data || []);
  } catch (err) {
    console.error('Failed to fetch users:', err);
    toast({ title: 'Error', description: 'Failed to load users', variant: 'destructive' });
  } finally {
    setLoading(false);
  }
};
```

### Toggle User Activation

```typescript
const toggleActive = async (id: number) => {
  try {
    await userService.deactivate(id);
    setUsers(u => u.map(user => 
      user.id === id ? { ...user, isActive: !user.isActive } : user
    ));
    toast({ title: 'User updated', description: 'User status has been changed.' });
  } catch (err) {
    console.error('Failed to toggle user status:', err);
    toast({ title: 'Error', description: 'Failed to update user', variant: 'destructive' });
  }
};
```

### User Table Row

```typescript
<TableRow key={u.id}>
  <TableCell>
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold">
        {u.userName?.split(' ').map(n => n[0]).join('') || u.email[0].toUpperCase()}
      </div>
      <div>
        <p className="font-medium text-sm">{u.userName}</p>
        <p className="text-xs text-muted-foreground">{u.email}</p>
      </div>
    </div>
  </TableCell>
  <TableCell>
    <Select defaultValue={u.role}>
      <SelectTrigger className="w-32 h-8 text-xs bg-muted/50 border-0">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {(['SuperAdmin', 'HRAdmin', 'Manager', 'Employee'] as Role[]).map(r => (
          <SelectItem key={r} value={r}>{r}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  </TableCell>
  <TableCell><StatusBadge status={u.isActive ? 'Active' : 'Inactive'} /></TableCell>
  <TableCell className="text-right">
    <Switch checked={u.isActive} onCheckedChange={() => toggleActive(u.id)} />
  </TableCell>
</TableRow>
```

### Loading State

```typescript
if (loading) {
  return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );
}
```

---

## User Service

### [`userService.ts`](../../src/services/userService.ts:1)

**Purpose**: API methods for user management operations.

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | Get all users |
| GET | `/users/:id` | Get user by ID |
| GET | `/users/me` | Get current user profile |
| PATCH | `/users/:id/deactivate` | Deactivate user |
| PATCH | `/users/:id/role` | Change user role |

### Service Methods

```typescript
export const userService = {
  // GET /api/v1/users
  getAll: async (): Promise<UserDto[]> => {
    const response = await api.get<ApiResponse<UserDto[]>>('/users');
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch users');
    }
    return response.data.data;
  },

  // GET /api/v1/users/:id
  getById: async (id: number): Promise<UserDto> => {
    const response = await api.get<ApiResponse<UserDto>>(`/users/${id}`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'User not found');
    }
    return response.data.data;
  },

  // GET /api/v1/users/me
  getMe: async (): Promise<UserDto> => {
    const response = await api.get<ApiResponse<UserDto>>('/users/me');
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch profile');
    }
    return response.data.data;
  },

  // PATCH /api/v1/users/:id/deactivate
  deactivate: async (id: number): Promise<void> => {
    const response = await api.patch<ApiResponse<string>>(`/users/${id}/deactivate`);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to deactivate user');
    }
  },

  // PATCH /api/v1/users/:id/role
  changeRole: async (id: number, roleName: string): Promise<void> => {
    const roleNumber = ROLE_TO_NUMBER[roleName];
    if (!roleNumber) {
      throw new Error(`Invalid role: ${roleName}`);
    }
    const response = await api.patch<ApiResponse<string>>(`/users/${id}/role`, {
      role: roleNumber
    });
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to change role');
    }
  },
};
```

### Response Types

```typescript
export interface UserDto {
  id: number;
  userName: string;
  email: string;
  role: string;           // "SuperAdmin", "HRAdmin", "Manager", "Employee"
  isActive: boolean;
  isEmailVerified: boolean;
  isLockedOut: boolean;
  createdAt: string;
  lastLogin: string | null;
}

// Role number mapping — backend UserRole enum se match karta hai
export const ROLE_TO_NUMBER: Record<string, number> = {
  'SuperAdmin': 1,
  'HRAdmin': 2,
  'Manager': 3,
  'Employee': 4,
};
```

---

## User Roles

| Role | Permissions | Access Level |
|------|-------------|---------------|
| SuperAdmin | All permissions | Full system access |
| HRAdmin | HR features | HR management |
| Manager | Team features | Team management |
| Employee | Basic features | Self-service only |

---

## Related Documentation

- [Core Application Module](../Core/Core_Application_Module.md)
- [Layout Module](../Layout/Layout_Module.md)
- [Authentication Module](../Authentication/Authentication_Module.md)
- [Common Components Module](../Foundation/Common_Components_Module.md)
- [Services Module](../Foundation/Services_Module.md)
- [Types Module](../Foundation/Types_Module.md)

---

*Last Updated: 2026-03-31*
