import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PageHeader from '@/components/common/PageHeader';
import StatusBadge from '@/components/common/StatusBadge';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import type { Role } from '@/types';
import { userService } from '@/services';
import type { UserDto } from '@/services/userService';
import { useAuthStore } from '@/store/authStore';

const ROLES: Role[] = ['SuperAdmin', 'HRAdmin', 'Manager', 'Employee'];

const UsersPage = () => {
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(true);
  // Track which users are being updated (for loading states)
  const [updatingIds, setUpdatingIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAll();
      setUsers(data);
    } catch (err: any) {
      console.error('[UsersPage] Fetch failed:', err);
      toast({
        title: 'Error',
        description: err.message || 'Failed to load users',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // PATCH /users/:id/role
  const handleRoleChange = async (userId: number, newRole: string) => {
    // Apna role khud change karna prevent karo
    if (currentUser?.id === String(userId)) {
      toast({
        title: 'Not Allowed',
        description: 'You cannot change your own role.',
        variant: 'destructive'
      });
      return;
    }

    setUpdatingIds(prev => new Set(prev).add(userId));

    try {
      await userService.changeRole(userId, newRole);

      // Local state update karo
      setUsers(prev =>
        prev.map(u => u.id === userId ? { ...u, role: newRole } : u)
      );

      toast({
        title: 'Role Updated',
        description: `User role changed to ${newRole}. They must re-login.`
      });
    } catch (err: any) {
      console.error('[UsersPage] Role change failed:', err);
      toast({
        title: 'Error',
        description: err.message || 'Failed to change role',
        variant: 'destructive'
      });
    } finally {
      setUpdatingIds(prev => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    }
  };

  // PATCH /users/:id/deactivate — Sirf deactivate, reactivate nahi
  const handleDeactivate = async (userId: number, currentlyActive: boolean) => {
    // Already inactive hai toh kuch nahi karna
    if (!currentlyActive) {
      toast({
        title: 'Already Inactive',
        description: 'This user is already deactivated.',
      });
      return;
    }

    // Apne aap ko deactivate karna prevent karo
    if (currentUser?.id === String(userId)) {
      toast({
        title: 'Not Allowed',
        description: 'You cannot deactivate your own account.',
        variant: 'destructive'
      });
      return;
    }

    setUpdatingIds(prev => new Set(prev).add(userId));

    try {
      await userService.deactivate(userId);

      // Local state update — backend sirf deactivate karta hai
      setUsers(prev =>
        prev.map(u => u.id === userId ? { ...u, isActive: false } : u)
      );

      toast({
        title: 'User Deactivated',
        description: 'User has been deactivated. All sessions revoked.'
      });
    } catch (err: any) {
      console.error('[UsersPage] Deactivate failed:', err);
      toast({
        title: 'Error',
        description: err.message || 'Failed to deactivate user',
        variant: 'destructive'
      });
    } finally {
      setUpdatingIds(prev => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description={`${users.length} system users`}
      >
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-warning/10 text-warning text-xs font-medium">
          <Shield className="w-3.5 h-3.5" /> SuperAdmin Only
        </div>
      </PageHeader>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card className="glass-card border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Deactivate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                users.map(u => {
                  const isUpdating = updatingIds.has(u.id);
                  const isCurrentUser = currentUser?.id === String(u.id);

                  return (
                    <TableRow
                      key={u.id}
                      className={!u.isActive ? 'opacity-50' : ''}
                    >
                      {/* User Info */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {u.userName?.split(' ').map(n => n[0]).join('').toUpperCase() || u.email[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-sm text-foreground flex items-center gap-1">
                              {u.userName}
                              {isCurrentUser && (
                                <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                                  You
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground">{u.email}</p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Role Change Dropdown — PATCH /users/:id/role */}
                      <TableCell>
                        <Select
                          value={u.role}
                          onValueChange={(newRole) => handleRoleChange(u.id, newRole)}
                          disabled={isUpdating || isCurrentUser || !u.isActive}
                        >
                          <SelectTrigger className="w-32 h-8 text-xs bg-muted/50 border-0">
                            {isUpdating
                              ? <Loader2 className="w-3 h-3 animate-spin" />
                              : <SelectValue />
                            }
                          </SelectTrigger>
                          <SelectContent>
                            {ROLES.map(r => (
                              <SelectItem key={r} value={r}>
                                {r}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>

                      {/* Status Badge */}
                      <TableCell>
                        <StatusBadge status={u.isActive ? 'Active' : 'Inactive'} />
                        {u.isLockedOut && (
                          <span className="ml-2 text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">
                            Locked
                          </span>
                        )}
                      </TableCell>

                      {/* Last Login */}
                      <TableCell className="text-xs text-muted-foreground">
                        {u.lastLogin
                          ? new Date(u.lastLogin).toLocaleDateString()
                          : 'Never'
                        }
                      </TableCell>

                      {/* Deactivate Toggle — PATCH /users/:id/deactivate */}
                      <TableCell className="text-right">
                        <Switch
                          checked={u.isActive}
                          onCheckedChange={() => handleDeactivate(u.id, u.isActive)}
                          disabled={isUpdating || isCurrentUser || !u.isActive}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Card>
      </motion.div>
    </div>
  );
};

export default UsersPage;