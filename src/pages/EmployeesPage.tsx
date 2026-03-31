import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PageHeader from '@/components/common/PageHeader';
import StatusBadge from '@/components/common/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Search, Plus, Eye, Pencil, Trash2, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Link } from 'react-router-dom';
import { employeeService, departmentService, designationService } from '@/services';
import type { EmployeeResponseDto, DepartmentResponseDto, DesignationResponseDto, CreateEmployeeDto, UpdateEmployeeDto } from '@/types/backend';
import { useToast } from '@/hooks/use-toast';

const EmployeesPage = () => {
  const { toast } = useToast();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'SuperAdmin' || user?.role === 'HRAdmin';
  
  const [employees, setEmployees] = useState<EmployeeResponseDto[]>([]);
  const [departments, setDepartments] = useState<DepartmentResponseDto[]>([]);
  const [designations, setDesignations] = useState<DesignationResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<EmployeeResponseDto | null>(null);
  
  // Form state - Gender is number: 1=Male, 2=Female, 3=Other
  // Status is number: 1=Active, 2=Inactive, 3=OnLeave
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: 1,  // 1=Male, 2=Female, 3=Other
    dateOfBirth: '',
    joiningDate: new Date().toISOString().split('T')[0],
    departmentId: '' as string,
    designationId: '' as string,
    reportingManagerId: '' as string,
    status: 1,  // 1=Active, 2=Inactive, 3=OnLeave
  });

  useEffect(() => {
    fetchData();
  }, []);

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
      console.error('Error fetching employees:', err);
      toast({ title: 'Error', description: 'Failed to load data', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  // Open dialog for create
  const openCreateDialog = () => {
    setEditingEmployee(null);
    resetForm();
    setDialogOpen(true);
  };

  // Open dialog for edit
  const openEditDialog = (emp: EmployeeResponseDto) => {
    setEditingEmployee(emp);
    setFormData({
      firstName: emp.firstName,
      lastName: emp.lastName,
      email: emp.email,
      phone: emp.phone || '',
      gender: getGenderNumber(emp.gender),
      dateOfBirth: emp.dateOfBirth?.split('T')[0] || '',
      joiningDate: emp.joiningDate?.split('T')[0] || '',
      departmentId: emp.departmentId.toString(),
      designationId: emp.designationId?.toString() || '',
      reportingManagerId: emp.reportingManagerId?.toString() || '',
      status: getStatusNumber(emp.status),
    });
    setDialogOpen(true);
  };

  // Helper to convert gender string to number
  const getGenderNumber = (gender: string): number => {
    if (gender === 'Male' || gender === '1') return 1;
    if (gender === 'Female' || gender === '2') return 2;
    return 3;
  };

  // Helper to convert status string to number
  const getStatusNumber = (status: string): number => {
    if (status === 'Active' || status === '1') return 1;
    if (status === 'Inactive' || status === '2') return 2;
    return 3; // OnLeave
  };

  // Helper to convert status number to string
  const getStatusString = (status: number): string => {
    if (status === 1) return 'Active';
    if (status === 2) return 'Inactive';
    return 'OnLeave';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.departmentId || !formData.dateOfBirth) {
      toast({ title: 'Error', description: 'Please fill all required fields', variant: 'destructive' });
      return;
    }

    try {
      setSaving(true);
      
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
        // Update existing employee
        await employeeService.update(editingEmployee.id, data as UpdateEmployeeDto);
        toast({ title: 'Success', description: 'Employee updated successfully' });
      } else {
        // Create new employee
        await employeeService.create(data as CreateEmployeeDto);
        toast({ title: 'Success', description: 'Employee created successfully' });
      }
      
      setDialogOpen(false);
      resetForm();
      fetchData();
    } catch (err: any) {
      console.error('Error saving employee:', err);
      toast({ 
        title: 'Error', 
        description: err.response?.data?.message || err.message || 'Failed to save employee', 
        variant: 'destructive' 
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (emp: EmployeeResponseDto) => {
    if (!confirm(`Are you sure you want to delete ${emp.firstName} ${emp.lastName}?`)) {
      return;
    }

    try {
      await employeeService.delete(emp.id);
      toast({ title: 'Success', description: 'Employee deleted successfully' });
      fetchData();
    } catch (err: any) {
      console.error('Error deleting employee:', err);
      toast({ 
        title: 'Error', 
        description: err.response?.data?.message || 'Failed to delete employee', 
        variant: 'destructive' 
      });
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      gender: 1,
      dateOfBirth: '',
      joiningDate: new Date().toISOString().split('T')[0],
      departmentId: '',
      designationId: '',
      reportingManagerId: '',
      status: 1,
    });
  };

  const filtered = employees.filter((e) => {
    const fullName = `${e.firstName} ${e.lastName}`.toLowerCase();
    const matchSearch = fullName.includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      (e.employeeCode || '').toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === 'all' || e.departmentId.toString() === deptFilter;
    const matchStatus = statusFilter === 'all' || e.status === statusFilter;
    return matchSearch && matchDept && matchStatus;
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Employees" description={`${employees.length} total employees`}>
        {isAdmin && (
          <Button onClick={openCreateDialog} className="gradient-primary border-0 text-white">
            <Plus className="w-4 h-4 mr-1" /> Add Employee
          </Button>
        )}
      </PageHeader>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingEmployee ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            {/* Personal Information */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Personal Information</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input 
                  id="firstName" 
                  placeholder="John" 
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input 
                  id="lastName" 
                  placeholder="Doe" 
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="john@company.com" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone" 
                  placeholder="+1-555-0100" 
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select 
                  value={String(formData.gender)} 
                  onValueChange={(val) => setFormData({ ...formData, gender: parseInt(val) })}
                >
                  <SelectTrigger id="gender">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Male</SelectItem>
                    <SelectItem value="2">Female</SelectItem>
                    <SelectItem value="3">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input 
                  id="dateOfBirth" 
                  type="date" 
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Employment Information */}
            <div className="space-y-2 pt-4 border-t">
              <h3 className="text-sm font-medium text-muted-foreground">Employment Information</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Select 
                  value={formData.departmentId} 
                  onValueChange={(val) => setFormData({ ...formData, departmentId: val })}
                >
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(d => (
                      <SelectItem key={d.id} value={d.id.toString()}>{d.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Select 
                  value={formData.designationId} 
                  onValueChange={(val) => setFormData({ ...formData, designationId: val })}
                >
                  <SelectTrigger id="designation">
                    <SelectValue placeholder="Select designation" />
                  </SelectTrigger>
                  <SelectContent>
                    {designations
                      .filter(d => !formData.departmentId || d.departmentId.toString() === formData.departmentId)
                      .map(d => (
                        <SelectItem key={d.id} value={d.id.toString()}>{d.title}</SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="joiningDate">Joining Date</Label>
                <Input 
                  id="joiningDate" 
                  type="date" 
                  value={formData.joiningDate}
                  onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                />
              </div>
              {editingEmployee && (
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={String(formData.status)} 
                    onValueChange={(val) => setFormData({ ...formData, status: parseInt(val) })}
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Active</SelectItem>
                      <SelectItem value="2">Inactive</SelectItem>
                      <SelectItem value="3">On Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="reportingManager">Reporting Manager</Label>
              <Select 
                value={formData.reportingManagerId} 
                onValueChange={(val) => setFormData({ ...formData, reportingManagerId: val })}
              >
                <SelectTrigger id="reportingManager">
                  <SelectValue placeholder="Select manager" />
                </SelectTrigger>
                <SelectContent>
                  {employees
                    .filter(e => !editingEmployee || e.id !== editingEmployee.id)
                    .map(e => (
                      <SelectItem key={e.id} value={e.id.toString()}>{e.firstName} {e.lastName}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              type="submit" 
              className="w-full gradient-primary border-0 text-white" 
              disabled={saving}
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {saving ? 'Saving...' : editingEmployee ? 'Update Employee' : 'Create Employee'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Filters */}
      <Card className="glass-card border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search employees..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-muted/50 border-0" />
            </div>
            <Select value={deptFilter} onValueChange={setDeptFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-muted/50 border-0"><SelectValue placeholder="Department" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(d => <SelectItem key={d.id} value={d.id.toString()}>{d.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40 bg-muted/50 border-0"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="OnLeave">On Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center h-64">Loading...</div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <Card className="glass-card border-border/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead>Employee</TableHead>
                  <TableHead className="hidden md:table-cell">Department</TableHead>
                  <TableHead className="hidden lg:table-cell">Designation</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No employees found
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((emp) => (
                    <TableRow key={emp.id} className="group">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {emp.firstName[0]}{emp.lastName[0]}
                          </div>
                          <div>
                            <p className="font-medium text-foreground text-sm">{emp.firstName} {emp.lastName}</p>
                            <p className="text-xs text-muted-foreground">{emp.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{emp.departmentName}</TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{emp.designationTitle || '-'}</TableCell>
                      <TableCell><StatusBadge status={emp.status as any} /></TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link to={`/employees/${emp.id}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="w-4 h-4" /></Button>
                          </Link>
                          {isAdmin && (
                            <>
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(emp)}>
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(emp)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default EmployeesPage;
