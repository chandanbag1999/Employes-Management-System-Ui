import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Plus, Users, Pencil } from 'lucide-react';
import { departmentService, designationService } from '@/services';
import type { DepartmentResponseDto, DesignationResponseDto } from '@/types/backend';

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState<DepartmentResponseDto[]>([]);
  const [designations, setDesignations] = useState<DesignationResponseDto[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch department and designation data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [deptData, desigData] = await Promise.all([
          departmentService.getAll(),
          designationService.getAll()
        ]);
        setDepartments(deptData || []);
        setDesignations(desigData || []);
      } catch (err) {
        console.error('Error fetching departments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Departments & Designations" description="Manage organizational structure.">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gradient-primary border-0 text-white"><Plus className="w-4 h-4 mr-1" /> Add Department</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Department</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2"><Label>Name</Label><Input placeholder="Department name" /></div>
              <div className="space-y-2"><Label>Description</Label><Textarea placeholder="Brief description" /></div>
            </div>
            <Button className="w-full gradient-primary border-0 text-white">Save</Button>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <Tabs defaultValue="departments">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="designations">Designations</TabsTrigger>
        </TabsList>

        <TabsContent value="departments" className="mt-4">
          {loading ? (
            <div className="text-center text-muted-foreground p-8">Loading...</div>
          ) : departments.length === 0 ? (
            <div className="text-center text-muted-foreground p-8">No departments found</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {departments.map(dept => (
                <motion.div key={dept.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  <Card className="glass-card border-border/50 group">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center text-white">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">{dept.name}</h3>
                      <p className="text-xs text-muted-foreground mb-3">{dept.description || 'No description'}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground"><Users className="w-3.5 h-3.5" />{dept.employeeCount || 0} people</span>
                        {dept.headName && <span className="text-xs text-muted-foreground">Head: {dept.headName}</span>}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="designations" className="mt-4">
          {loading ? (
            <div className="text-center text-muted-foreground p-8">Loading...</div>
          ) : designations.length === 0 ? (
            <div className="text-center text-muted-foreground p-8">No designations found</div>
          ) : (
            <Card className="glass-card border-border/50 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead>Designation</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {designations.map(des => (
                    <TableRow key={des.id}>
                      <TableCell className="font-medium text-sm">{des.title}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{des.departmentName || 'N/A'}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">L{des.level}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="w-4 h-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DepartmentsPage;
