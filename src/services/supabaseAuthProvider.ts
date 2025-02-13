
import type { AuthProvider, User, Role } from '../types/auth';
import { supabase } from '@/integrations/supabase/client';

export class SupabaseAuthProvider implements AuthProvider {
  constructor() {
    // Set up auth state change listener
    supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);
      if (event === 'SIGNED_OUT') {
        // Clear any local auth state
        console.log('User signed out, clearing local state');
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
      }
    });
  }

  async login(email: string, password: string): Promise<User> {
    console.log('Attempting login for email:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login error:', error);
      throw new Error(error.message);
    }
    if (!data.user) throw new Error('No user data returned');

    // Verifica se o email foi confirmado
    if (!data.user.email_confirmed_at) {
      throw new Error('Por favor, confirme seu email antes de fazer login.');
    }

    console.log('Login successful, fetching roles');
    const roles = await this.getUserRoles(data.user.id);

    return {
      id: data.user.id,
      email: data.user.email!,
      companyId: '1',
      roles,
    };
  }

  async logout(): Promise<void> {
    console.log('Attempting logout');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error);
      throw new Error(error.message);
    }
    console.log('Logout successful');
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      console.log('Getting current user');
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        throw sessionError;
      }

      if (!session) {
        console.log('No active session found');
        return null;
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Get user error:', userError);
        throw userError;
      }

      if (!user) {
        console.log('No user found');
        return null;
      }

      console.log('User found, fetching roles');
      const roles = await this.getUserRoles(user.id);

      return {
        id: user.id,
        email: user.email!,
        companyId: '1',
        roles,
      };
    } catch (error) {
      console.error('Error in getCurrentUser:', error);
      // If we get a refresh token error, return null instead of throwing
      if (error instanceof Error && error.message.includes('refresh_token_not_found')) {
        console.log('Refresh token not found, returning null');
        return null;
      }
      throw error;
    }
  }

  async getUserRoles(userId: string): Promise<Role[]> {
    console.log('Fetching roles for user:', userId);
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching user roles:', error);
      return [];
    }

    console.log('Roles fetched:', data);
    return data.map(role => role.role as Role);
  }
}
