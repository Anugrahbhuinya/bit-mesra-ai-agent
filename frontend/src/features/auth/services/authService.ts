import studentApi from "./api";
import type { AuthResponse, TokenRefreshResponse, StudentUser } from "../types";

export const authService = {
  /**
   * Registers a new student.
   */
  register: async (payload: any): Promise<StudentUser> => {
    const response = await studentApi.post<StudentUser>("/api/auth/register", payload);
    return response.data;
  },

  /**
   * Logs in a student, returning access token, refresh token, and profile.
   */
  login: async (payload: any): Promise<AuthResponse> => {
    const response = await studentApi.post<AuthResponse>("/api/auth/login", payload);
    return response.data;
  },

  /**
   * Performs explicit logout by revoking the refresh token session on the backend.
   */
  logout: async (refreshToken: string): Promise<void> => {
    await studentApi.post("/api/auth/logout", { refresh_token: refreshToken });
  },

  /**
   * Manually triggers a token refresh cycle.
   */
  refresh: async (refreshToken: string): Promise<TokenRefreshResponse> => {
    const response = await studentApi.post<TokenRefreshResponse>("/api/auth/refresh", {
      refresh_token: refreshToken,
    });
    return response.data;
  },

  /**
   * Fetches the current authenticated student user profile.
   */
  getMe: async (): Promise<StudentUser> => {
    const response = await studentApi.get<StudentUser>("/api/auth/me");
    return response.data;
  },
};
