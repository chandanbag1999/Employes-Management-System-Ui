# EmployeeManagementUI_V2 - Complete Frontend Documentation

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Core Application Flow](#core-application-flow)
5. [Authentication System](#authentication-system)
6. [Layout & Navigation](#layout--navigation)
7. [Feature Modules](#feature-modules)
   - [Dashboard](#dashboard)
   - [Employees](#employees)
   - [Attendance](#attendance)
   - [Leaves](#leaves)
   - [Payroll](#payroll)
   - [Performance](#performance)
   - [Reports](#reports)
   - [Users](#users)
   - [Organization](#organization)
8. [API Services Layer](#api-services-layer)
9. [State Management](#state-management)
10. [Type Definitions](#type-definitions)
11. [UI Components](#ui-components)
12. [Common Components](#common-components)
13. [Routing & Access Control](#routing--access-control)
14. [Getting Started](#getting-started)

---

## 🎯 Project Overview

**EmployeeManagementUI_V2** is a modern React + TypeScript frontend application for an Employee Management System. It provides a comprehensive web interface for HR administrators, managers, and employees to manage various aspects of the employee lifecycle including:

- Employee records management
- Attendance tracking
- Leave management
- Payroll processing
- Performance reviews
- Department organization
- User management

### Key Features
- **Role-Based Access Control (RBAC)**: Four user roles with different permissions
- **Responsive Design**: Mobile, tablet, and desktop support
- **Dark Mode**: System-wide dark mode toggle
- **Real-time Data**: Live statistics and updates
- **Modern UI**: Shadcn UI components with Tailwind CSS
- **Charts & Analytics**: Visual data representation

---

## 💻 Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | UI Library |
| **TypeScript** | 5.8.3 | Type Safety |
| **Vite** | 5.4.19 | Build Tool & Dev Server |
| **React Router** | 6.30.1 | Client-side Routing |
| **Zustand** | 5.0.12 | State Management |
| **React Query** | 5.83.0 | Server State Management |
| **Tailwind CSS** | 3.4.17 | Utility-first CSS |
| **Radix UI** | Various | Unstyled UI Primitives |
| **Recharts** | 2.15.4 | Data Visualization |
| **Framer Motion** | 12.38.0 | Animations |
| **Axios** | 1.13.6 | HTTP Client |
| **Lucide React** | 0.462.0 | Icons |
| **React Hook Form** | 7.61.1 | Form Handling |
| **Zod** | 3.25.76 | Schema Validation |
| **Sonner** | 1.7.4 | Toast Notifications |
| **date-fns** | 3.6.0 | Date Utilities |

---

## 📁 Project Structure

```
EmployeeManagementUI_V2/
│
├── public/                          # Static public assets
│   ├── favicon-32x32.png
│   ├── favicon.ico
│   ├── icon-192x192.png
│   ├── icon-512x512.png
│   └── placeholder.svg
│
├── src/                            # Source code directory
│   │
│   ├── App.tsx                     # Root application component
│   ├── main.tsx                    # Application entry point
│   ├── index.css                   # Global styles
│   ├── vite-env.d.ts               # Vite type declarations
│   │
│   ├── components/                  # React components
│   │   │
│   │   ├── auth/                   # Authentication components
│   │   │   └── AuthGuard.tsx       # Route protection component
│   │   │
│   │   ├── common/                # Shared/common components
│   │   │   ├── ErrorBoundary.tsx   # Error handling wrapper
│   │   │   ├── PageHeader.tsx      # Page title component
│   │   │   ├── StatCard.tsx         # Statistics card component
│   │   │   └── StatusBadge.tsx      # Status badge component
│   │   │
│   │   ├── layout/                 # Layout components
│   │   │   ├── AppLayout.tsx       # Main layout wrapper
│   │   │   ├── AppSidebar.tsx       # Sidebar navigation
│   │   │   ├── MobileNav.tsx        # Mobile bottom navigation
│   │   │   └── Topbar.tsx           # Top header bar
│   │   │
│   │   ├── ui/                     # Shadcn UI components
│   │   │   ├── accordion.tsx
│   │   │   ├── alert-dialog.tsx
│   │   │   ├── alert.tsx
│   │   │   ├── aspect-ratio.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── breadcrumb.tsx
│   │   │   ├── button.tsx
│   │   │   ├── calendar.tsx
│   │   │   ├── card.tsx
│   │   │   ├── carousel.tsx
│   │   │   ├── chart.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── collapsible.tsx
│   │   │   ├── context-menu.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── drawer.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── form.tsx
│   │   │   ├── hover-card.tsx
│   │   │   ├── input-otp.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── menubar.tsx
│   │   │   ├── navigation-menu.tsx
│   │   │   ├── pagination.tsx
│   │   │   ├── popover.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── radio-group.tsx
│   │   │   ├── resizable.tsx
│   │   │   ├── scroll-area.tsx
│   │   │   ├── select.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── slider.tsx
│   │   │   ├── sonner.tsx
│   │   │   ├── switch.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── toaster.tsx
│   │   │   ├── toggle-group.tsx
│   │   │   ├── toggle.tsx
│   │   │   ├── tooltip.tsx
│   │   │   └── use-toast.ts
│   │   │
│   │   └── NavLink.tsx             # Navigation link component
│   │
│   ├── config/                     # Configuration files
│   │   └── navigation.ts           # Navigation menu configuration
│   │
│   ├── data/                       # Mock/static data
│   │   └── mockData.ts             # Mock data for development
│   │
│   ├── hooks/                      # Custom React hooks
│   │   ├── use-mobile.tsx          # Mobile detection hook
│   │   └── use-toast.ts            # Toast notification hook
│   │
│   ├── lib/                        # Core libraries
│   │   ├── api.ts                  # Axios instance with interceptors
│   │   └── utils.ts                # Utility functions
│   │
│   ├── pages/                      # Page components
│   │   ├── AttendancePage.tsx      # Attendance management
│   │   ├── Dashboard.tsx            # Main dashboard
│   │   ├── DepartmentsPage.tsx      # Department management
│   │   ├── EmployeeProfile.tsx      # Employee detail view
│   │   ├── EmployeesPage.tsx        # Employee list & CRUD
│   │   ├── Index.tsx                # Index redirect
│   │   ├── LeavesPage.tsx           # Leave management
│   │   ├── LoginPage.tsx            # Login/Register
│   │   ├── NotFound.tsx             # 404 page
│   │   ├── PayrollPage.tsx           # Payroll management
│   │   ├── PerformancePage.tsx       # Performance management
│   │   ├── ReportsPage.tsx           # Reports & analytics
│   │   └── UsersPage.tsx             # User management
│   │
│   ├── services/                    # API service layer
│   │   ├── attendanceService.ts      # Attendance API
│   │   ├── authService.ts            # Authentication API
│   │   ├── dashboardService.ts      # Dashboard API
│   │   ├── departmentService.ts      # Department API
│   │   ├── designationService.ts     # Designation API
│   │   ├── employeeService.ts        # Employee API
│   │   ├── index.ts                  # Barrel export
│   │   ├── leaveService.ts            # Leave API
│   │   ├── payrollService.ts          # Payroll API
│   │   ├── performanceService.ts      # Performance API
│   │   └── userService.ts             # User API
│   │
│   ├── store/                       # Zustand state stores
│   │   ├── authStore.ts              # Authentication state
│   │   └── uiStore.ts                # UI preferences state
│   │
│   ├── test/                        # Test files
│   │   ├── components/
│   │   │   └── StatusBadge.test.tsx
│   │   ├── services/
│   │   │   ├── attendanceService.test.ts
│   │   │   ├── authService.test.ts
│   │   │   ├── dashboardService.test.ts
│   │   │   ├── departmentService.test.ts
│   │   │   ├── designationService.test.ts
│   │   │   ├── employeeService.test.ts
│   │   │   ├── leaveService.test.ts
│   │   │   ├── payrollService.test.ts
│   │   │   ├── performanceService.test.ts
│   │   │   └── userService.test.ts
│   │   ├── setup.ts
│   │   ├── stores/
│   │   │   ├── authStore.test.ts
│   │   │   └── uiStore.test.ts
│   │   └── example.test.ts
│   │
│   ├── types/                       # TypeScript types
│   │   ├── api.ts                   # API types
│   │   ├── backend.ts               # Backend DTO types
│   │   └── index.ts                  # Core types
│   │
│   └── utils/                       # Utility functions
│       └── auth.ts                   # Auth utilities
│
├── Docs/                            # Documentation (this file is also here)
│   ├── README.md
│   ├── COMPLETE_DOCUMENTATION.md    # This comprehensive file
│   ├── Core/
│   │   └── Core_Application_Module.md
│   ├── Authentication/
│   │   └── Authentication_Module.md
│   ├── Layout/
│   │   └── Layout_Module.md
│   ├── Dashboard/
│   │   └── Dashboard_Module.md
│   ├── Employee/
│   │   └── Employee_Module.md
│   ├── Attendance/
│   │   └── Attendance_Module.md
│   ├── Leave/
│   │   └── Leave_Module.md
│   ├── Payroll/
│   │   └── Payroll_Module.md
│   ├── Performance/
│   │   └── Performance_Module.md
│   ├── Reports/
│   │   └── Reports_Module.md
│   ├── Users/
│   │   └── Users_Module.md
│   ├── Organization/
│   │   └── Organization_Module.md
│   └── Foundation/
│       ├── Common_Components_Module.md
│       ├── Navigation_Module.md
│       ├── Services_Module.md
│       ├── Stores_Module.md
│       ├── Types_Module.md
│       └── UI_Components_Module.md
│
├── package.json                     # Dependencies and scripts
├── vite.config.ts                   # Vite configuration
├── tailwind.config.ts               # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript configuration
├── components.json                 # Shadcn UI configuration
├── eslint.config.js                # ESLint configuration
├── postcss.config.js               # PostCSS configuration
├── vitest.config.ts               # Vitest configuration
├── .env                            # Environment variables
├── .gitignore
├── README.md
├── plan.md
├── codebase_snapshot.txt
├── universal_codebase_snapshot.cjs
└── vercel.json                     # Vercel deployment config
```

---

## 🔄 Core Application Flow

### Application Initialization

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           main.tsx                                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  1. Import React's createRoot                                            │
│  2. Import App component                                                  │
│  3. Import global styles (index.css)                                     │
│  4. Mount React app to #root element                                      │
│                                                                          │
│  createRoot(document.getElementById("root")!).render(<App />)           │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                              App.tsx                                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                    Provider Hierarchy                               │ │
│  │                                                                    │ │
│  │  1. QueryClientProvider                                            │ │
│  │     └─> Enables React Query for data fetching                        │ │
│  │                                                                    │ │
│  │  2. TooltipProvider                                                │ │
│  │     └─> Enables Radix UI tooltips                                   │ │
│  │                                                                    │ │
│  │  3. ErrorBoundary                                                   │ │
│  │     └─> Catches JavaScript errors                                   │ │
│  │                                                                    │ │
│  │  4. Toaster + Sonner                                               │ │
│  │     └─> Toast notifications                                         │ │
│  │                                                                    │ │
│  │  5. DarkModeInit                                                   │ │
│  │     └─> Syncs dark mode with DOM                                    │ │
│  │                                                                    │ │
│  │  6. BrowserRouter                                                  │ │
│  │     └─> React Router for navigation                                 │ │
│  │                                                                    │ │
│  │  7. Routes                                                         │ │
│  │     └─> Route definitions with protection                           │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                       Routes Configuration                          │ │
│  │                                                                    │ │
│  │  /login          → LoginPage (Public)                              │ │
│  │                                                                    │ │
│  │  Protected Routes (wrapped in AuthGuard + AppLayout):              │ │
│  │    /             → Dashboard                                       │ │
│  │    /employees    → EmployeesPage                                  │ │
│  │    /employees/:id → EmployeeProfile                                │ │
│  │    /attendance   → AttendancePage                                  │ │
│  │    /leaves       → LeavesPage                                      │ │
│  │    /payroll      → PayrollPage (SuperAdmin, HRAdmin)              │ │
│  │    /performance  → PerformancePage                                 │ │
│  │    /departments  → DepartmentsPage (SuperAdmin, HRAdmin)          │ │
│  │    /reports      → ReportsPage (SuperAdmin, HRAdmin, Manager)    │ │
│  │    /users        → UsersPage (SuperAdmin only)                    │ │
│  │                                                                    │ │
│  │  *               → NotFound                                       │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Authentication System

### Files Involved
- `src/pages/LoginPage.tsx`
- `src/components/auth/AuthGuard.tsx`
- `src/services/authService.ts`
- `src/store/authStore.ts`
- `src/utils/auth.ts`

### Login Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           Login Flow                                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  User enters email/password                                              │
│         │                                                               │
│         ▼                                                               │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ handleAuthSubmit()                                                │  │
│  │                                                                    │  │
│  │  1. Set isLoading = true                                          │  │
│  │  2. Build request payload (login or register)                       │  │
│  │  3. POST to /Auth/login or /Auth/register                          │  │
│  │  4. Handle response:                                               │  │
│  │     - Success: Extract token, call loginWithToken()                 │  │
│  │     - Error: Parse error message, display to user                  │  │
│  │  5. Redirect to / on success                                       │  │
│  │                                                                    │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│         │                                                               │
│         ▼                                                               │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ authStore.loginWithToken(token, userData)                         │  │
│  │                                                                    │  │
│  │  1. Store token in localStorage ('ems-token')                    │  │
│  │  2. Create User object from response data                         │  │
│  │  3. Update Zustand state:                                         │  │
│  │     - user: User object                                           │  │
│  │     - token: JWT token                                            │  │
│  │     - isAuthenticated: true                                       │  │
│  │  4. Persist state to localStorage ('ems-auth')                    │  │
│  │                                                                    │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│         │                                                               │
│         ▼                                                               │
│  window.location.href = '/'  (Redirect to Dashboard)                   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### AuthGuard Component

**Purpose**: Protects routes based on authentication and role.

```typescript
// AuthGuard.tsx - Line 11-24
const AuthGuard: React.FC<AuthGuardProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  // 1. Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Check role-based access
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // 3. Render children if authorized
  return <>{children}</>;
};
```

### Role Definitions

| Role | Permissions | Access Level |
|------|-------------|--------------|
| `SuperAdmin` | All features | Full system access |
| `HRAdmin` | HR features | HR management |
| `Manager` | Team features | Team management |
| `Employee` | Basic features | Self-service |

---

## 🎨 Layout & Navigation

### Layout Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Application Layout                                │
├────────────┬────────────────────────────────────────────────────────────┤
│            │                         Topbar                             │
│            │  ┌─────────────────────────────────────────────────────┐  │
│            │  │ [☰] [Search...]          [🌙/☀️] [🔔] [👤 Name] │  │
│            │  └─────────────────────────────────────────────────────┘  │
│   Sidebar  ├────────────────────────────────────────────────────────────┤
│            │                                                             │
│  ┌──────┐ │                                                             │
│  │ Logo  │ │                     Main Content                            │
│  ├──────┤ │                     (Outlet)                                 │
│  │ Nav  │ │                                                             │
│  │Items │ │                                                             │
│  │      │ │                                                             │
│  ├──────┤ │                                                             │
│  │Logout│ │                                                             │
│  └──────┘ │                                                             │
├────────────┴────────────────────────────────────────────────────────────┤
│                      MobileNav (Bottom - Mobile Only)                    │
│  [🏠] [👥] [🕐] [📅] [📊]                                                │
└─────────────────────────────────────────────────────────────────────────┘
```

### Navigation Configuration

**File**: `src/config/navigation.ts`

```typescript
// Navigation is organized into groups
const navigationConfig: NavGroup[] = [
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

### Role Access Matrix

| Page | SuperAdmin | HRAdmin | Manager | Employee |
|------|:-----------:|:--------:|:--------:|:--------:|
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

## 📊 Feature Modules

### Dashboard

**File**: `src/pages/Dashboard.tsx`

**Purpose**: Main landing page displaying organization-wide statistics.

**Components Used**:
- `PageHeader` - Welcome message with user name
- `StatCard` (4x) - Key metrics (Total Employees, Present Today, On Leave, Total Payroll)
- `BarChart` - Department headcount visualization
- Custom display - Attendance rate
- Card component - Recent activities list

**Data Fetching**:
```typescript
useEffect(() => {
  const fetchData = async () => {
    const [statsData, activitiesData, deptData] = await Promise.all([
      dashboardService.getStats(),
      dashboardService.getRecentActivities(),
      dashboardService.getDepartmentHeadcount()
    ]);
    // Map and set state
  };
  fetchData();
}, []);
```

---

### Employees

**Files**: 
- `src/pages/EmployeesPage.tsx`
- `src/pages/EmployeeProfile.tsx`
- `src/services/employeeService.ts`

**Features**:
1. Employee list with pagination
2. Search by name, email, employee code
3. Filter by department and status
4. Create new employee (dialog form)
5. Edit existing employee
6. Delete employee
7. View employee profile

**CRUD Flow**:
```
┌────────────────────────────────────────────────────────────────────┐
│                        Employee CRUD Flow                            │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  CREATE                                                             │
│  1. Click "Add Employee" button                                     │
│  2. Open dialog with form                                           │
│  3. Fill required fields (firstName, lastName, email, etc.)       │
│  4. Submit → POST /employees                                        │
│  5. Show success toast                                              │
│  6. Refresh list                                                    │
│                                                                     │
│  READ                                                               │
│  1. GET /employees?page=1&pageSize=100                             │
│  2. Display in table with filters                                    │
│  3. Click employee → GET /employees/:id                            │
│  4. Show profile page with tabs                                     │
│                                                                     │
│  UPDATE                                                             │
│  1. Click edit icon on employee row                                  │
│  2. Open dialog pre-filled with employee data                        │
│  3. Modify fields                                                    │
│  4. Submit → PUT /employees/:id                                     │
│  5. Show success toast                                              │
│  6. Refresh list                                                    │
│                                                                     │
│  DELETE                                                             │
│  1. Click delete icon                                                │
│  2. Confirm deletion with browser confirm()                         │
│  3. DELETE /employees/:id                                           │
│  4. Show success toast                                              │
│  5. Refresh list                                                    │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

---

### Attendance

**Files**:
- `src/pages/AttendancePage.tsx`
- `src/services/attendanceService.ts`

**Features**:
1. Clock in/out with timer
2. Real-time elapsed time display
3. Today's attendance statistics
4. Attendance records table

**Clock In/Out Flow**:
```typescript
const handleClock = () => {
  if (clockedIn) {
    // Clock out
    setClockedIn(false);
    setElapsed(0);
    toast({ title: 'Clocked Out', description: `Total time: ${formatTime(elapsed)}` });
  } else {
    // Clock in
    setClockedIn(true);
    toast({ title: 'Clocked In', description: `You clocked in at ${new Date().toLocaleTimeString()}` });
  }
};
```

---

### Leaves

**Files**:
- `src/pages/LeavesPage.tsx`
- `src/services/leaveService.ts`

**Features**:
1. Leave balance cards
2. Apply leave dialog
3. Leave requests table
4. Approve/Reject actions (for managers)

**Leave Types**:
- Casual Leave
- Sick Leave
- Annual Leave
- Maternity Leave
- (And more as configured in backend)

---

### Payroll

**Files**:
- `src/pages/PayrollPage.tsx`
- `src/services/payrollService.ts`

**Features**:
1. Monthly payroll filtering
2. Salary statistics (Gross, Net, Deductions)
3. Payroll records table with breakdown
4. Run Payroll button (admin only)

**Salary Components**:
```
Gross Salary = Basic + HRA + DA + TA + Other Allowances
Total Deductions = PF + Tax + Other Deductions
Net Salary = Gross Salary - Total Deductions
```

---

### Performance

**Files**:
- `src/pages/PerformancePage.tsx`
- `src/services/performanceService.ts`

**Features**:
1. Goals with progress tracking
2. Progress bars for each goal
3. Performance reviews with ratings
4. Star rating display
5. Self-assessment comments

**Goal Structure**:
```typescript
interface Goal {
  id: number;
  title: string;
  description: string;
  progress: number;  // 0-100
  status: string;
  dueDate: string;
}
```

**Review Structure**:
```typescript
interface Review {
  employeeName: string;
  period: string;      // e.g., "Q1 2026"
  rating: number;       // 1-5
  comments: string;
  selfComments?: string;
  status: string;
  reviewerName: string;
}
```

---

### Reports

**File**: `src/pages/ReportsPage.tsx`

**Features**:
1. Tabbed interface (Attendance, Payroll, Headcount)
2. Bar charts for attendance
3. Line chart for payroll trends
4. Pie chart for department distribution
5. Horizontal bar chart for breakdown

**Charts Used**:
- `BarChart` - Attendance by day, department breakdown
- `LineChart` - Payroll trends over time
- `PieChart` - Department headcount distribution

---

### Users

**File**: `src/pages/UsersPage.tsx`

**Features**:
1. User list table
2. Role dropdown for each user
3. Active/Inactive toggle switch
4. User avatar with initials

**Access**: SuperAdmin only

---

### Organization

**Files**:
- `src/pages/DepartmentsPage.tsx`
- `src/services/departmentService.ts`
- `src/services/designationService.ts`

**Features**:
1. Tabbed interface (Departments, Designations, Deleted)
2. Department cards with employee count
3. Designation cards with department association
4. Create/Edit/Delete operations
5. Soft delete for designations
6. Restore deleted designations
7. Purge old deleted designations

**Soft Delete Flow**:
```
┌────────────────────────────────────────────────────────────────────┐
│                      Soft Delete Flow                                │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  DELETE                                                             │
│  1. Click delete icon                                                │
│  2. Confirm deletion                                                 │
│  3. DELETE /designations/:id                                        │
│  4. Item moves to "Deleted" tab                                      │
│                                                                     │
│  RESTORE                                                            │
│  1. Go to "Deleted" tab                                             │
│  2. Click restore icon                                                │
│  3. POST /designations/:id/restore                                  │
│  4. Item moves back to "Designations" tab                            │
│                                                                     │
│  PURGE                                                              │
│  1. Click "Purge Old" button                                        │
│  2. DELETE /designations/purge?months=12                            │
│  3. Permanently removes items deleted > 12 months ago               │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

---

## 🌐 API Services Layer

### API Client Configuration

**File**: `src/lib/api.ts`

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5185/api/v1';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 30000,
});

// Request interceptor - Add JWT token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('ems-token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor - Handle 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('ems-auth');
            localStorage.removeItem('ems-token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);
```

### All API Endpoints

| Module | Method | Endpoint | Service |
|--------|--------|----------|---------|
| **Auth** | POST | `/auth/login` | authService |
| | POST | `/auth/register` | authService |
| | POST | `/auth/logout` | authService |
| **Users** | GET | `/users` | userService |
| | GET | `/users/:id` | userService |
| | GET | `/users/me` | authService, userService |
| | PATCH | `/users/:id/deactivate` | userService |
| | PATCH | `/users/:id/role` | userService |
| **Employees** | GET | `/employees` | employeeService |
| | GET | `/employees/:id` | employeeService |
| | POST | `/employees` | employeeService |
| | PUT | `/employees/:id` | employeeService |
| | DELETE | `/employees/:id` | employeeService |
| **Departments** | GET | `/departments` | departmentService |
| | GET | `/departments/:id` | departmentService |
| | POST | `/departments` | departmentService |
| | PUT | `/departments/:id` | departmentService |
| | DELETE | `/departments/:id` | departmentService |
| **Designations** | GET | `/designations` | designationService |
| | GET | `/designations/deleted` | designationService |
| | GET | `/designations/:id` | designationService |
| | POST | `/designations` | designationService |
| | PUT | `/designations/:id` | designationService |
| | DELETE | `/designations/:id` | designationService |
| | POST | `/designations/:id/restore` | designationService |
| | DELETE | `/designations/purge?months=12` | designationService |
| **Attendance** | GET | `/attendance` | attendanceService |
| | POST | `/attendance/clock-in` | attendanceService |
| | POST | `/attendance/clock-out` | attendanceService |
| | POST | `/attendance/manual` | attendanceService |
| **Leave** | GET | `/leave` | leaveService |
| | GET | `/leave/types` | leaveService |
| | GET | `/leave/balance/:employeeId` | leaveService |
| | POST | `/leave` | leaveService |
| | PUT | `/leave/:id/action` | leaveService |
| **Payroll** | GET | `/payroll` | payrollService |
| | GET | `/payroll/:id` | payrollService |
| | POST | `/payroll/run` | payrollService |
| **Performance** | GET | `/performance/goals` | performanceService |
| | POST | `/performance/goals` | performanceService |
| | PUT | `/performance/goals/:id` | performanceService |
| | GET | `/performance/reviews` | performanceService |
| | POST | `/performance/reviews` | performanceService |
| **Dashboard** | GET | `/dashboard/stats` | dashboardService |
| | GET | `/dashboard/headcount` | dashboardService |
| | GET | `/dashboard/activities?count=10` | dashboardService |

---

## 🗄️ State Management

### Zustand Stores

**File**: `src/store/authStore.ts`

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

// Persisted to localStorage under key 'ems-auth'
export const useAuthStore = create<AuthState>()(
  persist((set) => ({ /* implementation */ }), { name: 'ems-auth' })
);
```

**File**: `src/store/uiStore.ts`

```typescript
interface UIState {
  sidebarCollapsed: boolean;
  darkMode: boolean;
  toggleSidebar: () => void;
  toggleDarkMode: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

// Not persisted - resets on refresh
export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  darkMode: true,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  toggleDarkMode: () => set((s) => {
    const next = !s.darkMode;
    document.documentElement.classList.toggle('dark', next);
    return { darkMode: next };
  }),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
}));
```

---

## 📝 Type Definitions

### Core Types

**File**: `src/types/index.ts`

```typescript
export type Role = 'SuperAdmin' | 'HRAdmin' | 'Manager' | 'Employee';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar?: string;
  departmentId?: string;
}

export interface Employee {
  id: number;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  joiningDate: string;
  status: string;
  departmentId: number;
  departmentName: string;
  designationId?: number;
  designationTitle?: string;
  reportingManagerId?: number;
  reportingManagerName?: string;
  // ... more fields
}
```

### Backend DTO Types

**File**: `src/types/backend.ts`

These types match the backend DTOs exactly:

```typescript
// Gender: Backend uses numbers (1=Male, 2=Female, 3=Other)
interface CreateEmployeeDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  gender: number;  // 1=Male, 2=Female, 3=Other
  dateOfBirth: string;
  joiningDate: string;
  departmentId: number;
  designationId?: number;
  reportingManagerId?: number;
}

// Status: Backend uses numbers (1=Active, 2=Inactive, 3=OnLeave)
interface UpdateEmployeeDto extends CreateEmployeeDto {
  status: number;  // 1=Active, 2=Inactive, 3=OnLeave
}
```

---

## 🎛️ UI Components

### Shadcn UI Components Used

**Layout**:
- `Card` - Content containers
- `Dialog` - Modal dialogs
- `Sheet` - Side panels
- `Separator` - Dividers
- `ScrollArea` - Custom scrollbar

**Form**:
- `Button` - Interactive buttons
- `Input` - Text inputs
- `Label` - Form labels
- `Textarea` - Multi-line text
- `Select` - Dropdown select
- `Checkbox` - Checkboxes
- `Switch` - Toggle switches
- `RadioGroup` - Radio buttons

**Data Display**:
- `Table` - Data tables
- `Badge` - Status badges
- `Avatar` - User avatars
- `Progress` - Progress bars
- `Skeleton` - Loading placeholders

**Navigation**:
- `Tabs` - Tabbed interfaces
- `Breadcrumb` - Breadcrumb navigation

**Feedback**:
- `Toast` - Notifications
- `Alert` - Alert messages
- `Tooltip` - Hover tooltips
- `Progress` - Progress indicators

---

## 🔧 Common Components

### PageHeader

**File**: `src/components/common/PageHeader.tsx`

```typescript
interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;  // Action buttons
}

// Usage
<PageHeader title="Employees" description="Manage employees">
  <Button>Add Employee</Button>
</PageHeader>
```

### StatCard

**File**: `src/components/common/StatCard.tsx`

```typescript
interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  gradient?: string;
}

// Usage
<StatCard 
  title="Total Employees" 
  value={150} 
  change="+4 this month"
  changeType="positive"
  icon={<Users />}
  gradient="gradient-primary"
/>
```

### StatusBadge

**File**: `src/components/common/StatusBadge.tsx`

```typescript
export type StatusType = 
  | 'Active' | 'Inactive' | 'OnLeave'
  | 'Present' | 'Absent' | 'Late' | 'HalfDay'
  | 'Pending' | 'Approved' | 'Rejected'
  | 'Draft' | 'Processed' | 'Paid'
  | 'NotStarted' | 'InProgress' | 'Completed';

// Usage
<StatusBadge status="Active" />  // Green badge
<StatusBadge status="Pending" /> // Yellow badge
<StatusBadge status="Rejected" /> // Red badge
```

---

## 🛣️ Routing & Access Control

### Route Definitions

**File**: `src/App.tsx`

```typescript
<Routes>
  {/* Public route */}
  <Route path="/login" element={<LoginPage />} />

  {/* Protected routes with AuthGuard */}
  <Route element={<AuthGuard><AppLayout /></AuthGuard>}>
    {/* Available to all authenticated users */}
    <Route path="/" element={<Dashboard />} />
    <Route path="/employees" element={<EmployeesPage />} />
    <Route path="/employees/:id" element={<EmployeeProfile />} />
    <Route path="/attendance" element={<AttendancePage />} />
    <Route path="/leaves" element={<LeavesPage />} />
    <Route path="/performance" element={<PerformancePage />} />

    {/* Role-restricted routes */}
    <Route path="/payroll" element={
      <AuthGuard allowedRoles={['SuperAdmin', 'HRAdmin']}>
        <PayrollPage />
      </AuthGuard>
    } />
    <Route path="/departments" element={
      <AuthGuard allowedRoles={['SuperAdmin', 'HRAdmin']}>
        <DepartmentsPage />
      </AuthGuard>
    } />
    <Route path="/reports" element={
      <AuthGuard allowedRoles={['SuperAdmin', 'HRAdmin', 'Manager']}>
        <ReportsPage />
      </AuthGuard>
    } />
    <Route path="/users" element={
      <AuthGuard allowedRoles={['SuperAdmin']}>
        <UsersPage />
      </AuthGuard>
    } />
  </Route>

  {/* 404 */}
  <Route path="*" element={<NotFound />} />
</Routes>
```

---

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev

# Server runs at http://localhost:5173
```

### Build

```bash
# Production build
npm run build

# Development build
npm run build:dev
```

### Testing

```bash
# Run tests once
npm run test

# Watch mode
npm run test:watch
```

### Environment Variables

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:5185/api/v1
```

### Key Scripts

| Script | Command | Description |
|--------|---------|-------------|
| dev | `npm run dev` | Start development server |
| build | `npm run build` | Production build |
| lint | `npm run lint` | Run ESLint |
| preview | `npm run preview` | Preview production build |
| test | `npm run test` | Run tests |

---

## 📚 Additional Documentation

For more detailed documentation on each module, see the individual files in the `Docs/` folder:

- `Docs/Core/Core_Application_Module.md` - App entry, routing, providers
- `Docs/Authentication/Authentication_Module.md` - Login, AuthGuard, auth store
- `Docs/Layout/Layout_Module.md` - Layout, sidebar, topbar, mobile nav
- `Docs/Dashboard/Dashboard_Module.md` - Dashboard page
- `Docs/Employee/Employee_Module.md` - Employee CRUD operations
- `Docs/Attendance/Attendance_Module.md` - Attendance tracking
- `Docs/Leave/Leave_Module.md` - Leave management
- `Docs/Payroll/Payroll_Module.md` - Payroll processing
- `Docs/Performance/Performance_Module.md` - Performance reviews and goals
- `Docs/Reports/Reports_Module.md` - Reports and analytics
- `Docs/Users/Users_Module.md` - User management
- `Docs/Organization/Organization_Module.md` - Departments and designations
- `Docs/Foundation/Services_Module.md` - API services
- `Docs/Foundation/Types_Module.md` - TypeScript types
- `Docs/Foundation/Stores_Module.md` - Zustand stores
- `Docs/Foundation/Navigation_Module.md` - Navigation config
- `Docs/Foundation/Common_Components_Module.md` - Common components
- `Docs/Foundation/UI_Components_Module.md` - UI components reference

---

**Last Updated**: 2026-03-31
