import React from "react";
import { type TimelineEvent } from "../types/planner";
import TimelineCard from "./TimelineCard";
import { CalendarDays } from "lucide-react";
import { EmptyState } from "./EmptyState";

interface TimelineProps {
  events: TimelineEvent[];
}

export const Timeline: React.FC<TimelineProps> = ({ events }) => {
  // Group events by date YYYY-MM-DD
  const groupedEvents = React.useMemo(() => {
    const groups: Record<string, TimelineEvent[]> = {};
    
    events.forEach((evt) => {
      const d = evt.date;
      if (!groups[d]) {
        groups[d] = [];
      }
      groups[d].push(evt);
    });

    // Sort dates chronologically
    return Object.keys(groups)
      .sort((a, b) => a.localeCompare(b))
      .map((date) => ({
        date,
        events: groups[date]
      }));
  }, [events]);

  if (events.length === 0) {
    return (
      <div className="py-12 select-none">
        <EmptyState
          icon={CalendarDays}
          title="Academic Timeline Clear"
          description="No registered classes, low attendance alerts, custom tasks, or academic calendar events found in this period."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 select-text relative before:absolute before:top-2 before:bottom-2 before:left-[118px] before:w-px before:bg-outline-variant/30 before:hidden md:before:block">
      {groupedEvents.map((group) => (
        <TimelineCard
          key={group.date}
          date={group.date}
          events={group.events}
        />
      ))}
    </div>
  );
};

export default Timeline;
