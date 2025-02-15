
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

  // Gera o identificador usando o primeiro nome completo e a primeira letra do sobrenome
  const identifier = (data.first_name + data.last_name[0])
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ''); // Remove caracteres especiais e espaços

  // Insere o representante
  const insertData: RepresentativeInsertData = {
    profile_id: authData.user.id,
    identifier,
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
  // Se estiver atualizando o identificador, validar o formato
  if (data.identifier) {
    // Remove caracteres especiais e espaços, mantendo apenas letras minúsculas e números
    data.identifier = data.identifier.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Verifica se o identificador ficou vazio após a limpeza
    if (!data.identifier) {
      throw new Error("O identificador deve conter pelo menos uma letra ou número");
    }
  }

  const { data: representative, error } = await supabase
    .from('representatives')
    .update(data)
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) {
    if (error.message.includes('representatives_identifier_check')) {
      throw new Error("O identificador deve conter apenas letras minúsculas e números, sem espaços ou caracteres especiais");
    }
    throw error;
  }
  
  if (!representative) throw new Error('Representative not found');
  
  return representative;
}
