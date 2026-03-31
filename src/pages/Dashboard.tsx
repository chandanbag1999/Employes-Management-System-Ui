import { motion } from 'framer-motion';
import { Users, Clock, CalendarDays, Wallet, TrendingUp, CheckCircle } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';
import StatCard from '@/components/common/StatCard';
import PageHeader from '@/components/common/PageHeader';
import StatusBadge from '@/components/common/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/authStore';
import { useEffect, useState } from 'react';
import { dashboardService } from '@/services';
import type { DashboardStats, Activity } from '@/types';

// ─────────────────────────────────────────
// Employee Dashboard — Self-service view
// Backend 403 nahi dega kyunki yeh data
// attendance/leave se aata hai, dashboard se nahi
// ─────────────────────────────────────────
const EmployeeDashboard = ({ userName }: { userName: string }) => {
  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${userName.split(' ')[0]} 👋`}
        description="Here's your personal overview for today."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="My Attendance"
          value="Present"
          change="On time today"
          changeType="positive"
          icon={<Clock className="w-5 h-5" />}
          gradient="gradient-success"
        />
        <StatCard
          title="Leave Balance"
          value="12 days"
          change="3 pending requests"
          changeType="neutral"
          icon={<CalendarDays className="w-5 h-5" />}
          gradient="gradient-warning"
        />
        <StatCard
          title="My Goals"
          value="3 Active"
          change="1 completed this month"
          changeType="positive"
          icon={<TrendingUp className="w-5 h-5" />}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="glass-card border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Clock In', icon: <Clock className="w-5 h-5" />, path: '/attendance' },
                { label: 'Apply Leave', icon: <CalendarDays className="w-5 h-5" />, path: '/leaves' },
                { label: 'My Payslips', icon: <Wallet className="w-5 h-5" />, path: '/payroll' },
                { label: 'My Goals', icon: <CheckCircle className="w-5 h-5" />, path: '/performance' },
              ].map((action) => (
                <a
                  key={action.label}
                  href={action.path}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border/50 hover:bg-accent transition-colors cursor-pointer text-center"
                >
                  <div className="text-primary">{action.icon}</div>
                  <span className="text-sm font-medium">{action.label}</span>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

// ─────────────────────────────────────────
// Admin/Manager Dashboard — Full overview
// Backend se real data fetch karta hai
// ─────────────────────────────────────────
const AdminDashboard = ({ userName }: { userName: string }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [departmentHeadcount, setDepartmentHeadcount] = useState<{ name: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [statsData, activitiesData, deptData] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getRecentActivities(),
          dashboardService.getDepartmentHeadcount(),
        ]);

        // Backend field names map karo — docs se: totalEmployees, presentToday, etc.
        const rawStats = statsData as any;
        setStats({
          totalEmployees: rawStats.totalEmployees ?? rawStats.totalEmployeesCount ?? 0,
          presentToday: rawStats.presentToday ?? rawStats.presentCount ?? 0,
          onLeave: rawStats.onLeave ?? rawStats.onLeaveCount ?? 0,
          pendingLeaves: rawStats.pendingLeaves ?? rawStats.pendingLeaveRequests ?? 0,
          totalPayroll: rawStats.totalPayroll ?? rawStats.totalPayrollThisMonth ?? 0,
          attendanceRate: rawStats.attendanceRate ?? rawStats.attendancePercentage ?? 0,
        });

        // Activities map karo
        const rawActivities = (activitiesData as any[]) || [];
        setActivities(
          rawActivities.map((a: any) => ({
            id: a.id ?? Math.random(),
            type: a.type ?? 'info',
            message: a.message ?? a.description ?? '',
            timestamp: a.timestamp ?? a.createdAt ?? new Date().toISOString(),
            userId: a.userId ?? 0,
          }))
        );

        // Department headcount map karo
        const rawDept = (deptData as any[]) || [];
        setDepartmentHeadcount(
          rawDept.map((item: any) => ({
            name: item.departmentName ?? item.name ?? 'Unknown',
            count: item.employeeCount ?? item.count ?? 0,
          }))
        );
      } catch (err: any) {
        console.error('[Dashboard] Fetch error:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title={`Welcome back, ${userName.split(' ')[0]}`}
          description="Loading dashboard data..."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader
          title={`Welcome back, ${userName.split(' ')[0]}`}
          description="Dashboard overview"
        />
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="pt-6">
            <p className="text-destructive text-sm font-medium">
              ⚠️ Failed to load dashboard data: {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 text-xs underline text-muted-foreground hover:text-foreground"
            >
              Try again
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${userName.split(' ')[0]}`}
        description="Here's what's happening with your organization today."
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Employees"
          value={stats?.totalEmployees ?? 0}
          change="+4 this month"
          changeType="positive"
          icon={<Users className="w-5 h-5" />}
        />
        <StatCard
          title="Present Today"
          value={stats?.presentToday ?? 0}
          change={`${stats?.attendanceRate?.toFixed(1) ?? 0}% rate`}
          changeType="positive"
          icon={<Clock className="w-5 h-5" />}
          gradient="gradient-success"
        />
        <StatCard
          title="On Leave"
          value={stats?.onLeave ?? 0}
          change={`${stats?.pendingLeaves ?? 0} pending`}
          changeType="neutral"
          icon={<CalendarDays className="w-5 h-5" />}
          gradient="gradient-warning"
        />
        <StatCard
          title="Total Payroll"
          value={`₹${((stats?.totalPayroll ?? 0) / 1000).toFixed(0)}K`}
          change="+2.5% vs last month"
          changeType="positive"
          icon={<Wallet className="w-5 h-5" />}
          gradient="gradient-info"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Department Headcount</CardTitle>
            </CardHeader>
            <CardContent>
              {departmentHeadcount.length === 0 ? (
                <div className="flex items-center justify-center h-[240px] text-muted-foreground text-sm">
                  No department data available
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={departmentHeadcount}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="name"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={11}
                      // Long names truncate karo
                      tickFormatter={(val) => val.length > 10 ? val.slice(0, 10) + '…' : val}
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        background: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--foreground))',
                      }}
                    />
                    <Bar dataKey="count" fill="hsl(239, 84%, 67%)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Attendance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center h-[240px] gap-4">
                {/* Big number */}
                <div className="text-center">
                  <div className="text-6xl font-bold text-primary">
                    {stats?.attendanceRate?.toFixed(1) ?? 0}%
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">Today's Attendance Rate</div>
                </div>

                {/* Present vs Absent breakdown */}
                <div className="flex gap-6 mt-2">
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-green-500">
                      {stats?.presentToday ?? 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Present</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-orange-500">
                      {stats?.onLeave ?? 0}
                    </div>
                    <div className="text-xs text-muted-foreground">On Leave</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-red-500">
                      {(stats?.totalEmployees ?? 0) - (stats?.presentToday ?? 0) - (stats?.onLeave ?? 0)}
                    </div>
                    <div className="text-xs text-muted-foreground">Absent</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="glass-card border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-4">
                  No recent activity to show
                </p>
              ) : (
                activities.map((activity, index) => (
                  <div
                    key={activity.id ?? `activity-${index}`}
                    className="flex items-start gap-3"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{activity.message}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <StatusBadge
                      status={
                        activity.type === 'leave'
                          ? 'Pending'
                          : activity.type === 'attendance'
                          ? 'Present'
                          : 'Active'
                      }
                    />
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

// ─────────────────────────────────────────
// Main Dashboard — Role check karke
// sahi component render karta hai
// ─────────────────────────────────────────
const Dashboard = () => {
  const { user } = useAuthStore();
  const userName = user?.name ?? 'User';
  const role = user?.role;

  // Employee ko simple self-service view
  if (role === 'Employee') {
    return <EmployeeDashboard userName={userName} />;
  }

  // SuperAdmin, HRAdmin, Manager ko full dashboard
  return <AdminDashboard userName={userName} />;
};

export default Dashboard;