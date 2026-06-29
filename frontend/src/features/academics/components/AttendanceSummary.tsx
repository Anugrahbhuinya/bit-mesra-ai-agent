import React from "react";
import { type DashboardSummary } from "../types/attendance";
import { ShieldAlert, TrendingUp, AlertTriangle, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface AttendanceSummaryProps {
  summary: DashboardSummary;
}

export const AttendanceSummary: React.FC<AttendanceSummaryProps> = ({ summary }) => {
  const isBelow = summary.overall_attendance < 75.0;

  return (
    <div className="space-y-6">
      {/* Overall stats banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className={`matte-card rounded-2xl p-6 border flex flex-col md:flex-row md:items-center justify-between gap-6 select-none ${
          isBelow 
            ? "bg-red-500/5 border-red-500/20" 
            : "bg-emerald-500/5 border-emerald-500/20"
        }`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-full border flex items-center justify-center ${
              isBelow
                ? "bg-red-500/10 border-red-500/20 text-red-400"
                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
            }`}
          >
            {isBelow ? <ShieldAlert size={22} /> : <ShieldCheck size={22} />}
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-primary uppercase tracking-wider">
              Semester Attendance
            </h3>
            <p className="text-[10px] text-on-surface-variant mt-0.5 max-w-md leading-normal">
              {isBelow
                ? "Your overall attendance is below the 75% regulatory requirement. Prioritize regular lectures to recover."
                : "Great job! Your cumulative attendance is in the safe zone. Maintain this streak."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="text-right">
            <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider block">
              Cumulative Stat
            </span>
            <span className="text-[8px] font-semibold text-on-surface-variant/70 block">
              {summary.total_attended} / {summary.total_conducted} lectures
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-4xl font-extrabold tracking-tight ${
                isBelow ? "text-red-400" : "text-emerald-400"
              }`}
            >
              {summary.overall_attendance.toFixed(1)}%
            </span>
            <span
              className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 border rounded-full ${
                isBelow
                  ? "border-red-500/20 text-red-400 bg-red-500/5"
                  : "border-emerald-500/20 text-emerald-400 bg-emerald-500/5"
              }`}
            >
              {isBelow ? "Critical" : "Safe"}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 select-text">
        {/* Best Subject */}
        <div className="matte-card rounded-2xl p-4.5 bg-surface-container/40 border border-outline-variant/50 flex flex-col justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-[8px] font-bold text-on-surface-variant uppercase tracking-wider block">
              Best Performing Course
            </span>
            {summary.best_subject ? (
              <span className="text-[11px] font-extrabold text-on-surface line-clamp-1">
                {summary.best_subject.subject_name}
              </span>
            ) : (
              <span className="text-[11px] font-semibold text-on-surface-variant/40">
                No data logged
              </span>
            )}
          </div>
          <div className="flex justify-between items-end">
            <span className="text-[9px] text-on-surface-variant font-medium">
              {summary.best_subject?.faculty || "—"}
            </span>
            <span className="text-lg font-extrabold text-emerald-400 font-mono-code">
              {summary.best_subject ? `${summary.best_subject.attendance_percentage.toFixed(1)}%` : "— %"}
            </span>
          </div>
        </div>

        {/* Lowest Subject */}
        <div className="matte-card rounded-2xl p-4.5 bg-surface-container/40 border border-outline-variant/50 flex flex-col justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-[8px] font-bold text-on-surface-variant uppercase tracking-wider block">
              Lowest Performing Course
            </span>
            {summary.lowest_subject ? (
              <span className="text-[11px] font-extrabold text-on-surface line-clamp-1">
                {summary.lowest_subject.subject_name}
              </span>
            ) : (
              <span className="text-[11px] font-semibold text-on-surface-variant/40">
                No data logged
              </span>
            )}
          </div>
          <div className="flex justify-between items-end">
            <span className="text-[9px] text-on-surface-variant font-medium">
              {summary.lowest_subject?.faculty || "—"}
            </span>
            <span
              className={`text-lg font-extrabold font-mono-code ${
                summary.lowest_subject && summary.lowest_subject.attendance_percentage < 75.0
                  ? "text-red-400"
                  : "text-amber-400"
              }`}
            >
              {summary.lowest_subject ? `${summary.lowest_subject.attendance_percentage.toFixed(1)}%` : "— %"}
            </span>
          </div>
        </div>

        {/* Warning Indicator */}
        <div className="matte-card rounded-2xl p-4.5 bg-surface-container/40 border border-outline-variant/50 flex flex-col justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-[8px] font-bold text-on-surface-variant uppercase tracking-wider block">
              Below Threshold Courses
            </span>
            <span className="text-xl font-black text-on-surface font-mono-code">
              {summary.below_threshold_count}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[9px] text-on-surface-variant">
            <TrendingUp size={12} className={summary.below_threshold_count > 0 ? "text-red-400" : "text-emerald-400"} />
            <span>
              {summary.below_threshold_count > 0
                ? `${summary.below_threshold_count} subject(s) need immediate attention`
                : "All tracked courses are fully compliant"}
            </span>
          </div>
        </div>

        {/* Short Term Trend Stats */}
        <div className="matte-card rounded-2xl p-4.5 bg-surface-container/40 border border-outline-variant/50 flex flex-col justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[8px] font-bold text-on-surface-variant uppercase tracking-wider block">
              Recent Performance (30 Days)
            </span>
            <div className="flex items-center justify-between text-[10px] font-semibold text-on-surface select-none">
              <span>Conducted:</span>
              <span className="font-mono-code">{summary.monthly_summary.conducted}</span>
            </div>
            <div className="flex items-center justify-between text-[10px] font-semibold text-on-surface select-none">
              <span>Attended:</span>
              <span className="font-mono-code">{summary.monthly_summary.attended}</span>
            </div>
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold border-t border-outline-variant/30 pt-1">
            <span className="text-on-surface-variant uppercase tracking-wider">Trend Rate:</span>
            <span className={summary.monthly_summary.percentage >= 75 ? "text-emerald-400" : "text-red-400"}>
              {summary.monthly_summary.percentage.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceSummary;
