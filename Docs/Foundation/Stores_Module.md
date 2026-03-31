# Stores Module

## Overview

The Stores Module provides global state management using Zustand. It handles authentication state and UI preferences with persistence to localStorage.

## Files

| File | Purpose |
|------|---------|
| [`src/store/authStore.ts`](../../src/store/authStore.ts:1) | Authentication state |
| [`src/store/uiStore.ts`](../../src/store/uiStore.ts:1) | UI preferences state |

---

## Auth Store

### [`src/store/authStore.ts`](../../src/store/authStore.ts:1)

**Purpose**: Manages authentication state including user info, token, and authentication actions.

### State Interface

```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithToken: (token: string, userData: {...}) => boolean;
  logout: () => void;
  switchRole: (role: Role) => void;
  clearError: () => void;
}
```

### User Type

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar?: string;
  departmentId?: string;
}

type Role = 'SuperAdmin' | 'HRAdmin' | 'Manager' | 'Employee';
```

### Persistence Configuration

```typescript
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({ /* state and actions */ }),
    { name: 'ems-auth' }  // localStorage key
  )
);
```

### Login Action

```typescript
login: async (email: string, password: string) => {
  set({ isLoading: true, error: null });
  
  try {
    const response = await authService.login(email, password);

    if (!response || !response.token) {
      throw new Error('Invalid response from server');
    }

    localStorage.setItem('ems-token', response.token);

    const user: User = {
      id: '1',
      email: response.email,
      name: response.userName,
      role: response.role as Role,
      avatar: '',
    };

    set({ user, token: response.token, isAuthenticated: true, isLoading: false });
    return true;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Login failed';
    set({
      error: errorMessage,
      isLoading: false
    });
    return false;
  }
}
```

### Login With Token Action

```typescript
loginWithToken: (token: string, userData: { email: string; userName: string; role: string }) => {
  localStorage.setItem('ems-token', token);
  
  const user: User = {
    id: '1',
    email: userData.email,
    name: userData.userName,
    role: userData.role as Role,
    avatar: '',
  };

  set({ user, token, isAuthenticated: true, isLoading: false });
  return true;
}
```

### Logout Action

```typescript
logout: () => {
  localStorage.removeItem('ems-token');
  set({ user: null, token: null, isAuthenticated: false, error: null });
}
```

### Role Switching

```typescript
switchRole: (role: Role) => {
  set((state) => ({
    user: state.user ? { ...state.user, role } : null,
  }));
}
```

### Error Clearing

```typescript
clearError: () => {
  set({ error: null });
}
```

---

## UI Store

### [`src/store/uiStore.ts`](../../src/store/uiStore.ts:1)

**Purpose**: Manages UI preferences including dark mode and sidebar state.

### State Interface

```typescript
interface UIState {
  sidebarCollapsed: boolean;
  darkMode: boolean;
  toggleSidebar: () => void;
  toggleDarkMode: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}
```

### Initial State

```typescript
export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  darkMode: true,
  // ... actions
}));
```

### Sidebar Toggle

```typescript
toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
```

### Dark Mode Toggle

```typescript
toggleDarkMode: () =>
  set((s) => {
    const next = !s.darkMode;
    document.documentElement.classList.toggle('dark', next);
    return { darkMode: next };
  }),
```

### Sidebar Collapse Setter

```typescript
setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
```

---

## State Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    Application Startup                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. App loads                                                   │
│  2. Check localStorage for 'ems-auth'                           │
│  3. Restore auth state if found                                  │
│  4. Check localStorage for dark mode                            │
│  5. Apply dark mode class to <html>                             │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                     Zustand Stores                         │ │
│  │  ┌─────────────────┐    ┌─────────────────────────────┐   │ │
│  │  │    authStore    │    │         uiStore             │   │ │
│  │  │  - user         │    │  - sidebarCollapsed          │   │ │
│  │  │  - token        │    │  - darkMode                  │   │ │
│  │  │  - isAuth       │    │                              │   │ │
│  │  └─────────────────┘    └─────────────────────────────┘   │ │
│  │           ↓                        ↓                        │ │
│  │  ┌─────────────────┐    ┌─────────────────────────────┐   │ │
│  │  │  AuthGuard      │    │  AppLayout, Topbar,         │   │ │
│  │  │  Components     │    │  AppSidebar                  │   │ │
│  │  └─────────────────┘    └─────────────────────────────┘   │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## Persistence

### Auth Store Persistence

```typescript
// Persisted keys in localStorage
{
  'ems-auth': {
    state: {
      user: { id, email, name, role, ... },
      token: 'jwt-token-string',
      isAuthenticated: true,
      isLoading: false,
      error: null
    },
    version: 0
  }
}

// Also stored separately
localStorage.setItem('ems-token', 'jwt-token-string');
```

### UI Store Persistence

Not persisted - defaults to `sidebarCollapsed: false` and `darkMode: true` on each session.

---

## Related Documentation

- [Authentication Module](../Authentication/Authentication_Module.md)
- [Layout Module](../Layout/Layout_Module.md)
- [Core Application Module](../Core/Core_Application_Module.md)

---

*Last Updated: 2026-03-31*
