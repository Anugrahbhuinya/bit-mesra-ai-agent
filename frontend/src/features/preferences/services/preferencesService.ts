import studentApi from "../../auth/services/api";
import type { 
  StudentPreferences, 
  UpdatePreferencesPayload, 
  PartialUpdatePreferencesPayload 
} from "../types";

export const preferencesService = {
  /**
   * Fetches personalized settings.
   */
  getPreferences: async (): Promise<StudentPreferences> => {
    const response = await studentApi.get<StudentPreferences>("/api/preferences");
    return response.data;
  },

  /**
   * Replaces all personalized settings.
   */
  updatePreferences: async (payload: UpdatePreferencesPayload): Promise<StudentPreferences> => {
    const response = await studentApi.put<StudentPreferences>("/api/preferences", payload);
    return response.data;
  },

  /**
   * Modifies specific keys of student preferences.
   */
  partialUpdatePreferences: async (payload: PartialUpdatePreferencesPayload): Promise<StudentPreferences> => {
    const response = await studentApi.patch<StudentPreferences>("/api/preferences", payload);
    return response.data;
  },

  /**
   * Resets all student settings to default.
   */
  resetPreferences: async (): Promise<StudentPreferences> => {
    const response = await studentApi.post<StudentPreferences>("/api/preferences/reset");
    return response.data;
  },
};

export default preferencesService;
