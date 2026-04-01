import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Briefcase, RotateCcw, Loader2, Trash } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { departmentService, designationService } from '@/services';
import type {
    DepartmentResponseDto,
    DesignationResponseDto
} from '@/types/backend';

interface DeletedTabProps {
    deletedDepartments: DepartmentResponseDto[];
    deletedDesignations: DesignationResponseDto[];
    loading: boolean;
    onRefresh: () => void;
}

const DeletedTab = ({
    deletedDepartments,
    deletedDesignations,
    loading,
    onRefresh
}: DeletedTabProps) => {
    const { toast } = useToast();

    // ── Department Restore/Purge State ───────────────────────────
    const [restoringDeptId, setRestoringDeptId] = useState<number | null>(null);
    const [purgingDept, setPurgingDept] = useState(false);
    const [purgeDeptDialogOpen, setPurgeDeptDialogOpen] = useState(false);

    // ── Designation Restore/Purge State ─────────────────────────
    const [restoringDesigId, setRestoringDesigId] = useState<number | null>(null);
    const [purgingDesig, setPurgingDesig] = useState(false);
    const [purgeDesigDialogOpen, setPurgeDesigDialogOpen] = useState(false);

    // ── Department Handlers ──────────────────────────────────────
    const handleRestoreDepartment = async (id: number) => {
        setRestoringDeptId(id);
        try {
            await departmentService.restore(id);
            toast({ title: 'Success', description: 'Department restored successfully' });
            onRefresh();
        } catch (err: any) {
            toast({
                title: 'Error',
                description: err.response?.data?.message || 'Failed to restore department',
                variant: 'destructive'
            });
        } finally {
            setRestoringDeptId(null);
        }
    };

    const handlePurgeDepartments = async () => {
        setPurgingDept(true);
        try {
            const count = await departmentService.purge(12);
            toast({
                title: 'Success',
                description: `Permanently deleted ${count} old department${count !== 1 ? 's' : ''}`
            });
            setPurgeDeptDialogOpen(false);
            onRefresh();
        } catch (err: any) {
            toast({
                title: 'Error',
                description: err.response?.data?.message || 'Failed to purge departments',
                variant: 'destructive'
            });
        } finally {
            setPurgingDept(false);
        }
    };

    // ── Designation Handlers ─────────────────────────────────────
    const handleRestoreDesignation = async (id: number) => {
        setRestoringDesigId(id);
        try {
            await designationService.restore(id);
            toast({ title: 'Success', description: 'Designation restored successfully' });
            onRefresh();
        } catch (err: any) {
            toast({
                title: 'Error',
                description: err.response?.data?.message || 'Failed to restore designation',
                variant: 'destructive'
            });
        } finally {
            setRestoringDesigId(null);
        }
    };

    const handlePurgeDesignations = async () => {
        setPurgingDesig(true);
        try {
            const count = await designationService.purge(12);
            toast({
                title: 'Success',
                description: `Permanently deleted ${count} old designation${count !== 1 ? 's' : ''}`
            });
            setPurgeDesigDialogOpen(false);
            onRefresh();
        } catch (err: any) {
            toast({
                title: 'Error',
                description: err.response?.data?.message || 'Failed to purge designations',
                variant: 'destructive'
            });
        } finally {
            setPurgingDesig(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    const isEmpty = deletedDepartments.length === 0 && deletedDesignations.length === 0;

    if (isEmpty) {
        return (
            <div className="text-center text-muted-foreground p-12 border border-dashed border-border rounded-xl">
                <Trash className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium">Deleted items will appear here</p>
                <p className="text-xs mt-1">Soft deleted departments and designations can be restored within 12 months</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">

            {/* ── Deleted Departments Section ── */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-primary" />
                            Deleted Departments
                            <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                                {deletedDepartments.length}
                            </span>
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Restorable within 12 months of deletion
                        </p>
                    </div>
                    {deletedDepartments.length > 0 && (
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setPurgeDeptDialogOpen(true)}
                        >
                            <Trash className="w-3.5 h-3.5 mr-1" />
                            Purge Old (12+ months)
                        </Button>
                    )}
                </div>

                {deletedDepartments.length === 0 ? (
                    <div className="text-center text-muted-foreground py-6 text-sm border border-dashed border-border rounded-xl">
                        No deleted departments
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {deletedDepartments.map((dept, index) => (
                            <motion.div
                                key={dept.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card className="glass-card border-destructive/20 bg-destructive/5">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-white shadow-lg opacity-80">
                                                <Building2 className="w-6 h-6" />
                                            </div>
                                            <Button
                                                variant="ghost" size="icon"
                                                className="h-8 w-8 hover:bg-green-500/10"
                                                onClick={() => handleRestoreDepartment(dept.id)}
                                                disabled={restoringDeptId === dept.id}
                                                title="Restore department"
                                            >
                                                {restoringDeptId === dept.id
                                                    ? <Loader2 className="w-4 h-4 text-green-600 animate-spin" />
                                                    : <RotateCcw className="w-4 h-4 text-green-600" />
                                                }
                                            </Button>
                                        </div>
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold text-foreground line-through opacity-60">
                                                    {dept.name}
                                                </h3>
                                                <span className="text-[10px] bg-red-500/10 text-red-600 px-1.5 py-0.5 rounded-full font-medium uppercase">
                                                    Deleted
                                                </span>
                                            </div>
                                            {dept.code && (
                                                <p className="text-xs text-muted-foreground">
                                                    Code: {dept.code}
                                                </p>
                                            )}
                                            <p className="text-xs text-muted-foreground line-clamp-2">
                                                {dept.description || 'No description'}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Divider */}
            <div className="border-t border-border/50" />

            {/* ── Deleted Designations Section ── */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-emerald-600" />
                            Deleted Designations
                            <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                                {deletedDesignations.length}
                            </span>
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Restorable within 12 months of deletion
                        </p>
                    </div>
                    {deletedDesignations.length > 0 && (
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setPurgeDesigDialogOpen(true)}
                        >
                            <Trash className="w-3.5 h-3.5 mr-1" />
                            Purge Old (12+ months)
                        </Button>
                    )}
                </div>

                {deletedDesignations.length === 0 ? (
                    <div className="text-center text-muted-foreground py-6 text-sm border border-dashed border-border rounded-xl">
                        No deleted designations
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {deletedDesignations.map((desig, index) => (
                            <motion.div
                                key={desig.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card className="glass-card border-destructive/20 bg-destructive/5">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-white shadow-lg opacity-80">
                                                <Briefcase className="w-6 h-6" />
                                            </div>
                                            <Button
                                                variant="ghost" size="icon"
                                                className="h-8 w-8 hover:bg-green-500/10"
                                                onClick={() => handleRestoreDesignation(desig.id)}
                                                disabled={restoringDesigId === desig.id}
                                                title="Restore designation"
                                            >
                                                {restoringDesigId === desig.id
                                                    ? <Loader2 className="w-4 h-4 text-green-600 animate-spin" />
                                                    : <RotateCcw className="w-4 h-4 text-green-600" />
                                                }
                                            </Button>
                                        </div>
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold text-foreground line-through opacity-60">
                                                    {desig.title}
                                                </h3>
                                                <span className="text-[10px] bg-red-500/10 text-red-600 px-1.5 py-0.5 rounded-full font-medium uppercase">
                                                    Deleted
                                                </span>
                                            </div>
                                            <span className="text-xs bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full font-medium">
                                                {desig.departmentName || 'No Department'}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Purge Confirm Dialogs ── */}
            <AlertDialog open={purgeDeptDialogOpen} onOpenChange={setPurgeDeptDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Purge Old Deleted Departments?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will <strong>permanently delete</strong> all departments
                            that have been in trash for more than 12 months.
                            <br /><br />
                            <strong>This action cannot be undone.</strong>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handlePurgeDepartments}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {purgingDept && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                            {purgingDept ? 'Purging...' : 'Purge Permanently'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={purgeDesigDialogOpen} onOpenChange={setPurgeDesigDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Purge Old Deleted Designations?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will <strong>permanently delete</strong> all designations
                            that have been in trash for more than 12 months.
                            <br /><br />
                            <strong>This action cannot be undone.</strong>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handlePurgeDesignations}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {purgingDesig && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                            {purgingDesig ? 'Purging...' : 'Purge Permanently'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default DeletedTab;