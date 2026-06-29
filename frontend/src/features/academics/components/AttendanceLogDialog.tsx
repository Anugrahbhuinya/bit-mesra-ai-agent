import React, { useState, useEffect } from "react";
import { type RecentAttendanceLogEnriched, type AttendanceStatus } from "../types/attendance";
import { X, CalendarDays, BookOpen, Layers, MessageSquare, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AttendanceLogDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: {
    subject_name: string;
    class_date: string;
    status: AttendanceStatus;
    remarks?: string;
  }) => Promise<void>;
  subjects: string[];
  editLog?: RecentAttendanceLogEnriched | null;
}

export const AttendanceLogDialog: React.FC<AttendanceLogDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  subjects,
  editLog = null
}) => {
  const isEditing = !!editLog;
  
  // States
  const [subjectName, setSubjectName] = useState("");
  const [classDate, setClassDate] = useState("");
  const [status, setStatus] = useState<AttendanceStatus>("Present");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get today's date in local time YYYY-MM-DD
  const getTodayDateString = () => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const localDate = new Date(today.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (isOpen) {
      setError(null);
      if (editLog) {
        setSubjectName(editLog.subject_name);
        setClassDate(editLog.class_date);
        setStatus(editLog.status);
        setRemarks(editLog.remarks || "");
      } else {
        setSubjectName(subjects[0] || "");
        setClassDate(getTodayDateString());
        setStatus("Present");
        setRemarks("");
      }
    }
  }, [isOpen, editLog, subjects]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!subjectName.trim()) {
      setError("Please select or enter a subject name.");
      return;
    }
    if (!classDate) {
      setError("Please select a valid date.");
      return;
    }

    // Check future date
    const todayStr = getTodayDateString();
    if (classDate > todayStr) {
      setError("Cannot log attendance for future dates.");
      return;
    }

    setLoading(true);
    try {
      await onSave({
        subject_name: subjectName.trim(),
        class_date: classDate,
        status: status,
        remarks: remarks.trim() || undefined
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save attendance log. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md bg-surface-container border border-outline-variant rounded-2xl p-6 shadow-xl z-10 overflow-hidden"
        >
          {/* Header */}
          <div className="flex justify-between items-center select-none border-b border-outline-variant/30 pb-4 mb-4">
            <div>
              <h3 className="text-xs font-bold text-primary uppercase tracking-wider">
                {isEditing ? "Edit Attendance Session" : "Log Attendance Session"}
              </h3>
              <p className="text-[9px] text-on-surface-variant mt-0.5">
                {isEditing ? "Update details of a previously logged class." : "Manually log a past lecture or session."}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-surface-container-high border border-outline-variant/60 rounded-lg text-on-surface-variant hover:text-primary transition-all cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2 text-red-400 text-[10px] font-bold">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Subject Select */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5 select-none">
                <BookOpen size={10} />
                Course / Subject
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={subjectName}
                  disabled
                  className="w-full px-4.5 py-3 bg-surface-container-high border border-outline-variant rounded-xl text-on-surface/50 text-xs font-semibold select-none outline-none cursor-not-allowed"
                />
              ) : subjects.length > 0 ? (
                <select
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  className="w-full px-4.5 py-3 bg-surface-container-high border border-outline-variant focus:border-primary rounded-xl focus:outline-none transition-all text-on-surface text-xs font-semibold cursor-pointer"
                >
                  {subjects.map((sub) => (
                    <option key={sub} value={sub} className="bg-surface-container-high text-on-surface">
                      {sub}
                    </option>
                  ))}
                  <option value="" className="text-on-surface-variant/40">-- Custom Subject --</option>
                </select>
              ) : (
                <input
                  type="text"
                  placeholder="e.g. Compiler Design"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  required
                  className="w-full px-4.5 py-3 bg-surface-container-high border border-outline-variant focus:border-primary rounded-xl focus:outline-none transition-all text-on-surface placeholder:text-on-surface-variant/30 text-xs font-semibold"
                />
              )}

              {/* Custom Subject text field if Select returns empty/other */}
              {!isEditing && subjects.length > 0 && subjectName === "" && (
                <input
                  type="text"
                  placeholder="Enter subject name"
                  onChange={(e) => setSubjectName(e.target.value)}
                  required
                  className="w-full mt-2 px-4.5 py-3 bg-surface-container-high border border-outline-variant focus:border-primary rounded-xl focus:outline-none transition-all text-on-surface placeholder:text-on-surface-variant/30 text-xs font-semibold animate-fade-in"
                />
              )}
            </div>

            {/* Date and Status Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Date */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5 select-none">
                  <CalendarDays size={10} />
                  Date
                </label>
                <input
                  type="date"
                  max={getTodayDateString()}
                  value={classDate}
                  onChange={(e) => setClassDate(e.target.value)}
                  required
                  className="w-full px-4.5 py-3 bg-surface-container-high border border-outline-variant focus:border-primary rounded-xl focus:outline-none transition-all text-on-surface text-xs font-semibold cursor-pointer"
                />
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5 select-none">
                  <Layers size={10} />
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as AttendanceStatus)}
                  className="w-full px-4.5 py-3 bg-surface-container-high border border-outline-variant focus:border-primary rounded-xl focus:outline-none transition-all text-on-surface text-xs font-semibold cursor-pointer"
                >
                  <option value="Present" className="bg-surface-container-high text-emerald-400">Present</option>
                  <option value="Absent" className="bg-surface-container-high text-red-400">Absent</option>
                  <option value="Cancelled" className="bg-surface-container-high text-slate-400">Cancelled</option>
                  <option value="Holiday" className="bg-surface-container-high text-indigo-400">Holiday</option>
                  <option value="Medical Leave" className="bg-surface-container-high text-blue-400">Medical Leave</option>
                </select>
              </div>
            </div>

            {/* Remarks */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5 select-none">
                <MessageSquare size={10} />
                Remarks (Optional)
              </label>
              <textarea
                placeholder="e.g. Excused for college fest, or make-up class"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                maxLength={200}
                rows={2.5}
                className="w-full px-4.5 py-3 bg-surface-container-high border border-outline-variant focus:border-primary rounded-xl focus:outline-none transition-all text-on-surface placeholder:text-on-surface-variant/30 text-xs font-semibold resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-5 mt-4 bg-primary text-background font-bold text-xs uppercase tracking-wider rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:pointer-events-none select-none shadow-md cursor-pointer"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-background border-t-transparent"></div>
              ) : (
                <span>{isEditing ? "Save Changes" : "Log Session"}</span>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AttendanceLogDialog;
