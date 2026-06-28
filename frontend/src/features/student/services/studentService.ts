import studentApi from "../../auth/services/api";
import type { StudentUser } from "../../auth/types";

export interface StudentProfileUpdatePayload {
  name: string;
  email: string;
}

export interface StudentAccountStatus {
  roll_number: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

export const studentService = {
  /**
   * Retrieves the authenticated student's profile.
   */
  getProfile: async (): Promise<StudentUser> => {
    const response = await studentApi.get<StudentUser>("/api/student/profile");
    return response.data;
  },

  /**
   * Updates allowed student profile fields.
   */
  updateProfile: async (payload: StudentProfileUpdatePayload): Promise<StudentUser> => {
    const response = await studentApi.put<StudentUser>("/api/student/profile", payload);
    return response.data;
  },

  /**
   * Uploads an avatar image.
   */
  uploadProfilePicture: async (formData: FormData): Promise<{ profile_picture: string }> => {
    const response = await studentApi.patch<{ profile_picture: string }>(
      "/api/student/profile-picture",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  /**
   * Updates password.
   */
  changePassword: async (payload: any): Promise<void> => {
    await studentApi.patch("/api/student/change-password", payload);
  },

  /**
   * Fetch account details.
   */
  getAccount: async (): Promise<StudentAccountStatus> => {
    const response = await studentApi.get<StudentAccountStatus>("/api/student/account");
    return response.data;
  },
};

export default studentService;
