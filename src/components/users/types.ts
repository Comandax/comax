
export type SortField = 'name' | 'company' | 'email' | 'phone' | 'created_at';
export type SortOrder = 'asc' | 'desc';

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  created_at: string;
  fullName: string;
  companyName: string;
}
