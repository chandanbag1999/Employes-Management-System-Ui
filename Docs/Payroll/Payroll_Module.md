# Payroll Module

## Overview

The Payroll Module handles salary processing, payroll records management, and compensation-related operations. Access is restricted to SuperAdmin and HRAdmin roles.

## Files

| File | Purpose |
|------|---------|
| [`src/pages/PayrollPage.tsx`](../../src/pages/PayrollPage.tsx:1) | Main payroll management page |
| [`src/services/payrollService.ts`](../../src/services/payrollService.ts:1) | Payroll API service |

---

## PayrollPage Component

### [`PayrollPage.tsx`](../../src/pages/PayrollPage.tsx:1)

**Purpose**: Main payroll management page with salary statistics, month selector, and payroll records table.

### Page Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Payroll                                          [Run Payroll]         │
│  Manage salary processing and payslips.                                  │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                   │
│  │ Gross Payroll│ │ Net Payroll  │ │ Deductions   │                   │
│  │ $892K        │ │ $745K        │ │ $147K        │                   │
│  └──────────────┘ └──────────────┘ └──────────────┘                   │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  Payroll Records                        [January 2024 ▼]            │ │
│  │  ───────────────────────────────────────────────────────────────  │ │
│  │  Employee    │ Basic     │ Allowances │ Deductions │ Net │ Status│ │
│  │  ────────────┼───────────┼─────────────┼────────────┼─────┼──────│ │
│  │  John Doe    │ $5,000    │ $2,000      │ $700        │$6,300│[Paid]│
│  │  Jane Smith  │ $6,000    │ $2,500      │ $850        │$7,650│[Paid]│
│  │  Bob Wilson  │ $4,000    │ $1,500      │ $550        │$4,950│[Pending]│
│  └───────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

### Features

1. **Salary Statistics**: Gross payroll, net payroll, and deductions summary
2. **Month Selector**: Filter payroll by month/year
3. **Payroll Records Table**: Detailed salary breakdown per employee
4. **Run Payroll Button**: Trigger payroll processing (HR Admin only)
5. **Status Badges**: Visual status indicators for each record

### State Management

```typescript
const [payroll, setPayroll] = useState<PayrollRecordResponseDto[]>([]);
const [loading, setLoading] = useState(true);
const [selectedMonth, setSelectedMonth] = useState('January');
```

### Month Mapping

```typescript
const monthMap: Record<string, number> = {
  'January': 1, 'February': 2, 'March': 3, 'April': 4,
  'May': 5, 'June': 6, 'July': 7, 'August': 8,
  'September': 9, 'October': 10, 'November': 11, 'December': 12
};
```

### Data Fetching

```typescript
useEffect(() => {
  const fetchPayroll = async () => {
    try {
      setLoading(true);
      const data = await payrollService.getAll({ 
        month: monthMap[selectedMonth], 
        year: 2024,
        page: 1, 
        pageSize: 50 
      });
      setPayroll(data.data || []);
    } catch (err) {
      console.error('Error fetching payroll:', err);
    } finally {
      setLoading(false);
    }
  };
  fetchPayroll();
}, [selectedMonth]);
```

### Statistics Calculation

```typescript
const totalGross = payroll.reduce((s, p) => s + p.grossSalary, 0);
const totalNet = payroll.reduce((s, p) => s + p.netSalary, 0);
const totalDeductions = totalGross - totalNet;
```

### Month Selector

```typescript
<Select value={selectedMonth} onValueChange={setSelectedMonth}>
  <SelectTrigger className="w-36 bg-muted/50 border-0">
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    {['January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'].map(m => 
      <SelectItem key={m} value={m}>{m} 2024</SelectItem>
    )}
  </SelectContent>
</Select>
```

### Payroll Table

```typescript
<Table>
  <TableHeader>
    <TableRow className="bg-muted/30">
      <TableHead>Employee</TableHead>
      <TableHead className="hidden md:table-cell">Basic</TableHead>
      <TableHead className="hidden lg:table-cell">Allowances</TableHead>
      <TableHead className="hidden lg:table-cell">Deductions</TableHead>
      <TableHead>Net Salary</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {payroll.map(p => (
      <TableRow key={p.id}>
        <TableCell className="font-medium text-sm">{p.employeeName}</TableCell>
        <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
          ${p.basic.toLocaleString()}
        </TableCell>
        <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
          ${(p.hra + p.da + p.ta + p.otherAllowances).toLocaleString()}
        </TableCell>
        <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
          ${(p.pf + p.tax + p.otherDeductions).toLocaleString()}
        </TableCell>
        <TableCell className="font-semibold text-sm text-foreground">
          ${p.netSalary.toLocaleString()}
        </TableCell>
        <TableCell><StatusBadge status={p.status as any} /></TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

---

## Payroll Service

### [`payrollService.ts`](../../src/services/payrollService.ts:1)

**Purpose**: API methods for payroll operations.

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/payroll` | Get all payroll records |
| GET | `/payroll/:id` | Get payroll record by ID |
| POST | `/payroll/run` | Run payroll for selected period |

### Service Methods

```typescript
export const payrollService = {
  // GET /api/v1/payroll
  getAll: async (filter: PayrollFilter = {}): Promise<any> => {
    const params = new URLSearchParams();
    if (filter.employeeId) params.append('employeeId', filter.employeeId.toString());
    if (filter.month) params.append('month', filter.month.toString());
    if (filter.year) params.append('year', filter.year.toString());
    if (filter.status) params.append('status', filter.status);
    if (filter.page) params.append('page', filter.page.toString());
    if (filter.pageSize) params.append('pageSize', filter.pageSize.toString());

    const response = await api.get<ApiResponse<any>>(`/payroll?${params}`);
    return response.data.data;
  },

  // GET /api/v1/payroll/:id
  getById: async (id: number): Promise<PayrollRecordResponseDto> => {
    const response = await api.get<ApiResponse<PayrollRecordResponseDto>>(`/payroll/${id}`);
    return response.data.data;
  },

  // POST /api/v1/payroll/run
  runPayroll: async (data: { 
    month: number; 
    year: number; 
    employeeIds?: number[] 
  }): Promise<any> => {
    const response = await api.post<ApiResponse<any>>('/payroll/run', data);
    return response.data.data;
  },
};
```

### Filter Types

```typescript
interface PayrollFilter {
  employeeId?: number;
  month?: number;
  year?: number;
  status?: string;
  page?: number;
  pageSize?: number;
}
```

### Response Types

```typescript
interface PayrollRecordResponseDto {
  id: number;
  employeeId: number;
  employeeName: string;
  month: string;
  year: number;
  basic: number;
  hra: number;           // House Rent Allowance
  da: number;            // Dearness Allowance
  ta: number;            // Travel Allowance
  otherAllowances: number;
  pf: number;             // Provident Fund
  tax: number;
  otherDeductions: number;
  grossSalary: number;
  netSalary: number;
  status: string;
}
```

---

## Salary Components

| Component | Description |
|-----------|-------------|
| Basic | Base salary component |
| HRA | House Rent Allowance |
| DA | Dearness Allowance |
| TA | Travel Allowance |
| Other Allowances | Additional allowances |
| PF | Provident Fund (deduction) |
| Tax | Income tax (deduction) |
| Other Deductions | Other deductions |

### Calculations

```
Gross Salary = Basic + HRA + DA + TA + Other Allowances
Total Deductions = PF + Tax + Other Deductions
Net Salary = Gross Salary - Total Deductions
```

---

## Related Documentation

- [Core Application Module](../Core/Core_Application_Module.md)
- [Layout Module](../Layout/Layout_Module.md)
- [Common Components Module](../Foundation/Common_Components_Module.md)
- [Services Module](../Foundation/Services_Module.md)
- [Types Module](../Foundation/Types_Module.md)

---

*Last Updated: 2026-03-31*
