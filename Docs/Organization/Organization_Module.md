# Organization Module

## Overview

The Organization Module handles organizational structure management including departments and designations. Access is restricted to SuperAdmin and HRAdmin roles.

## Files

| File | Purpose |
|------|---------|
| [`src/pages/DepartmentsPage.tsx`](../../src/pages/DepartmentsPage.tsx:1) | Main organization management page |
| [`src/services/departmentService.ts`](../../src/services/departmentService.ts:1) | Department API service |
| [`src/services/designationService.ts`](../../src/services/designationService.ts:1) | Designation API service |

---

## DepartmentsPage Component

### [`DepartmentsPage.tsx`](../../src/pages/DepartmentsPage.tsx:1)

**Purpose**: Main organization management page with departments, designations, and soft-delete management.

### Page Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Organization                                            [+ Add Dept] [+ Add Designation] │
│  Manage departments, designations and structure.                       │
├─────────────────────────────────────────────────────────────────────────┤
│  [Departments] [Designations] [Deleted (3)]                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌───────────────────────────┐ ┌───────────────────────────┐          │
│  │ 🏢 Engineering            │ │ 🏢 Human Resources        │          │
│  │ 45 employees              │ │ 12 employees              │          │
│  │ Head: John Doe            │ │ Head: Jane Smith          │          │
│  │ No description provided   │ │ Manages company HR...     │          │
│  │                       [✏️][🗑] │                       [✏️][🗑] │          │
│  └───────────────────────────┘ └───────────────────────────┘          │
│                                                                         │
│  ┌───────────────────────────┐ ┌───────────────────────────┐          │
│  │ 💼 Software Developer      │ │ 💼 Senior Developer       │          │
│  │ Department: Engineering   │ │ Department: Engineering   │          │
│  │                       [✏️][🗑] │                       [✏️][🗑] │          │
│  └───────────────────────────┘ └───────────────────────────┘          │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│  Deleted Tab:                                                            │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ Designations deleted within 12 months can be restored.             │ │
│  │                                         [Purge Old]                │ │
│  │ 💼 Junior Developer           30 days ago         [Restore]       │ │
│  │ 💼 Intern                     45 days ago         [Restore]       │ │
│  └───────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

### Features

1. **Tabbed Interface**: Three tabs (Departments, Designations, Deleted)
2. **Department Cards**: Grid of department cards with management actions
3. **Designation Cards**: Grid of designation cards
4. **Deleted Tab**: Soft-deleted designations with restore functionality
5. **Create/Edit Dialogs**: Modal forms for CRUD operations
6. **Purge Old**: Remove old deleted designations

### Tabs

| Tab | Content |
|-----|---------|
| Departments | Department cards |
| Designations | Designation cards |
| Deleted | Soft-deleted designations |

### State Management

```typescript
const [departments, setDepartments] = useState<DepartmentResponseDto[]>([]);
const [designations, setDesignations] = useState<DesignationResponseDto[]>([]);
const [deletedDesignations, setDeletedDesignations] = useState<DesignationResponseDto[]>([]);
const [loading, setLoading] = useState(true);

// Department form state
const [deptDialogOpen, setDeptDialogOpen] = useState(false);
const [editingDept, setEditingDept] = useState<DepartmentResponseDto | null>(null);
const [deptFormData, setDeptFormData] = useState({ name: '', description: '', code: '', isActive: true });

// Designation form state
const [desigDialogOpen, setDesigDialogOpen] = useState(false);
const [editingDesig, setEditingDesig] = useState<DesignationResponseDto | null>(null);
const [desigFormData, setDesigFormData] = useState({ title: '', departmentId: '', description: '' });
```

### Data Fetching

```typescript
const fetchData = async () => {
  try {
    setLoading(true);
    const [deptData, desigData, deletedDesigData] = await Promise.all([
      departmentService.getAll(),
      designationService.getAll(),
      designationService.getAllDeleted()
    ]);
    setDepartments(deptData || []);
    setDesignations(desigData || []);
    setDeletedDesignations(deletedDesigData || []);
  } catch (err) {
    console.error('Error fetching data:', err);
    toast({ title: 'Error', description: 'Failed to load data', variant: 'destructive' });
  } finally {
    setLoading(false);
  }
};
```

### Department Operations

#### Create Department

```typescript
const handleCreateDepartment = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!deptFormData.name.trim()) {
    toast({ title: 'Error', description: 'Department name is required', variant: 'destructive' });
    return;
  }

  try {
    setSavingDept(true);
    const data: CreateDepartmentDto = {
      name: deptFormData.name,
      description: deptFormData.description || undefined,
      code: deptFormData.code || undefined,
    };
    
    await departmentService.create(data);
    toast({ title: 'Success', description: 'Department created successfully' });
    setDeptDialogOpen(false);
    fetchData();
  } catch (err) {
    toast({ title: 'Error', description: 'Failed to create department', variant: 'destructive' });
  } finally {
    setSavingDept(false);
  }
};
```

#### Delete Department

```typescript
const handleDeleteDepartment = async () => {
  if (!deletingDept) return;

  try {
    setDeleting(true);
    await departmentService.delete(deletingDept.id);
    toast({ title: 'Success', description: 'Department deleted successfully' });
    setDeleteDialogOpen(false);
    fetchData();
  } catch (err) {
    toast({ title: 'Error', description: 'Failed to delete department', variant: 'destructive' });
  } finally {
    setDeleting(false);
  }
};
```

### Designation Operations

#### Create Designation

```typescript
const handleCreateDesignation = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!desigFormData.title.trim()) {
    toast({ title: 'Error', description: 'Designation title is required', variant: 'destructive' });
    return;
  }
  if (!desigFormData.departmentId) {
    toast({ title: 'Error', description: 'Please select a department', variant: 'destructive' });
    return;
  }

  try {
    setSavingDesig(true);
    const data: CreateDesignationDto = {
      title: desigFormData.title,
      departmentId: Number(desigFormData.departmentId),
    };
    
    await designationService.create(data);
    toast({ title: 'Success', description: 'Designation created successfully' });
    setDesigDialogOpen(false);
    fetchData();
  } catch (err) {
    toast({ title: 'Error', description: 'Failed to create designation', variant: 'destructive' });
  } finally {
    setSavingDesig(false);
  }
};
```

#### Restore Designation

```typescript
const handleRestoreDesignation = async (id: number) => {
  try {
    setRestoringId(id);
    await designationService.restore(id);
    toast({ title: 'Success', description: 'Designation restored successfully' });
    fetchData();
  } catch (err) {
    toast({ title: 'Error', description: 'Failed to restore designation', variant: 'destructive' });
  } finally {
    setRestoringId(null);
  }
};
```

#### Purge Old Designations

```typescript
const handlePurgeOld = async () => {
  try {
    setPurging(true);
    const count = await designationService.purge(12);
    toast({ title: 'Success', description: `Purged ${count} old deleted designations` });
    setPurgeDialogOpen(false);
    fetchData();
  } catch (err) {
    toast({ title: 'Error', description: 'Failed to purge designations', variant: 'destructive' });
  } finally {
    setPurging(false);
  }
};
```

---

## Department Service

### [`departmentService.ts`](../../src/services/departmentService.ts:1)

**Purpose**: API methods for department operations.

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/departments` | Get all departments |
| GET | `/departments/:id` | Get department by ID |
| POST | `/departments` | Create new department |
| PUT | `/departments/:id` | Update department |
| DELETE | `/departments/:id` | Delete department |

### Service Methods

```typescript
export const departmentService = {
  getAll: async (): Promise<DepartmentResponseDto[]> => {
    const response = await api.get<any>('/departments');
    const paginatedData = response.data.data;
    const departments = paginatedData?.data || paginatedData || [];
    return Array.isArray(departments) ? departments : [];
  },

  getById: async (id: number): Promise<DepartmentResponseDto> => {
    const response = await api.get<any>(`/departments/${id}`);
    return response.data.data || response.data;
  },

  create: async (data: CreateDepartmentDto): Promise<DepartmentResponseDto> => {
    const response = await api.post<any>('/departments', data);
    return response.data.data || response.data;
  },

  update: async (id: number, data: UpdateDepartmentDto): Promise<DepartmentResponseDto> => {
    const response = await api.put<ApiResponse<DepartmentResponseDto>>(`/departments/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/departments/${id}`);
  },
};
```

### Department Response Types

```typescript
interface DepartmentResponseDto {
  id: number;
  name: string;
  code?: string;
  description?: string;
  headId?: number;
  headName?: string;
  employeeCount?: number;
  isActive?: boolean;
}

interface CreateDepartmentDto {
  name: string;
  description?: string;
  code?: string;
  headId?: number;
}

interface UpdateDepartmentDto extends CreateDepartmentDto {}
```

---

## Designation Service

### [`designationService.ts`](../../src/services/designationService.ts:1)

**Purpose**: API methods for designation operations including soft delete.

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/designations` | Get all active designations |
| GET | `/designations/deleted` | Get soft-deleted designations |
| GET | `/designations/:id` | Get designation by ID |
| POST | `/designations` | Create new designation |
| PUT | `/designations/:id` | Update designation |
| DELETE | `/designations/:id` | Soft delete designation |
| POST | `/designations/:id/restore` | Restore soft-deleted designation |
| DELETE | `/designations/purge?months=12` | Permanently delete old designations |

### Service Methods

```typescript
export const designationService = {
  getAll: async (): Promise<DesignationResponseDto[]> => {
    const response = await api.get<any>('/designations');
    const paginatedData = response.data.data;
    const designations = paginatedData?.data || paginatedData || [];
    return Array.isArray(designations) ? designations : [];
  },

  getAllDeleted: async (): Promise<DesignationResponseDto[]> => {
    const response = await api.get<any>('/designations/deleted');
    const paginatedData = response.data.data;
    const designations = paginatedData?.data || paginatedData || [];
    return Array.isArray(designations) ? designations : [];
  },

  getById: async (id: number): Promise<DesignationResponseDto> => {
    const response = await api.get<any>(`/designations/${id}`);
    return response.data.data || response.data;
  },

  create: async (data: CreateDesignationDto): Promise<DesignationResponseDto> => {
    const response = await api.post<any>('/designations', data);
    return response.data.data || response.data;
  },

  update: async (id: number, data: CreateDesignationDto): Promise<DesignationResponseDto> => {
    const response = await api.put<any>(`/designations/${id}`, data);
    return response.data.data || response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/designations/${id}`);
  },

  restore: async (id: number): Promise<void> => {
    const response = await api.post(`/designations/${id}/restore`);
    return response.data;
  },

  purge: async (months: number = 12): Promise<number> => {
    const response = await api.delete(`/designations/purge?months=${months}`);
    return response.data?.data || 0;
  },
};
```

### Designation Response Types

```typescript
interface DesignationResponseDto {
  id: number;
  title: string;
  description?: string;
  departmentId: number;
  departmentName?: string;
  createdAt?: string;
}

interface CreateDesignationDto {
  title: string;
  departmentId: number;
  description?: string;
}
```

---

## Soft Delete Features

### Restore
- Deleted designations can be restored within 12 months
- Restoration restores the designation to active state

### Purge
- Permanently removes designations deleted more than specified months ago
- Default: 12 months
- Returns count of purged designations

---

## Related Documentation

- [Core Application Module](../Core/Core_Application_Module.md)
- [Layout Module](../Layout/Layout_Module.md)
- [Common Components Module](../Foundation/Common_Components_Module.md)
- [Services Module](../Foundation/Services_Module.md)
- [Types Module](../Foundation/Types_Module.md)

---

*Last Updated: 2026-03-31*
