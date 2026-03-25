import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export type StatusType = 'Active' | 'Inactive' | 'OnLeave' | 'Present' | 'Absent' | 'Late' | 'HalfDay' | 'Pending' | 'Approved' | 'Rejected' | 'Draft' | 'Processed' | 'Paid' | 'NotStarted' | 'InProgress' | 'Completed';

const statusStyles: Record<StatusType, string> = {
  Active: 'bg-success/10 text-success border-success/20',
  Inactive: 'bg-muted text-muted-foreground border-muted',
  OnLeave: 'bg-warning/10 text-warning border-warning/20',
  Present: 'bg-success/10 text-success border-success/20',
  Absent: 'bg-destructive/10 text-destructive border-destructive/20',
  Late: 'bg-warning/10 text-warning border-warning/20',
  HalfDay: 'bg-info/10 text-info border-info/20',
  Pending: 'bg-warning/10 text-warning border-warning/20',
  Approved: 'bg-success/10 text-success border-success/20',
  Rejected: 'bg-destructive/10 text-destructive border-destructive/20',
  Draft: 'bg-muted text-muted-foreground border-muted',
  Processed: 'bg-info/10 text-info border-info/20',
  Paid: 'bg-success/10 text-success border-success/20',
  NotStarted: 'bg-muted text-muted-foreground border-muted',
  InProgress: 'bg-info/10 text-info border-info/20',
  Completed: 'bg-success/10 text-success border-success/20',
};

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const label = status.replace(/([A-Z])/g, ' $1').trim();
  return (
    <Badge variant="outline" className={cn('font-medium text-xs border', statusStyles[status], className)}>
      {label}
    </Badge>
  );
};

export default StatusBadge;
