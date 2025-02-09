
import { createClient } from '@supabase/supabase-js';
import type { AuthProvider, User } from '../types/auth';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export class SupabaseAuthProvider implements AuthProvider {
  async login(email: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error(error.message);
    if (!data.user) throw new Error('No user data returned');

    // Aqui você buscaria os dados adicionais do usuário, como companyId
    return {
      id: data.user.id,
      email: data.user.email!,
      companyId: '1', // Exemplo - na implementação real isso viria do perfil do usuário
    };
  }

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  }

  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    return {
      id: user.id,
      email: user.email!,
      companyId: '1', // Exemplo - na implementação real isso viria do perfil do usuário
    };
  }
}
