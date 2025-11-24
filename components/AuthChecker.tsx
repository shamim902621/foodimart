// hooks/useAuthChecker.ts
import { router, usePathname } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

// --- Define allowed roles ---
type UserRole = 'USER' | 'ADMIN' | 'SUPERADMIN';

export function useAuthChecker(requiredRole?: UserRole[]) {
  const { user, isAuthenticated, loading } = useAuth();
  const pathname = usePathname();

  // PUBLIC ROUTES (no login required)
  const publicRoutes = ['/welcome', '/login', '/signup', '/otp-verification'];

  useEffect(() => {
    if (loading) return; // wait for auth state

    const isPublicRoute = publicRoutes.includes(pathname);

    // 1️⃣ Not logged in & accessing protected page → redirect to login
    if (!isAuthenticated && !isPublicRoute) {
      router.replace('/login');
      return;
    }

    // 2️⃣ Logged in & trying to open login/signup → redirect based on role
    if (isAuthenticated && isPublicRoute && user) {
      redirectByRole(user.role);
      return;
    }

    // 3️⃣ Logged in but role does not match → redirect
    if (isAuthenticated && requiredRole && user) {
      const allowed = requiredRole.includes(user.role as UserRole);
      if (!allowed) {
        redirectByRole(user.role as UserRole);
      }
    }
  }, [isAuthenticated, loading, pathname, user, requiredRole]);

  // --- ROLE-BASED REDIRECTION ---
  const redirectByRole = (role: UserRole) => {
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
