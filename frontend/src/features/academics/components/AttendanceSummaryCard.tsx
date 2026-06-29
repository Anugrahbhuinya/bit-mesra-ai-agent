import React from "react";
import { type DashboardSummary } from "../types/attendance";
import { CheckSquare, AlertTriangle, ArrowRight, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";
import AttendanceProgress from "./AttendanceProgress";

interface AttendanceSummaryCardProps {
  summary: DashboardSummary;
}

export const AttendanceSummaryCard: React.FC<AttendanceSummaryCardProps> = ({ summary }) => {
  const overall = summary.overall_attendance;
  const belowCount = summary.below_threshold_count;

  return (
    <div className="space-y-4 select-text">
      {/* Big percentage & Alert banner */}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-0.5">
          <span className="text-[8px] font-bold text-on-surface-variant uppercase tracking-wider block select-none">
            Overall Attendance
          </span>
          <span className="text-2xl font-black text-primary font-mono-code leading-none">
            {overall.toFixed(1)}%
          </span>
        </div>

        {/* Warning Indicator */}
        {belowCount > 0 ? (
          <div className="flex items-center gap-1.5 p-2 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 select-none">
            <ShieldAlert size={14} className="animate-bounce" />
            <div className="text-right">
              <span className="text-[7.5px] font-extrabold uppercase tracking-wider block">
                {belowCount} At Risk
              </span>
              <span className="text-[7px] text-red-400/80 block leading-none">
                Below 75%
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 select-none">
            <CheckSquare size={14} />
            <div className="text-right">
              <span className="text-[7.5px] font-extrabold uppercase tracking-wider block">
                All Safe
              </span>
              <span className="text-[7px] text-emerald-400/80 block leading-none">
                No Warning
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Progress slider bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-[8px] font-bold text-on-surface-variant uppercase tracking-wider select-none">
          <span>Progress Bar</span>
          <span>Threshold 75%</span>
        </div>
        <AttendanceProgress percentage={overall} />
      </div>

      {/* Stats summaries */}
      <div className="grid grid-cols-2 gap-3 select-none text-xs font-semibold">
        <div className="p-3 bg-surface-container/20 border border-outline-variant/40 rounded-xl space-y-1">
          <span className="text-[8px] font-bold text-on-surface-variant uppercase tracking-wider block">
            Best Performer
          </span>
          <span className="text-[9.5px] font-bold text-primary block truncate">
            {summary.best_subject?.subject_name || "N/A"}
          </span>
        </div>

        <div className="p-3 bg-surface-container/20 border border-outline-variant/40 rounded-xl space-y-1">
          <span className="text-[8px] font-bold text-on-surface-variant uppercase tracking-wider block">
            Needs Focus
          </span>
          <span className="text-[9.5px] font-bold text-primary block truncate">
            {summary.lowest_subject?.subject_name || "N/A"}
          </span>
        </div>
      </div>

      {/* Direct Navigate link */}
      <Link
        to="/academics/attendance"
        className="text-[9px] font-bold text-primary hover:text-primary/80 uppercase tracking-widest flex items-center justify-end gap-1 select-none w-fit ml-auto hover:underline"
      >
        <span>Track Attendance</span>
        <ArrowRight size={10} />
      </Link>
    </div>
  );
};

export default AttendanceSummaryCard;
