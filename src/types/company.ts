
export interface Company {
  id: string;
  name: string;
  responsible: string;
  email: string;
  phone: string;
  active: boolean;
  logo_url?: string;
  created_at: string;
  owner_id: string;
  short_name: string;
}

export type SortField = "name" | "responsible" | "created_at";
export type SortOrder = "asc" | "desc";
