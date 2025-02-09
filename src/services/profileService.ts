
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
  const { data: { user }, error: authError } = await supabase.auth.admin.createUser({
    email: `${profile.first_name.toLowerCase()}.${profile.last_name.toLowerCase()}@example.com`,
    password: "password123",
    user_metadata: {
      first_name: profile.first_name,
      last_name: profile.last_name
    }
  });

  if (authError) throw authError;
  if (!user) throw new Error('Failed to create user');

  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: user.id,
      ...profile
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
