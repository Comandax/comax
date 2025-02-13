
export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
  email_confirmed: boolean | null;
  confirmation_token?: string;
}

export interface ProfileFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}
