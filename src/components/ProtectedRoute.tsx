import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/types/user';

type ProtectedRouteProps = {
  allowedRoles?: UserRole[];
  requireApproved?: boolean;
};

export const ProtectedRoute = ({
  allowedRoles = [],
  requireApproved = true,
}: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="text-sm font-medium text-slate-500">Memuat aplikasi...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireApproved && user.status !== 'approved') {
    return <Navigate to="/waiting-approval" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
