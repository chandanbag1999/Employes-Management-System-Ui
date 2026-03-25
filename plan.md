

# Enterprise Employee Management System (EMS)

## Design System
- **Dark Corporate** style: dark sidebar (#1a1a2e), clean white content areas, indigo/violet accent (#6366f1)
- Glassmorphism cards with soft shadows, smooth Framer Motion animations
- Dark mode + Light mode toggle
- Mobile-first responsive with bottom navigation on mobile
- Skeleton loading states, toast notifications throughout

## Architecture
- **State**: Zustand for auth/role/UI state, TanStack Query for server data
- **API Layer**: Axios service with interceptors, mock data handlers for all endpoints
- **Forms**: React Hook Form + Zod validation
- **Routing**: Role-based route protection via auth guard component
- **Structure**: Feature-based folders (`/features/employees`, `/features/attendance`, etc.)

## Layout System
- **Sidebar** (config-driven): dark themed, collapsible, role-filtered menu items with icons
- **Topbar**: search, notifications bell, user avatar dropdown, dark mode toggle
- **Mobile**: bottom tab navigation for key sections

## Auth & Roles
- Login page with JWT mock flow
- 4 roles: SuperAdmin, HRAdmin, Manager, Employee
- Role-based sidebar menus (each role sees different items)
- Route guard component that redirects unauthorized users
- Permission-based UI rendering (buttons/actions hidden per role)

## Modules (All Scaffolded)

### 1. Dashboard
- Stat cards (employees, attendance %, leaves, payroll total)
- Line chart (attendance trends) + Bar chart (department headcount)
- Recent activities feed
- Quick actions based on role

### 2. Employees
- Data table with search, filters (department, status, designation), pagination
- Add/Edit employee modal/drawer with full form
- Employee profile page with tabs (info, attendance, leaves, payroll, performance)
- Department & designation mapping

### 3. Attendance
- Clock In/Clock Out button with live timer
- Today's attendance status card
- Monthly calendar view (color-coded days)
- Attendance table with date range filters
- Monthly summary stats

### 4. Leave Management
- Apply leave form (type, dates, reason)
- Leave history table with status badges
- Admin/Manager: Approve/Reject actions with comments
- Leave balance cards by type

### 5. Payroll
- Salary structure view (basic, allowances, deductions)
- Payroll run interface (Admin: select month, process)
- Payslip view/download
- Payroll history table

### 6. Performance
- Goals list with progress bars
- Add/edit goals
- Review cycles with ratings
- Self-assessment comments section

### 7. Departments & Designations
- CRUD tables for both
- Filter employees by department
- Department stats cards

### 8. Reports & Analytics
- Attendance reports with date filters and charts
- Payroll reports with export simulation
- Headcount analytics by department/designation

### 9. User Management (Admin only)
- Users table
- Activate/deactivate toggle
- Role assignment

## Reusable Components
- `DataTable` — sortable, filterable, paginated table
- `StatCard` — glassmorphism stat cards with icons
- `FormModal` — modal/drawer with React Hook Form
- `StatusBadge` — colored badges for statuses
- `PageHeader` — consistent page titles with breadcrumbs
- `ErrorBoundary` — graceful error handling
- `SkeletonLoader` — per-component loading states

## Pages Created
- `/login` — Auth page
- `/` — Dashboard
- `/employees`, `/employees/:id` — List + Profile
- `/attendance` — Attendance module
- `/leaves` — Leave management
- `/payroll` — Payroll module
- `/performance` — Performance & reviews
- `/departments` — Departments & designations
- `/reports` — Reports & analytics
- `/users` — User management (admin only)

