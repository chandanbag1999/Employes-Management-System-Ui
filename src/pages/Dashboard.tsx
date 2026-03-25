import { motion } from 'framer-motion';
import { Users, Clock, CalendarDays, Wallet } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from '@/components/common/StatCard';
import PageHeader from '@/components/common/PageHeader';
import StatusBadge from '@/components/common/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/authStore';
import { useEffect, useState } from 'react';
import { dashboardService } from '@/services';
import type { DashboardStats, Activity } from '@/types';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [departmentHeadcount, setDepartmentHeadcount] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsData, activitiesData, deptData] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getRecentActivities(),
          dashboardService.getDepartmentHeadcount()
        ]);
        
        // Map backend stats to frontend format
        setStats({
          totalEmployees: (statsData as any).totalEmployees || (statsData as any).totalEmployeesCount || 0,
          presentToday: (statsData as any).presentToday || (statsData as any).presentCount || 0,
          onLeave: (statsData as any).onLeave || (statsData as any).onLeaveCount || 0,
          pendingLeaves: (statsData as any).pendingLeaves || (statsData as any).pendingLeaveRequests || 0,
          totalPayroll: (statsData as any).totalPayroll || 0,
          attendanceRate: (statsData as any).attendanceRate || 0,
        });
        
        setActivities(activitiesData || []);
        
        // Map department headcount - backend uses different field names
        const mappedDept = (deptData || []).map((item: any) => ({
          name: item.departmentName || item.name || '',
          count: item.employeeCount || item.count || 0,
        }));
        setDepartmentHeadcount(mappedDept);
        
      } catch (err: any) {
        setError(err.message);
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64">Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-6">
      <PageHeader title={`Welcome back, ${user?.name?.split(' ')[0]}`} description="Here's what's happening with your organization today." />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Employees" value={stats?.totalEmployees || 0} change="+4 this month" changeType="positive" icon={<Users className="w-5 h-5" />} />
        <StatCard title="Present Today" value={stats?.presentToday || 0} change={`${stats?.attendanceRate?.toFixed(1) || 0}% rate`} changeType="positive" icon={<Clock className="w-5 h-5" />} gradient="gradient-success" />
        <StatCard title="On Leave" value={stats?.onLeave || 0} change={`${stats?.pendingLeaves || 0} pending`} changeType="neutral" icon={<CalendarDays className="w-5 h-5" />} gradient="gradient-warning" />
        <StatCard title="Total Payroll" value={`$${((stats?.totalPayroll || 0) / 1000).toFixed(0)}K`} change="+2.5% vs last month" changeType="positive" icon={<Wallet className="w-5 h-5" />} gradient="gradient-info" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Department Headcount</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={departmentHeadcount}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} />
                  <Bar dataKey="count" fill="hsl(239, 84%, 67%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glass-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Attendance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary">{stats?.attendanceRate?.toFixed(1) || 0}%</div>
                  <div className="text-sm text-muted-foreground mt-1">Attendance Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="glass-card border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.length === 0 ? (
                <p className="text-muted-foreground text-sm">No recent activity</p>
              ) : (
                activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{activity.message}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <StatusBadge status={activity.type === 'leave' ? 'Pending' : activity.type === 'attendance' ? 'Late' : 'Active'} />
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;
