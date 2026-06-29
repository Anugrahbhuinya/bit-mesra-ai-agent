import { useState, useEffect, useCallback } from "react";
import academicDashboardApi from "../services/academicDashboardApi";
import type { AcademicDashboardPayload } from "../types/dashboard";

export const useAcademicDashboard = (autoFetch: boolean = true) => {
  const [dashboardData, setDashboardData] = useState<AcademicDashboardPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await academicDashboardApi.getDashboard();
      setDashboardData(data);
    } catch (err: any) {
      console.error("Failed to load academic dashboard", err);
      setError(err.response?.data?.detail || "Failed to load academic dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchDashboard();
    }
  }, [autoFetch, fetchDashboard]);

  return {
    dashboardData,
    loading,
    error,
    refetch: fetchDashboard
  };
};

export default useAcademicDashboard;
