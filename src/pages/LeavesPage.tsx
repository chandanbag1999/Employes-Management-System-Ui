import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalendarDays, Plus, Check, X } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/hooks/use-toast';
import { leaveService } from '@/services';
import type { LeaveResponseDto, LeaveTypeResponseDto } from '@/types/backend';

const LeavesPage = () => {
  const { user } = useAuthStore();
  const isApprover = user?.role === 'SuperAdmin' || user?.role === 'HRAdmin' || user?.role === 'Manager';
  
  const [leaveRequests, setLeaveRequests] = useState<LeaveResponseDto[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveTypeResponseDto[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch leave data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [requestsData, typesData] = await Promise.all([
          leaveService.getAll({ page: 1, pageSize: 50 }),
          leaveService.getTypes()
        ]);
        setLeaveRequests(requestsData.data || []);
        setLeaveTypes(typesData || []);
      } catch (err) {
        console.error('Error fetching leaves:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAction = (action: 'Approved' | 'Rejected', id: number) => {
    toast({ title: `Leave ${action}`, description: `Leave request ${id} has been ${action.toLowerCase()}.` });
  };

  // Map leave types to balance display
  const leaveBalances = leaveTypes.map(type => ({
    type: type.name,
    total: type.maxDays,
    used: 0, // Would need backend to provide actual usage
    remaining: type.maxDays
  }));

  return (
    <div className="space-y-6">
      <PageHeader title="Leave Management" description="Apply and manage leave requests.">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gradient-primary border-0 text-white"><Plus className="w-4 h-4 mr-1" /> Apply Leave</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Apply for Leave</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2"><Label>Leave Type</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    {leaveTypes.map(t => <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Start Date</Label><Input type="date" /></div>
                <div className="space-y-2"><Label>End Date</Label><Input type="date" /></div>
              </div>
              <div className="space-y-2"><Label>Reason</Label><Textarea placeholder="Reason for leave..." /></div>
            </div>
            <Button className="w-full gradient-primary border-0 text-white">Submit Request</Button>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* Leave Balances */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {leaveBalances.map(lb => (
          <StatCard
            key={lb.type}
            title={`${lb.type} Leave`}
            value={`${lb.remaining}/${lb.total}`}
            change={`${lb.used} used`}
            changeType={lb.remaining < 3 ? 'negative' : 'neutral'}
            icon={<CalendarDays className="w-5 h-5" />}
          />
        ))}
      </div>

      {/* Leave Requests Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card className="glass-card border-border/50 overflow-hidden">
          <CardHeader className="pb-2"><CardTitle className="text-base">Leave Requests</CardTitle></CardHeader>
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead>Employee</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="hidden md:table-cell">Dates</TableHead>
                  <TableHead className="hidden lg:table-cell">Days</TableHead>
                  <TableHead>Status</TableHead>
                  {isApprover && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaveRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={isApprover ? 6 : 5} className="text-center text-muted-foreground">
                      No leave requests found
                    </TableCell>
                  </TableRow>
                ) : (
                  leaveRequests.map(req => (
                    <TableRow key={req.id}>
                      <TableCell className="font-medium text-sm">{req.employeeName}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{req.leaveTypeName}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{req.startDate} → {req.endDate}</TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{req.days}</TableCell>
                      <TableCell><StatusBadge status={req.status as any} /></TableCell>
                      {isApprover && (
                        <TableCell className="text-right">
                          {req.status === 'Pending' && (
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-success" onClick={() => handleAction('Approved', req.id)}><Check className="w-4 h-4" /></Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleAction('Rejected', req.id)}><X className="w-4 h-4" /></Button>
                            </div>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default LeavesPage;
