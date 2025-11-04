import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function PrivateRoute() {
  const { token } = useAuth() || {};
  if (!token) return <Navigate to="/auth/login" replace />;
  return <Outlet />;
}

export function RoleRoute({ allow }) {
  const { role } = useAuth() || {};
  if (!allow.includes(role)) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}

export function PublicOnly() {
  const { token } = useAuth() || {};
  if (token) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
