import { useState, useEffect, useCallback } from "react";
import timetableApi from "../services/timetableApi";
import type { 
  Timetable, 
  WeeklyGroupedTimetable, 
  ClassEntry, 
  ClassEntryFormPayload 
} from "../types/timetable";

export const useTimetable = () => {
  const [timetable, setTimetable] = useState<Timetable | null>(null);
  const [weekGrouped, setWeekGrouped] = useState<WeeklyGroupedTimetable | null>(null);
  const [todayClasses, setTodayClasses] = useState<ClassEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTimetableData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [tData, wData, dData] = await Promise.all([
        timetableApi.getTimetable(),
        timetableApi.getWeekGrouped(),
        timetableApi.getTodayClasses()
      ]);
      setTimetable(tData);
      setWeekGrouped(wData);
      setTodayClasses(dData);
    } catch (err: any) {
      console.error("Failed to load timetable", err);
      setError(err.response?.data?.detail || "Failed to load timetable.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTimetableData();
  }, [fetchTimetableData]);

  const addClass = async (data: ClassEntryFormPayload) => {
    setError(null);
    try {
      const updated = await timetableApi.addClassEntry(data);
      setTimetable(updated);
      await fetchTimetableData(); // Refresh grouped list and today view
    } catch (err: any) {
      const msg = err.response?.data?.detail || "Failed to add class entry.";
      setError(msg);
      throw new Error(msg);
    }
  };

  const updateClass = async (id: string, data: Partial<ClassEntryFormPayload>) => {
    setError(null);
    try {
      const updated = await timetableApi.updateClassEntry(id, data);
      setTimetable(updated);
      await fetchTimetableData();
    } catch (err: any) {
      const msg = err.response?.data?.detail || "Failed to update class entry.";
      setError(msg);
      throw new Error(msg);
    }
  };

  const deleteClass = async (id: string) => {
    setError(null);
    try {
      const updated = await timetableApi.deleteClassEntry(id);
      setTimetable(updated);
      await fetchTimetableData();
    } catch (err: any) {
      const msg = err.response?.data?.detail || "Failed to delete class entry.";
      setError(msg);
      throw new Error(msg);
    }
  };

  const saveConfirmedTimetable = async (classes: ClassEntryFormPayload[]) => {
    setError(null);
    try {
      const updated = await timetableApi.confirmTimetable(classes);
      setTimetable(updated);
      await fetchTimetableData();
    } catch (err: any) {
      const msg = err.response?.data?.detail || "Failed to confirm and save timetable.";
      setError(msg);
      throw new Error(msg);
    }
  };

  return {
    timetable,
    weekGrouped,
    todayClasses,
    loading,
    error,
    refetch: fetchTimetableData,
    addClass,
    updateClass,
    deleteClass,
    saveConfirmedTimetable,
  };
};

export default useTimetable;
