
export type Role = 'superuser' | 'owner' | 'representative';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  companyId: string;
  roles?: Role[];
}

export interface AuthProvider {
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<User | null>;
  getUserRoles: (userId: string) => Promise<Role[]>;
}
