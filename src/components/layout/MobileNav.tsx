import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Clock, CalendarDays, User, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

const items = [
  { icon: LayoutDashboard, label: 'Home', path: '/' },
  { icon: Clock, label: 'Attendance', path: '/attendance' },
  { icon: CalendarDays, label: 'Leaves', path: '/leaves' },
  { icon: User, label: 'Profile', path: '/employees' },
  { icon: MoreHorizontal, label: 'More', path: '/more' },
];

const MobileNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border flex items-center justify-around px-2 z-40 md:hidden backdrop-blur-lg">
      {items.map((item) => {
        const active = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors",
              active ? "text-primary" : "text-muted-foreground"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default MobileNav;
