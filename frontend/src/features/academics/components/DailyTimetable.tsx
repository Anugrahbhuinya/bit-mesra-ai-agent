import React, { useState, useEffect } from "react";
import { type ClassEntry } from "../types/timetable";
import ClassCard from "./ClassCard";
import { Plus, Calendar } from "lucide-react";

interface DailyTimetableProps {
  classes: ClassEntry[];
  onAddClass: (day: string) => void;
  onEditClass: (entry: ClassEntry) => void;
  onDeleteClass: (id: string) => void;
  onDuplicateClass: (entry: ClassEntry) => void;
}

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const DailyTimetable: React.FC<DailyTimetableProps> = ({
  classes,
  onAddClass,
  onEditClass,
  onDeleteClass,
  onDuplicateClass,
}) => {
  // Default to today's weekday if possible, fallback to Monday
  const getTodayDay = () => {
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
    return WEEKDAYS.includes(today) ? today : "Monday";
  };

  const [selectedDay, setSelectedDay] = useState<string>(getTodayDay());

  const filteredClasses = classes
    .filter((c) => c.day === selectedDay)
    .sort((a, b) => {
      const aMins = a.start_time.split(":").map(Number).reduce((h, m) => h * 60 + m);
      const bMins = b.start_time.split(":").map(Number).reduce((h, m) => h * 60 + m);
      return aMins - bMins;
    });

  // Highlight current active lecture
  const isLectureCurrent = (cls: ClassEntry) => {
    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();
    const startMins = cls.start_time.split(":").map(Number).reduce((h, m) => h * 60 + m);
    const endMins = cls.end_time.split(":").map(Number).reduce((h, m) => h * 60 + m);
    const today = now.toLocaleDateString("en-US", { weekday: "long" });
    return today === selectedDay && currentMins >= startMins && currentMins <= endMins;
  };

  return (
    <div className="space-y-6">
      {/* Day Picker bar */}
      <div className="flex border-b border-outline-variant/20 pb-px gap-1 overflow-x-auto custom-scrollbar select-none">
        {WEEKDAYS.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 border-b-2 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
              selectedDay === day
                ? "border-primary text-primary"
                : "border-transparent text-on-surface-variant hover:text-primary"
            }`}
          >
            {day.substring(0, 3)}
          </button>
        ))}
      </div>

      {/* Class List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center select-none">
          <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
            <Calendar size={14} />
            <span>{selectedDay}'s Classes</span>
          </h3>
          <button
            onClick={() => onAddClass(selectedDay)}
            className="flex items-center gap-1 px-3 py-1.5 bg-surface-container hover:bg-surface-container-high border border-outline-variant text-[9px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
          >
            <Plus size={10} />
            <span>Add Class</span>
          </button>
        </div>

        {filteredClasses.length === 0 ? (
          <div className="matte-card rounded-2xl p-8 text-center text-on-surface-variant/60 font-semibold uppercase tracking-wider text-[10px] select-none bg-surface-container/30 border-dashed border-outline-variant/60">
            No classes scheduled for {selectedDay}.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredClasses.map((cls) => (
              <ClassCard
                key={cls.id}
                entry={cls}
                onEdit={onEditClass}
                onDelete={onDeleteClass}
                onDuplicate={onDuplicateClass}
                isCurrent={isLectureCurrent(cls)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyTimetable;
