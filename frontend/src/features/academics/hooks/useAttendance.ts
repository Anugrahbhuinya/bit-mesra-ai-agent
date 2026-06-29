import { useState, useEffect, useCallback } from "react";
import attendanceApi from "../services/attendanceApi";
import type {
  AttendanceRecord,
  DashboardSummary,
  AttendanceAnalytics,
  AttendanceLog,
  AttendanceLogCreatePayload,
  AttendanceLogUpdatePayload
} from "../types/attendance";

export const useAttendance = (autoFetch: boolean = true) => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [analytics, setAnalytics] = useState<AttendanceAnalytics | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const sumData = await attendanceApi.getDashboardSummary();
      setSummary(sumData);
    } catch (err: any) {
      console.error("Failed to load attendance summary", err);
      setError(err.response?.data?.detail || "Failed to load attendance summary.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const recData = await attendanceApi.getAttendanceRecords();
      setRecords(recData);
    } catch (err: any) {
      console.error("Failed to load attendance records", err);
      setError(err.response?.data?.detail || "Failed to load attendance records.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const analyticData = await attendanceApi.getAnalytics();
      setAnalytics(analyticData);
    } catch (err: any) {
      console.error("Failed to load attendance analytics", err);
      setError(err.response?.data?.detail || "Failed to load attendance analytics.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [recData, sumData, analyticData] = await Promise.all([
        attendanceApi.getAttendanceRecords(),
        attendanceApi.getDashboardSummary(),
        attendanceApi.getAnalytics()
      ]);
      setRecords(recData);
      setSummary(sumData);
      setAnalytics(analyticData);
    } catch (err: any) {
      console.error("Failed to fetch all attendance data", err);
      setError(err.response?.data?.detail || "Failed to load attendance data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchAllData();
    }
  }, [autoFetch, fetchAllData]);

  const logAttendance = async (payload: AttendanceLogCreatePayload) => {
    setError(null);
    try {
      const updatedRecord = await attendanceApi.createLog(payload);
      await fetchAllData(); // reload all stats dynamically
      return updatedRecord;
    } catch (err: any) {
      const msg = err.response?.data?.detail || "Failed to create attendance entry.";
      setError(msg);
      throw new Error(msg);
    }
  };

  const updateAttendanceLog = async (logId: string, payload: AttendanceLogUpdatePayload) => {
    setError(null);
    try {
      const updatedRecord = await attendanceApi.updateLog(logId, payload);
      await fetchAllData();
      return updatedRecord;
    } catch (err: any) {
      const msg = err.response?.data?.detail || "Failed to update attendance log.";
      setError(msg);
      throw new Error(msg);
    }
  };

  const deleteAttendanceLog = async (logId: string) => {
    setError(null);
    try {
      const updatedRecord = await attendanceApi.deleteLog(logId);
      await fetchAllData();
      return updatedRecord;
    } catch (err: any) {
      const msg = err.response?.data?.detail || "Failed to delete attendance log.";
      setError(msg);
      throw new Error(msg);
    }
  };

  const fetchSubjectHistory = async (subjectId: string): Promise<AttendanceLog[]> => {
    try {
      return await attendanceApi.getSubjectHistory(subjectId);
    } catch (err: any) {
      const msg = err.response?.data?.detail || "Failed to fetch subject history.";
      throw new Error(msg);
    }
  };

  return {
    records,
    summary,
    analytics,
    loading,
    error,
    refetchAll: fetchAllData,
    fetchRecords,
    fetchSummary,
    fetchAnalytics,
    logAttendance,
    updateAttendanceLog,
    deleteAttendanceLog,
    fetchSubjectHistory
  };
};

export default useAttendance;
