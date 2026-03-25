import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PageHeader from '@/components/common/PageHeader';
import StatusBadge from '@/components/common/StatusBadge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import type { Role } from '@/types';
import { userService } from '@/services';
import type { UserDto } from '@/services/userService';

const UsersPage = () => {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAll();
      setUsers(data || []);
    } catch (err: any) {
      console.error('Failed to fetch users:', err);
      toast({ title: 'Error', description: 'Failed to load users', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id: number) => {
    try {
      await userService.deactivate(id);
      setUsers(u => u.map(user => user.id === id ? { ...user, isActive: !user.isActive } : user));
      toast({ title: 'User updated', description: 'User status has been changed.' });
    } catch (err) {
      console.error('Failed to toggle user status:', err);
      toast({ title: 'Error', description: 'Failed to update user', variant: 'destructive' });
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
      <PageHeader title="User Management" description="Manage system users and roles.">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-warning/10 text-warning text-xs font-medium">
          <Shield className="w-3.5 h-3.5" /> Admin Only
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
                <TableHead className="text-right">Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(u => (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold">
                        {u.userName?.split(' ').map(n => n[0]).join('') || u.email[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-foreground">{u.userName}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select defaultValue={u.role}>
                      <SelectTrigger className="w-32 h-8 text-xs bg-muted/50 border-0"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {(['SuperAdmin', 'HRAdmin', 'Manager', 'Employee'] as Role[]).map(r => (
                          <SelectItem key={r} value={r}>{r}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell><StatusBadge status={u.isActive ? 'Active' : 'Inactive'} /></TableCell>
                  <TableCell className="text-right">
                    <Switch checked={u.isActive} onCheckedChange={() => toggleActive(u.id)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </motion.div>
    </div>
  );
};

export default UsersPage;
