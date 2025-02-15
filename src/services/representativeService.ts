
import { supabase } from "@/integrations/supabase/client";
import { Representative, RepresentativeFormData, RepresentativeInsertData } from "@/types/representative";

export async function createRepresentative(data: RepresentativeFormData): Promise<Representative> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const insertData: RepresentativeInsertData = {
    profile_id: user.id,
    pix_key: data.pix_key,
    identifier: '', // This will be overwritten by the database trigger
  };

  const { data: representative, error } = await supabase
    .from('representatives')
    .insert(insertData)
    .select()
    .single();

  if (error) throw error;
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
