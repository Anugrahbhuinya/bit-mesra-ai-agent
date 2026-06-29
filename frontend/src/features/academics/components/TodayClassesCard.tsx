import React, { useMemo } from "react";
import { type ClassEntry } from "../types/timetable";
import { Calendar, Clock, MapPin, CheckCircle, X, HelpCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface TodayClassesCardProps {
  classes: ClassEntry[];
}

export const TodayClassesCard: React.FC<TodayClassesCardProps> = ({ classes }) => {
  // Determine ongoing and next classes
  const scheduleStatus = useMemo(() => {
    const now = new Date();
    // Convert to IST offset check if needed, but standard local comparison is fine
    const currentMins = now.getHours() * 60 + now.getMinutes();

    const parseMins = (tStr: string) => {
      const parts = tStr.split(":");
      return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    };

    let activeClass: ClassEntry | null = null;
    let nextClass: ClassEntry | null = null;
    let closestDiff = Infinity;

    for (const c of classes) {
      const start = parseMins(c.start_time);
      const end = parseMins(c.end_time);

      if (currentMins >= start && currentMins < end) {
        activeClass = c;
      } else if (start > currentMins) {
        const diff = start - currentMins;
        if (diff < closestDiff) {
          closestDiff = diff;
          nextClass = c;
        }
      }
    }

    return { activeClass, nextClass };
  }, [classes]);

  const { activeClass, nextClass } = scheduleStatus;

  if (classes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-6 gap-2 select-none">
        <Calendar size={20} className="text-on-surface-variant/30" />
        <div>
          <h5 className="text-[10px] font-bold text-on-surface uppercase tracking-wider">No Classes Today</h5>
          <p className="text-[9px] text-on-surface-variant max-w-[200px] mt-1 leading-normal">
            Enjoy your free day! No lectures scheduled on your timetable.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 select-text">
      {/* Highlights */}
      {(activeClass || nextClass) && (
        <div className="p-3 border border-outline-variant/60 rounded-xl bg-primary/5 select-none space-y-2">
          {activeClass && (
            <div className="flex items-center justify-between gap-3">
              <span className="text-[7.5px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded uppercase tracking-wider animate-pulse">
                Live Now
              </span>
              <div className="text-right shrink-0">
                <span className="text-[9px] font-bold text-primary block truncate max-w-[130px]">
                  {activeClass.subject}
                </span>
                <span className="text-[8px] text-on-surface-variant block font-mono-code">
                  in {activeClass.classroom}
                </span>
              </div>
            </div>
          )}

          {nextClass && !activeClass && (
            <div className="flex items-center justify-between gap-3">
              <span className="text-[7.5px] font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded uppercase tracking-wider">
                Up Next
              </span>
              <div className="text-right shrink-0">
                <span className="text-[9px] font-bold text-primary block truncate max-w-[130px]">
                  {nextClass.subject}
                </span>
                <span className="text-[8px] text-on-surface-variant block font-mono-code">
                  at {nextClass.start_time}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Classes list */}
      <div className="space-y-2.5 max-h-[180px] overflow-y-auto custom-scrollbar pr-1">
        {classes.map((cls, idx) => {
          const isOngoing = activeClass?.id === cls.id;
          
          return (
            <motion.div
              key={cls.id}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, delay: idx * 0.03 }}
              className={`flex items-start justify-between p-3 border border-outline-variant/40 rounded-xl transition-all gap-3 ${
                isOngoing
                  ? "bg-primary/5 border-primary/45 shadow-sm"
                  : "bg-surface-container/20 hover:bg-surface-container/50"
              }`}
            >
              <div className="space-y-1">
                <h5 className="text-[11px] font-bold text-primary leading-tight line-clamp-1">
                  {cls.subject}
                </h5>
                <span className="text-[8px] font-bold text-on-surface-variant/80 uppercase block select-none">
                  {cls.faculty}
                </span>
              </div>

              <div className="text-right shrink-0 select-none space-y-1">
                <span className="text-[8px] font-mono-code font-bold text-on-surface-variant block">
                  {cls.start_time} - {cls.end_time}
                </span>
                <span className="text-[8px] font-bold text-primary/80 block">
                  {cls.classroom}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TodayClassesCard;
