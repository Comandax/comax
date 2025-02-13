
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { SupabaseAuthProvider } from '../services/supabaseAuthProvider';
import type { AuthProvider, User } from '../types/auth';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  userInitials: string;
  userName: string;
  handleLogout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Aqui você pode facilmente trocar o provedor de autenticação
const authProvider: AuthProvider = new SupabaseAuthProvider();

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      console.log('Checking current user');
      const user = await authProvider.getCurrentUser();
      console.log('Current user:', user);
      setUser(user);
      
      // Se não houver usuário e não estivermos na página de login,
      // redireciona para login
      if (!user && window.location.pathname !== '/login') {
        console.log('No user found, redirecting to login');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error checking user:', error);
      // Em caso de erro de autenticação, também redireciona para login
      if (window.location.pathname !== '/login') {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    console.log('Login attempt for:', email);
    const user = await authProvider.login(email, password);
    setUser(user);
    return user;
  }

  async function logout() {
    console.log('Logging out');
    await authProvider.logout();
    setUser(null);
  }

  async function handleLogout() {
    await logout();
    window.location.href = '/login';
  }

  const userInitials = (() => {
    if (user?.firstName && user?.lastName) {
      return (user.firstName[0] + user.lastName[0]).toUpperCase();
    }
    // Fallback para o nome completo se existir
    if (user?.name) {
      const nameParts = user.name.trim().split(' ');
      if (nameParts.length >= 2) {
        return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
      }
      return nameParts[0][0].toUpperCase();
    }
    // Último fallback para o email
    return user?.email?.charAt(0).toUpperCase() || '';
  })();

  const userName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}`
    : user?.name || user?.email?.split('@')[0] || '';

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout,
      userInitials,
      userName,
      handleLogout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
