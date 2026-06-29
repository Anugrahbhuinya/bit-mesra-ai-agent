import React from "react";
import { type PlannerTask } from "../types/planner";
import { AlertCircle, Calendar, Clock, ArrowRight, Hourglass } from "lucide-react";
import { Link } from "react-router-dom";

interface UpcomingExamCardProps {
  exam: PlannerTask | null;
}

export const UpcomingExamCard: React.FC<UpcomingExamCardProps> = ({ exam }) => {
  const getCountdown = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Parse target date YYYY-MM-DD
    const parts = dateStr.split("-");
    const target = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    target.setHours(0, 0, 0, 0);
    
    const diff = target.getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    if (days < 0) return "Completed";
    return `In ${days} days`;
  };

  if (!exam) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-6 gap-2 select-none">
        <Hourglass size={20} className="text-on-surface-variant/30" />
        <div>
          <h5 className="text-[10px] font-bold text-on-surface uppercase tracking-wider">No Upcoming Exams</h5>
          <p className="text-[9px] text-on-surface-variant max-w-[200px] mt-1 leading-normal">
            Your schedule is clear. Use the Planner to add mid-semester or end-semester papers.
          </p>
        </div>
      </div>
    );
  }

  const countdown = getCountdown(exam.due_date);
  const formattedDate = new Date(exam.due_date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });

  const isUrgent = countdown === "Today" || countdown === "Tomorrow" || countdown.includes("In 1") || countdown.includes("In 2");

  return (
    <div className="space-y-4 select-text">
      {/* Title & Countdown badge */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h5 className="text-[11px] font-bold text-primary leading-tight line-clamp-1">
            {exam.title}
          </h5>
          <span className="text-[7.5px] font-bold text-on-surface bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded uppercase tracking-wider block w-fit">
            Exam Paper
          </span>
        </div>

        <span className={`text-[8px] font-extrabold uppercase tracking-wider px-2 py-0.5 border rounded-full shrink-0 select-none ${
          isUrgent 
            ? "bg-red-500/10 border-red-500/25 text-red-400 animate-pulse" 
            : "bg-surface-container border-outline-variant/60 text-on-surface-variant"
        }`}>
          {countdown}
        </span>
      </div>

      {/* Date-time details */}
      <div className="grid grid-cols-2 gap-3 p-3 bg-surface-container/20 border border-outline-variant/40 rounded-xl select-none font-mono-code font-bold text-[9px] text-on-surface-variant">
        <div className="flex items-center gap-1.5">
          <Calendar size={11} className="text-primary shrink-0" />
          <span>{formattedDate}</span>
        </div>
        {exam.due_time && (
          <div className="flex items-center gap-1.5 justify-end">
            <Clock size={11} className="text-primary shrink-0" />
            <span>{exam.due_time}</span>
          </div>
        )}
      </div>

      {/* Direct Navigate link */}
      <Link
        to={`/academics/planner/task/${exam.id}`}
        className="text-[9px] font-bold text-primary hover:text-primary/80 uppercase tracking-widest flex items-center justify-end gap-1 select-none w-fit ml-auto hover:underline"
      >
        <span>Open Details</span>
        <ArrowRight size={10} />
      </Link>
    </div>
  );
};

export default UpcomingExamCard;
