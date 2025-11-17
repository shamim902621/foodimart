// hooks/useAuthChecker.ts
import { router, usePathname } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

export function useAuthChecker(requiredRole?: string[]) {
  const { user, isAuthenticated, loading } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    const publicRoutes = ['/welcome', '/login', '/signup', '/otp-verification'];
    const isPublicRoute = publicRoutes.includes(pathname);

    if (!isAuthenticated && !isPublicRoute) {
      router.replace('/login');
      return;
    }

    if (isAuthenticated && isPublicRoute) {
      redirectByRole(user!.role);
      return;
    }

    if (isAuthenticated && requiredRole && user) {
      const hasRequiredRole = requiredRole.includes(user.role);
      if (!hasRequiredRole) {
        redirectByRole(user.role);
      }
    }
  }, [isAuthenticated, loading, pathname, user, requiredRole]);

  const redirectByRole = (role: string) => {
    switch (role) {
      case 'USER':
        router.replace('/category');
        break;
      case 'ADMIN':
        router.replace('/admin/dashboard');
        break;
      case 'SUPERADMIN':
        router.replace('/superadmin/dashboard');
        break;
      default:
        router.replace('/login');
    }
  };

  return { user, isAuthenticated, loading };
}