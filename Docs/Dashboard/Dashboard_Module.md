# Dashboard Module

## Overview

The Dashboard Module provides an overview of the organization's key metrics and recent activities. It serves as the landing page after login and displays real-time statistics from various modules.

## Files

| File | Purpose |
|------|---------|
| [`src/pages/Dashboard.tsx`](../../src/pages/Dashboard.tsx:1) | Main dashboard page component |

---

## Dashboard Page

### [`Dashboard.tsx`](../../src/pages/Dashboard.tsx:1)

**Purpose**: Main dashboard displaying organization-wide statistics, department headcount chart, and recent activities.

### Page Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     Welcome back, John                                   │
│              Here's what's happening with your organization today.      │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │
│  │ Total        │ │ Present      │ │ On Leave     │ │ Total        │   │
│  │ Employees    │ │ Today        │ │              │ │ Payroll      │   │
│  │ 150          │ │ 142 (94.7%)  │ │ 8 pending    │ │ $892K        │   │
│  │ +4 this month │ │ rate         │ │              │ │ +2.5%        │   │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘   │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────┐ ┌─────────────────────────────────┐ │
│  │  Department Headcount        │ │     Attendance Overview          │ │
│  │                             │ │                                 │ │
│  │  ┌─────────────────────┐   │ │        ┌───────────────┐          │ │
│  │  │ ████ Engineering    │   │ │        │   94.7%       │          │ │
│  │  │ ███ HR              │   │ │        │   Attendance  │          │ │
│  │  │ ██ Marketing        │   │ │        │   Rate        │          │ │
│  │  │ ██ Sales            │   │ │        └───────────────┘          │ │
│  │  └─────────────────────┘   │ │                                 │ │
│  └─────────────────────────────┘ └─────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │  Recent Activity                                                     ││
│  │  ┌────────────────────────────────────────────────────────────────┐ ││
│  │  │ • John Doe applied for leave - 2 hours ago                     │ ││
│  │  │ • Jane Smith clocked in - 3 hours ago                          │ ││
│  │  │ • New employee onboarding scheduled - 5 hours ago              │ ││
│  │  └────────────────────────────────────────────────────────────────┘ ││
│  └─────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────┘
```

### Components Used

| Component | Purpose |
|-----------|---------|
| [`PageHeader`](../../src/components/common/PageHeader.tsx:1) | Page title with greeting |
| [`StatCard`](../../src/components/common/StatCard.tsx:1) | Key metric cards (4x) |
| [`Card`](../../src/components/ui/card.tsx:1) | Chart containers |
| [`BarChart`](../../src/components/ui/chart.tsx:1) | Department headcount |
| [`StatusBadge`](../../src/components/common/StatusBadge.tsx:1) | Activity type badges |

### Data Fetching

```typescript
useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsData, activitiesData, deptData] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getRecentActivities(),
        dashboardService.getDepartmentHeadcount()
      ]);
      
      // Map backend stats to frontend format
      setStats({
        totalEmployees: statsData.totalEmployeesCount || 0,
        presentToday: statsData.presentCount || 0,
        onLeave: statsData.onLeaveCount || 0,
        pendingLeaves: statsData.pendingLeaveRequests || 0,
        totalPayroll: statsData.totalPayroll || 0,
        attendanceRate: statsData.attendanceRate || 0,
      });
      
      setActivities(activitiesData || []);
      setDepartmentHeadcount(mappedDept);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);
```

### State Management

```typescript
const [stats, setStats] = useState<DashboardStats | null>(null);
const [activities, setActivities] = useState<Activity[]>([]);
const [departmentHeadcount, setDepartmentHeadcount] = useState<any[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

### Dashboard Statistics

```typescript
interface DashboardStats {
  totalEmployees: number;
  presentToday: number;
  onLeave: number;
  pendingLeaves: number;
  totalPayroll: number;
  attendanceRate: number;
}
```

### Stat Cards

| Card | Value Source | Icon | Gradient |
|------|--------------|------|----------|
| Total Employees | `stats.totalEmployees` | Users | Default |
| Present Today | `stats.presentToday` | Clock | gradient-success |
| On Leave | `stats.onLeave` | CalendarDays | gradient-warning |
| Total Payroll | `$${(stats.totalPayroll / 1000).toFixed(0)}K` | Wallet | gradient-info |

### Charts

#### Department Headcount Bar Chart

```typescript
<ResponsiveContainer width="100%" height={240}>
  <BarChart data={departmentHeadcount}>
    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
    <Tooltip contentStyle={{ ... }} />
    <Bar dataKey="count" fill="hsl(239, 84%, 67%)" radius={[6, 6, 0, 0]} />
  </BarChart>
</ResponsiveContainer>
```

#### Attendance Rate Display

```typescript
<div className="flex items-center justify-center h-full">
  <div className="text-center">
    <div className="text-4xl font-bold text-primary">
      {stats?.attendanceRate?.toFixed(1) || 0}%
    </div>
    <div className="text-sm text-muted-foreground mt-1">
      Attendance Rate
    </div>
  </div>
</div>
```

### Recent Activities

```typescript
{activities.map((activity, index) => (
  <div key={activity.id || `activity-${index}`} className="flex items-start gap-3">
    <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
    <div className="flex-1 min-w-0">
      <p className="text-sm text-foreground">{activity.message}</p>
      <p className="text-xs text-muted-foreground mt-0.5">
        {new Date(activity.timestamp).toLocaleString()}
      </p>
    </div>
    <StatusBadge status={activity.type === 'leave' ? 'Pending' : ...} />
  </div>
))}
```

### Activity Types

```typescript
interface Activity {
  id: number;
  type: string;        // 'leave', 'attendance', 'employee', etc.
  message: string;     // Human-readable activity description
  timestamp: string;   // ISO date string
  userId: number;      // User who performed the action
}
```

### Animations

Uses Framer Motion for entrance animations:

```typescript
<motion.div
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.1 }}
>
  {/* Content */}
</motion.div>
```

### Loading & Error States

```typescript
if (loading) return <div className="flex items-center justify-center h-64">Loading...</div>;
if (error) return <div className="text-red-500">Error: {error}</div>;
```

### Responsive Design

| Breakpoint | Grid Columns |
|------------|--------------|
| Mobile (<640px) | 1 column |
| Tablet (640px+) | 2 columns |
| Desktop (1024px+) | 4 columns for stats, 2 columns for charts |

### API Integration

| Service Method | Endpoint | Purpose |
|----------------|----------|---------|
| `dashboardService.getStats()` | `GET /dashboard/stats` | Organization statistics |
| `dashboardService.getRecentActivities()` | `GET /dashboard/activities?count=10` | Recent activities |
| `dashboardService.getDepartmentHeadcount()` | `GET /dashboard/headcount` | Department employee counts |

---

## User Greeting

The dashboard personalizes the greeting based on the logged-in user's name:

```typescript
const { user } = useAuthStore();
// ...
<PageHeader title={`Welcome back, ${user?.name?.split(' ')[0]}`} ... />
```

---

## Related Documentation

- [Core Application Module](../Core/Core_Application_Module.md)
- [Layout Module](../Layout/Layout_Module.md)
- [Common Components Module](../Foundation/Common_Components_Module.md)
- [Dashboard Service](../Foundation/Services_Module.md)

---

*Last Updated: 2026-03-31*
