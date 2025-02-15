import { supabase } from "@/integrations/supabase/client";
import { Representative, RepresentativeFormData, RepresentativeInsertData } from "@/types/representative";

export async function createRepresentative(data: RepresentativeFormData): Promise<Representative> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Primeiro, busca o perfil do usuário para obter o nome completo
  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, last_name')
    .eq('id', user.id)
    .single();

  if (!profile) throw new Error('Profile not found');

  // Gera o identificador usando o primeiro nome e a primeira letra do sobrenome
  const identifier = (profile.first_name + profile.last_name[0])
    .toLowerCase()
    .replace(/\s+/g, '');

  const insertData: RepresentativeInsertData = {
    profile_id: user.id,
    pix_key: data.pix_key,
    identifier: identifier,
  };

  // Insere o representante
  const { data: representative, error: insertError } = await supabase
    .from('representatives')
    .insert(insertData)
    .select()
    .single();

  if (insertError) throw insertError;

  // Adiciona a role de representante
  const { error: roleError } = await supabase
    .from('user_roles')
    .insert({
      user_id: user.id,
      role: 'representative'
    });

  if (roleError) {
    // Se houver erro ao adicionar a role, remove o representante criado
    await supabase
      .from('representatives')
      .delete()
      .eq('id', representative.id);
    
    throw roleError;
  }

  return representative as Representative;
}

export async function getRepresentative(profile_id: string): Promise<Representative | null> {
  const { data: representative, error } = await supabase
    .from('representatives')
    .select('*')
    .eq('profile_id', profile_id)
    .maybeSingle();

  if (error) throw error;
  return representative as Representative | null;
}

export async function updateRepresentative(id: string, data: Partial<RepresentativeFormData>): Promise<Representative> {
  const { data: representative, error } = await supabase
    .from('representatives')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return representative as Representative;
}
