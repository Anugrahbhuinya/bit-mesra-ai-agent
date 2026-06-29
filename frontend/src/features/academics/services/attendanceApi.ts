import studentApi from "../../auth/services/api";
import type {
  AttendanceRecord,
  DashboardSummary,
  AttendanceLog,
  AttendanceAnalytics,
  AttendanceLogCreatePayload,
  AttendanceLogUpdatePayload
} from "../types/attendance";

export const attendanceApi = {
  getAttendanceRecords: async (): Promise<AttendanceRecord[]> => {
    const response = await studentApi.get<AttendanceRecord[]>("/api/attendance");
    return response.data;
  },

  getDashboardSummary: async (): Promise<DashboardSummary> => {
    const response = await studentApi.get<DashboardSummary>("/api/attendance/summary");
    return response.data;
  },

  getSubjectHistory: async (subjectId: string): Promise<AttendanceLog[]> => {
    const response = await studentApi.get<AttendanceLog[]>(`/api/attendance/history/${subjectId}`);
    return response.data;
  },

  createLog: async (payload: AttendanceLogCreatePayload): Promise<AttendanceRecord> => {
    const response = await studentApi.post<AttendanceRecord>("/api/attendance/log", payload);
    return response.data;
  },

  updateLog: async (logId: string, payload: AttendanceLogUpdatePayload): Promise<AttendanceRecord> => {
    const response = await studentApi.put<AttendanceRecord>(`/api/attendance/log/${logId}`, payload);
    return response.data;
  },

  deleteLog: async (logId: string): Promise<AttendanceRecord> => {
    const response = await studentApi.delete<AttendanceRecord>(`/api/attendance/log/${logId}`);
    return response.data;
  },

  getAnalytics: async (): Promise<AttendanceAnalytics> => {
    const response = await studentApi.get<AttendanceAnalytics>("/api/attendance/analytics");
    return response.data;
  }
};

export default attendanceApi;
