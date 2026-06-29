import React, { useState, useMemo } from "react";
import { useTimeline } from "../hooks/useTimeline";
import Timeline from "../components/Timeline";
import LoadingState from "../components/LoadingState";
import { CalendarDays, Filter, ArrowLeft, RefreshCw, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const TimelinePage: React.FC = () => {
  const navigate = useNavigate();
  const { timeline, loading, error, refetch } = useTimeline();

  // Filter State
  const [selectedType, setSelectedType] = useState<string>("all");

  // Filtered Events
  const filteredEvents = useMemo(() => {
    if (selectedType === "all") return timeline;
    
    if (selectedType === "exams_quizzes") {
      return timeline.filter((e) => e.type === "exam" || e.type === "quiz");
    }
    
    return timeline.filter((e) => e.type === selectedType);
  }, [timeline, selectedType]);

  if (loading && timeline.length === 0) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6 select-text">
      {/* Header */}
      <div className="flex justify-between items-start gap-4 select-none">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/academics/planner")}
            className="p-1 hover:bg-surface-container border border-outline-variant/60 rounded-lg text-on-surface-variant hover:text-primary transition-all cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h2 className="text-sm font-bold text-primary uppercase tracking-wider">Academic Timeline</h2>
            <p className="text-[10px] text-on-surface-variant mt-0.5">
              Aggregated chronological stream of lectures, quiz/exam schedules, and personal tasks.
            </p>
          </div>
        </div>

        <button
          onClick={refetch}
          className="p-2 bg-surface-container border border-outline-variant/60 hover:border-primary/25 rounded-xl text-on-surface-variant hover:text-primary transition-all cursor-pointer"
          title="Refresh timeline"
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2 text-red-400 text-[10px] font-bold">
          <AlertCircle size={14} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter toolbar */}
      <div className="flex items-center gap-3 p-4 bg-surface-container/30 border border-outline-variant/40 rounded-2xl select-none max-w-md">
        <Filter size={14} className="text-on-surface-variant/40 shrink-0" />
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="w-full px-3 py-1.5 bg-surface-container border border-outline-variant focus:border-primary rounded-xl focus:outline-none text-on-surface text-xs font-semibold cursor-pointer"
        >
          <option value="all">All Events</option>
          <option value="class">Classes / Lectures</option>
          <option value="exams_quizzes">Exams & Quizzes</option>
          <option value="attendance_alert">Attendance Warnings</option>
          <option value="task">Planner Tasks</option>
          <option value="holiday">Holidays & Breaks</option>
        </select>
      </div>

      {/* Timeline display */}
      <Timeline events={filteredEvents} />
    </div>
  );
};

export default TimelinePage;
