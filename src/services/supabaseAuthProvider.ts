
import type { AuthProvider, User, Role } from '../types/auth';
import { supabase } from '@/integrations/supabase/client';

export class SupabaseAuthProvider implements AuthProvider {
  async login(email: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error(error.message);
    if (!data.user) throw new Error('No user data returned');

    // Verifica se o email foi confirmado
    if (!data.user.email_confirmed_at) {
      throw new Error('Por favor, confirme seu email antes de fazer login.');
    }

    const roles = await this.getUserRoles(data.user.id);

    return {
      id: data.user.id,
      email: data.user.email!,
      companyId: '1',
      roles,
    };
  }

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  }

  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    const roles = await this.getUserRoles(user.id);

    return {
      id: user.id,
      email: user.email!,
      companyId: '1',
      roles,
    };
  }

  async getUserRoles(userId: string): Promise<Role[]> {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching user roles:', error);
      return [];
    }

    // Convertendo a resposta para o formato correto
    // A role 'superuser' do banco deve ser mapeada para 'superuser' no frontend
    return data.map(row => {
      if (row.role === 'superuser') return 'superuser';
      return 'owner';
    }) as Role[];
  }
}
