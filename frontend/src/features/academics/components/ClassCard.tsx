import React from "react";
import { type ClassEntry } from "../types/timetable";
import { Edit2, Trash2, Copy, MapPin, User, Clock, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

interface ClassCardProps {
  entry: ClassEntry;
  onEdit: (entry: ClassEntry) => void;
  onDelete: (id: string) => void;
  onDuplicate: (entry: ClassEntry) => void;
  isCurrent?: boolean;
}

export const ClassCard: React.FC<ClassCardProps> = ({
  entry,
  onEdit,
  onDelete,
  onDuplicate,
  isCurrent = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className={`matte-card rounded-xl p-4 flex flex-col justify-between gap-3 group relative overflow-hidden transition-all ${
        isCurrent 
          ? "border-primary bg-surface-container-high ring-1 ring-primary" 
          : "bg-surface-container"
      }`}
    >
      {/* Active Highlighting Line */}
      {isCurrent && (
        <div className="absolute top-0 left-0 bottom-0 w-1 bg-primary" />
      )}

      {/* Row: Title & Actions */}
      <div className="flex justify-between items-start select-text">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <h4 className="text-xs font-bold text-primary leading-tight">{entry.subject}</h4>
            {isCurrent && (
              <span className="text-[8px] font-bold text-background bg-primary px-1.5 py-0.5 rounded-full uppercase tracking-wider select-none animate-pulse shrink-0">
                Live
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-[10px] text-on-surface-variant">
            <User size={10} className="shrink-0" />
            <span>{entry.faculty}</span>
          </div>
        </div>

        {/* Action Buttons (Visible on Hover in Desktop, always visible on Mobile) */}
        <div className="flex gap-1 select-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0">
          <button
            onClick={() => onDuplicate(entry)}
            className="p-1 hover:bg-surface-container-high border border-outline-variant/60 rounded-lg text-on-surface-variant hover:text-primary transition-all cursor-pointer"
            title="Duplicate class"
          >
            <Copy size={10} />
          </button>
          <button
            onClick={() => onEdit(entry)}
            className="p-1 hover:bg-surface-container-high border border-outline-variant/60 rounded-lg text-on-surface-variant hover:text-primary transition-all cursor-pointer"
            title="Edit class"
          >
            <Edit2 size={10} />
          </button>
          <button
            onClick={() => onDelete(entry.id)}
            className="p-1 hover:bg-red-500/10 border border-outline-variant/60 hover:border-red-500/20 rounded-lg text-on-surface-variant hover:text-red-400 transition-all cursor-pointer"
            title="Delete class"
          >
            <Trash2 size={10} />
          </button>
        </div>
      </div>

      {/* Row: Details */}
      <div className="flex flex-wrap items-center justify-between text-[9px] font-semibold text-on-surface-variant uppercase tracking-wider gap-2 select-none border-t border-outline-variant/30 pt-2.5">
        <div className="flex items-center gap-1">
          <Clock size={10} className="text-on-surface-variant shrink-0" />
          <span className="font-mono-code font-bold">{entry.start_time} - {entry.end_time}</span>
        </div>

        <div className="flex items-center gap-1">
          <MapPin size={10} className="text-on-surface-variant shrink-0" />
          <span>{entry.classroom}{entry.building ? `, ${entry.building}` : ""}</span>
        </div>
      </div>

      {/* Optional Remarks */}
      {entry.remarks && (
        <div className="text-[9px] text-on-surface-variant/80 border-t border-outline-variant/20 pt-1.5 italic select-text flex items-start gap-1">
          <AlertCircle size={8} className="shrink-0 mt-0.5" />
          <span className="line-clamp-1">{entry.remarks}</span>
        </div>
      )}
    </motion.div>
  );
};

export default ClassCard;
