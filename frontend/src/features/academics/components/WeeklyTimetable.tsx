import React from "react";
import { type ClassEntry } from "../types/timetable";
import { Plus, Clock, MapPin } from "lucide-react";
import { motion } from "framer-motion";

interface WeeklyTimetableProps {
  classes: ClassEntry[];
  onAddClass: (day: string) => void;
  onEditClass: (entry: ClassEntry) => void;
  onDeleteClass: (id: string) => void;
}

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const WeeklyTimetable: React.FC<WeeklyTimetableProps> = ({
  classes,
  onAddClass,
  onEditClass,
  onDeleteClass,
}) => {
  // Sort helper
  const sortClasses = (dayClasses: ClassEntry[]) => {
    return [...dayClasses].sort((a, b) => {
      const aMins = a.start_time.split(":").map(Number).reduce((h, m) => h * 60 + m);
      const bMins = b.start_time.split(":").map(Number).reduce((h, m) => h * 60 + m);
      return aMins - bMins;
    });
  };

  // Group classes by weekday
  const grouped: Record<string, ClassEntry[]> = WEEKDAYS.reduce((acc, day) => {
    acc[day] = sortClasses(classes.filter((c) => c.day === day));
    return acc;
  }, {} as Record<string, ClassEntry[]>);

  // Helper to determine if a class is currently active
  const isLectureCurrent = (cls: ClassEntry) => {
    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();
    const startMins = cls.start_time.split(":").map(Number).reduce((h, m) => h * 60 + m);
    const endMins = cls.end_time.split(":").map(Number).reduce((h, m) => h * 60 + m);
    const today = now.toLocaleDateString("en-US", { weekday: "long" });
    return today === cls.day && currentMins >= startMins && currentMins <= endMins;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 select-text">
      {WEEKDAYS.map((day, idx) => {
        const dayClasses = grouped[day] || [];
        return (
          <motion.div
            key={day}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: idx * 0.04 }}
            className="flex flex-col bg-surface-container-low border border-outline-variant/60 rounded-2xl p-4 min-h-[300px]"
          >
            {/* Day Header */}
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-outline-variant/30 select-none">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{day}</span>
              <button
                onClick={() => onAddClass(day)}
                className="p-1 hover:bg-surface-container-high border border-outline-variant/40 rounded-lg text-on-surface-variant hover:text-primary transition-all cursor-pointer"
                title={`Add class to ${day}`}
              >
                <Plus size={12} />
              </button>
            </div>

            {/* Day Slots */}
            <div className="flex-1 flex flex-col gap-3">
              {dayClasses.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-center p-4 select-none">
                  <span className="text-[9px] text-on-surface-variant/40 font-bold uppercase tracking-wider">
                    Free Day
                  </span>
                </div>
              ) : (
                dayClasses.map((cls) => {
                  const current = isLectureCurrent(cls);
                  return (
                    <div
                      key={cls.id}
                      onClick={() => onEditClass(cls)}
                      className={`group cursor-pointer rounded-xl p-3 border text-left transition-all ${
                        current
                          ? "bg-surface-container border-primary shadow-sm ring-1 ring-primary"
                          : "bg-surface-container border-outline-variant/50 hover:border-primary/50"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[11px] font-bold text-primary leading-tight line-clamp-1">
                            {cls.subject}
                          </span>
                          {current && (
                            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 animate-pulse" />
                          )}
                        </div>
                        <span className="text-[9px] text-on-surface-variant block font-medium">
                          {cls.faculty}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-[8px] font-semibold text-on-surface-variant/80 uppercase tracking-wider select-none border-t border-outline-variant/20 pt-1.5 mt-2">
                        <div className="flex items-center gap-0.5 font-mono-code font-bold">
                          <Clock size={8} />
                          <span>{cls.start_time}</span>
                        </div>
                        <div className="flex items-center gap-0.5">
                          <MapPin size={8} />
                          <span>{cls.classroom}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default WeeklyTimetable;
