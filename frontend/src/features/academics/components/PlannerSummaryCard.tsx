import React from "react";
import { type PlannerSummaryData } from "../types/dashboard";
import { ListChecks, AlertTriangle, Clock, ArrowRight, Circle } from "lucide-react";
import { Link } from "react-router-dom";

interface PlannerSummaryCardProps {
  summary: PlannerSummaryData;
}

export const PlannerSummaryCard: React.FC<PlannerSummaryCardProps> = ({ summary }) => {
  const items = [
    { label: "Pending", count: summary.pendingTasksCount, icon: Clock, color: "text-amber-400" },
    { label: "High Priority", count: summary.highPriorityCount, icon: AlertTriangle, color: "text-red-400" },
    { label: "Today's Tasks", count: summary.todayTasksCount, icon: ListChecks, color: "text-primary" }
  ];

  return (
    <div className="space-y-4 select-text">
      {/* Counters Grid */}
      <div className="grid grid-cols-3 gap-2.5 select-none text-xs font-semibold">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <div key={it.label} className="p-3 bg-surface-container/20 border border-outline-variant/40 rounded-xl space-y-1.5 flex flex-col justify-between">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[7.5px] font-bold text-on-surface-variant uppercase tracking-wider block">
                  {it.label}
                </span>
                <Icon size={11} className={it.color} />
              </div>
              <span className="text-base font-extrabold text-on-surface font-mono-code leading-none block">
                {it.count}
              </span>
            </div>
          );
        })}
      </div>

      {/* Checklist stream */}
      <div className="space-y-2">
        <span className="text-[8px] font-bold text-on-surface-variant uppercase tracking-wider block select-none">
          Recent Checklist Items
        </span>
        
        {summary.recentPending.length === 0 ? (
          <p className="text-[9px] text-on-surface-variant italic py-2">
            No pending tasks. Your workspace is clear!
          </p>
        ) : (
          <div className="space-y-2">
            {summary.recentPending.map((task) => (
              <Link
                key={task.id}
                to={`/academics/planner/task/${task.id}`}
                className="flex items-start gap-2.5 p-2.5 border border-outline-variant/35 hover:border-primary/20 rounded-xl bg-surface-container/10 hover:bg-surface-container/40 transition-all select-text"
              >
                <Circle size={12} className="mt-0.5 text-on-surface-variant/40 shrink-0" />
                <div className="space-y-0.5">
                  <h6 className="text-[10px] font-bold text-primary leading-tight line-clamp-1">
                    {task.title}
                  </h6>
                  <span className="text-[7.5px] font-bold uppercase tracking-wider text-on-surface-variant/80 block select-none">
                    Due: {new Date(task.due_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Direct Navigate link */}
      <Link
        to="/academics/planner"
        className="text-[9px] font-bold text-primary hover:text-primary/80 uppercase tracking-widest flex items-center justify-end gap-1 select-none w-fit ml-auto hover:underline"
      >
        <span>Open Planner</span>
        <ArrowRight size={10} />
      </Link>
    </div>
  );
};

export default PlannerSummaryCard;
