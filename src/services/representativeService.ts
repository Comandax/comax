import { supabase } from "@/integrations/supabase/client";
import type { Representative, RepresentativeCompany } from "@/types/representative";
import type { Profile } from "@/types/profile";

export async function createRepresentative(userId: string): Promise<Representative> {
  // Get user profile to generate identifier
  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, last_name')
    .eq('id', userId)
    .single();

  if (!profile) {
    throw new Error('Profile not found');
  }

  // Generate initial identifier using the database function
  const { data: identifier } = await supabase
    .rpc('generate_representative_identifier', {
      first_name: profile.first_name,
      last_name: profile.last_name
    });

  // Create representative record
  const { data, error } = await supabase
    .from('representatives')
    .insert([
      { 
        id: userId,
        identifier: identifier
      }
    ])
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error('Failed to create representative');

  // Add representative role
  const { error: roleError } = await supabase
    .from('user_roles')
    .upsert([
      {
        user_id: userId,
        role: 'representative'
      }
    ], {
      onConflict: 'user_id,role'
    });

  if (roleError) {
    // Se houver erro ao criar a role, vamos tentar limpar o representante criado
    await supabase.from('representatives').delete().eq('id', userId);
    throw roleError;
  }

  return data;
}

export async function getRepresentativeByIdentifier(identifier: string): Promise<Representative | null> {
  const { data, error } = await supabase
    .from('representatives')
    .select('*')
    .eq('identifier', identifier)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function updateRepresentative(id: string, identifier: string): Promise<Representative> {
  const { data, error } = await supabase
    .from('representatives')
    .update({ identifier })
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error('Representative not found');

  return data;
}

export async function getRepresentativeCompanies(representativeId: string): Promise<RepresentativeCompany[]> {
  const { data, error } = await supabase
    .from('companies')
    .select(`
      id,
      name,
      logo_url,
      owner:profiles (
        first_name,
        last_name,
        email,
        phone
      )
    `)
    .eq('representative_id', representativeId);

  if (error) throw error;
  
  return data.map(company => ({
    id: company.id,
    name: company.name,
    logo_url: company.logo_url,
    owner: company.owner as RepresentativeCompany['owner']
  }));
}

export async function getCurrentRepresentative(): Promise<Representative | null> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data, error } = await supabase
    .from('representatives')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (error) throw error;
  return data;
}
