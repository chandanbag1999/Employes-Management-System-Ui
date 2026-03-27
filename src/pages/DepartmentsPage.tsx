import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Users, Pencil, Loader2, Trash2, Briefcase, Plus, RotateCcw, Trash } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { departmentService, designationService } from '@/services';
import type { DepartmentResponseDto, DesignationResponseDto, CreateDepartmentDto, UpdateDepartmentDto, CreateDesignationDto } from '@/types/backend';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const DepartmentsPage = () => {
  const { toast } = useToast();
  const [departments, setDepartments] = useState<DepartmentResponseDto[]>([]);
  const [designations, setDesignations] = useState<DesignationResponseDto[]>([]);
  const [deletedDesignations, setDeletedDesignations] = useState<DesignationResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Department form state
  const [savingDept, setSavingDept] = useState(false);
  const [deptDialogOpen, setDeptDialogOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<DepartmentResponseDto | null>(null);
  const [deptFormData, setDeptFormData] = useState({ name: '', description: '', code: '', isActive: true });

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingDept, setDeletingDept] = useState<DepartmentResponseDto | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Designation form state - MATCHES BACKEND: Title, Description, DepartmentId
  const [savingDesig, setSavingDesig] = useState(false);
  const [desigDialogOpen, setDesigDialogOpen] = useState(false);
  const [editingDesig, setEditingDesig] = useState<DesignationResponseDto | null>(null);
  const [desigFormData, setDesigFormData] = useState({ 
    title: '', 
    departmentId: '' as number | string, 
    description: '' 
  });
  const [deletingDesig, setDeletingDesig] = useState<DesignationResponseDto | null>(null);
  const [desigDeleteDialogOpen, setDesigDeleteDialogOpen] = useState(false);

  // Restore and Purge state
  const [restoringId, setRestoringId] = useState<number | null>(null);
  const [purging, setPurging] = useState(false);
  const [purgeDialogOpen, setPurgeDialogOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

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
    } catch (err: any) {
      console.error('Error fetching data:', err);
      toast({ title: 'Error', description: 'Failed to load data', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  // Department handlers
  const openEditDialog = (dept: DepartmentResponseDto) => {
    setEditingDept(dept);
    setDeptFormData({
      name: dept.name,
      description: dept.description || '',
      code: dept.code || '',
      isActive: dept.isActive ?? true,
    });
    setDeptDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingDept(null);
    setDeptFormData({ name: '', description: '', code: '', isActive: true });
    setDeptDialogOpen(true);
  };

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
      setDeptFormData({ name: '', description: '', code: '', isActive: true });
      setDeptDialogOpen(false);
      setEditingDept(null);
      fetchData();
    } catch (err: any) {
      console.error('Error creating department:', err);
      toast({ 
        title: 'Error', 
        description: err.response?.data?.message || 'Failed to create department', 
        variant: 'destructive' 
      });
    } finally {
      setSavingDept(false);
    }
  };

  const handleUpdateDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDept) return;
    if (!deptFormData.name.trim()) {
      toast({ title: 'Error', description: 'Department name is required', variant: 'destructive' });
      return;
    }

    try {
      setSavingDept(true);
      const data: UpdateDepartmentDto = {
        name: deptFormData.name,
        description: deptFormData.description || undefined,
        code: deptFormData.code || undefined,
      };
      
      await departmentService.update(editingDept.id, data);
      
      toast({ title: 'Success', description: 'Department updated successfully' });
      setDeptFormData({ name: '', description: '', code: '', isActive: true });
      setDeptDialogOpen(false);
      setEditingDept(null);
      fetchData();
    } catch (err: any) {
      console.error('Error updating department:', err);
      toast({ 
        title: 'Error', 
        description: err.response?.data?.message || 'Failed to update department', 
        variant: 'destructive' 
      });
    } finally {
      setSavingDept(false);
    }
  };

  const handleDeleteDepartment = async () => {
    if (!deletingDept) return;

    try {
      setDeleting(true);
      await departmentService.delete(deletingDept.id);
      toast({ title: 'Success', description: 'Department deleted successfully' });
      setDeleteDialogOpen(false);
      setDeletingDept(null);
      fetchData();
    } catch (err: any) {
      console.error('Error deleting department:', err);
      toast({ 
        title: 'Error', 
        description: err.response?.data?.message || 'Failed to delete department', 
        variant: 'destructive' 
      });
    } finally {
      setDeleting(false);
    }
  };

  // Designation handlers - MATCHES BACKEND
  const openCreateDesigDialog = () => {
    setEditingDesig(null);
    setDesigFormData({ title: '', departmentId: '', description: '' });
    setDesigDialogOpen(true);
  };

  const openEditDesigDialog = (desig: DesignationResponseDto) => {
    setEditingDesig(desig);
    setDesigFormData({
      title: desig.title,
      departmentId: desig.departmentId,
      description: desig.description || '',
    });
    setDesigDialogOpen(true);
  };

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
      setDesigFormData({ title: '', departmentId: '', description: '' });
      setDesigDialogOpen(false);
      setEditingDesig(null);
      fetchData();
    } catch (err: any) {
      console.error('Error creating designation:', err);
      toast({ 
        title: 'Error', 
        description: err.response?.data?.message || err.message || 'Failed to create designation', 
        variant: 'destructive' 
      });
    } finally {
      setSavingDesig(false);
    }
  };

  const handleUpdateDesignation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDesig) return;
    
    if (!desigFormData.title.trim()) {
      toast({ title: 'Error', description: 'Designation title is required', variant: 'destructive' });
      return;
    }

    try {
      setSavingDesig(true);
      const data: CreateDesignationDto = {
        title: desigFormData.title,
        departmentId: Number(desigFormData.departmentId),
      };
      
      await designationService.update(editingDesig.id, data);
      
      toast({ title: 'Success', description: 'Designation updated successfully' });
      setDesigDialogOpen(false);
      setEditingDesig(null);
      fetchData();
    } catch (err: any) {
      console.error('Error updating designation:', err);
      toast({ 
        title: 'Error', 
        description: err.response?.data?.message || 'Failed to update designation', 
        variant: 'destructive' 
      });
    } finally {
      setSavingDesig(false);
    }
  };

  const handleDeleteDesignation = async () => {
    if (!deletingDesig) return;
    
    try {
      await designationService.delete(deletingDesig.id);
      toast({ title: 'Success', description: 'Designation deleted successfully' });
      setDesigDeleteDialogOpen(false);
      setDeletingDesig(null);
      fetchData();
    } catch (err: any) {
      console.error('Error deleting designation:', err);
      toast({ 
        title: 'Error', 
        description: err.response?.data?.message || 'Failed to delete designation', 
        variant: 'destructive' 
      });
    }
  };

  // Restore and Purge handlers
  const handleRestoreDesignation = async (id: number) => {
    try {
      setRestoringId(id);
      await designationService.restore(id);
      toast({ title: 'Success', description: 'Designation restored successfully' });
      fetchData();
    } catch (err: any) {
      console.error('Error restoring designation:', err);
      toast({ 
        title: 'Error', 
        description: err.response?.data?.message || 'Failed to restore designation', 
        variant: 'destructive' 
      });
    } finally {
      setRestoringId(null);
    }
  };

  const handlePurgeOld = async () => {
    try {
      setPurging(true);
      const count = await designationService.purge(12);
      toast({ title: 'Success', description: `Purged ${count} old deleted designations` });
      setPurgeDialogOpen(false);
      fetchData();
    } catch (err: any) {
      console.error('Error purging designations:', err);
      toast({ 
        title: 'Error', 
        description: err.response?.data?.message || 'Failed to purge designations', 
        variant: 'destructive' 
      });
    } finally {
      setPurging(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Organization" description="Manage departments, designations and structure.">
        <div className="flex gap-2">
          <Button className="gradient-primary border-0 text-white" onClick={openCreateDialog}>
            <Plus className="w-4 h-4 mr-1" /> Add Department
          </Button>

          <Button variant="outline" onClick={openCreateDesigDialog}>
            <Plus className="w-4 h-4 mr-1" /> Add Designation
          </Button>
        </div>
      </PageHeader>

      <Tabs defaultValue="departments">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="designations">Designations</TabsTrigger>
          <TabsTrigger value="deleted">Deleted ({deletedDesignations.length})</TabsTrigger>
        </TabsList>

        {/* Departments Grid */}
        <TabsContent value="departments" className="mt-4">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : departments.length === 0 ? (
            <div className="text-center text-muted-foreground p-8">No departments found</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {departments.map((dept, index) => (
                <motion.div
                  key={dept.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="glass-card border-border/50 group hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-white shadow-lg">
                          <Building2 className="w-6 h-6" />
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 hover:bg-primary/10"
                            onClick={() => openEditDialog(dept)}
                          >
                            <Pencil className="w-4 h-4 text-primary" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 hover:bg-destructive/10"
                            onClick={() => { setDeletingDept(dept); setDeleteDialogOpen(true); }}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg text-foreground">{dept.name}</h3>
                          {dept.code && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                              {dept.code}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {dept.description || 'No description provided'}
                        </p>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Users className="w-4 h-4" />
                          <span>{dept.employeeCount || 0} employees</span>
                        </div>
                        {dept.headName && (
                          <span className="text-xs text-muted-foreground">
                            Head: {dept.headName}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Designations Grid */}
        <TabsContent value="designations" className="mt-4">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : designations.length === 0 ? (
            <div className="text-center text-muted-foreground p-8">No designations found</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {designations.map((desig, index) => (
                <motion.div
                  key={desig.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="glass-card border-border/50 group hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg">
                          <Briefcase className="w-6 h-6" />
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 hover:bg-primary/10"
                            onClick={() => openEditDesigDialog(desig)}
                          >
                            <Pencil className="w-4 h-4 text-primary" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 hover:bg-destructive/10"
                            onClick={() => { setDeletingDesig(desig); setDesigDeleteDialogOpen(true); }}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg text-foreground">{desig.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Department: <span className="text-foreground font-medium">{desig.departmentName || 'N/A'}</span>
                        </p>
                        {desig.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {desig.description}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Deleted Designations Tab */}
        <TabsContent value="deleted" className="mt-4">
          <div className="mb-4 flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Deleted designations can be restored within 12 months.
            </p>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => setPurgeDialogOpen(true)}
              disabled={deletedDesignations.length === 0}
            >
              <Trash className="w-4 h-4 mr-1" /> Purge Old (12+ months)
            </Button>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : deletedDesignations.length === 0 ? (
            <div className="text-center text-muted-foreground p-8">No deleted designations</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {deletedDesignations.map((desig, index) => (
                <motion.div
                  key={desig.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="glass-card border-border/50 bg-destructive/5 group hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-white shadow-lg">
                          <Briefcase className="w-6 h-6" />
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 hover:bg-green-500/10"
                          onClick={() => handleRestoreDesignation(desig.id)}
                          disabled={restoringId === desig.id}
                        >
                          {restoringId === desig.id ? (
                            <Loader2 className="w-4 h-4 text-green-600 animate-spin" />
                          ) : (
                            <RotateCcw className="w-4 h-4 text-green-600" />
                          )}
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg text-foreground line-through opacity-70">{desig.title}</h3>
                          <span className="text-xs bg-red-500/10 text-red-600 px-2 py-0.5 rounded-full font-medium">
                            DELETED
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Department: <span className="text-foreground font-medium">{desig.departmentName || 'N/A'}</span>
                        </p>
                        {desig.createdAt && (
                          <p className="text-xs text-muted-foreground">
                            Deleted: {new Date(desig.createdAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Department Create/Edit Dialog */}
      <Dialog open={deptDialogOpen} onOpenChange={setDeptDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingDept ? 'Edit Department' : 'Add Department'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={editingDept ? handleUpdateDepartment : handleCreateDepartment} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="dept-name">Name *</Label>
              <Input 
                id="dept-name" 
                placeholder="Department name" 
                value={deptFormData.name}
                onChange={(e) => setDeptFormData({ ...deptFormData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dept-code">Code</Label>
              <Input 
                id="dept-code" 
                placeholder="e.g. ENG, HR" 
                value={deptFormData.code}
                onChange={(e) => setDeptFormData({ ...deptFormData, code: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dept-desc">Description</Label>
              <Textarea 
                id="dept-desc" 
                placeholder="Brief description" 
                value={deptFormData.description}
                onChange={(e) => setDeptFormData({ ...deptFormData, description: e.target.value })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="dept-active">Active Status</Label>
                <p className="text-sm text-muted-foreground">Set whether department is active</p>
              </div>
              <Switch
                id="dept-active"
                checked={deptFormData.isActive}
                onCheckedChange={(checked) => setDeptFormData({ ...deptFormData, isActive: checked })}
              />
            </div>
            <Button
              type="submit" 
              className="w-full gradient-primary border-0 text-white" 
              disabled={savingDept}
            >
              {savingDept ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {savingDept ? 'Saving...' : (editingDept ? 'Update Department' : 'Save Department')}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Designation Create/Edit Dialog - MATCHES BACKEND ENTITY */}
      <Dialog open={desigDialogOpen} onOpenChange={setDesigDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingDesig ? 'Edit Designation' : 'Add Designation'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={editingDesig ? handleUpdateDesignation : handleCreateDesignation} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="desig-title">Title *</Label>
              <Input 
                id="desig-title" 
                placeholder="Designation title" 
                value={desigFormData.title}
                onChange={(e) => setDesigFormData({ ...desigFormData, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="desig-dept">Department *</Label>
              <Select 
                value={String(desigFormData.departmentId)} 
                onValueChange={(val) => setDesigFormData({ ...desigFormData, departmentId: val })}
              >
                <SelectTrigger id="desig-dept">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(dept => (
                    <SelectItem key={dept.id} value={String(dept.id)}>{dept.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="desig-desc">Description</Label>
              <Textarea 
                id="desig-desc" 
                placeholder="Brief description (optional)" 
                value={desigFormData.description}
                onChange={(e) => setDesigFormData({ ...desigFormData, description: e.target.value })}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full gradient-primary border-0 text-white" 
              disabled={savingDesig}
            >
              {savingDesig ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {savingDesig ? 'Saving...' : (editingDesig ? 'Update Designation' : 'Save Designation')}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Department Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete "{deletingDept?.name}". You can restore it later from the Deleted tab.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDepartment} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {deleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Designation Delete Confirmation Dialog */}
      <AlertDialog open={desigDeleteDialogOpen} onOpenChange={setDesigDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete "{deletingDesig?.title}". You can restore it later from the Deleted tab.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDesignation} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Purge Confirmation Dialog */}
      <AlertDialog open={purgeDialogOpen} onOpenChange={setPurgeDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Purge Old Deleted Designations?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all designations that have been in trash for more than 12 months. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePurgeOld} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {purging ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {purging ? 'Purging...' : 'Purge Old'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DepartmentsPage;
