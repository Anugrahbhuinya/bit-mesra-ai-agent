import React from "react";
import { Calendar, Sparkles, Plus, Upload } from "lucide-react";
import { motion } from "framer-motion";

interface EmptyTimetableProps {
  onCreateManual: () => void;
  onImportClick: () => void;
}

export const EmptyTimetable: React.FC<EmptyTimetableProps> = ({
  onCreateManual,
  onImportClick,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto matte-card rounded-2xl p-8 py-12 flex flex-col items-center justify-center text-center gap-6 select-none bg-surface-container"
    >
      <div className="w-16 h-16 rounded-full bg-secondary-container border border-outline-variant flex items-center justify-center text-primary">
        <Calendar size={28} className="text-primary" />
      </div>

      <div className="space-y-2 max-w-md">
        <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Setup Your Timetable</h3>
        <p className="text-[11px] text-on-surface-variant leading-relaxed">
          Set up your class timetable to unlock automatic attendance tracking, planner synchronization, and context-aware AI assistant capabilities.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md pt-4">
        {/* Import with AI */}
        <button
          onClick={onImportClick}
          className="flex items-center justify-center gap-2 p-4 bg-primary hover:bg-primary/95 text-background font-bold text-xs uppercase tracking-wider rounded-xl transition-all active:scale-[0.98] cursor-pointer shadow-md group"
        >
          <Sparkles size={14} className="group-hover:animate-pulse" />
          <span>Import with AI</span>
        </button>

        {/* Create Manually */}
        <button
          onClick={onCreateManual}
          className="flex items-center justify-center gap-2 p-4 bg-surface-container-low hover:bg-surface-container-high border border-outline-variant hover:border-primary/50 text-on-surface font-bold text-xs uppercase tracking-wider rounded-xl transition-all active:scale-[0.98] cursor-pointer"
        >
          <Plus size={14} />
          <span>Build Manually</span>
        </button>
      </div>

      <div className="flex items-center gap-1.5 text-[10px] text-on-surface-variant/60 font-semibold uppercase tracking-wider bg-surface-container-low border border-outline-variant/60 px-3 py-1 rounded-full mt-2">
        <Sparkles size={10} className="text-primary" />
        <span>Gemini Vision extracts timetables in seconds</span>
      </div>
    </motion.div>
  );
};

export default EmptyTimetable;
