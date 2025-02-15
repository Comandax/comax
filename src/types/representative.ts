
export interface Representative {
  id: string;
  profile_id: string;
  identifier: string;
  pix_key: string | null;
  created_at: string;
  updated_at: string;
}

export interface RepresentativeFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface RepresentativeInsertData {
  profile_id: string;
  identifier: string;
}
