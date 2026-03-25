import { useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { getNavForRole } from '@/config/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Users, Building2, Clock, CalendarDays,
  Wallet, TrendingUp, BarChart3, Shield, ChevronLeft, LogOut,
} from 'lucide-react';

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  LayoutDashboard, Users, Building2, Clock, CalendarDays,
  Wallet, TrendingUp, BarChart3, Shield,
};

const AppSidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  if (!user) return null;

  const navGroups = getNavForRole(user.role);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen glass-sidebar border-r border-sidebar-border z-40 transition-all duration-300 flex flex-col hidden md:flex",
        sidebarCollapsed ? "w-[68px]" : "w-[250px]"
      )}
    >
      {/* Logo */}
      <div className={cn("h-16 flex items-center border-b border-sidebar-border px-4", sidebarCollapsed && "justify-center")}>
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-white font-bold text-sm shrink-0">
          E
        </div>
        {!sidebarCollapsed && <span className="ml-3 font-bold text-sidebar-accent-foreground text-lg">EMS</span>}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto scrollbar-thin space-y-6">
        {navGroups.map((group) => (
          <div key={group.label}>
            {!sidebarCollapsed && (
              <p className="text-[11px] uppercase font-semibold text-sidebar-foreground/50 tracking-wider mb-2 px-3">
                {group.label}
              </p>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = iconMap[item.icon] || LayoutDashboard;
                const active = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                      active
                        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md shadow-primary/25"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      sidebarCollapsed && "justify-center px-2"
                    )}
                  >
                    <Icon className="w-[18px] h-[18px] shrink-0" />
                    {!sidebarCollapsed && <span>{item.title}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-3 space-y-2">
        <button
          onClick={logout}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-destructive transition-colors w-full",
            sidebarCollapsed && "justify-center px-2"
          )}
        >
          <LogOut className="w-[18px] h-[18px] shrink-0" />
          {!sidebarCollapsed && <span>Logout</span>}
        </button>
        <button
          onClick={toggleSidebar}
          className={cn(
            "flex items-center justify-center w-full py-1.5 rounded-lg text-sidebar-foreground/50 hover:bg-sidebar-accent transition-colors",
          )}
        >
          <ChevronLeft className={cn("w-4 h-4 transition-transform", sidebarCollapsed && "rotate-180")} />
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
