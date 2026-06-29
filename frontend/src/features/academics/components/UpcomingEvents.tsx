import React from "react";
import { type TimelineEvent } from "../types/planner";
import { Calendar, Clock, AlertTriangle, Layers, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface UpcomingEventsProps {
  events: TimelineEvent[];
  maxItems?: number;
}

export const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events, maxItems = 5 }) => {
  const getEventBadge = (type: string) => {
    const config: Record<string, string> = {
      class: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
      exam: "bg-red-500/10 border-red-500/20 text-red-400",
      quiz: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
      holiday: "bg-slate-500/10 border-slate-500/20 text-slate-400",
      registration: "bg-blue-500/10 border-blue-500/20 text-blue-400",
      attendance_alert: "bg-amber-500/10 border-amber-500/20 text-amber-400",
      task: "bg-purple-500/10 border-purple-500/20 text-purple-400"
    };

    return (
      <span className={`text-[7px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 border rounded-full leading-none shrink-0 ${
        config[type] || "bg-surface-container border-outline-variant text-on-surface-variant"
      }`}>
        {type}
      </span>
    );
  };

  const displayedEvents = events.slice(0, maxItems);

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-6 gap-1.5 select-none">
        <Bell size={16} className="text-on-surface-variant/30" />
        <p className="text-on-surface-variant text-[10px]">
          No upcoming events or classes in the pipeline.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3.5 select-text">
      {displayedEvents.map((evt, idx) => {
        const dateStr = new Date(evt.date).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short"
        });

        return (
          <motion.div
            key={evt.id}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.15, delay: idx * 0.04 }}
            className={`flex items-start justify-between p-3 border border-outline-variant/40 rounded-xl bg-surface-container/40 hover:bg-surface-container/60 transition-colors gap-3 relative overflow-hidden ${
              evt.priority === "High" ? "border-l-2 border-l-red-500" : ""
            }`}
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                {getEventBadge(evt.type)}
                <h4 className="text-[11px] font-bold text-primary leading-tight line-clamp-1">
                  {evt.title}
                </h4>
              </div>
              <p className="text-[9px] text-on-surface-variant line-clamp-1 leading-normal">
                {evt.description}
              </p>
            </div>

            <div className="text-right shrink-0 select-none space-y-1">
              <div className="flex items-center gap-1 text-[9px] font-mono-code font-bold text-on-surface-variant justify-end">
                <Calendar size={9} />
                <span>{dateStr}</span>
              </div>
              {evt.time && (
                <div className="flex items-center gap-1 text-[8px] font-mono-code font-semibold text-primary/80 justify-end">
                  <Clock size={8} />
                  <span>{evt.time}</span>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default UpcomingEvents;
