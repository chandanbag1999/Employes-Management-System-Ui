import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock, CheckCircle, XCircle, AlertTriangle,
  Timer, RefreshCw, Calendar, TrendingUp,
  Loader2, Users, Filter, X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from '@/components/ui/select';
import { toast } from 'sonner';
import PageHeader from '@/components/common/PageHeader';
import StatusBadge from '@/components/common/StatusBadge';
import { attendanceService } from '@/services/attendanceService';
import { useAuthStore } from '@/store/authStore';
import type { AttendanceResponseDto } from '@/types/backend';

// ─── Types ────────────────────────────────────────────────────────────────────

interface MonthlySummary {
  presentDays: number;
  absentDays: number;
  halfDays: number;
  leaveDays: number;
  totalWorkingHours: number;
  averageWorkingHours: number;
  totalWorkingDays: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatTimer = (s: number): string => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return [h, m, sec]
    .map(v => v.toString().padStart(2, '0'))
    .join(':');
};

const formatTime = (t: any): string => {
  if (!t) return '—';
  // TimeSpan from backend: "09:30:00"
  const str = typeof t === 'string' ? t : String(t);
  const parts = str.split(':');
  if (parts.length < 2) return str;
  const h = parseInt(parts[0]);
  const m = parts[1];
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${m} ${ampm}`;
};

// ─── Stat Mini Card ───────────────────────────────────────────────────────────

const MiniStat = ({
  label, value, color, loading
}: {
  label: string;
  value: string | number;
  color: string;
  loading: boolean;
}) => (
  <div className="text-center p-3">
    {loading ? (
      <Skeleton className="h-8 w-12 mx-auto mb-1" />
    ) : (
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    )}
    <p className="text-xs text-muted-foreground">{label}</p>
  </div>
);

// ─── Row Skeleton ─────────────────────────────────────────────────────────────

const RowSkeleton = () => (
  <tr className="border-b border-border/30">
    {[...Array(6)].map((_, i) => (
      <td key={i} className="px-4 py-3">
        <Skeleton className="h-4 w-full" />
      </td>
    ))}
  </tr>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const AttendancePage = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'SuperAdmin' || user?.role === 'HRAdmin';
  const isManager = user?.role === 'Manager';
  const canViewAll = isAdmin || isManager;

  // ── Clock state ──────────────────────────────────────────────────────────
  const [todayRecord, setTodayRecord] = useState<AttendanceResponseDto | null>(null);
  const [todayLoading, setTodayLoading] = useState(true);
  const [clockLoading, setClockLoading] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  // ── Summary state ────────────────────────────────────────────────────────
  const [summary, setSummary] = useState<MonthlySummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);

  // ── All records state (admin/manager) ────────────────────────────────────
  const [records, setRecords] = useState<AttendanceResponseDto[]>([]);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  // ── Filters ──────────────────────────────────────────────────────────────
  const [showFilters, setShowFilters] = useState(false);
  const [fromDate, setFromDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString().split('T')[0]
  );
  const [toDate, setToDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [statusFilter, setStatusFilter] = useState('');

  // ── Derived state ─────────────────────────────────────────────────────────

  const isClockedIn = !!(todayRecord?.clockIn && !todayRecord?.clockOut);
  const isClockedOut = !!(todayRecord?.clockIn && todayRecord?.clockOut);

  // ── Timer ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!isClockedIn || !todayRecord?.clockIn) return;

    // Elapsed seconds from clock-in time
    const clockInParts = String(todayRecord.clockIn).split(':');
    if (clockInParts.length >= 2) {
      const clockInSeconds =
        parseInt(clockInParts[0]) * 3600 +
        parseInt(clockInParts[1]) * 60 +
        (parseInt(clockInParts[2]) || 0);

      const now = new Date();
      const nowSeconds =
        now.getHours() * 3600 +
        now.getMinutes() * 60 +
        now.getSeconds();

      const diff = nowSeconds - clockInSeconds;
      setElapsed(diff > 0 ? diff : 0);
    }

    const interval = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(interval);
  }, [isClockedIn, todayRecord?.clockIn]);

  // ── Fetch today's record ──────────────────────────────────────────────────

  const fetchToday = useCallback(async () => {
    setTodayLoading(true);
    try {
      const data = await attendanceService.getMyToday();
      setTodayRecord(data);
    } catch (err) {
      console.error('fetchToday error:', err);
    } finally {
      setTodayLoading(false);
    }
  }, []);

  // ── Fetch monthly summary ─────────────────────────────────────────────────

  const fetchSummary = useCallback(async () => {
    setSummaryLoading(true);
    try {
      const now = new Date();
      const data = await attendanceService.getMySummary(
        now.getMonth() + 1,
        now.getFullYear()
      );
      setSummary(data);
    } catch (err) {
      console.error('fetchSummary error:', err);
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  // ── Fetch all records (admin/manager) ─────────────────────────────────────

  const fetchAllRecords = useCallback(async () => {
    if (!canViewAll) return;
    setRecordsLoading(true);
    try {
      const result = await attendanceService.getAll({
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
        status: statusFilter || undefined,
        pageSize: 50,
      });
      setRecords(result.data);
      setTotalCount(result.totalCount);
    } catch (err) {
      console.error('fetchAllRecords error:', err);
    } finally {
      setRecordsLoading(false);
    }
  }, [canViewAll, fromDate, toDate, statusFilter]);

  useEffect(() => {
    fetchToday();
    fetchSummary();
  }, [fetchToday, fetchSummary]);

  useEffect(() => {
    if (canViewAll) fetchAllRecords();
  }, [fetchAllRecords, canViewAll]);

  // ── Clock In ──────────────────────────────────────────────────────────────

  const handleClockIn = async () => {
    setClockLoading(true);
    try {
      const result = await attendanceService.clockIn();
      setTodayRecord(result);
      setElapsed(0);
      toast.success('Clocked in successfully!', {
        description: `Time: ${formatTime(result.clockIn)}`
      });
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
        err?.message ||
        'Clock in failed'
      );
    } finally {
      setClockLoading(false);
    }
  };

  // ── Clock Out ─────────────────────────────────────────────────────────────

  const handleClockOut = async () => {
    setClockLoading(true);
    try {
      const result = await attendanceService.clockOut();
      setTodayRecord(result);
      toast.success('Clocked out successfully!', {
        description: `Total hours: ${result.workingHours?.toFixed(1)}h`
      });
      fetchSummary();
      if (canViewAll) fetchAllRecords();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
        err?.message ||
        'Clock out failed'
      );
    } finally {
      setClockLoading(false);
    }
  };

  // ── Clear filters ─────────────────────────────────────────────────────────

  const clearFilters = () => {
    setFromDate(
      new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        .toISOString().split('T')[0]
    );
    setToDate(new Date().toISOString().split('T')[0]);
    setStatusFilter('');
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <PageHeader
        title="Attendance"
        description="Track your daily attendance and working hours"
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => { fetchToday(); fetchSummary(); }}
          disabled={todayLoading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${todayLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </PageHeader>

      {/* ── Clock In/Out Card ── */}
      <Card className="glass-card border-border/50">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">

            {/* Timer display */}
            <div className="flex-1 text-center sm:text-left">
              <p className="text-sm text-muted-foreground mb-1">
                Today — {new Date().toLocaleDateString('en-IN', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>

              {todayLoading ? (
                <Skeleton className="h-12 w-40" />
              ) : (
                <p className="text-5xl font-mono font-bold text-foreground tracking-wider">
                  {isClockedIn
                    ? formatTimer(elapsed)
                    : isClockedOut
                      ? `${todayRecord?.workingHours?.toFixed(1)}h`
                      : '00:00:00'
                  }
                </p>
              )}

              <p className="text-xs text-muted-foreground mt-2">
                {isClockedIn
                  ? `⏱ Running since ${formatTime(todayRecord?.clockIn)}`
                  : isClockedOut
                    ? `✅ ${formatTime(todayRecord?.clockIn)} → ${formatTime(todayRecord?.clockOut)}`
                    : '🔴 Not clocked in yet'
                }
              </p>
            </div>

            {/* Status + Button */}
            <div className="flex flex-col items-center gap-3">
              {todayRecord && (
                <StatusBadge status={todayRecord.status as any} />
              )}

              {todayLoading ? (
                <Skeleton className="h-12 w-32" />
              ) : isClockedOut ? (
                <div className="text-center">
                  <p className="text-sm text-green-500 font-medium">
                    ✓ Done for today
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {todayRecord?.status === 'HalfDay'
                      ? 'Marked as Half Day'
                      : 'Marked as Present'}
                  </p>
                </div>
              ) : (
                <Button
                  onClick={isClockedIn ? handleClockOut : handleClockIn}
                  disabled={clockLoading}
                  className={`h-12 px-8 text-base font-semibold text-white border-0 min-w-[140px]
                                        ${isClockedIn
                      ? 'bg-orange-500 hover:bg-orange-600'
                      : 'gradient-primary'
                    }`}
                >
                  {clockLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Timer className="w-5 h-5 mr-2" />
                      {isClockedIn ? 'Clock Out' : 'Clock In'}
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Monthly Summary ── */}
      <Card className="glass-card border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {new Date().toLocaleDateString('en-IN', {
              month: 'long', year: 'numeric'
            })} — My Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-3 sm:grid-cols-6 divide-x divide-border/30">
            <MiniStat
              label="Present"
              value={summary?.presentDays ?? 0}
              color="text-green-500"
              loading={summaryLoading}
            />
            <MiniStat
              label="Absent"
              value={summary?.absentDays ?? 0}
              color="text-red-500"
              loading={summaryLoading}
            />
            <MiniStat
              label="Half Day"
              value={summary?.halfDays ?? 0}
              color="text-yellow-500"
              loading={summaryLoading}
            />
            <MiniStat
              label="On Leave"
              value={summary?.leaveDays ?? 0}
              color="text-blue-500"
              loading={summaryLoading}
            />
            <MiniStat
              label="Total Hours"
              value={`${summary?.totalWorkingHours?.toFixed(0) ?? 0}h`}
              color="text-purple-500"
              loading={summaryLoading}
            />
            <MiniStat
              label="Avg Hours"
              value={`${summary?.averageWorkingHours?.toFixed(1) ?? 0}h`}
              color="text-foreground"
              loading={summaryLoading}
            />
          </div>
        </CardContent>
      </Card>

      {/* ── All Records Table (Admin/Manager only) ── */}
      {canViewAll && (
        <Card className="glass-card border-border/50 overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="w-4 h-4" />
                Attendance Records
                {totalCount > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {totalCount}
                  </Badge>
                )}
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(f => !f)}
                  className={showFilters ? 'border-primary text-primary' : ''}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchAllRecords}
                  disabled={recordsLoading}
                >
                  <RefreshCw className={`w-4 h-4 ${recordsLoading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>

            {/* Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-3 border-t border-border/30 mt-3">
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">
                        From Date
                      </Label>
                      <Input
                        type="date"
                        value={fromDate}
                        onChange={e => setFromDate(e.target.value)}
                        className="bg-background/50"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">
                        To Date
                      </Label>
                      <Input
                        type="date"
                        value={toDate}
                        onChange={e => setToDate(e.target.value)}
                        className="bg-background/50"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">
                        Status
                      </Label>
                      <Select
                        value={statusFilter}
                        onValueChange={v =>
                          setStatusFilter(v === 'all' ? '' : v)
                        }
                      >
                        <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="Present">Present</SelectItem>
                          <SelectItem value="Absent">Absent</SelectItem>
                          <SelectItem value="HalfDay">Half Day</SelectItem>
                          <SelectItem value="OnLeave">On Leave</SelectItem>
                          <SelectItem value="Holiday">Holiday</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="gap-2 text-muted-foreground"
                      >
                        <X className="w-4 h-4" />
                        Clear
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardHeader>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-muted/30">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                    Employee
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">
                    Date
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                    Clock In
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">
                    Clock Out
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">
                    Hours
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recordsLoading ? (
                  [...Array(8)].map((_, i) => <RowSkeleton key={i} />)
                ) : records.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-16 text-muted-foreground"
                    >
                      <Clock className="w-10 h-10 mx-auto mb-2 opacity-20" />
                      <p>No attendance records found</p>
                    </td>
                  </tr>
                ) : (
                  records.map((rec, idx) => (
                    <motion.tr
                      key={rec.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.02 }}
                      className="border-b border-border/30 hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {rec.employeeName?.[0] ?? '?'}
                          </div>
                          <div>
                            <p className="font-medium text-foreground text-xs">
                              {rec.employeeName}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              {rec.employeeCode}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-muted-foreground text-xs">
                        {new Date(rec.date).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        {formatTime(rec.clockIn)}
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground text-xs">
                        {formatTime(rec.clockOut)}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground text-xs">
                        {rec.workingHours
                          ? `${rec.workingHours.toFixed(1)}h`
                          : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={rec.status as any} />
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </motion.div>
  );
};

export default AttendancePage;