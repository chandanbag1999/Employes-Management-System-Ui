import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Clock, CheckCircle, XCircle, AlertTriangle, Timer } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { attendanceService } from '@/services';
import type { AttendanceResponseDto } from '@/types/backend';

const AttendancePage = () => {
  const [clockedIn, setClockedIn] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [attendance, setAttendance] = useState<AttendanceResponseDto[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch attendance data from API
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        const data = await attendanceService.getAll({ page: 1, pageSize: 50 });
        setAttendance(data.data || []);
      } catch (err) {
        console.error('Error fetching attendance:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (clockedIn) {
      interval = setInterval(() => setElapsed(e => e + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [clockedIn]);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const handleClock = () => {
    if (clockedIn) {
      setClockedIn(false);
      setElapsed(0);
      toast({ title: 'Clocked Out', description: `Total time: ${formatTime(elapsed)}` });
    } else {
      setClockedIn(true);
      toast({ title: 'Clocked In', description: `You clocked in at ${new Date().toLocaleTimeString()}` });
    }
  };

  // Calculate stats from real data
  const present = attendance.filter(a => a.status === 'Present').length;
  const absent = attendance.filter(a => a.status === 'Absent').length;
  const late = attendance.filter(a => a.status === 'Late').length;
  const avgHours = attendance.length > 0 
    ? (attendance.reduce((sum, a) => sum + (a.totalHours || 0), 0) / attendance.length).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      <PageHeader title="Attendance" description="Track daily attendance and clock in/out." />

      {/* Clock In/Out */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="glass-card border-border/50">
          <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-6">
            <div className="text-center sm:text-left flex-1">
              <p className="text-sm text-muted-foreground mb-1">Today, {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
              <p className="text-4xl font-mono font-bold text-foreground">{formatTime(elapsed)}</p>
              <p className="text-xs text-muted-foreground mt-1">{clockedIn ? 'Timer is running...' : 'Not clocked in'}</p>
            </div>
            <Button
              onClick={handleClock}
              className={`h-14 px-8 text-lg font-semibold border-0 text-white ${clockedIn ? 'gradient-warning' : 'gradient-primary'}`}
            >
              <Timer className="w-5 h-5 mr-2" />
              {clockedIn ? 'Clock Out' : 'Clock In'}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats - Using real data */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Present" value={present} icon={<CheckCircle className="w-5 h-5" />} gradient="gradient-success" />
        <StatCard title="Absent" value={absent} icon={<XCircle className="w-5 h-5" />} gradient="bg-destructive" />
        <StatCard title="Late" value={late} icon={<AlertTriangle className="w-5 h-5" />} gradient="gradient-warning" />
        <StatCard title="Avg Hours" value={`${avgHours}h`} icon={<Clock className="w-5 h-5" />} gradient="gradient-info" />
      </div>

      {/* Table */}
      <Card className="glass-card border-border/50 overflow-hidden">
        <CardHeader className="pb-2"><CardTitle className="text-base">Today's Attendance</CardTitle></CardHeader>
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Loading...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>Employee</TableHead>
                <TableHead>Clock In</TableHead>
                <TableHead className="hidden md:table-cell">Clock Out</TableHead>
                <TableHead className="hidden md:table-cell">Hours</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendance.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No attendance records found
                  </TableCell>
                </TableRow>
              ) : (
                attendance.map(rec => (
                  <TableRow key={rec.id}>
                    <TableCell className="font-medium text-sm">{rec.employeeName}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{rec.clockIn || '—'}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{rec.clockOut || '—'}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{rec.totalHours ? `${rec.totalHours}h` : '—'}</TableCell>
                    <TableCell><StatusBadge status={rec.status as any} /></TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
};

export default AttendancePage;
