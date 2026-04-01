import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import AuthGuard from "@/components/auth/AuthGuard";
import AppLayout from "@/components/layout/AppLayout";
import LoginPage from "@/pages/LoginPage";
import Dashboard from "@/pages/Dashboard";
import EmployeesPage from "@/pages/EmployeesPage";
import EmployeeProfile from "@/pages/EmployeeProfile";
import AttendancePage from "@/pages/AttendancePage";
import LeavesPage from "@/pages/LeavesPage";
import PayrollPage from "@/pages/PayrollPage";
import PerformancePage from "@/pages/PerformancePage";
import OrganizationPage from "@/pages/OrganizationPage"; // ← Updated
import ReportsPage from "@/pages/ReportsPage";
import UsersPage from "@/pages/UsersPage";
import NotFound from "@/pages/NotFound";
import { useUIStore } from "@/store/uiStore";

const queryClient = new QueryClient();

const DarkModeInit = () => {
  const { darkMode } = useUIStore();
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ErrorBoundary>
        <Toaster />
        <Sonner />
        <DarkModeInit />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route element={<AuthGuard><AppLayout /></AuthGuard>}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/employees" element={<EmployeesPage />} />
              <Route path="/employees/:id" element={<EmployeeProfile />} />
              <Route path="/attendance" element={<AttendancePage />} />
              <Route path="/leaves" element={<LeavesPage />} />
              <Route path="/performance" element={<PerformancePage />} />

              {/* Role restricted */}
              <Route path="/payroll" element={
                <AuthGuard allowedRoles={['SuperAdmin', 'HRAdmin']}>
                  <PayrollPage />
                </AuthGuard>
              } />

              {/* /departments → /organization rename */}
              <Route path="/organization" element={
                <AuthGuard allowedRoles={['SuperAdmin', 'HRAdmin']}>
                  <OrganizationPage />
                </AuthGuard>
              } />

              <Route path="/reports" element={
                <AuthGuard allowedRoles={['SuperAdmin', 'HRAdmin', 'Manager']}>
                  <ReportsPage />
                </AuthGuard>
              } />

              <Route path="/users" element={
                <AuthGuard allowedRoles={['SuperAdmin']}>
                  <UsersPage />
                </AuthGuard>
              } />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;