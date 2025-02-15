
import { supabase } from "@/integrations/supabase/client";
import { Representative, RepresentativeFormData, RepresentativeInsertData } from "@/types/representative";

export async function createRepresentative(data: RepresentativeFormData): Promise<Representative> {
  // Primeiro, cria o usuário usando o auth do Supabase
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        first_name: data.first_name,
        last_name: data.last_name,
      }
    }
  });

  if (authError) throw authError;
  if (!authData.user) throw new Error('Failed to create user');

  // Insere o representante
  const insertData: RepresentativeInsertData = {
    profile_id: authData.user.id,
    identifier: data.first_name.toLowerCase() + data.last_name[0].toLowerCase(),
  };

  // Insere o representante
  const { data: representative, error: insertError } = await supabase
    .from('representatives')
    .insert(insertData)
    .select()
    .maybeSingle();

  if (insertError) throw insertError;
  if (!representative) throw new Error('Failed to create representative');

  // Adiciona o role na tabela user_roles
  const { error: userRoleError } = await supabase
    .from('user_roles')
    .insert({
      user_id: authData.user.id,
      role: 'representative'
    });

  if (userRoleError) {
    // Se houver erro ao adicionar na tabela user_roles, remove o representante criado
    await supabase
      .from('representatives')
      .delete()
      .eq('id', representative.id);
    
    throw userRoleError;
  }

  return representative;
}

export async function getRepresentative(profile_id: string): Promise<Representative | null> {
  const { data: representative, error } = await supabase
    .from('representatives')
    .select('*')
    .eq('profile_id', profile_id)
    .maybeSingle();

  if (error) throw error;
  return representative;
}

export async function updateRepresentative(id: string, data: { pix_key?: string, identifier?: string }): Promise<Representative> {
  const { data: representative, error } = await supabase
    .from('representatives')
    .update(data)
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) throw error;
  if (!representative) throw new Error('Representative not found');
  
  return representative;
}
