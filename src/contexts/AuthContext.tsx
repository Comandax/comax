
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { SupabaseAuthProvider } from '../services/supabaseAuthProvider';
import type { AuthProvider, User } from '../types/auth';

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

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const user = await authProvider.getCurrentUser();
      setUser(user);
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    const user = await authProvider.login(email, password);
    setUser(user);
    return user;
  }

  async function logout() {
    await authProvider.logout();
    setUser(null);
  }

  async function handleLogout() {
    await logout();
    window.location.href = '/login';
  }

  const userInitials = user?.name 
    ? (() => {
        const nameParts = user.name.trim().split(' ');
        if (nameParts.length >= 2) {
          // Pega a primeira letra do primeiro e do último nome
          return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
        }
        // Se tiver apenas um nome, pega a primeira letra
        return nameParts[0][0].toUpperCase();
      })()
    : user?.email?.charAt(0).toUpperCase() || '';

  const userName = user?.name || user?.email?.split('@')[0] || '';

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
