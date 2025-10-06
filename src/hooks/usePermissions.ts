import { useAuth } from '@/hooks/useAuth';

export function usePermissions() {
  const { user } = useAuth();

  const hasPermission = (permission: string) => {
    if (!user) return false;
    return user.permissions.includes(permission);
  };

  const hasRole = (role: string) => {
    if (!user) return false;
    return user.roles.some((r) => r.name === role);
  };

  return { hasPermission, hasRole };
}

export function usePermissions() {
  const { user } = useAuth();

  const hasPermission = (permission: string) => {
    if (!user) return false;
    return user.permissions.includes(permission);
  };

  const hasRole = (role: string) => {
    if (!user) return false;
    return user.roles.some((r) => r.name === role);
  };

  return { hasPermission, hasRole };
}
