import { createContext, useState, useEffect, type ReactNode } from "react";
import { authService } from "../services/authService";
import type { StudentUser } from "../types";
import { clearStudentSession } from "../services/api";

export interface AuthContextType {
  currentUser: StudentUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (payload: any, remember: boolean) => Promise<void>;
  logout: () => Promise<void>;
  registerStudent: (payload: any) => Promise<StudentUser>;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<StudentUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProfile = async () => {
    try {
      const user = await authService.getMe();
      if (user && user.role === "student") {
        setCurrentUser(user);
      } else {
        clearStudentSession();
        setCurrentUser(null);
      }
    } catch (error) {
      console.error("Failed to restore student session", error);
      clearStudentSession();
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("bit_student_access_token") || sessionStorage.getItem("bit_student_access_token");
    if (accessToken) {
      fetchProfile();
    } else {
      setLoading(false);
    }

    // Listen to force logout event dispatched from Axios interceptor on refresh failure
    const handleForceLogout = () => {
      setCurrentUser(null);
    };

    window.addEventListener("student-logout", handleForceLogout);
    return () => {
      window.removeEventListener("student-logout", handleForceLogout);
    };
  }, []);

  const login = async (payload: any, remember: boolean) => {
    setLoading(true);
    try {
      const response = await authService.login(payload);
      
      // Store tokens based on remember choice
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem("bit_student_access_token", response.access_token);
      storage.setItem("bit_student_refresh_token", response.refresh_token);
      
      setCurrentUser(response.user);
    } catch (error) {
      clearStudentSession();
      setCurrentUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    const refreshToken = localStorage.getItem("bit_student_refresh_token");
    try {
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch (error) {
      console.error("Logout request error", error);
    } finally {
      clearStudentSession();
      setCurrentUser(null);
      setLoading(false);
    }
  };

  const registerStudent = async (payload: any) => {
    setLoading(true);
    try {
      const user = await authService.register(payload);
      return user;
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    try {
      const user = await authService.getMe();
      setCurrentUser(user);
    } catch (error) {
      console.error("Error refreshing profile", error);
    }
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    isAuthenticated: !!currentUser,
    login,
    logout,
    registerStudent,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
