# Core Application Module

## Overview

The Core Application Module is the foundation of the Employee Management System frontend. It contains the entry points, routing configuration, and core application setup that bootstraps the entire React application.

## Files

### [`main.tsx`](../../src/main.tsx:1)

**Purpose**: Application entry point that mounts the React application to the DOM.

**Code Analysis**:
```typescript
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
```

**Key Points**:
- Uses `createRoot` from React 18 for concurrent mode
- Mounts to element with `id="root"`
- Imports global CSS styles (`index.css`)

---

### [`App.tsx`](../../src/App.tsx:1)

**Purpose**: Root application component that sets up the entire application infrastructure including providers, routing, and error handling.

**Architecture**:
```
┌─────────────────────────────────────────────────────────┐
│                    QueryClientProvider                   │
│  ┌───────────────────────────────────────────────────┐  │
│  │                 TooltipProvider                     │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │              ErrorBoundary                   │  │  │
│  │  │  ┌─────────────────────────────────────┐    │  │  │
│  │  │  │            Toaster (Sonner)          │    │  │  │
│  │  │  │  ┌──────────────────────────────┐   │    │  │  │
│  │  │  │  │     DarkModeInit Component   │   │    │  │  │
│  │  │  │  │  ┌────────────────────────┐  │   │    │  │  │
│  │  │  │  │  │    BrowserRouter       │  │   │    │  │  │
│  │  │  │  │  │  ┌──────────────────┐  │  │   │    │  │  │
│  │  │  │  │  │  │    Routes        │  │  │   │    │  │  │
│  │  │  │  │  │  │  ┌────────────┐  │  │  │   │    │  │  │
│  │  │  │  │  │  │  │ AppLayout  │  │  │  │   │    │  │  │
│  │  │  │  │  │  │  └────────────┘  │  │  │   │    │  │  │
│  │  │  │  │  │  └──────────────────┘  │  │   │    │  │  │
│  │  │  │  │  └────────────────────────┘  │   │    │  │  │
│  │  │  │  └──────────────────────────────┘   │    │  │  │
│  │  │  └─────────────────────────────────────┘    │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Provider Hierarchy**:
1. **QueryClientProvider**: Enables React Query for data fetching
2. **TooltipProvider**: Enables Radix UI tooltips
3. **ErrorBoundary**: Catches and displays JavaScript errors
4. **Toaster**: Toast notifications (Sonner)
5. **Toaster**: Toast notifications (standard)
6. **DarkModeInit**: Syncs dark mode preference with DOM
7. **BrowserRouter**: React Router navigation
8. **Routes**: Application route definitions

---

### [`App.tsx`](../../src/App.tsx:34) - Main App Component

```typescript
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ErrorBoundary>
        <Toaster />
        <Sonner />
        <DarkModeInit />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<AuthGuard><AppLayout /></AuthGuard>}>
              {/* Protected routes */}
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);
```

---

### Route Configuration

| Route | Component | Protection | Description |
|-------|-----------|------------|-------------|
| `/login` | [`LoginPage`](../../src/pages/LoginPage.tsx:1) | Public | Login/Registration page |
| `/` | [`Dashboard`](../../src/pages/Dashboard.tsx:1) | AuthGuard | Main dashboard |
| `/employees` | [`EmployeesPage`](../../src/pages/EmployeesPage.tsx:1) | AuthGuard | Employee list |
| `/employees/:id` | [`EmployeeProfile`](../../src/pages/EmployeeProfile.tsx:1) | AuthGuard | Employee details |
| `/attendance` | [`AttendancePage`](../../src/pages/AttendancePage.tsx:1) | AuthGuard | Attendance tracking |
| `/leaves` | [`LeavesPage`](../../src/pages/LeavesPage.tsx:1) | AuthGuard | Leave management |
| `/payroll` | [`PayrollPage`](../../src/pages/PayrollPage.tsx:1) | AuthGuard + Roles | Payroll (SuperAdmin, HRAdmin) |
| `/performance` | [`PerformancePage`](../../src/pages/PerformancePage.tsx:1) | AuthGuard | Performance reviews |
| `/departments` | [`DepartmentsPage`](../../src/pages/DepartmentsPage.tsx:1) | AuthGuard + Roles | Departments (SuperAdmin, HRAdmin) |
| `/reports` | [`ReportsPage`](../../src/pages/ReportsPage.tsx:1) | AuthGuard + Roles | Reports (SuperAdmin, HRAdmin, Manager) |
| `/users` | [`UsersPage`](../../src/pages/UsersPage.tsx:1) | AuthGuard + Roles | Users (SuperAdmin only) |
| `*` | [`NotFound`](../../src/pages/NotFound.tsx:1) | Public | 404 page |

---

### Dark Mode Initialization

```typescript
const DarkModeInit = () => {
  const { darkMode } = useUIStore();
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);
  return null;
};
```

**Purpose**: 
- Syncs Zustand UI store dark mode state with Tailwind's `dark` class
- Ensures consistent dark mode across server-rendered content

---

### Query Client Configuration

```typescript
const queryClient = new QueryClient();
```

**Configuration Details**:
- Uses default React Query configuration
- Provides caching and background refetching for API calls

---

## State Dependencies

| Provider | State Used |
|----------|------------|
| DarkModeInit | `uiStore.darkMode` |
| AppLayout | `uiStore.sidebarCollapsed` |
| Routes | `authStore.isAuthenticated`, `authStore.user` |

---

## Error Handling

The ErrorBoundary component catches:
- JavaScript errors during rendering
- Errors in child component trees
- Displays a fallback UI instead of crashing the app

---

## Imports Summary

```typescript
// Providers & Core
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

// UI Providers
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Components
import ErrorBoundary from "@/components/common/ErrorBoundary";
import AuthGuard from "@/components/auth/AuthGuard";
import AppLayout from "@/components/layout/AppLayout";

// Pages
import LoginPage from "@/pages/LoginPage";
import Dashboard from "@/pages/Dashboard";
// ... other pages

// State
import { useUIStore } from "@/store/uiStore";
```

---

## Key Design Decisions

### 1. Nested Providers Pattern
Providers are nested to ensure proper context propagation and avoid conflicts.

### 2. Route Grouping
Protected routes are grouped under `AppLayout` to share common layout structure.

### 3. Role-Based Route Protection
Routes use `AuthGuard` component with `allowedRoles` prop for granular access control.

### 4. Global Error Boundary
Single ErrorBoundary wraps the entire app for consistent error handling.

---

## Related Documentation

- [Authentication Module](../Authentication/Authentication_Module.md)
- [Layout Module](../Layout/Layout_Module.md)
- [Stores Module](../Foundation/Stores_Module.md)
- [Navigation Module](../Foundation/Navigation_Module.md)

---

*Last Updated: 2026-03-31*
