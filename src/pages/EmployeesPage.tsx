import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Filter, Eye, Pencil, Trash2,
  ChevronLeft, ChevronRight, Users, UserCheck,
  UserX, RefreshCw, X, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import PageHeader from '@/components/common/PageHeader';
import StatusBadge from '@/components/common/StatusBadge';
import { employeeService } from '@/services/employeeService';
import { departmentService } from '@/services/departmentService';
import { designationService } from '@/services/designationService';
import type { EmployeeResponseDto, CreateEmployeeDto, UpdateEmployeeDto } from '@/types/backend';
import { useAuthStore } from '@/store/authStore';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Department { id: number; name: string; }
interface Designation { id: number; title: string; departmentId?: number; }

interface EmployeeFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  joiningDate: string;
  departmentId: string;
  designationId: string;
  reportingManagerId: string;
  status: string;
}

const EMPTY_FORM: EmployeeFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  gender: '',
  dateOfBirth: '',
  joiningDate: new Date().toISOString().split('T')[0],
  departmentId: '',
  designationId: '',
  reportingManagerId: '',
  status: '1',
};

const STATUS_OPTIONS = [
  { value: '1', label: 'Active' },
  { value: '2', label: 'Inactive' },
  { value: '3', label: 'On Leave' },
];

const GENDER_OPTIONS = [
  { value: '1', label: 'Male' },
  { value: '2', label: 'Female' },
  { value: '3', label: 'Other' },
];

// ─── Stat Card ────────────────────────────────────────────────────────────────

const StatCard = ({
  label, value, icon: Icon, color, loading
}: {
  label: string; value: number; icon: any; color: string; loading: boolean;
}) => (
  <Card className="glass-card border-border/50">
    <CardContent className="p-4 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        {loading ? (
          <Skeleton className="h-7 w-12 mt-1" />
        ) : (
          <p className="text-2xl font-bold text-foreground">{value}</p>
        )}
      </div>
    </CardContent>
  </Card>
);

// ─── Employee Row Skeleton ────────────────────────────────────────────────────

const EmployeeRowSkeleton = () => (
  <tr className="border-b border-border/30">
    {[...Array(7)].map((_, i) => (
      <td key={i} className="px-4 py-3">
        <Skeleton className="h-4 w-full" />
      </td>
    ))}
  </tr>
);

// ─── Form Field ───────────────────────────────────────────────────────────────

const FormField = ({
  label, required, error, children
}: {
  label: string; required?: boolean; error?: string; children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <Label className="text-sm font-medium">
      {label} {required && <span className="text-destructive">*</span>}
    </Label>
    {children}
    {error && <p className="text-xs text-destructive">{error}</p>}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const EmployeesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const canManage = user?.role === 'SuperAdmin' || user?.role === 'HRAdmin';

  // List state
  const [employees, setEmployees] = useState<EmployeeResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  // Filter state
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Form state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<EmployeeResponseDto | null>(null);
  const [formData, setFormData] = useState<EmployeeFormData>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<Partial<EmployeeFormData>>({});
  const [submitting, setSubmitting] = useState(false);

  // Delete state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingEmployee, setDeletingEmployee] = useState<EmployeeResponseDto | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Reference data
  const [departments, setDepartments] = useState<Department[]>([]);
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [allEmployees, setAllEmployees] = useState<EmployeeResponseDto[]>([]);
  const [refDataLoading, setRefDataLoading] = useState(true);

  // Search input (debounced separately from actual search)
  const [searchInput, setSearchInput] = useState('');

  // ── Fetch reference data ────────────────────────────────────────────────────

  useEffect(() => {
    const fetchRefData = async () => {
      setRefDataLoading(true);
      try {
        const [deptRes, desigRes] = await Promise.all([
          departmentService.getAll({ pageSize: 200 }),
          designationService.getAll({ pageSize: 200 }),
        ]);

        // ✅ FIXED: .data nikalo — getAll ab PaginatedResult return karta hai
        setDepartments(Array.isArray(deptRes.data) ? deptRes.data : []);
        setDesignations(Array.isArray(desigRes.data) ? desigRes.data : []);
      } catch (err) {
        console.error('Failed to load reference data:', err);
        // ✅ Error pe bhi empty array set karo — crash nahi hoga
        setDepartments([]);
        setDesignations([]);
      } finally {
        setRefDataLoading(false);
      }
    };
    fetchRefData();
  }, []);

  // ── Fetch all employees for managers list + stats ───────────────────────────

  useEffect(() => {
    const fetchAllForManagers = async () => {
      try {
        const res = await employeeService.getAll({ pageSize: 500 });
        setAllEmployees(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Failed to fetch managers list:', err);
        setAllEmployees([]);
      }
    };
    fetchAllForManagers();
  }, []);

  // ── Fetch paginated employees ───────────────────────────────────────────────

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const result = await employeeService.getAll({
        page,
        pageSize,
        search: search || undefined,
        departmentId: deptFilter ? parseInt(deptFilter) : undefined,
        status: statusFilter || undefined,
      });
      setEmployees(Array.isArray(result.data) ? result.data : []);
      setTotalCount(result.totalCount || 0);
      setTotalPages(result.totalPages || 1);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to load employees');
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, deptFilter, statusFilter]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // ── Stats ──────────────────────────────────────────────────────────────────

  const activeCount = allEmployees.filter(e => e.status === 'Active').length;
  const inactiveCount = allEmployees.filter(
    e => e.status === 'Inactive' || e.status === 'OnLeave'
  ).length;

  // ── Search debounce ────────────────────────────────────────────────────────

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // ── Form helpers ───────────────────────────────────────────────────────────

  const openCreateDialog = () => {
    setEditingEmployee(null);
    setFormData(EMPTY_FORM);
    setFormErrors({});
    setDialogOpen(true);
  };

  const openEditDialog = (emp: EmployeeResponseDto) => {
    setEditingEmployee(emp);
    setFormData({
      firstName: emp.firstName || '',
      lastName: emp.lastName || '',
      email: emp.email || '',
      phone: emp.phone || '',
      gender: emp.gender?.toString() || '',
      dateOfBirth: emp.dateOfBirth?.split('T')[0] || '',
      joiningDate: emp.joiningDate?.split('T')[0] || '',
      departmentId: emp.departmentId?.toString() || '',
      designationId: emp.designationId?.toString() || '',
      reportingManagerId: emp.reportingManagerId?.toString() || '',
      status: emp.status === 'Active' ? '1' 
            : emp.status === 'Inactive' ? '2' 
            : emp.status === 'OnLeave' ? '3' 
            : '1',
    });
    setFormErrors({});
    setDialogOpen(true);
  };

  const closeDialog = () => {
    if (submitting) return;
    setDialogOpen(false);
    setEditingEmployee(null);
    setFormData(EMPTY_FORM);
    setFormErrors({});
  };

  const handleFormChange = (field: keyof EmployeeFormData, value: string) => {
    if (field === 'departmentId') {
      // Department change pe designation reset karo
      setFormData(prev => ({ ...prev, departmentId: value, designationId: '' }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    // Error clear karo
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // ── Validation ─────────────────────────────────────────────────────────────

  const validate = (): boolean => {
    const errors: Partial<EmployeeFormData> = {};
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    if (!formData.gender) errors.gender = 'Gender is required';
    if (!formData.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
    if (!formData.joiningDate) errors.joiningDate = 'Joining date is required';
    if (!formData.departmentId) errors.departmentId = 'Department is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);

    try {
      if (editingEmployee) {
        const payload: UpdateEmployeeDto = {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || undefined,
          gender: parseInt(formData.gender),
          dateOfBirth: formData.dateOfBirth,
          joiningDate: formData.joiningDate,
          departmentId: parseInt(formData.departmentId),
          designationId: formData.designationId
            ? parseInt(formData.designationId)
            : undefined,
          reportingManagerId: formData.reportingManagerId
            ? parseInt(formData.reportingManagerId)
            : undefined,
          status: parseInt(formData.status),
        };
        await employeeService.update(editingEmployee.id, payload);
        toast.success(`${formData.firstName} ${formData.lastName} updated successfully`);
      } else {
        const payload: CreateEmployeeDto = {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || undefined,
          gender: parseInt(formData.gender),
          dateOfBirth: formData.dateOfBirth,
          joiningDate: formData.joiningDate,
          departmentId: parseInt(formData.departmentId),
          designationId: formData.designationId
            ? parseInt(formData.designationId)
            : undefined,
          reportingManagerId: formData.reportingManagerId
            ? parseInt(formData.reportingManagerId)
            : undefined,
        };
        await employeeService.create(payload);
        toast.success('Employee created successfully');
      }

      closeDialog();
      fetchEmployees();

      // Managers list refresh
      const res = await employeeService.getAll({ pageSize: 500 });
      setAllEmployees(Array.isArray(res.data) ? res.data : []);

    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0] ||
        'Operation failed. Please try again.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────

  const openDeleteDialog = (emp: EmployeeResponseDto) => {
    setDeletingEmployee(emp);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingEmployee) return;
    setDeleting(true);
    try {
      await employeeService.delete(deletingEmployee.id);
      toast.success(
        `${deletingEmployee.firstName} ${deletingEmployee.lastName} deleted successfully`
      );
      setDeleteDialogOpen(false);
      setDeletingEmployee(null);
      if (employees.length === 1 && page > 1) setPage(p => p - 1);
      else fetchEmployees();
      const res = await employeeService.getAll({ pageSize: 500 });
      setAllEmployees(Array.isArray(res.data) ? res.data : []);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  // ── Clear filters ──────────────────────────────────────────────────────────

  const clearFilters = () => {
    setSearchInput('');
    setSearch('');
    setDeptFilter('');
    setStatusFilter('');
    setPage(1);
  };

  const hasFilters = !!(searchInput || deptFilter || statusFilter);

  // ── Designations filtered by selected department ───────────────────────────

  const filteredDesignations = formData.departmentId
    ? designations.filter(
        d => !d.departmentId || d.departmentId === parseInt(formData.departmentId)
      )
    : designations;

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* ── Header ── */}
      <PageHeader title="Employees" description="Manage your organization's workforce">
        {canManage && (
          <Button onClick={openCreateDialog} className="gradient-primary text-white gap-2">
            <Plus className="w-4 h-4" />
            Add Employee
          </Button>
        )}
      </PageHeader>

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Employees"
          value={allEmployees.length}
          icon={Users}
          color="bg-blue-500"
          loading={refDataLoading}
        />
        <StatCard
          label="Active"
          value={activeCount}
          icon={UserCheck}
          color="bg-green-500"
          loading={refDataLoading}
        />
        <StatCard
          label="Inactive / On Leave"
          value={inactiveCount}
          icon={UserX}
          color="bg-orange-500"
          loading={refDataLoading}
        />
      </div>

      {/* ── Filters ── */}
      <Card className="glass-card border-border/50">
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, code..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                className="pl-9 bg-background/50"
              />
            </div>

            {/* Filter toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(f => !f)}
              className={showFilters ? 'border-primary text-primary' : ''}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {hasFilters && (
                <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-primary text-white">
                  !
                </Badge>
              )}
            </Button>

            {/* Refresh */}
            <Button variant="outline" onClick={fetchEmployees} disabled={loading}>
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          {/* Extended filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-border/30">
                  {/* Department filter */}
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">
                      Department
                    </Label>
                    <Select
                      value={deptFilter}
                      onValueChange={v => {
                        setDeptFilter(v === 'all' ? '' : v);
                        setPage(1);
                      }}
                    >
                      <SelectTrigger className="bg-background/50">
                        <SelectValue placeholder="All Departments" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        {departments.map(d => (
                          <SelectItem key={d.id} value={d.id.toString()}>
                            {d.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Status filter */}
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">
                      Status
                    </Label>
                    <Select
                      value={statusFilter}
                      onValueChange={v => {
                        setStatusFilter(v === 'all' ? '' : v);
                        setPage(1);
                      }}
                    >
                      <SelectTrigger className="bg-background/50">
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="OnLeave">On Leave</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Clear filters */}
                  {hasFilters && (
                    <div className="flex items-end">
                      <Button
                        variant="ghost"
                        onClick={clearFilters}
                        className="gap-2 text-muted-foreground"
                      >
                        <X className="w-4 h-4" />
                        Clear Filters
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* ── Table ── */}
      <Card className="glass-card border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 bg-muted/30">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                  Employee
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">
                  Code
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">
                  Department
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">
                  Designation
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden xl:table-cell">
                  Joined
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                  Status
                </th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(pageSize)].map((_, i) => <EmployeeRowSkeleton key={i} />)
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-muted-foreground">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p className="font-medium">No employees found</p>
                    {hasFilters && (
                      <p className="text-xs mt-1">
                        Try adjusting your filters or{' '}
                        <button onClick={clearFilters} className="text-primary underline">
                          clear all
                        </button>
                      </p>
                    )}
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {employees.map((emp, idx) => (
                    <motion.tr
                      key={emp.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="border-b border-border/30 hover:bg-muted/20 transition-colors group"
                    >
                      {/* Employee name + email */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {emp.firstName?.[0]}{emp.lastName?.[0]}
                          </div>
                          <div>
                            <p className="font-medium text-foreground leading-tight">
                              {emp.firstName} {emp.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground">{emp.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Code */}
                      <td className="px-4 py-3 hidden md:table-cell">
                        <Badge variant="outline" className="font-mono text-xs">
                          {emp.employeeCode || '—'}
                        </Badge>
                      </td>

                      {/* Department */}
                      <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">
                        {emp.departmentName || '—'}
                      </td>

                      {/* Designation */}
                      <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">
                        {emp.designationTitle || '—'}
                      </td>

                      {/* Joined */}
                      <td className="px-4 py-3 hidden xl:table-cell text-muted-foreground">
                        {emp.joiningDate
                          ? new Date(emp.joiningDate).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })
                          : '—'}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <StatusBadge status={emp.status as any} />
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={() => navigate(`/employees/${emp.id}`)}
                            title="View Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {canManage && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-blue-500"
                                onClick={() => openEditDialog(emp)}
                                title="Edit Employee"
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={() => openDeleteDialog(emp)}
                                title="Delete Employee"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        {!loading && employees.length > 0 && (
          <div className="px-4 py-3 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Showing{' '}
              <span className="font-medium text-foreground">
                {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, totalCount)}
              </span>{' '}
              of{' '}
              <span className="font-medium text-foreground">{totalCount}</span>{' '}
              employees
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => p - 1)}
                disabled={page === 1 || loading}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              {/* Page numbers */}
              {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPage(pageNum)}
                    className="h-8 w-8 p-0 text-xs"
                  >
                    {pageNum}
                  </Button>
                );
              })}

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => p + 1)}
                disabled={page === totalPages || loading}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* ═══════════════════════════════════════════════════════════════════════
          CREATE / EDIT DIALOG
      ═══════════════════════════════════════════════════════════════════════ */}
      <Dialog open={dialogOpen} onOpenChange={closeDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
            </DialogTitle>
            <DialogDescription>
              {editingEmployee
                ? `Update details for ${editingEmployee.firstName} ${editingEmployee.lastName}`
                : 'Fill in the details to create a new employee record'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
            {/* First Name */}
            <FormField label="First Name" required error={formErrors.firstName}>
              <Input
                value={formData.firstName}
                onChange={e => handleFormChange('firstName', e.target.value)}
                placeholder="John"
                className={formErrors.firstName ? 'border-destructive' : ''}
              />
            </FormField>

            {/* Last Name */}
            <FormField label="Last Name" required error={formErrors.lastName}>
              <Input
                value={formData.lastName}
                onChange={e => handleFormChange('lastName', e.target.value)}
                placeholder="Doe"
                className={formErrors.lastName ? 'border-destructive' : ''}
              />
            </FormField>

            {/* Email */}
            <FormField label="Email Address" required error={formErrors.email}>
              <Input
                type="email"
                value={formData.email}
                onChange={e => handleFormChange('email', e.target.value)}
                placeholder="john.doe@company.com"
                className={formErrors.email ? 'border-destructive' : ''}
              />
            </FormField>

            {/* Phone */}
            <FormField label="Phone Number" error={formErrors.phone}>
              <Input
                value={formData.phone}
                onChange={e => handleFormChange('phone', e.target.value)}
                placeholder="+91 98765 43210"
              />
            </FormField>

            {/* Gender */}
            <FormField label="Gender" required error={formErrors.gender}>
              <Select
                value={formData.gender}
                onValueChange={v => handleFormChange('gender', v)}
              >
                <SelectTrigger className={formErrors.gender ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  {GENDER_OPTIONS.map(g => (
                    <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            {/* Date of Birth */}
            <FormField label="Date of Birth" required error={formErrors.dateOfBirth}>
              <Input
                type="date"
                value={formData.dateOfBirth}
                onChange={e => handleFormChange('dateOfBirth', e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className={formErrors.dateOfBirth ? 'border-destructive' : ''}
              />
            </FormField>

            {/* Joining Date */}
            <FormField label="Joining Date" required error={formErrors.joiningDate}>
              <Input
                type="date"
                value={formData.joiningDate}
                onChange={e => handleFormChange('joiningDate', e.target.value)}
                className={formErrors.joiningDate ? 'border-destructive' : ''}
              />
            </FormField>

            {/* Department */}
            <FormField label="Department" required error={formErrors.departmentId}>
              <Select
                value={formData.departmentId}
                onValueChange={v => handleFormChange('departmentId', v)}
              >
                <SelectTrigger className={formErrors.departmentId ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(d => (
                    <SelectItem key={d.id} value={d.id.toString()}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            {/* Designation */}
            <FormField label="Designation">
              <Select
                value={formData.designationId}
                onValueChange={v => handleFormChange('designationId', v)}
                disabled={!formData.departmentId}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      formData.departmentId
                        ? 'Select designation'
                        : 'Select department first'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {filteredDesignations.map(d => (
                    <SelectItem key={d.id} value={d.id.toString()}>
                      {d.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            {/* Reporting Manager */}
            <FormField label="Reporting Manager">
              <Select
                value={formData.reportingManagerId}
                onValueChange={v => handleFormChange('reportingManagerId', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select manager (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {allEmployees
                    .filter(e => !editingEmployee || e.id !== editingEmployee.id)
                    .map(e => (
                      <SelectItem key={e.id} value={e.id.toString()}>
                        {e.firstName} {e.lastName}
                        {e.designationTitle ? ` — ${e.designationTitle}` : ''}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </FormField>

            {/* Status — only for edit */}
            {editingEmployee && (
              <FormField label="Status">
                <Select
                  value={formData.status}
                  onValueChange={v => handleFormChange('status', v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map(s => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            )}
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button variant="outline" onClick={closeDialog} disabled={submitting}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="gradient-primary text-white min-w-[120px]"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {editingEmployee ? 'Saving...' : 'Creating...'}
                </>
              ) : (
                editingEmployee ? 'Save Changes' : 'Create Employee'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══════════════════════════════════════════════════════════════════════
          DELETE CONFIRMATION DIALOG
      ═══════════════════════════════════════════════════════════════════════ */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Employee</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{' '}
              <span className="font-semibold text-foreground">
                {deletingEmployee?.firstName} {deletingEmployee?.lastName}
              </span>
              ? This action will soft-delete the record and can be reviewed by an admin.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive hover:bg-destructive/90 text-white"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Employee'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default EmployeesPage;