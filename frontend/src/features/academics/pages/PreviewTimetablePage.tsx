import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PreviewTable } from "../components/PreviewTable";
import { useTimetable } from "../hooks/useTimetable";
import { type ClassEntry } from "../types/timetable";
import { ArrowLeft, CheckCircle2, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

export const PreviewTimetablePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { saveConfirmedTimetable } = useTimetable();

  const [classes, setClasses] = useState<ClassEntry[]>([]);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (location.state && location.state.classes) {
      setClasses(location.state.classes);
    } else {
      // Redirect back if accessed directly without state
      navigate("/academics/timetable");
    }
  }, [location, navigate]);

  const validateAll = () => {
    if (classes.length === 0) return "Add at least one class before saving.";
    
    // Check for missing subjects or faculties
    for (const cls of classes) {
      if (!cls.subject.trim()) return "All class entries must have a subject name.";
      if (!cls.faculty.trim()) return "All class entries must have a faculty name.";
      if (!cls.classroom.trim()) return "All class entries must have a classroom location.";
      
      // Basic time validation
      const startParts = cls.start_time.split(":").map(Number);
      const endParts = cls.end_time.split(":").map(Number);
      if (startParts.length !== 2 || endParts.length !== 2) return "Invalid time formats.";
      const startMins = startParts[0] * 60 + startParts[1];
      const endMins = endParts[0] * 60 + endParts[1];
      if (startMins >= endMins) return `Invalid times: '${cls.subject}' start time must be before end time.`;
    }
    return null;
  };

  const handleSave = async () => {
    setError(null);
    const validationErrorMsg = validateAll();
    if (validationErrorMsg) {
      setError(validationErrorMsg);
      return;
    }

    setSaving(true);
    try {
      // Send confirm request
      await saveConfirmedTimetable(classes);
      navigate("/academics/timetable");
    } catch (err: any) {
      console.error("Failed to save schedule", err);
      setError(err.message || "Failed to confirm and save schedule.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto select-none">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/academics/timetable/import")}
            disabled={saving}
            className="p-2 bg-surface-container hover:bg-surface-container-high border border-outline-variant/60 rounded-xl text-on-surface-variant hover:text-primary transition-all cursor-pointer disabled:opacity-50"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="space-y-0.5">
            <h2 className="text-xs font-bold text-primary uppercase tracking-wider">Review Timetable</h2>
            <p className="text-[10px] text-on-surface-variant font-medium">
              Review and correct extracted class records before saving.
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving || classes.length === 0}
          className="flex items-center gap-1.5 px-5 py-3 bg-primary text-background font-bold text-xs uppercase tracking-wider rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer shadow-md"
        >
          {saving ? (
            <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-background border-t-transparent"></div>
          ) : (
            <CheckCircle2 size={14} />
          )}
          <span>Confirm & Save</span>
        </button>
      </div>

      {error && (
        <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2.5 text-red-400 text-[10px] font-semibold leading-relaxed">
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="matte-card rounded-2xl p-6 space-y-6 bg-surface-container"
      >
        <div className="space-y-1">
          <h3 className="text-xs font-bold text-primary uppercase tracking-wider select-none">AI Extracted Schedule Preview</h3>
          <p className="text-[10px] text-on-surface-variant select-none">
            Gemini processed your document and generated the entries below. Double-check and correct any mistakes.
          </p>
        </div>

        {/* Editable Preview Table */}
        <PreviewTable
          classes={classes}
          onChange={setClasses}
        />
      </motion.div>
    </div>
  );
};

export default PreviewTimetablePage;
