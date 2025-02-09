
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
    .update(profile)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createProfile(profile: ProfileFormData): Promise<Profile> {
  // First sign up the user
  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email: profile.email,
    password: "password123", // You might want to generate this or ask for it in the form
    options: {
      data: {
        first_name: profile.first_name,
        last_name: profile.last_name
      }
    }
  });

  if (signUpError) throw signUpError;
  if (!authData.user) throw new Error('Failed to create user');

  // Then create the profile
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: authData.user.id,
      ...profile
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
