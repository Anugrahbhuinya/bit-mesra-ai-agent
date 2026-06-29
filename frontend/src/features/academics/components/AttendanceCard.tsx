import React from "react";
import { type AttendanceRecord } from "../types/attendance";
import AttendanceProgress from "./AttendanceProgress";
import { Clock, Calendar, CheckSquare, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface AttendanceCardProps {
  record: AttendanceRecord;
  onLogClick: (subjectName: string) => void;
  className?: string;
}

export const AttendanceCard: React.FC<AttendanceCardProps> = ({
  record,
  onLogClick,
  className = ""
}) => {
  const isBelow = record.attendance_percentage < 75.0;
  const lastUpdatedDate = new Date(record.updated_at).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short"
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`matte-card rounded-2xl p-5 bg-surface-container/60 hover:bg-surface-container border transition-all duration-200 flex flex-col justify-between gap-4 relative overflow-hidden group select-text ${
        isBelow ? "border-red-500/20 hover:border-red-500/30" : "border-outline-variant/60 hover:border-outline-variant"
      } ${className}`}
    >
      {/* Risk status bar */}
      {isBelow && (
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-red-500" />
      )}

      {/* Header */}
      <div className="space-y-1">
        <div className="flex justify-between items-start gap-4">
          <Link
            to={`/academics/attendance/subject/${record.subject_id}`}
            className="hover:underline text-xs font-extrabold text-primary leading-tight line-clamp-1"
          >
            {record.subject_name}
          </Link>
          
          <button
            onClick={() => onLogClick(record.subject_name)}
            className="p-1 hover:bg-primary/10 border border-outline-variant/60 hover:border-primary/20 rounded-lg text-on-surface-variant hover:text-primary transition-all cursor-pointer flex items-center justify-center shrink-0"
            title="Log attendance"
          >
            <Plus size={12} />
          </button>
        </div>
        <p className="text-[10px] text-on-surface-variant font-medium line-clamp-1">
          {record.faculty}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="py-1">
        <AttendanceProgress percentage={record.attendance_percentage} size="sm" />
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-3 text-[9px] font-bold text-on-surface-variant uppercase tracking-wider border-t border-outline-variant/30 pt-3">
        <div className="space-y-0.5">
          <span className="text-[8px] font-semibold block text-on-surface-variant/60">Conducted</span>
          <span className="text-on-surface font-mono-code">{record.total_conducted}</span>
        </div>
        <div className="space-y-0.5">
          <span className="text-[8px] font-semibold block text-on-surface-variant/60">Attended</span>
          <span className="text-on-surface font-mono-code">{record.total_attended}</span>
        </div>
        
        {record.safe_leaves > 0 ? (
          <div className="space-y-0.5 col-span-2 text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 px-2 py-1 rounded-lg">
            <span className="text-[8px] font-semibold block text-emerald-400/70">Safe Leaves (Bunks)</span>
            <span>{record.safe_leaves} class{record.safe_leaves > 1 ? "es" : ""} safe</span>
          </div>
        ) : record.required_classes > 0 ? (
          <div className="space-y-0.5 col-span-2 text-red-400 bg-red-500/5 border border-red-500/10 px-2 py-1 rounded-lg">
            <span className="text-[8px] font-semibold block text-red-400/70">Recovery Classes</span>
            <span>Attend next {record.required_classes} classes</span>
          </div>
        ) : (
          <div className="space-y-0.5 col-span-2 text-amber-400 bg-amber-500/5 border border-amber-500/10 px-2 py-1 rounded-lg">
            <span className="text-[8px] font-semibold block text-amber-400/70">Bunk Limit Margin</span>
            <span>No leaves allowed (0% margin)</span>
          </div>
        )}
      </div>

      {/* Footer info */}
      <div className="flex items-center justify-between text-[8px] text-on-surface-variant/60 font-semibold uppercase tracking-wider select-none border-t border-outline-variant/20 pt-2.5">
        <span className="flex items-center gap-1">
          <Clock size={9} />
          Updated: {lastUpdatedDate}
        </span>
        <Link
          to={`/academics/attendance/subject/${record.subject_id}`}
          className="text-primary hover:underline font-bold"
        >
          Details →
        </Link>
      </div>
    </motion.div>
  );
};

export default AttendanceCard;
