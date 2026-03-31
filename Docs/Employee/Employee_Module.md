# Employee Module

## Overview

The Employee Module handles all employee-related operations including viewing the employee list, adding new employees, editing existing records, viewing individual employee profiles, and managing employee data.

## Files

| File | Purpose |
|------|---------|
| [`src/pages/EmployeesPage.tsx`](../../src/pages/EmployeesPage.tsx:1) | Employee list with CRUD operations |
| [`src/pages/EmployeeProfile.tsx`](../../src/pages/EmployeeProfile.tsx:1) | Individual employee profile view |
| [`src/services/employeeService.ts`](../../src/services/employeeService.ts:1) | Employee API service |

---

## EmployeesPage Component

### [`EmployeesPage.tsx`](../../src/pages/EmployeesPage.tsx:1)

**Purpose**: Main employee management page with list view, search, filters, and CRUD dialog.

### Page Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Employees                                          [+ Add Employee]    │
│  150 total employees                                                    │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ [🔍 Search employees...] [All Departments ▼] [All Status ▼]       │ │
│  └───────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ Employee          │ Department      │ Designation │ Status │ Actions│
│  ├──────────────────┼─────────────────┼─────────────┼────────┼────────┤
│  │ 👤 John Doe      │ Engineering     │ Senior Dev  │ Active │ 👁 ✏️ 🗑│
│  │    john@email.com│                 │             │        │        │
│  ├──────────────────┼─────────────────┼─────────────┼────────┼────────┤
│  │ 👤 Jane Smith    │ HR              │ Manager     │ Active │ 👁 ✏️ 🗑│
│  │    jane@email.com│                 │             │        │        │
│  └──────────────────┴─────────────────┴─────────────┴────────┴────────┘
└─────────────────────────────────────────────────────────────────────────┘
```

### Features

1. **Employee List**: Paginated table view of all employees
2. **Search**: Filter by name, email, or employee code
3. **Department Filter**: Filter by department
4. **Status Filter**: Filter by Active/Inactive/On Leave
5. **CRUD Operations**: Create, Read, Update, Delete employees
6. **Add Employee Dialog**: Modal form for new employee creation
7. **Edit Dialog**: Modal form for editing existing employees

### Data Fetching

```typescript
const fetchData = async () => {
  try {
    setLoading(true);
    const [empData, deptData, desigData] = await Promise.all([
      employeeService.getAll({ page: 1, pageSize: 100 }),
      departmentService.getAll(),
      designationService.getAll()
    ]);
    setEmployees(empData.data || []);
    setDepartments(deptData || []);
    setDesignations(desigData || []);
  } catch (err) {
    toast({ title: 'Error', description: 'Failed to load data', variant: 'destructive' });
  }
};
```

### State Management

```typescript
const [employees, setEmployees] = useState<EmployeeResponseDto[]>([]);
const [departments, setDepartments] = useState<DepartmentResponseDto[]>([]);
const [designations, setDesignations] = useState<DesignationResponseDto[]>([]);
const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);
const [search, setSearch] = useState('');
const [deptFilter, setDeptFilter] = useState('all');
const [statusFilter, setStatusFilter] = useState('all');
const [dialogOpen, setDialogOpen] = useState(false);
const [editingEmployee, setEditingEmployee] = useState<EmployeeResponseDto | null>(null);
```

### Form State

```typescript
const [formData, setFormData] = useState({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  gender: 1,      // 1=Male, 2=Female, 3=Other
  dateOfBirth: '',
  joiningDate: new Date().toISOString().split('T')[0],
  departmentId: '' as string,
  designationId: '' as string,
  reportingManagerId: '' as string,
  status: 1,     // 1=Active, 2=Inactive, 3=OnLeave
});
```

### Gender/Status Mapping

```typescript
// Gender: Backend uses numbers (1=Male, 2=Female, 3=Other)
const getGenderNumber = (gender: string): number => {
  if (gender === 'Male' || gender === '1') return 1;
  if (gender === 'Female' || gender === '2') return 2;
  return 3;
};

// Status: Backend uses numbers (1=Active, 2=Inactive, 3=OnLeave)
const getStatusNumber = (status: string): number => {
  if (status === 'Active' || status === '1') return 1;
  if (status === 'Inactive' || status === '2') return 2;
  return 3;
};
```

### CRUD Operations

#### Create Employee

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  const data = {
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    phone: formData.phone,
    gender: formData.gender,
    dateOfBirth: formData.dateOfBirth,
    joiningDate: formData.joiningDate,
    departmentId: Number(formData.departmentId),
    designationId: formData.designationId ? Number(formData.designationId) : undefined,
    reportingManagerId: formData.reportingManagerId ? Number(formData.reportingManagerId) : undefined,
    status: formData.status,
  };

  if (editingEmployee) {
    await employeeService.update(editingEmployee.id, data as UpdateEmployeeDto);
    toast({ title: 'Success', description: 'Employee updated successfully' });
  } else {
    await employeeService.create(data as CreateEmployeeDto);
    toast({ title: 'Success', description: 'Employee created successfully' });
  }
  
  setDialogOpen(false);
  resetForm();
  fetchData();
};
```

#### Delete Employee

```typescript
const handleDelete = async (emp: EmployeeResponseDto) => {
  if (!confirm(`Delete ${emp.firstName} ${emp.lastName}?`)) return;
  
  try {
    await employeeService.delete(emp.id);
    toast({ title: 'Success', description: 'Employee deleted successfully' });
    fetchData();
  } catch (err) {
    toast({ title: 'Error', description: 'Failed to delete employee', variant: 'destructive' });
  }
};
```

### Filtering

```typescript
const filtered = employees.filter((e) => {
  const fullName = `${e.firstName} ${e.lastName}`.toLowerCase();
  const matchSearch = fullName.includes(search.toLowerCase()) ||
    e.email.toLowerCase().includes(search.toLowerCase()) ||
    (e.employeeCode || '').toLowerCase().includes(search.toLowerCase());
  const matchDept = deptFilter === 'all' || e.departmentId.toString() === deptFilter;
  const matchStatus = statusFilter === 'all' || e.status === statusFilter;
  return matchSearch && matchDept && matchStatus;
});
```

### Role-Based Access

```typescript
const { user } = useAuthStore();
const isAdmin = user?.role === 'SuperAdmin' || user?.role === 'HRAdmin';

// Only admins can see Add Employee button
{isAdmin && (
  <Button onClick={openCreateDialog} className="gradient-primary border-0 text-white">
    <Plus className="w-4 h-4 mr-1" /> Add Employee
  </Button>
)}

// Only admins can see Edit/Delete buttons
{isAdmin && (
  <>
    <Button variant="ghost" size="icon" onClick={() => openEditDialog(emp)}>
      <Pencil className="w-4 h-4" />
    </Button>
    <Button variant="ghost" size="icon" onClick={() => handleDelete(emp)}>
      <Trash2 className="w-4 h-4" />
    </Button>
  </>
)}
```

---

## EmployeeProfile Component

### [`EmployeeProfile.tsx`](../../src/pages/EmployeeProfile.tsx:1)

**Purpose**: Individual employee detail view with tabbed sections.

### Page Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ┌────────────────┐                                                     │
│  │  JD            │  John Doe                    [Active]               │
│  └────────────────┘  Senior Developer · Engineering                      │
│                      📧 john@email.com  📱 +1-555-0100  📅 Joined 2020 │
├─────────────────────────────────────────────────────────────────────────┤
│  [Information] [Attendance] [Leaves] [Payroll]                         │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────┐  ┌─────────────────────────┐              │
│  │ Personal Details        │  │ Employment Details       │              │
│  │ Employee Code: EMP001   │  │ Department: Engineering │              │
│  │ Full Name: John Doe     │  │ Designation: Senior Dev │              │
│  │ Email: john@email.com   │  │ Joining Date: 2020-01-15│              │
│  │ Phone: +1-555-0100      │  │ Salary: N/A             │              │
│  └─────────────────────────┘  └─────────────────────────┘              │
└─────────────────────────────────────────────────────────────────────────┘
```

### Route Parameter

```typescript
const { id } = useParams();  // URL: /employees/:id
```

### Data Fetching

```typescript
useEffect(() => {
  const fetchEmployee = async () => {
    try {
      setLoading(true);
      if (id) {
        const data = await employeeService.getById(parseInt(id));
        setEmployee(data);
      }
    } catch (err) {
      console.error('Error fetching employee:', err);
    } finally {
      setLoading(false);
    }
  };
  fetchEmployee();
}, [id]);
```

### Tabs

| Tab | Content |
|-----|---------|
| Information | Personal and employment details |
| Attendance | Attendance history (placeholder) |
| Leaves | Leave records (placeholder) |
| Payroll | Payroll history (placeholder) |

### Profile Header

```typescript
<div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center text-white text-2xl font-bold">
  {employee.firstName[0]}{employee.lastName[0]}
</div>
```

---

## Employee Service

### [`employeeService.ts`](../../src/services/employeeService.ts:1)

**Purpose**: API methods for employee CRUD operations.

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/employees` | Get all employees (paginated) |
| GET | `/employees/:id` | Get employee by ID |
| POST | `/employees` | Create new employee |
| PUT | `/employees/:id` | Update employee |
| DELETE | `/employees/:id` | Delete employee |

### Service Methods

```typescript
export const employeeService = {
  getAll: async (filter: EmployeeFilter = {}): Promise<PaginatedResult<EmployeeResponseDto>> => {
    const params = new URLSearchParams();
    if (filter.page) params.append('page', filter.page.toString());
    if (filter.pageSize) params.append('pageSize', filter.pageSize.toString());
    if (filter.search) params.append('search', filter.search);
    if (filter.departmentId) params.append('departmentId', filter.departmentId.toString());
    if (filter.designationId) params.append('designationId', filter.designationId.toString());
    if (filter.status) params.append('status', filter.status);
    if (filter.gender) params.append('gender', filter.gender);

    const response = await api.get<any>(`/employees?${params}`);
    return extractPaginatedData<EmployeeResponseDto>(response);
  },

  getById: async (id: number): Promise<EmployeeResponseDto> => {
    const response = await api.get<any>(`/employees/${id}`);
    return response.data.data || response.data;
  },

  create: async (data: CreateEmployeeDto): Promise<EmployeeResponseDto> => {
    const response = await api.post<any>('/employees', data);
    return response.data.data || response.data;
  },

  update: async (id: number, data: UpdateEmployeeDto): Promise<EmployeeResponseDto> => {
    const response = await api.put<any>(`/employees/${id}`, data);
    return response.data.data || response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/employees/${id}`);
  },
};
```

### Data Types

```typescript
interface EmployeeResponseDto {
  id: number;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  joiningDate: string;
  profilePhotoUrl?: string;
  status: string;
  departmentId: number;
  departmentName: string;
  designationId?: number;
  designationTitle?: string;
  reportingManagerId?: number;
  reportingManagerName?: string;
  userId?: number;
  createdAt: string;
}

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

interface UpdateEmployeeDto extends CreateEmployeeDto {
  status: number;  // 1=Active, 2=Inactive, 3=OnLeave
}
```

---

## Related Documentation

- [Core Application Module](../Core/Core_Application_Module.md)
- [Layout Module](../Layout/Layout_Module.md)
- [Department Module](./Organization/Department_Module.md)
- [Common Components Module](../Foundation/Common_Components_Module.md)
- [Services Module](../Foundation/Services_Module.md)
- [Types Module](../Foundation/Types_Module.md)

---

*Last Updated: 2026-03-31*
