
export interface Representative {
  id: string;
  profile_id: string;
  identifier: string;
  pix_key: string;
  created_at: string;
  updated_at: string;
}

export interface RepresentativeFormData {
  pix_key: string;
}

export interface RepresentativeInsertData {
  profile_id: string;
  pix_key: string;
  identifier?: string;
}
