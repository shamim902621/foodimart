// components/ProtectedRoute.tsx
import { ActivityIndicator, View } from 'react-native';
import { useAuthChecker } from '../components/AuthChecker';

interface ProtectedRouteProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export default function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const { user, loading } = useAuthChecker(allowedRoles);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2ECC71" />
      </View>
    );
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return null; // useAuthChecker will handle redirection
  }

  return <>{children}</>;
}