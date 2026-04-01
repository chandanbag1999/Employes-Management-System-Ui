import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Users, Pencil, Loader2, Trash2, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Dialog, DialogContent,
    DialogHeader, DialogTitle, DialogDescription
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { departmentService } from '@/services';
import type {
    DepartmentResponseDto,
    CreateDepartmentDto,
    UpdateDepartmentDto
} from '@/types/backend';

interface DepartmentsTabProps {
    departments: DepartmentResponseDto[];
    loading: boolean;
    onRefresh: () => void;
}

const DepartmentsTab = ({ departments, loading, onRefresh }: DepartmentsTabProps) => {
    const { toast } = useToast();

    // ── Form State ───────────────────────────────────────────────
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<DepartmentResponseDto | null>(null);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '', description: '', code: ''
    });

    // ── Delete State ─────────────────────────────────────────────
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleting, setDeleting] = useState<DepartmentResponseDto | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // ── Dialog Handlers ──────────────────────────────────────────
    const openCreateDialog = () => {
        setEditing(null);
        setFormData({ name: '', description: '', code: '' });
        setDialogOpen(true);
    };

    const openEditDialog = (dept: DepartmentResponseDto) => {
        setEditing(dept);
        setFormData({
            name: dept.name,
            description: dept.description || '',
            code: dept.code || '',
        });
        setDialogOpen(true);
    };

    // ── Save Handler ─────────────────────────────────────────────
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            toast({
                title: 'Validation Error',
                description: 'Department name is required',
                variant: 'destructive'
            });
            return;
        }

        setSaving(true);
        try {
            if (editing) {
                const data: UpdateDepartmentDto = {
                    name: formData.name,
                    description: formData.description || undefined,
                    code: formData.code || undefined,
                };
                await departmentService.update(editing.id, data);
                toast({ title: 'Success', description: 'Department updated successfully' });
            } else {
                const data: CreateDepartmentDto = {
                    name: formData.name,
                    description: formData.description || undefined,
                    code: formData.code || undefined,
                };
                await departmentService.create(data);
                toast({ title: 'Success', description: 'Department created successfully' });
            }
            setDialogOpen(false);
            setEditing(null);
            onRefresh();
        } catch (err: any) {
            toast({
                title: 'Error',
                description: err.response?.data?.message || 'Failed to save department',
                variant: 'destructive'
            });
        } finally {
            setSaving(false);
        }
    };

    // ── Delete Handler ───────────────────────────────────────────
    const handleDelete = async () => {
        if (!deleting) return;
        setIsDeleting(true);
        try {
            await departmentService.delete(deleting.id);
            toast({
                title: 'Success',
                description: `"${deleting.name}" moved to deleted. Restore it from the Deleted tab.`
            });
            setDeleteDialogOpen(false);
            setDeleting(null);
            onRefresh();
        } catch (err: any) {
            toast({
                title: 'Error',
                description: err.response?.data?.message || 'Failed to delete department',
                variant: 'destructive'
            });
        } finally {
            setIsDeleting(false);
        }
    };

    // ── Render ───────────────────────────────────────────────────
    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    {departments.length} department{departments.length !== 1 ? 's' : ''} total
                </p>
                <Button
                    className="gradient-primary border-0 text-white"
                    onClick={openCreateDialog}
                >
                    <Plus className="w-4 h-4 mr-1" /> Add Department
                </Button>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : departments.length === 0 ? (
                <div className="text-center text-muted-foreground p-12 border border-dashed border-border rounded-xl">
                    <Building2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No departments yet</p>
                    <p className="text-xs mt-1">Click "Add Department" to create one</p>
                </div>
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
                                                variant="ghost" size="icon"
                                                className="h-8 w-8 hover:bg-primary/10"
                                                onClick={() => openEditDialog(dept)}
                                            >
                                                <Pencil className="w-4 h-4 text-primary" />
                                            </Button>
                                            <Button
                                                variant="ghost" size="icon"
                                                className="h-8 w-8 hover:bg-destructive/10"
                                                onClick={() => {
                                                    setDeleting(dept);
                                                    setDeleteDialogOpen(true);
                                                }}
                                            >
                                                <Trash2 className="w-4 h-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-lg text-foreground">
                                                {dept.name}
                                            </h3>
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

            {/* Create/Edit Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editing ? 'Edit Department' : 'Add Department'}
                        </DialogTitle>
                        <DialogDescription>
                            {editing
                                ? 'Update the department details below.'
                                : 'Fill in the details to create a new department.'
                            }
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSave} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="dept-name">Name *</Label>
                            <Input
                                id="dept-name"
                                placeholder="e.g. Engineering"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dept-code">Code</Label>
                            <Input
                                id="dept-code"
                                placeholder="e.g. ENG, HR, FIN"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dept-desc">Description</Label>
                            <Textarea
                                id="dept-desc"
                                placeholder="Brief description of this department"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full gradient-primary border-0 text-white"
                            disabled={saving}
                        >
                            {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                            {saving ? 'Saving...' : (editing ? 'Update Department' : 'Create Department')}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirm Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Department?</AlertDialogTitle>
                        <AlertDialogDescription>
                            <strong>"{deleting?.name}"</strong> will be soft deleted.
                            You can restore it from the <strong>Deleted</strong> tab anytime within 12 months.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isDeleting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                            {isDeleting ? 'Deleting...' : 'Move to Deleted'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default DepartmentsTab;