import { useState, useEffect, useCallback } from "react";
import plannerApi from "../services/plannerApi";
import type { TimelineEvent } from "../types/planner";

export const useTimeline = (autoFetch: boolean = true) => {
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [upcoming, setUpcoming] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTimelineData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [tData, uData] = await Promise.all([
        plannerApi.getTimeline(),
        plannerApi.getUpcoming()
      ]);
      setTimeline(tData);
      setUpcoming(uData);
    } catch (err: any) {
      console.error("Failed to load timeline", err);
      setError(err.response?.data?.detail || "Failed to load timeline events.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchTimelineData();
    }
  }, [autoFetch, fetchTimelineData]);

  return {
    timeline,
    upcoming,
    loading,
    error,
    refetch: fetchTimelineData
  };
};

export default useTimeline;
