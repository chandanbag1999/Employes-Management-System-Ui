import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatusBadge from '@/components/common/StatusBadge';
import { Mail, Phone, Building2, Calendar, DollarSign } from 'lucide-react';
import { employeeService } from '@/services';
import type { EmployeeResponseDto } from '@/types/backend';

const EmployeeProfile = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState<EmployeeResponseDto | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch employee data from API
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

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </motion.div>
    );
  }

  if (!employee) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Employee not found</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Profile Header */}
      <Card className="glass-card border-border/50">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center text-white text-2xl font-bold shrink-0">
              {employee.firstName[0]}{employee.lastName[0]}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-foreground">{employee.firstName} {employee.lastName}</h1>
                <StatusBadge status={employee.status as any} />
              </div>
              <p className="text-muted-foreground">{employee.designationTitle || 'N/A'} · {employee.departmentName || 'N/A'}</p>
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{employee.email}</span>
                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{employee.phone || 'N/A'}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />Joined {employee.joiningDate || 'N/A'}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="info">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="info">Information</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="leaves">Leaves</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="glass-card border-border/50">
              <CardHeader><CardTitle className="text-base">Personal Details</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {[
                  ['Employee Code', employee.employeeCode || 'N/A'],
                  ['Full Name', `${employee.firstName} ${employee.lastName}`],
                  ['Email', employee.email],
                  ['Phone', employee.phone || 'N/A'],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium text-foreground">{value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="glass-card border-border/50">
              <CardHeader><CardTitle className="text-base">Employment Details</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {[
                  ['Department', employee.departmentName || 'N/A'],
                  ['Designation', employee.designationTitle || 'N/A'],
                  ['Date of Joining', employee.joiningDate || 'N/A'],
                  ['Salary', 'N/A'],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium text-foreground">{value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="attendance" className="mt-4">
          <Card className="glass-card border-border/50 p-8 text-center text-muted-foreground">Attendance history will be shown here.</Card>
        </TabsContent>
        <TabsContent value="leaves" className="mt-4">
          <Card className="glass-card border-border/50 p-8 text-center text-muted-foreground">Leave records will be shown here.</Card>
        </TabsContent>
        <TabsContent value="payroll" className="mt-4">
          <Card className="glass-card border-border/50 p-8 text-center text-muted-foreground">Payroll history will be shown here.</Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default EmployeeProfile;
