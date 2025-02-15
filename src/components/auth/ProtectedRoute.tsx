
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  superUserOnly?: boolean;
}

export const ProtectedRoute = ({ children, superUserOnly = false }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Lista de rotas públicas que não exigem autenticação
  const publicRoutes = ['/representatives/create'];

  if (loading) {
    return <div>Loading...</div>;
  }

  // Se a rota atual está na lista de rotas públicas, permite o acesso
  if (publicRoutes.includes(location.pathname)) {
    return <>{children}</>;
  }

  // Se não for uma rota pública e o usuário não estiver autenticado, redireciona para login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Se a rota requer superusuário e o usuário não é superusuário nem representante,
  // redireciona para a página de edição do próprio perfil
  if (superUserOnly && !user.roles?.includes('superuser')) {
    return <Navigate to={`/users/${user.id}`} />;
  }

  return <>{children}</>;
};
