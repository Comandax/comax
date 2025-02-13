
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
  // Se uma nova senha foi fornecida, atualiza a senha no auth
  if (profile.password && profile.password.trim() !== '') {
    const { error: passwordError } = await supabase.auth.updateUser({
      password: profile.password
    });

    if (passwordError) {
      throw new Error('Erro ao atualizar senha: ' + passwordError.message);
    }
  }

  // Atualiza os outros dados do perfil
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

  // Gera um token de confirmação único
  const confirmationToken = crypto.randomUUID();

  // Cria o perfil manualmente ao invés de esperar pelo trigger
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: authData.user.id,
      first_name: profile.first_name,
      last_name: profile.last_name,
      email: profile.email,
      phone: profile.phone,
      confirmation_token: confirmationToken,
      email_confirmed: false
    })
    .select()
    .maybeSingle();

  if (profileError) {
    // Se houver erro na criação, verifica se o perfil já existe (pode ter sido criado pelo trigger)
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .maybeSingle();

    if (fetchError) {
      console.error('Error fetching existing profile:', fetchError);
      throw new Error('Erro ao verificar perfil existente: ' + fetchError.message);
    }

    if (existingProfile) {
      // Se o perfil já existe, atualiza com as informações adicionais
      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .update({
          first_name: profile.first_name,
          last_name: profile.last_name,
          phone: profile.phone,
          confirmation_token: confirmationToken,
          email_confirmed: false
        })
        .eq('id', authData.user.id)
        .select()
        .maybeSingle();

      if (updateError) {
        console.error('Error updating existing profile:', updateError);
        throw new Error('Erro ao atualizar perfil existente: ' + updateError.message);
      }

      if (!updatedProfile) {
        throw new Error('Perfil não encontrado após atualização');
      }

      return updatedProfile;
    }

    // Se não encontrou perfil existente, propaga o erro original
    console.error('Profile creation error:', profileError);
    throw new Error('Erro ao criar perfil: ' + profileError.message);
  }

  if (!profileData) {
    throw new Error('Erro ao criar perfil: dados não retornados');
  }

  return profileData;
}
