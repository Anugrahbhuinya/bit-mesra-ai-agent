import React from "react";
import { type CalendarHighlightEvent } from "../types/dashboard";
import { Calendar, BellRing } from "lucide-react";
import { motion } from "framer-motion";

interface CalendarHighlightsCardProps {
  highlights: CalendarHighlightEvent[];
}

export const CalendarHighlightsCard: React.FC<CalendarHighlightsCardProps> = ({ highlights }) => {
  if (highlights.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-6 gap-2 select-none">
        <BellRing size={20} className="text-on-surface-variant/30" />
        <div>
          <h5 className="text-[10px] font-bold text-on-surface uppercase tracking-wider">No Scheduled Dates</h5>
          <p className="text-[9px] text-on-surface-variant max-w-[200px] mt-1 leading-normal">
            No academic calendar commencement dates scheduled.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3.5 select-text">
      <div className="space-y-2.5 max-h-[190px] overflow-y-auto custom-scrollbar pr-1">
        {highlights.map((item, idx) => {
          const dateStr = new Date(item.start_date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short"
          });
          
          return (
            <motion.div
              key={`${item.event}-${idx}`}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15, delay: idx * 0.03 }}
              className="flex items-center justify-between p-3 border border-outline-variant/40 rounded-xl bg-surface-container/20 hover:bg-surface-container/40 transition-colors gap-3 select-text"
            >
              <div className="space-y-0.5">
                <h6 className="text-[10px] font-bold text-primary leading-tight line-clamp-1">
                  {item.event}
                </h6>
                <span className="text-[7.5px] font-bold text-on-surface-variant uppercase tracking-wider block select-none">
                  Semester Schedule
                </span>
              </div>

              <div className="text-right shrink-0 select-none flex items-center gap-1 text-[8.5px] font-mono-code font-bold text-on-surface-variant">
                <Calendar size={10} className="text-primary/70 shrink-0" />
                <span>{dateStr}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarHighlightsCard;
