import { useState, useEffect, useCallback } from 'react';
import { Building2, Briefcase, Trash2, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageHeader from '@/components/common/PageHeader';
import DepartmentsTab from '@/components/organization/DepartmentsTab';
import DesignationsTab from '@/components/organization/DesignationsTab';
import DeletedTab from '@/components/organization/DeletedTab';
import { departmentService, designationService } from '@/services';
import type { DepartmentResponseDto, DesignationResponseDto } from '@/types/backend';
import { useToast } from '@/hooks/use-toast';

const OrganizationPage = () => {
    const { toast } = useToast();

    // ── All data lives here — passed down as props ────────────────
    const [departments, setDepartments] = useState<DepartmentResponseDto[]>([]);
    const [deletedDepartments, setDeletedDepartments] = useState<DepartmentResponseDto[]>([]);
    const [designations, setDesignations] = useState<DesignationResponseDto[]>([]);
    const [deletedDesignations, setDeletedDesignations] = useState<DesignationResponseDto[]>([]);
    const [loading, setLoading] = useState(true);

    // ── Single fetch function — children call onRefresh() ─────────
    const fetchAll = useCallback(async () => {
        try {
            setLoading(true);
            const [deptData, deletedDeptData, desigData, deletedDesigData] = await Promise.all([
                departmentService.getAll(),
                departmentService.getDeleted(),
                designationService.getAll(),
                designationService.getAllDeleted(),
            ]);
            // ✅ FIX: .data nikalo — getAll PaginatedResult return karta hai
            setDepartments(Array.isArray(deptData?.data) ? deptData.data : []);
            setDeletedDepartments(Array.isArray(deletedDeptData) ? deletedDeptData : []);
            setDesignations(Array.isArray(desigData?.data) ? desigData.data : []);
            setDeletedDesignations(Array.isArray(deletedDesigData) ? deletedDesigData : []);
        } catch (err: any) {
            console.error('[OrganizationPage] Fetch error:', err);
            toast({
                title: 'Error',
                description: 'Failed to load organization data',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    const totalDeleted = deletedDepartments.length + deletedDesignations.length;

    return (
        <div className="space-y-6">
            <PageHeader
                title="Organization"
                description="Manage departments, designations and your company structure."
            />

            <Tabs defaultValue="departments">
                <TabsList className="bg-muted/50">
                    {/* Departments Tab */}
                    <TabsTrigger value="departments" className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        Departments
                        {departments.length > 0 && (
                            <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                                {departments.length}
                            </span>
                        )}
                    </TabsTrigger>

                    {/* Designations Tab */}
                    <TabsTrigger value="designations" className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        Designations
                        {designations.length > 0 && (
                            <span className="text-xs bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded-full">
                                {designations.length}
                            </span>
                        )}
                    </TabsTrigger>

                    {/* Deleted Tab */}
                    <TabsTrigger value="deleted" className="flex items-center gap-2">
                        <Trash2 className="w-4 h-4" />
                        Deleted
                        {totalDeleted > 0 && (
                            <span className="text-xs bg-destructive/10 text-destructive px-1.5 py-0.5 rounded-full">
                                {totalDeleted}
                            </span>
                        )}
                    </TabsTrigger>
                </TabsList>

                {/* Each tab gets its own isolated component */}
                <TabsContent value="departments" className="mt-4">
                    <DepartmentsTab
                        departments={departments}
                        loading={loading}
                        onRefresh={fetchAll}
                    />
                </TabsContent>

                <TabsContent value="designations" className="mt-4">
                    <DesignationsTab
                        designations={designations}
                        departments={departments}
                        loading={loading}
                        onRefresh={fetchAll}
                    />
                </TabsContent>

                <TabsContent value="deleted" className="mt-4">
                    <DeletedTab
                        deletedDepartments={deletedDepartments}
                        deletedDesignations={deletedDesignations}
                        loading={loading}
                        onRefresh={fetchAll}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default OrganizationPage;