export interface StudentUser {
  roll_number: string;
  name: string;
  email: string;
  department: string;
  program: string;
  year: number;
  semester: number;
  section: string;
  profile_picture?: string | null;
  role: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: StudentUser;
}

export interface TokenRefreshResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}
