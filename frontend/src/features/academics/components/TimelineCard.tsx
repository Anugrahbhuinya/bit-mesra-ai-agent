import React from "react";
import { type TimelineEvent as ITimelineEvent } from "../types/planner";
import TimelineEvent from "./TimelineEvent";

interface TimelineCardProps {
  date: string;
  events: ITimelineEvent[];
}

export const TimelineCard: React.FC<TimelineCardProps> = ({ date, events }) => {
  const parsedDate = new Date(date);
  
  // Format day name and day number/month
  const dayName = parsedDate.toLocaleDateString("en-IN", { weekday: "short" });
  const dateFormatted = parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short"
  });

  // Check if date represents today
  const today = new Date();
  const isToday = today.toDateString() === parsedDate.toDateString();

  return (
    <div className="flex flex-col md:flex-row gap-4 select-text">
      {/* Date sidebar */}
      <div className="md:w-28 shrink-0 flex md:flex-col items-baseline md:items-end gap-1.5 select-none pt-1">
        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest leading-none">
          {dayName}
        </span>
        <div className="flex items-center gap-1.5 md:flex-col md:items-end">
          <span className="text-sm font-extrabold text-primary leading-none">
            {dateFormatted}
          </span>
          {isToday && (
            <span className="text-[8px] font-extrabold text-background bg-primary px-1.5 py-0.5 rounded uppercase tracking-wider leading-none">
              Today
            </span>
          )}
        </div>
      </div>

      {/* Events timeline section */}
      <div className="flex-1 space-y-3 relative border-l border-outline-variant/30 pl-4 md:pl-6 pb-2">
        {/* Connection timeline line markers */}
        <div className={`absolute -left-[4.5px] top-4 w-2.5 h-2.5 rounded-full border-2 bg-background ${
          isToday ? "border-primary bg-primary scale-110" : "border-outline-variant/60"
        }`} />

        {events.map((evt) => (
          <TimelineEvent key={evt.id} event={evt} />
        ))}
      </div>
    </div>
  );
};

export default TimelineCard;
