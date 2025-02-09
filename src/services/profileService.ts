
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
  // First sign up the user with email confirmation enabled
  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email: profile.email,
    password: profile.password,
    options: {
      data: {
        first_name: profile.first_name,
        last_name: profile.last_name
      },
      emailRedirectTo: `${window.location.origin}/login`
    }
  });

  if (signUpError) {
    throw new Error(signUpError.message);
  }
  
  if (!authData.user) {
    throw new Error('Falha ao criar usuário');
  }

  // Wait a moment for the auth session to be established
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Create the profile with the user's ID
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: authData.user.id,
      first_name: profile.first_name,
      last_name: profile.last_name,
      email: profile.email,
      phone: profile.phone
    })
    .select()
    .single();

  if (error) {
    console.error('Profile creation error:', error);
    // If profile creation fails, we should probably clean up the auth user
    // but Supabase doesn't provide a way to delete users via the client library
    throw new Error('Erro ao criar perfil: ' + error.message);
  }

  return data;
}

