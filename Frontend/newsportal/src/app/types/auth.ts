export interface User {
  id: string;
  email: string;
  username: string;
  bio?: string;
  profile_picture?: string | null;
  date_joined: string;
  is_staff: boolean; // Match the backend field name exactly
}

export interface AuthResponse {
  refresh: string;
  access: string;
  user: User;
}