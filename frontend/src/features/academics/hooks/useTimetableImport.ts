import { useState } from "react";
import timetableApi from "../services/timetableApi";
import type { ClassEntry } from "../types/timetable";

export const useTimetableImport = () => {
  const [classesPreview, setClassesPreview] = useState<ClassEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const importFile = async (file: File) => {
    setLoading(true);
    setProgress(0);
    setError(null);
    try {
      const response = await timetableApi.importTimetable(file, (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total || progressEvent.loaded)
        );
        // Cap upload progress at 90%, leaving 10% for backend extraction
        setProgress(Math.min(percentCompleted, 90));
      });

      // Artificial progress bar finish
      setProgress(100);
      setClassesPreview(response.classes);
      return response.classes;
    } catch (err: any) {
      console.error("AI import failed", err);
      const msg = err.response?.data?.detail || "AI timetable extraction failed. Please try a cleaner image/PDF or input manually.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const clearPreview = () => {
    setClassesPreview([]);
    setProgress(0);
    setError(null);
  };

  return {
    classesPreview,
    setClassesPreview,
    loading,
    progress,
    error,
    importFile,
    clearPreview,
  };
};

export default useTimetableImport;
