
export interface User {
  id: string;
  email: string;
  companyId: string;
}

export interface AuthProvider {
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<User | null>;
}
