import { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Pencil, Loader2, Trash2, Plus } from 'lucide-react';
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
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue
} from '@/components/ui/select';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { designationService } from '@/services';
import type {
    DepartmentResponseDto,
    DesignationResponseDto,
    CreateDesignationDto
} from '@/types/backend';

interface DesignationsTabProps {
    designations: DesignationResponseDto[];
    departments: DepartmentResponseDto[];
    loading: boolean;
    onRefresh: () => void;
}

const DesignationsTab = ({
    designations,
    departments,
    loading,
    onRefresh
}: DesignationsTabProps) => {
    const { toast } = useToast();

    // ── Form State ───────────────────────────────────────────────
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<DesignationResponseDto | null>(null);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        departmentId: '' as number | string,
        description: '',
    });

    // ── Delete State ─────────────────────────────────────────────
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleting, setDeleting] = useState<DesignationResponseDto | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // ── Dialog Handlers ──────────────────────────────────────────
    const openCreateDialog = () => {
        setEditing(null);
        setFormData({ title: '', departmentId: '', description: '' });
        setDialogOpen(true);
    };

    const openEditDialog = (desig: DesignationResponseDto) => {
        setEditing(desig);
        setFormData({
            title: desig.title,
            departmentId: desig.departmentId,
            description: desig.description || '',
        });
        setDialogOpen(true);
    };

    // ── Save Handler ─────────────────────────────────────────────
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            toast({
                title: 'Validation Error',
                description: 'Designation title is required',
                variant: 'destructive'
            });
            return;
        }
        if (!formData.departmentId) {
            toast({
                title: 'Validation Error',
                description: 'Please select a department',
                variant: 'destructive'
            });
            return;
        }

        setSaving(true);
        try {
            const data: CreateDesignationDto = {
                title: formData.title,
                departmentId: Number(formData.departmentId),
                description: formData.description || undefined,
            };

            if (editing) {
                await designationService.update(editing.id, data);
                toast({ title: 'Success', description: 'Designation updated successfully' });
            } else {
                await designationService.create(data);
                toast({ title: 'Success', description: 'Designation created successfully' });
            }
            setDialogOpen(false);
            setEditing(null);
            onRefresh();
        } catch (err: any) {
            toast({
                title: 'Error',
                description: err.response?.data?.message || 'Failed to save designation',
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
            await designationService.delete(deleting.id);
            toast({
                title: 'Success',
                description: `"${deleting.title}" moved to deleted. Restore from the Deleted tab.`
            });
            setDeleteDialogOpen(false);
            setDeleting(null);
            onRefresh();
        } catch (err: any) {
            toast({
                title: 'Error',
                description: err.response?.data?.message || 'Failed to delete designation',
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
                    {designations.length} designation{designations.length !== 1 ? 's' : ''} total
                </p>
                <Button variant="outline" onClick={openCreateDialog}>
                    <Plus className="w-4 h-4 mr-1" /> Add Designation
                </Button>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : designations.length === 0 ? (
                <div className="text-center text-muted-foreground p-12 border border-dashed border-border rounded-xl">
                    <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No designations yet</p>
                    <p className="text-xs mt-1">Click "Add Designation" to create one</p>
                </div>
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
                                                variant="ghost" size="icon"
                                                className="h-8 w-8 hover:bg-primary/10"
                                                onClick={() => openEditDialog(desig)}
                                            >
                                                <Pencil className="w-4 h-4 text-primary" />
                                            </Button>
                                            <Button
                                                variant="ghost" size="icon"
                                                className="h-8 w-8 hover:bg-destructive/10"
                                                onClick={() => {
                                                    setDeleting(desig);
                                                    setDeleteDialogOpen(true);
                                                }}
                                            >
                                                <Trash2 className="w-4 h-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="font-semibold text-lg text-foreground">
                                            {desig.title}
                                        </h3>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-xs bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full font-medium">
                                                {desig.departmentName || 'No Department'}
                                            </span>
                                        </div>
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

            {/* Create/Edit Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editing ? 'Edit Designation' : 'Add Designation'}
                        </DialogTitle>
                        <DialogDescription>
                            {editing
                                ? 'Update the designation details below.'
                                : 'Fill in the details to create a new designation.'
                            }
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSave} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="desig-title">Title *</Label>
                            <Input
                                id="desig-title"
                                placeholder="e.g. Senior Engineer"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="desig-dept">Department *</Label>
                            <Select
                                value={String(formData.departmentId)}
                                onValueChange={(val) => setFormData({ ...formData, departmentId: val })}
                            >
                                <SelectTrigger id="desig-dept">
                                    <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                                <SelectContent>
                                    {departments.map(dept => (
                                        <SelectItem key={dept.id} value={String(dept.id)}>
                                            {dept.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="desig-desc">Description</Label>
                            <Textarea
                                id="desig-desc"
                                placeholder="Brief description (optional)"
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
                            {saving ? 'Saving...' : (editing ? 'Update Designation' : 'Create Designation')}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirm Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Designation?</AlertDialogTitle>
                        <AlertDialogDescription>
                            <strong>"{deleting?.title}"</strong> will be soft deleted.
                            You can restore it from the <strong>Deleted</strong> tab within 12 months.
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

export default DesignationsTab;