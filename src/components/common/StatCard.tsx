import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  gradient?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, changeType = 'neutral', icon, gradient }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-card rounded-xl p-5 relative overflow-hidden group hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {change && (
            <p className={cn(
              "text-xs font-medium",
              changeType === 'positive' && 'text-success',
              changeType === 'negative' && 'text-destructive',
              changeType === 'neutral' && 'text-muted-foreground',
            )}>
              {change}
            </p>
          )}
        </div>
        <div className={cn(
          "w-11 h-11 rounded-lg flex items-center justify-center text-white shrink-0",
          gradient || "gradient-primary"
        )}>
          {icon}
        </div>
      </div>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity gradient-primary rounded-xl" />
    </motion.div>
  );
};

export default StatCard;
