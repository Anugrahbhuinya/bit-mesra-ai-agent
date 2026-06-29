import React from "react";
import { type TimelineEvent as ITimelineEvent } from "../types/planner";
import { Calendar, Clock, AlertTriangle, Play, BookOpen, Heart, User, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

interface TimelineEventProps {
  event: ITimelineEvent;
}

export const TimelineEvent: React.FC<TimelineEventProps> = ({ event }) => {
  const getEventConfig = (type: string) => {
    return {
      class: {
        badge: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
        icon: BookOpen,
        color: "border-emerald-500 bg-emerald-500"
      },
      exam: {
        badge: "bg-red-500/10 border-red-500/20 text-red-400",
        icon: AlertTriangle,
        color: "border-red-500 bg-red-500"
      },
      quiz: {
        badge: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
        icon: Play,
        color: "border-indigo-500 bg-indigo-500"
      },
      holiday: {
        badge: "bg-slate-500/10 border-slate-500/20 text-slate-400",
        icon: Heart,
        color: "border-slate-500 bg-slate-500"
      },
      registration: {
        badge: "bg-blue-500/10 border-blue-500/20 text-blue-400",
        icon: Calendar,
        color: "border-blue-500 bg-blue-500"
      },
      attendance_alert: {
        badge: "bg-amber-500/10 border-amber-500/20 text-amber-400",
        icon: AlertTriangle,
        color: "border-amber-500 bg-amber-500"
      },
      task: {
        badge: "bg-purple-500/10 border-purple-500/20 text-purple-400",
        icon: CheckCircle2,
        color: "border-purple-500 bg-purple-500"
      }
    }[type] || {
      badge: "bg-surface-container border-outline-variant text-on-surface-variant",
      icon: Clock,
      color: "border-outline bg-outline"
    };
  };

  const config = getEventConfig(event.type);
  const Icon = config.icon;

  const isCompletedTask = event.type === "task" && event.completed;

  return (
    <div className={`relative flex items-start gap-4 p-4 border border-outline-variant/40 rounded-xl bg-surface-container/40 hover:bg-surface-container/60 transition-colors select-text ${
      isCompletedTask ? "opacity-60" : ""
    }`}>
      {/* Icon frame */}
      <div className={`p-2.5 rounded-xl border shrink-0 bg-surface-container border-outline-variant/60 ${config.badge.split(" ").slice(-1)[0]}`}>
        <Icon size={14} className={isCompletedTask ? "text-emerald-400" : ""} />
      </div>

      <div className="space-y-1.5 flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap select-none">
          <span className={`text-[7px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 border rounded-full leading-none shrink-0 ${config.badge}`}>
            {event.type}
          </span>
          {event.priority && event.priority !== "Medium" && (
            <span className={`text-[7px] font-bold uppercase tracking-wider px-1 py-0.5 rounded ${
              event.priority === "High" ? "bg-red-500/15 text-red-400" : "bg-slate-500/15 text-slate-400"
            }`}>
              {event.priority} Priority
            </span>
          )}
          {event.category && (
            <span className="text-[7.5px] font-bold text-on-surface-variant bg-surface-container border border-outline-variant/40 px-1 py-0.5 rounded leading-none">
              {event.category}
            </span>
          )}
        </div>

        <h4 className={`text-xs font-bold leading-tight ${
          isCompletedTask ? "text-on-surface-variant line-through font-medium" : "text-primary"
        }`}>
          {event.title}
        </h4>

        {event.description && (
          <p className="text-[10px] text-on-surface-variant leading-relaxed font-medium">
            {event.description}
          </p>
        )}

        {/* Timetable/Class Specific Details */}
        {event.type === "class" && event.metadata && (
          <div className="flex items-center gap-3 text-[9px] text-on-surface-variant/80 font-bold select-none pt-1">
            <span className="flex items-center gap-0.5">
              <User size={9} />
              {event.metadata.faculty}
            </span>
            <span className="flex items-center gap-0.5">
              <Clock size={9} />
              {event.time}
            </span>
          </div>
        )}
      </div>

      {/* Time column (if any, non-classes) */}
      {event.type !== "class" && event.time && (
        <div className="text-right shrink-0 select-none text-[9px] font-mono-code font-bold text-primary/80 bg-surface-container-high border border-outline-variant/40 px-2 py-0.5 rounded h-fit">
          {event.time}
        </div>
      )}
    </div>
  );
};

export default TimelineEvent;
