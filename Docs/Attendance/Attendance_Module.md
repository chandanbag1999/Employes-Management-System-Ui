# Attendance Module

## Overview

The Attendance Module handles employee attendance tracking including clock-in/clock-out functionality, attendance records display, and real-time statistics.

## Files

| File | Purpose |
|------|---------|
| [`src/pages/AttendancePage.tsx`](../../src/pages/AttendancePage.tsx:1) | Main attendance management page |
| [`src/services/attendanceService.ts`](../../src/services/attendanceService.ts:1) | Attendance API service |

---

## AttendancePage Component

### [`AttendancePage.tsx`](../../src/pages/AttendancePage.tsx:1)

**Purpose**: Main attendance tracking page with clock in/out, statistics, and attendance records table.

### Page Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Attendance                                                              │
│  Track daily attendance and clock in/out.                                │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  Today, Tuesday, March 31, 2026           00:45:32               │ │
│  │  Timer is running...                       [Clock Out]           │ │
│  └───────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐                  │
│  │ Present  │ │ Absent   │ │ Late     │ │ Avg Hours│                  │
│  │ 142      │ │ 5        │ │ 8        │ │ 8.5h     │                  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘                  │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  Today's Attendance                              [Refresh]         │ │
│  │  ───────────────────────────────────────────────────────────────  │ │
│  │  Employee    │ Clock In │ Clock Out │ Hours   │ Status            │ │
│  │  ────────────┼──────────┼───────────┼─────────┼────────────────── │ │
│  │  John Doe    │ 09:00    │ 17:30     │ 8.5h    │ [Present]        │ │
│  │  Jane Smith  │ 09:15    │ 17:00     │ 7.75h   │ [Late]          │ │
│  │  Bob Wilson  │ -        │ -         │ -       │ [Absent]         │ │
│  └───────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

### Features

1. **Clock In/Out**: One-click clock in/out with timer display
2. **Live Timer**: Shows elapsed time since clock in
3. **Statistics Cards**: Real-time attendance statistics
4. **Attendance Table**: Today's attendance records
5. **Status Badges**: Visual status indicators

### State Management

```typescript
const [clockedIn, setClockedIn] = useState(false);
const [elapsed, setElapsed] = useState(0);
const [attendance, setAttendance] = useState<AttendanceResponseDto[]>([]);
const [loading, setLoading] = useState(true);
```

### Timer Effect

```typescript
useEffect(() => {
  let interval: NodeJS.Timeout;
  if (clockedIn) {
    interval = setInterval(() => setElapsed(e => e + 1), 1000);
  }
  return () => clearInterval(interval);
}, [clockedIn]);
```

### Time Formatting

```typescript
const formatTime = (s: number) => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
};
```

### Clock In/Out Handler

```typescript
const handleClock = () => {
  if (clockedIn) {
    setClockedIn(false);
    setElapsed(0);
    toast({ 
      title: 'Clocked Out', 
      description: `Total time: ${formatTime(elapsed)}` 
    });
  } else {
    setClockedIn(true);
    toast({ 
      title: 'Clocked In', 
      description: `You clocked in at ${new Date().toLocaleTimeString()}` 
    });
  }
};
```

### Statistics Calculation

```typescript
const present = attendance.filter(a => a.status === 'Present').length;
const absent = attendance.filter(a => a.status === 'Absent').length;
const late = attendance.filter(a => a.status === 'Late').length;
const avgHours = attendance.length > 0 
  ? (attendance.reduce((sum, a) => sum + (a.totalHours || 0), 0) / attendance.length).toFixed(1)
  : '0';
```

### Data Fetching

```typescript
useEffect(() => {
  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const data = await attendanceService.getAll({ page: 1, pageSize: 50 });
      setAttendance(data.data || []);
    } catch (err) {
      console.error('Error fetching attendance:', err);
    } finally {
      setLoading(false);
    }
  };
  fetchAttendance();
}, []);
```

### Clock Button Styling

```typescript
<Button
  onClick={handleClock}
  className={`h-14 px-8 text-lg font-semibold border-0 text-white ${
    clockedIn ? 'gradient-warning' : 'gradient-primary'
  }`}
>
  <Timer className="w-5 h-5 mr-2" />
  {clockedIn ? 'Clock Out' : 'Clock In'}
</Button>
```

### Attendance Table

```typescript
<Table>
  <TableHeader>
    <TableRow className="bg-muted/30">
      <TableHead>Employee</TableHead>
      <TableHead>Clock In</TableHead>
      <TableHead className="hidden md:table-cell">Clock Out</TableHead>
      <TableHead className="hidden md:table-cell">Hours</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {attendance.map(rec => (
      <TableRow key={rec.id}>
        <TableCell className="font-medium text-sm">{rec.employeeName}</TableCell>
        <TableCell className="text-sm text-muted-foreground">{rec.clockIn || '—'}</TableCell>
        <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
          {rec.clockOut || '—'}
        </TableCell>
        <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
          {rec.totalHours ? `${rec.totalHours}h` : '—'}
        </TableCell>
        <TableCell><StatusBadge status={rec.status as any} /></TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

---

## Attendance Service

### [`attendanceService.ts`](../../src/services/attendanceService.ts:1)

**Purpose**: API methods for attendance operations.

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/attendance` | Get all attendance records |
| POST | `/attendance/clock-in` | Clock in an employee |
| POST | `/attendance/clock-out` | Clock out an employee |
| POST | `/attendance/manual` | Add manual attendance record |

### Service Methods

```typescript
export const attendanceService = {
  // GET /api/v1/attendance
  getAll: async (filter: AttendanceFilter = {}): Promise<any> => {
    const params = new URLSearchParams();
    if (filter.employeeId) params.append('employeeId', filter.employeeId.toString());
    if (filter.date) params.append('date', filter.date);
    if (filter.status) params.append('status', filter.status);
    if (filter.page) params.append('page', filter.page.toString());
    if (filter.pageSize) params.append('pageSize', filter.pageSize.toString());

    const response = await api.get<ApiResponse<any>>(`/attendance?${params}`);
    return response.data.data;
  },

  // POST /api/v1/attendance/clock-in
  clockIn: async (employeeId: number): Promise<AttendanceResponseDto> => {
    const response = await api.post<ApiResponse<AttendanceResponseDto>>(
      '/attendance/clock-in', 
      { employeeId }
    );
    return response.data.data;
  },

  // POST /api/v1/attendance/clock-out
  clockOut: async (recordId: number): Promise<AttendanceResponseDto> => {
    const response = await api.post<ApiResponse<AttendanceResponseDto>>(
      '/attendance/clock-out', 
      { recordId }
    );
    return response.data.data;
  },

  // POST /api/v1/attendance/manual
  addManual: async (data: {
    employeeId: number;
    date: string;
    clockIn?: string;
    clockOut?: string;
  }): Promise<AttendanceResponseDto> => {
    const response = await api.post<ApiResponse<AttendanceResponseDto>>(
      '/attendance/manual', 
      data
    );
    return response.data.data;
  },
};
```

### Filter Types

```typescript
interface AttendanceFilter {
  employeeId?: number;
  date?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}
```

### Response Types

```typescript
interface AttendanceResponseDto {
  id: number;
  employeeId: number;
  employeeName: string;
  date: string;
  clockIn?: string;
  clockOut?: string;
  status: string;
  totalHours?: number;
}
```

---

## Attendance Status Types

| Status | Description | Badge Color |
|--------|-------------|-------------|
| Present | Employee was present | Green |
| Absent | Employee was absent | Red |
| Late | Employee arrived late | Yellow/Warning |
| HalfDay | Employee worked half day | Blue/Info |

---

## Related Documentation

- [Core Application Module](../Core/Core_Application_Module.md)
- [Layout Module](../Layout/Layout_Module.md)
- [Common Components Module](../Foundation/Common_Components_Module.md)
- [Services Module](../Foundation/Services_Module.md)
- [Types Module](../Foundation/Types_Module.md)

---

*Last Updated: 2026-03-31*
