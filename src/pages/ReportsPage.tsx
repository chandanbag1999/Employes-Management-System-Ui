import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { dashboardService } from '@/services';

const COLORS = ['hsl(239,84%,67%)', 'hsl(142,71%,45%)', 'hsl(38,92%,50%)', 'hsl(199,89%,48%)', 'hsl(270,76%,60%)', 'hsl(0,72%,51%)'];

const payrollTrend = [
  { month: 'Oct', amount: 820000 },
  { month: 'Nov', amount: 845000 },
  { month: 'Dec', amount: 860000 },
  { month: 'Jan', amount: 892000 },
];

// Mock attendance trend data since backend doesn't have this endpoint
const mockAttendanceTrend = [
  { day: 'Mon', present: 95, late: 8, absent: 5 },
  { day: 'Tue', present: 102, late: 5, absent: 3 },
  { day: 'Wed', present: 98, late: 6, absent: 7 },
  { day: 'Thu', present: 100, late: 4, absent: 4 },
  { day: 'Fri', present: 88, late: 10, absent: 12 },
];

const ReportsPage = () => {
  const [departmentHeadcount, setDepartmentHeadcount] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch report data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const deptData = await dashboardService.getDepartmentHeadcount();
        
        // Map department headcount
        const mappedDept = (deptData || []).map((item: any) => ({
          name: item.departmentName || item.name || '',
          count: item.employeeCount || item.count || 0,
        }));
        setDepartmentHeadcount(mappedDept);
      } catch (err) {
        console.error('Error fetching reports:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Reports & Analytics" description="Insights across your organization.">
        <Button variant="outline"><Download className="w-4 h-4 mr-1" /> Export</Button>
      </PageHeader>

      <Tabs defaultValue="attendance">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
          <TabsTrigger value="headcount">Headcount</TabsTrigger>
        </TabsList>

        <TabsContent value="attendance" className="mt-4">
          <Card className="glass-card border-border/50">
            <CardHeader><CardTitle className="text-base">Weekly Attendance Overview</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockAttendanceTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} />
                  <Bar dataKey="present" fill="hsl(142,71%,45%)" radius={[4,4,0,0]} />
                  <Bar dataKey="late" fill="hsl(38,92%,50%)" radius={[4,4,0,0]} />
                  <Bar dataKey="absent" fill="hsl(0,72%,51%)" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payroll" className="mt-4">
          <Card className="glass-card border-border/50">
            <CardHeader><CardTitle className="text-base">Payroll Trend</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={payrollTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={v => `$${v/1000}K`} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} />
                  <Line type="monotone" dataKey="amount" stroke="hsl(239,84%,67%)" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="headcount" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="glass-card border-border/50">
              <CardHeader><CardTitle className="text-base">By Department</CardTitle></CardHeader>
              <CardContent>
                {loading ? (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">Loading...</div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={departmentHeadcount} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="count" nameKey="name" label={({ name, value }) => `${name}: ${value}`}>
                        {departmentHeadcount.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
            <Card className="glass-card border-border/50">
              <CardHeader><CardTitle className="text-base">Department Breakdown</CardTitle></CardHeader>
              <CardContent>
                {loading ? (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">Loading...</div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={departmentHeadcount} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} width={80} />
                      <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} />
                      <Bar dataKey="count" fill="hsl(239,84%,67%)" radius={[0,4,4,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsPage;
