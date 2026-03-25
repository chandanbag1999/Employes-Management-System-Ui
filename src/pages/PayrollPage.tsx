import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wallet, DollarSign, TrendingUp, FileText } from 'lucide-react';
import { payrollService } from '@/services';
import type { PayrollRecordResponseDto } from '@/types/backend';

const PayrollPage = () => {
  const [payroll, setPayroll] = useState<PayrollRecordResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState('January');

  // Fetch payroll data from API
  useEffect(() => {
    const fetchPayroll = async () => {
      try {
        setLoading(true);
        const monthMap: Record<string, number> = {
          'January': 1, 'February': 2, 'March': 3, 'April': 4,
          'May': 5, 'June': 6, 'July': 7, 'August': 8,
          'September': 9, 'October': 10, 'November': 11, 'December': 12
        };
        const data = await payrollService.getAll({ 
          month: monthMap[selectedMonth], 
          year: 2024,
          page: 1, 
          pageSize: 50 
        });
        setPayroll(data.data || []);
      } catch (err) {
        console.error('Error fetching payroll:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayroll();
  }, [selectedMonth]);

  // Calculate totals from real data
  const totalGross = payroll.reduce((s, p) => s + p.grossSalary, 0);
  const totalNet = payroll.reduce((s, p) => s + p.netSalary, 0);
  const totalDeductions = totalGross - totalNet;

  return (
    <div className="space-y-6">
      <PageHeader title="Payroll" description="Manage salary processing and payslips.">
        <Button className="gradient-primary border-0 text-white"><DollarSign className="w-4 h-4 mr-1" /> Run Payroll</Button>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Gross Payroll" value={`$${(totalGross / 1000).toFixed(0)}K`} icon={<Wallet className="w-5 h-5" />} />
        <StatCard title="Net Payroll" value={`$${(totalNet / 1000).toFixed(0)}K`} icon={<TrendingUp className="w-5 h-5" />} gradient="gradient-success" />
        <StatCard title="Total Deductions" value={`$${(totalDeductions / 1000).toFixed(0)}K`} icon={<FileText className="w-5 h-5" />} gradient="gradient-warning" />
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card className="glass-card border-border/50 overflow-hidden">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base">Payroll Records</CardTitle>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-36 bg-muted/50 border-0"><SelectValue /></SelectTrigger>
              <SelectContent>
                {['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December'].map(m => 
                  <SelectItem key={m} value={m}>{m} 2024</SelectItem>
                )}
              </SelectContent>
            </Select>
          </CardHeader>
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead>Employee</TableHead>
                  <TableHead className="hidden md:table-cell">Basic</TableHead>
                  <TableHead className="hidden lg:table-cell">Allowances</TableHead>
                  <TableHead className="hidden lg:table-cell">Deductions</TableHead>
                  <TableHead>Net Salary</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payroll.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No payroll records found
                    </TableCell>
                  </TableRow>
                ) : (
                  payroll.map(p => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium text-sm">{p.employeeName}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">${p.basic.toLocaleString()}</TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">${(p.hra + p.da + p.ta + p.otherAllowances).toLocaleString()}</TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">${(p.pf + p.tax + p.otherDeductions).toLocaleString()}</TableCell>
                      <TableCell className="font-semibold text-sm text-foreground">${p.netSalary.toLocaleString()}</TableCell>
                      <TableCell><StatusBadge status={p.status as any} /></TableCell>
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

export default PayrollPage;
