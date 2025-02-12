
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  superUserOnly?: boolean;
}

export const ProtectedRoute = ({ children, superUserOnly = false }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Se a rota requer superusuário e o usuário não é superusuário,
  // redireciona para a página de edição do próprio perfil
  if (superUserOnly && !user.roles?.includes('superuser')) {
    return <Navigate to={`/users/${user.id}`} />;
  }

  return <>{children}</>;
};
