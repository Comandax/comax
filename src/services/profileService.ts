
import { supabase } from "@/integrations/supabase/client";
import { Profile, ProfileFormData } from "@/types/profile";

export async function getProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getProfile(id: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function updateProfile(id: string, profile: ProfileFormData): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      first_name: profile.first_name,
      last_name: profile.last_name,
      email: profile.email,
      phone: profile.phone
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createProfile(profile: ProfileFormData): Promise<Profile> {
  // Primeiro cria o usuário na autenticação
  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email: profile.email,
    password: profile.password,
    options: {
      emailRedirectTo: `${window.location.origin}/login`,
      data: {
        first_name: profile.first_name,
        last_name: profile.last_name
      }
    }
  });

  if (signUpError) {
    throw new Error(signUpError.message);
  }
  
  if (!authData.user) {
    throw new Error('Falha ao criar usuário');
  }

  // Espera um momento para garantir que o trigger de criação do perfil seja executado
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Atualiza o perfil com as informações adicionais
  const { data, error } = await supabase
    .from('profiles')
    .update({
      first_name: profile.first_name,
      last_name: profile.last_name,
      phone: profile.phone
    })
    .eq('id', authData.user.id)
    .select()
    .single();

  if (error) {
    console.error('Profile update error:', error);
    throw new Error('Erro ao atualizar perfil: ' + error.message);
  }

  return data;
}
