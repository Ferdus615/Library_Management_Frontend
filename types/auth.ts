export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
  phone?: string;
  address?: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}
