# Leave Module

## Overview

The Leave Module handles employee leave management including leave applications, approvals, leave type configuration, and leave balance tracking.

## Files

| File | Purpose |
|------|---------|
| [`src/pages/LeavesPage.tsx`](../../src/pages/LeavesPage.tsx:1) | Main leave management page |
| [`src/services/leaveService.ts`](../../src/services/leaveService.ts:1) | Leave API service |

---

## LeavesPage Component

### [`LeavesPage.tsx`](../../src/pages/LeavesPage.tsx:1)

**Purpose**: Main leave management page with leave balances, application dialog, and leave request management.

### Page Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Leave Management                                     [+ Apply Leave]   │
│  Apply and manage leave requests.                                       │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐                  │
│  │ Casual   │ │ Sick     │ │ Annual   │ │ maternity│                  │
│  │ Leave    │ │ Leave    │ │ Leave    │ │ Leave    │                  │
│  │ 10/12    │ │ 8/10     │ │ 18/20    │ │ 0/90     │                  │
│  │ 2 used   │ │ 2 used   │ │ 2 used   │ │ 0 used   │                  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘                  │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  Leave Requests                                                   │ │
│  │  ───────────────────────────────────────────────────────────────  │ │
│  │  Employee    │ Type      │ Dates        │ Days │ Status │ Actions │ │
│  │  ────────────┼───────────┼──────────────┼──────┼────────┼──────── │ │
│  │  John Doe    │ Annual    │ Mar 25 → 27  │ 3    │[Pending]│ ✓ ✗    │ │
│  │  Jane Smith  │ Sick      │ Mar 20 → 21  │ 2    │[Approved]│ -      │ │
│  │  Bob Wilson  │ Casual    │ Mar 15 → 16  │ 2    │[Rejected]│ -      │ │
│  └───────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

### Features

1. **Leave Balances**: Display remaining leave for each leave type
2. **Apply Leave Dialog**: Modal form for new leave applications
3. **Leave Requests Table**: List of all leave requests
4. **Approval Actions**: Approve/Reject buttons for managers
5. **Status Badges**: Visual status indicators

### State Management

```typescript
const { user } = useAuthStore();
const isApprover = user?.role === 'SuperAdmin' || user?.role === 'HRAdmin' || user?.role === 'Manager';

const [leaveRequests, setLeaveRequests] = useState<LeaveResponseDto[]>([]);
const [leaveTypes, setLeaveTypes] = useState<LeaveTypeResponseDto[]>([]);
const [loading, setLoading] = useState(true);
```

### Role-Based Access

```typescript
// Only approvers can see approve/reject buttons
const isApprover = user?.role === 'SuperAdmin' || user?.role === 'HRAdmin' || user?.role === 'Manager';

// In table:
{isApprover && (
  <TableCell className="text-right">
    {req.status === 'Pending' && (
      <div className="flex justify-end gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-success">
          <Check className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
          <X className="w-4 h-4" />
        </Button>
      </div>
    )}
  </TableCell>
)}
```

### Data Fetching

```typescript
useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const [requestsData, typesData] = await Promise.all([
        leaveService.getAll({ page: 1, pageSize: 50 }),
        leaveService.getTypes()
      ]);
      setLeaveRequests(requestsData.data || []);
      setLeaveTypes(typesData || []);
    } catch (err) {
      console.error('Error fetching leaves:', err);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);
```

### Leave Balances

```typescript
const leaveBalances = leaveTypes.map(type => ({
  type: type.name,
  total: type.maxDays,
  used: 0, // Would need backend to provide actual usage
  remaining: type.maxDays
}));
```

### Approval Handler

```typescript
const handleAction = (action: 'Approved' | 'Rejected', id: number) => {
  toast({ 
    title: `Leave ${action}`, 
    description: `Leave request ${id} has been ${action.toLowerCase()}.` 
  });
};
```

### Apply Leave Dialog

```typescript
<Dialog>
  <DialogTrigger asChild>
    <Button className="gradient-primary border-0 text-white">
      <Plus className="w-4 h-4 mr-1" /> Apply Leave
    </Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader><DialogTitle>Apply for Leave</DialogTitle></DialogHeader>
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label>Leave Type</Label>
        <Select>
          <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
          <SelectContent>
            {leaveTypes.map(t => (
              <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2"><Label>Start Date</Label><Input type="date" /></div>
        <div className="space-y-2"><Label>End Date</Label><Input type="date" /></div>
      </div>
      <div className="space-y-2"><Label>Reason</Label><Textarea placeholder="Reason for leave..." /></div>
    </div>
    <Button className="w-full gradient-primary border-0 text-white">Submit Request</Button>
  </DialogContent>
</Dialog>
```

---

## Leave Service

### [`leaveService.ts`](../../src/services/leaveService.ts:1)

**Purpose**: API methods for leave operations.

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/leave` | Get all leave requests |
| GET | `/leave/types` | Get all leave types |
| GET | `/leave/balance/:employeeId` | Get employee leave balance |
| POST | `/leave` | Apply for leave |
| PUT | `/leave/:id/action` | Approve/Reject leave |

### Service Methods

```typescript
export const leaveService = {
  // GET /api/v1/leave
  getAll: async (filter: LeaveFilter = {}): Promise<any> => {
    const params = new URLSearchParams();
    if (filter.employeeId) params.append('employeeId', filter.employeeId.toString());
    if (filter.status) params.append('status', filter.status);
    if (filter.page) params.append('page', filter.page.toString());
    if (filter.pageSize) params.append('pageSize', filter.pageSize.toString());

    const response = await api.get<ApiResponse<any>>(`/leave?${params}`);
    return response.data.data;
  },

  // GET /api/v1/leave/types
  getTypes: async (): Promise<LeaveTypeResponseDto[]> => {
    const response = await api.get<ApiResponse<LeaveTypeResponseDto[]>>('/leave/types');
    return response.data.data;
  },

  // GET /api/v1/leave/balance/:employeeId
  getBalance: async (employeeId: number): Promise<LeaveBalanceDto[]> => {
    const response = await api.get<ApiResponse<LeaveBalanceDto[]>>(`/leave/balance/${employeeId}`);
    return response.data.data;
  },

  // POST /api/v1/leave
  apply: async (data: {
    leaveTypeId: number;
    startDate: string;
    endDate: string;
    reason: string;
  }): Promise<LeaveResponseDto> => {
    const response = await api.post<ApiResponse<LeaveResponseDto>>('/leave', data);
    return response.data.data;
  },

  // PUT /api/v1/leave/:id/action
  updateStatus: async (id: number, data: { status: string; comments?: string }): Promise<LeaveResponseDto> => {
    const response = await api.put<ApiResponse<LeaveResponseDto>>(`/leave/${id}/action`, data);
    return response.data.data;
  },
};
```

### Filter Types

```typescript
interface LeaveFilter {
  employeeId?: number;
  status?: string;
  page?: number;
  pageSize?: number;
}
```

### Response Types

```typescript
interface LeaveResponseDto {
  id: number;
  employeeId: number;
  employeeName: string;
  leaveTypeId: number;
  leaveTypeName: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
  approvedBy?: string;
  comments?: string;
  days: number;
  createdAt: string;
}

interface LeaveTypeResponseDto {
  id: number;
  name: string;
  description?: string;
  maxDays: number;
  isActive: boolean;
}

interface LeaveBalanceDto {
  leaveTypeName: string;
  totalDays: number;
  usedDays: number;
  remainingDays: number;
}
```

---

## Leave Status Types

| Status | Description | Badge Color |
|--------|-------------|-------------|
| Pending | Awaiting approval | Yellow/Warning |
| Approved | Leave approved | Green/Success |
| Rejected | Leave rejected | Red/Destructive |

---

## Related Documentation

- [Core Application Module](../Core/Core_Application_Module.md)
- [Layout Module](../Layout/Layout_Module.md)
- [Common Components Module](../Foundation/Common_Components_Module.md)
- [Services Module](../Foundation/Services_Module.md)
- [Types Module](../Foundation/Types_Module.md)

---

*Last Updated: 2026-03-31*
