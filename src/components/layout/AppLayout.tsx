import { Outlet } from 'react-router-dom';
import AppSidebar from './AppSidebar';
import Topbar from './Topbar';
import MobileNav from './MobileNav';
import { useUIStore } from '@/store/uiStore';
import { cn } from '@/lib/utils';

const AppLayout = () => {
  const { sidebarCollapsed } = useUIStore();

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <div className={cn(
        "transition-all duration-300 min-h-screen flex flex-col",
        "md:ml-[250px]",
        sidebarCollapsed && "md:ml-[68px]"
      )}>
        <Topbar />
        <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
          <Outlet />
        </main>
      </div>
      <MobileNav />
    </div>
  );
};

export default AppLayout;
