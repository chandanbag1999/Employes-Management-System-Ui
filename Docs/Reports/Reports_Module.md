# Reports Module

## Overview

The Reports Module provides analytics and reporting capabilities including attendance reports, payroll trends, and department headcount analysis. Access is restricted to SuperAdmin, HRAdmin, and Manager roles.

## Files

| File | Purpose |
|------|---------|
| [`src/pages/ReportsPage.tsx`](../../src/pages/ReportsPage.tsx:1) | Main reports and analytics page |

---

## ReportsPage Component

### [`ReportsPage.tsx`](../../src/pages/ReportsPage.tsx:1)

**Purpose**: Main reporting page with tabbed analytics views.

### Page Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Reports & Analytics                               [Export]             │
│  Insights across your organization.                                    │
├─────────────────────────────────────────────────────────────────────────┤
│  [Attendance] [Payroll] [Headcount]                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  Weekly Attendance Overview                                       │ │
│  │  ┌─────────────────────────────────────────────────────────────┐ │ │
│  │  │          Bar Chart                                           │ │ │
│  │  │   Mon  Tue  Wed  Thu  Fri                                   │ │ │
│  │  │   ███  ███  ███  ███  ███  Present                         │ │ │
│  │  │   ██   ██   ██   ██   ██   Late                            │ │ │
│  │  │   █    █    █    █    █    Absent                          │ │ │
│  │  └─────────────────────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  Payroll Trend (Line Chart)                                        │ │
│  │  ┌─────────────────────────────────────────────────────────────┐ │ │
│  │  │     ╱╲    ╱╲                                                   │ │ │
│  │  │   ╱    ╲╱    ╲                                                │ │ │
│  │  │  ╱              ╲                                              │ │ │
│  │  │ Oct  Nov  Dec  Jan                                             │ │ │
│  │  └─────────────────────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌─────────────────────────────┐ ┌─────────────────────────────────┐ │
│  │  By Department (Pie Chart)  │ │  Department Breakdown (Bar)     │ │
│  │       Engineering 45%       │ │  ████████████████████ 45       │ │
│  │       HR 20%                │ │  ██████████ 20                  │ │
│  │       Marketing 15%          │ │  ████████ 15                    │ │
│  │       Sales 20%             │ │  ██████████ 20                  │ │
│  └─────────────────────────────┘ └─────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

### Features

1. **Tabbed Interface**: Three report tabs (Attendance, Payroll, Headcount)
2. **Attendance Report**: Weekly attendance overview bar chart
3. **Payroll Report**: Payroll trend line chart
4. **Headcount Report**: Department distribution pie chart and breakdown
5. **Export Button**: Export report data

### Tabs

| Tab | Content |
|-----|---------|
| Attendance | Weekly attendance bar chart |
| Payroll | Payroll trend line chart |
| Headcount | Department pie chart and breakdown |

### State Management

```typescript
const [departmentHeadcount, setDepartmentHeadcount] = useState<any[]>([]);
const [loading, setLoading] = useState(true);
```

### Chart Colors

```typescript
const COLORS = [
  'hsl(239,84%,67%)',  // Purple
  'hsl(142,71%,45%)',  // Green
  'hsl(38,92%,50%)',   // Yellow
  'hsl(199,89%,48%)',  // Blue
  'hsl(270,76%,60%)',  // Violet
  'hsl(0,72%,51%)'     // Red
];
```

### Data Fetching

```typescript
useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const deptData = await dashboardService.getDepartmentHeadcount();
      
      const mappedDept = (deptData || []).map((item: any) => ({
        name: item.departmentName || item.name || '',
        count: item.employeeCount || item.count || 0,
      }));
      setDepartmentHeadcount(mappedDept);
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);
```

### Attendance Tab

```typescript
<TabsContent value="attendance" className="mt-4">
  <Card className="glass-card border-border/50">
    <CardHeader><CardTitle className="text-base">Weekly Attendance Overview</CardTitle></CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={mockAttendanceTrend}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <Tooltip contentStyle={{ ... }} />
          <Bar dataKey="present" fill="hsl(142,71%,45%)" radius={[4,4,0,0]} />
          <Bar dataKey="late" fill="hsl(38,92%,50%)" radius={[4,4,0,0]} />
          <Bar dataKey="absent" fill="hsl(0,72%,51%)" radius={[4,4,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
</TabsContent>
```

### Payroll Tab

```typescript
<TabsContent value="payroll" className="mt-4">
  <Card className="glass-card border-border/50">
    <CardHeader><CardTitle className="text-base">Payroll Trend</CardTitle></CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={payrollTrend}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} 
                tickFormatter={v => `$${v/1000}K`} />
          <Tooltip contentStyle={{ ... }} />
          <Line type="monotone" dataKey="amount" stroke="hsl(239,84%,67%)" 
                strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
</TabsContent>
```

### Headcount Tab

```typescript
<TabsContent value="headcount" className="mt-4">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
    {/* Pie Chart */}
    <Card>
      <CardHeader><CardTitle className="text-base">By Department</CardTitle></CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={departmentHeadcount} cx="50%" cy="50%" 
                 innerRadius={60} outerRadius={100} 
                 dataKey="count" nameKey="name" 
                 label={({ name, value }) => `${name}: ${value}`}>
              {departmentHeadcount.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>

    {/* Horizontal Bar Chart */}
    <Card>
      <CardHeader><CardTitle className="text-base">Department Breakdown</CardTitle></CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={departmentHeadcount} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" 
                   fontSize={11} width={80} />
            <Tooltip contentStyle={{ ... }} />
            <Bar dataKey="count" fill="hsl(239,84%,67%)" radius={[0,4,4,0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  </div>
</TabsContent>
```

### Mock Data

```typescript
const payrollTrend = [
  { month: 'Oct', amount: 820000 },
  { month: 'Nov', amount: 845000 },
  { month: 'Dec', amount: 860000 },
  { month: 'Jan', amount: 892000 },
];

const mockAttendanceTrend = [
  { day: 'Mon', present: 95, late: 8, absent: 5 },
  { day: 'Tue', present: 102, late: 5, absent: 3 },
  { day: 'Wed', present: 98, late: 6, absent: 7 },
  { day: 'Thu', present: 100, late: 4, absent: 4 },
  { day: 'Fri', present: 88, late: 10, absent: 12 },
];
```

---

## Chart Types

| Chart | Type | Library | Purpose |
|-------|------|---------|---------|
| Attendance | Bar Chart | Recharts | Compare daily attendance |
| Payroll | Line Chart | Recharts | Show trends over time |
| Department | Pie Chart | Recharts | Show distribution |
| Department | Horizontal Bar | Recharts | Show breakdown |

---

## Related Documentation

- [Core Application Module](../Core/Core_Application_Module.md)
- [Layout Module](../Layout/Layout_Module.md)
- [Dashboard Module](../Dashboard/Dashboard_Module.md)
- [Common Components Module](../Foundation/Common_Components_Module.md)
- [Dashboard Service](../Foundation/Services_Module.md)

---

*Last Updated: 2026-03-31*
