# EmployeeManagementUI_V2 - Frontend Documentation

## Overview

This is a comprehensive React + TypeScript frontend application for the Employee Management System. The application provides a modern, responsive web interface for HR administrators, managers, and employees to manage various aspects of employee lifecycle.

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3.1 | UI Library |
| TypeScript | 5.8.3 | Type Safety |
| Vite | 5.4.19 | Build Tool |
| React Router | 6.30.1 | Routing |
| Zustand | 5.0.12 | State Management |
| React Query | 5.83.0 | Data Fetching |
| Tailwind CSS | 3.4.17 | Styling |
| Radix UI | Various | UI Components |
| Recharts | 2.15.4 | Charts |
| Framer Motion | 12.38.0 | Animations |

## Project Structure

```
EmployeeManagementUI_V2/
├── public/                 # Static assets
├── src/
│   ├── App.tsx            # Root application component
│   ├── main.tsx           # Application entry point
│   ├── index.css          # Global styles
│   ├── components/        # React components
│   │   ├── auth/          # Authentication components
│   │   ├── common/        # Shared/common components
│   │   ├── layout/        # Layout components
│   │   └── ui/            # Shadcn UI components
│   ├── config/            # Configuration files
│   ├── data/              # Mock data
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Core libraries
│   ├── pages/             # Page components
│   ├── services/          # API services
│   ├── store/             # Zustand stores
│   ├── test/              # Test files
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── Docs/                  # Documentation (this folder)
├── package.json
├── vite.config.ts
└── tailwind.config.ts
```

## Module Documentation

This documentation is organized into the following modules:

### Core Modules
1. **[Core Application Module](./Core/Core_Application_Module.md)** - App entry, routing, and core setup
2. **[Authentication Module](./Authentication/Authentication_Module.md)** - Login, registration, auth guards
3. **[Layout Module](./Layout/Layout_Module.md)** - App layout, sidebar, topbar

### Feature Modules
4. **[Dashboard Module](./Dashboard/Dashboard_Module.md)** - Main dashboard page
5. **[Employee Module](./Employee/Employee_Module.md)** - Employee management
6. **[Department Module](./Organization/Department_Module.md)** - Department and designation management
7. **[Attendance Module](./Attendance/Attendance_Module.md)** - Attendance tracking
8. **[Leave Module](./Leave/Leave_Module.md)** - Leave management
9. **[Payroll Module](./Payroll/Payroll_Module.md)** - Payroll processing
10. **[Performance Module](./Performance/Performance_Module.md)** - Performance reviews and goals
11. **[Reports Module](./Reports/Reports_Module.md)** - Analytics and reports
12. **[Users Module](./Users/Users_Module.md)** - User management

### Foundation Modules
13. **[Services Module](./Foundation/Services_Module.md)** - API services layer
14. **[Types Module](./Foundation/Types_Module.md)** - TypeScript type definitions
15. **[Stores Module](./Foundation/Stores_Module.md)** - State management
16. **[UI Components Module](./Foundation/UI_Components_Module.md)** - Shadcn UI components
17. **[Navigation Module](./Foundation/Navigation_Module.md)** - Navigation configuration
18. **[Common Components Module](./Foundation/Common_Components_Module.md)** - Shared components

## Features

### Role-Based Access Control
The application supports four user roles with different permissions:
- **SuperAdmin**: Full system access
- **HRAdmin**: HR management features
- **Manager**: Team management features
- **Employee**: Basic self-service features

### Pages & Routes

| Route | Page | Allowed Roles |
|-------|------|---------------|
| `/` | Dashboard | All |
| `/login` | Login | Public |
| `/employees` | Employees List | SuperAdmin, HRAdmin, Manager |
| `/employees/:id` | Employee Profile | All |
| `/attendance` | Attendance | All |
| `/leaves` | Leave Management | All |
| `/payroll` | Payroll | SuperAdmin, HRAdmin |
| `/performance` | Performance | All |
| `/departments` | Departments | SuperAdmin, HRAdmin |
| `/reports` | Reports | SuperAdmin, HRAdmin, Manager |
| `/users` | User Management | SuperAdmin |

## API Integration

The frontend communicates with the backend via REST API. All API calls are made through:
- **Base URL**: `http://localhost:5185/api/v1` (configurable via `VITE_API_BASE_URL`)
- **Authentication**: JWT Bearer token in Authorization header
- **Error Handling**: Automatic 401 redirect to login

## State Management

- **Zustand** for global state (auth, UI preferences)
- **React Query** for server state (data fetching, caching)
- **Component local state** for UI-specific state

## Styling

- Tailwind CSS for utility-first styling
- Shadcn UI components for consistent UI elements
- Dark mode support
- Responsive design (mobile, tablet, desktop)

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:5185/api/v1` |

---

*Last Updated: 2026-03-31*
