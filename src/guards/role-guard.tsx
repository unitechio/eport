import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/router';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }

  const hasRole = user?.roles.some((role) => allowedRoles.includes(role.name));

  if (!hasRole) {
    // Redirect to an unauthorized page or the home page
    router.push('/unauthorized');
    return null;
  }

  return <>{children}</>;
}
