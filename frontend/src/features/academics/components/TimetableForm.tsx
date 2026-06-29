import React, { useState } from "react";
import type { ClassEntryFormPayload } from "../types/timetable";
import { AlertCircle } from "lucide-react";

interface TimetableFormProps {
  initialValues?: Partial<ClassEntryFormPayload>;
  onSubmit: (values: ClassEntryFormPayload) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

export const TimetableForm: React.FC<TimetableFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = "Save Class",
}) => {
  const [day, setDay] = useState(initialValues?.day || "Monday");
  const [subject, setSubject] = useState(initialValues?.subject || "");
  const [faculty, setFaculty] = useState(initialValues?.faculty || "");
  const [classroom, setClassroom] = useState(initialValues?.classroom || "");
  const [building, setBuilding] = useState(initialValues?.building || "");
  const [startTime, setStartTime] = useState(initialValues?.start_time || "09:00");
  const [endTime, setEndTime] = useState(initialValues?.end_time || "10:00");
  const [remarks, setRemarks] = useState(initialValues?.remarks || "");

  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validate = () => {
    if (!subject.trim()) return "Subject name is required.";
    if (!faculty.trim()) return "Faculty name is required.";
    if (!classroom.trim()) return "Classroom location is required.";
    
    // Time regex validation (HH:MM)
    const timeRegex = /^\d{2}:\d{2}$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      return "Time must be in HH:MM format.";
    }

    const startParts = startTime.split(":").map(Number);
    const endParts = endTime.split(":").map(Number);
    
    if (startParts[0] > 23 || startParts[1] > 59 || endParts[0] > 23 || endParts[1] > 59) {
      return "Start or end time contains invalid values.";
    }

    const startMins = startParts[0] * 60 + startParts[1];
    const endMins = endParts[0] * 60 + endParts[1];

    if (startMins >= endMins) {
      return "Start time must be before end time.";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const errorMsg = validate();
    if (errorMsg) {
      setValidationError(errorMsg);
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        day,
        subject: subject.trim(),
        faculty: faculty.trim(),
        classroom: classroom.trim(),
        building: building.trim() || undefined,
        start_time: startTime.trim(),
        end_time: endTime.trim(),
        remarks: remarks.trim() || undefined,
      });
    } catch (err: any) {
      setValidationError(err.message || "Failed to submit timetable slot.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 select-text">
      {validationError && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2 text-red-400 text-[11px] font-semibold select-none">
          <AlertCircle size={14} className="shrink-0 mt-0.5" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Subject */}
      <div className="space-y-1.5">
        <label className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider block">
          Subject Name
        </label>
        <input
          type="text"
          placeholder="e.g. Distributed Systems"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          className="w-full px-4.5 py-3 bg-surface-container border border-outline-variant focus:border-primary rounded-xl focus:outline-none transition-all text-on-surface placeholder:text-on-surface-variant/20 text-xs font-semibold"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Faculty */}
        <div className="space-y-1.5">
          <label className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider block">
            Faculty / Professor
          </label>
          <input
            type="text"
            placeholder="e.g. Prof. S. R. Sharma"
            value={faculty}
            onChange={(e) => setFaculty(e.target.value)}
            required
            className="w-full px-4.5 py-3 bg-surface-container border border-outline-variant focus:border-primary rounded-xl focus:outline-none transition-all text-on-surface placeholder:text-on-surface-variant/20 text-xs font-semibold"
          />
        </div>

        {/* Day Select */}
        <div className="space-y-1.5">
          <label className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider block">
            Day
          </label>
          <select
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="w-full px-4 py-3 bg-surface-container border border-outline-variant focus:border-primary rounded-xl focus:outline-none transition-all text-on-surface text-xs font-semibold"
          >
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((d) => (
              <option key={d} value={d} className="bg-surface-container-high text-on-surface">
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Classroom */}
        <div className="space-y-1.5">
          <label className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider block">
            Classroom Location
          </label>
          <input
            type="text"
            placeholder="e.g. LH-1 or CAD Lab"
            value={classroom}
            onChange={(e) => setClassroom(e.target.value)}
            required
            className="w-full px-4.5 py-3 bg-surface-container border border-outline-variant focus:border-primary rounded-xl focus:outline-none transition-all text-on-surface placeholder:text-on-surface-variant/20 text-xs font-semibold"
          />
        </div>

        {/* Building */}
        <div className="space-y-1.5">
          <label className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider block">
            Building (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Main Building"
            value={building}
            onChange={(e) => setBuilding(e.target.value)}
            className="w-full px-4.5 py-3 bg-surface-container border border-outline-variant focus:border-primary rounded-xl focus:outline-none transition-all text-on-surface placeholder:text-on-surface-variant/20 text-xs font-semibold"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Start Time */}
        <div className="space-y-1.5">
          <label className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider block">
            Start Time (24-hour HH:MM)
          </label>
          <input
            type="text"
            placeholder="e.g. 09:00"
            maxLength={5}
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
            className="w-full px-4.5 py-3 bg-surface-container border border-outline-variant focus:border-primary rounded-xl focus:outline-none transition-all text-on-surface placeholder:text-on-surface-variant/20 text-xs font-mono-code font-bold"
          />
        </div>

        {/* End Time */}
        <div className="space-y-1.5">
          <label className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider block">
            End Time (24-hour HH:MM)
          </label>
          <input
            type="text"
            placeholder="e.g. 10:00"
            maxLength={5}
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
            className="w-full px-4.5 py-3 bg-surface-container border border-outline-variant focus:border-primary rounded-xl focus:outline-none transition-all text-on-surface placeholder:text-on-surface-variant/20 text-xs font-mono-code font-bold"
          />
        </div>
      </div>

      {/* Remarks */}
      <div className="space-y-1.5">
        <label className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider block">
          Remarks / Notes (Optional)
        </label>
        <input
          type="text"
          placeholder="e.g. Bring lab journals"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          className="w-full px-4.5 py-3 bg-surface-container border border-outline-variant focus:border-primary rounded-xl focus:outline-none transition-all text-on-surface placeholder:text-on-surface-variant/20 text-xs font-semibold"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end pt-4 select-none">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-5 py-3 bg-surface-container-low hover:bg-surface-container border border-outline-variant text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all disabled:opacity-50 cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-3 bg-primary text-background font-bold text-[11px] uppercase tracking-wider rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 flex items-center gap-1.5 cursor-pointer shadow-md"
        >
          {loading && <div className="animate-spin rounded-full h-3 w-3 border-2 border-background border-t-transparent"></div>}
          <span>{submitLabel}</span>
        </button>
      </div>
    </form>
  );
};

export default TimetableForm;
