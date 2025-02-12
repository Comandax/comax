
export interface Company {
  id: string;
  name: string;
  active: boolean;
  logo_url?: string;
  created_at: string;
  owner_id: string;
  short_name: string;
}

export type SortField = "name" | "created_at";
export type SortOrder = "asc" | "desc";
