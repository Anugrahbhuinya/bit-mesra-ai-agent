import studentApi from "../../auth/services/api";
import type { 
  Timetable, 
  WeeklyGroupedTimetable, 
  ClassEntry, 
  ClassEntryFormPayload 
} from "../types/timetable";

export const timetableApi = {
  getTimetable: async (): Promise<Timetable> => {
    const response = await studentApi.get<Timetable>("/api/timetable");
    return response.data;
  },

  getWeekGrouped: async (): Promise<WeeklyGroupedTimetable> => {
    const response = await studentApi.get<WeeklyGroupedTimetable>("/api/timetable/week");
    return response.data;
  },

  getTodayClasses: async (): Promise<ClassEntry[]> => {
    const response = await studentApi.get<ClassEntry[]>("/api/timetable/today");
    return response.data;
  },

  addClassEntry: async (data: ClassEntryFormPayload): Promise<Timetable> => {
    const response = await studentApi.post<Timetable>("/api/timetable", data);
    return response.data;
  },

  updateClassEntry: async (id: string, data: Partial<ClassEntryFormPayload>): Promise<Timetable> => {
    const response = await studentApi.put<Timetable>(`/api/timetable/${id}`, data);
    return response.data;
  },

  deleteClassEntry: async (id: string): Promise<Timetable> => {
    const response = await studentApi.delete<Timetable>(`/api/timetable/${id}`);
    return response.data;
  },

  importTimetable: async (file: File, onUploadProgress?: (progressEvent: any) => void): Promise<{ status: string; classes: ClassEntry[] }> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await studentApi.post<{ status: string; classes: ClassEntry[] }>(
      "/api/timetable/import",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress,
      }
    );
    return response.data;
  },

  confirmTimetable: async (classes: ClassEntryFormPayload[]): Promise<Timetable> => {
    const response = await studentApi.post<Timetable>("/api/timetable/confirm", { classes });
    return response.data;
  }
};

export default timetableApi;
