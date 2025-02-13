
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
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error('Perfil não encontrado');
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

  // Cria o perfil manualmente ao invés de esperar pelo trigger
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: authData.user.id,
      first_name: profile.first_name,
      last_name: profile.last_name,
      email: profile.email,
      phone: profile.phone
    })
    .select()
    .maybeSingle();

  if (profileError) {
    console.error('Profile creation error:', profileError);
    throw new Error('Erro ao criar perfil: ' + profileError.message);
  }

  if (!profileData) {
    throw new Error('Erro ao criar perfil: dados não retornados');
  }

  return profileData;
}
