
export interface Representative {
  id: string;
  identifier: string;
  created_at: string;
  updated_at: string;
}

export interface RepresentativeCompany {
  id: string;
  name: string;
  owner: {
    first_name: string;
    last_name: string;
    email: string | null;
    phone: string | null;
  };
  logo_url?: string;
}
