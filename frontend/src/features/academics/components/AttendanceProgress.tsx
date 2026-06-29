import React from "react";
import { motion } from "framer-motion";

interface AttendanceProgressProps {
  percentage: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const AttendanceProgress: React.FC<AttendanceProgressProps> = ({
  percentage,
  size = "md",
  className = ""
}) => {
  // Determine color theme based on BIT Mesra 75% attendance threshold
  const getColorClasses = (pct: number) => {
    if (pct >= 75.0) return {
      bar: "bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_8px_rgba(16,185,129,0.3)]",
      text: "text-emerald-400",
      bg: "bg-emerald-500/10"
    };
    if (pct >= 65.0) return {
      bar: "bg-gradient-to-r from-amber-500 to-orange-400 shadow-[0_0_8px_rgba(245,158,11,0.3)]",
      text: "text-amber-400",
      bg: "bg-amber-500/10"
    };
    return {
      bar: "bg-gradient-to-r from-red-500 to-rose-400 shadow-[0_0_8px_rgba(239,68,68,0.3)]",
      text: "text-red-400",
      bg: "bg-red-500/10"
    };
  };

  const colors = getColorClasses(percentage);
  
  const heightClass = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4"
  }[size];

  return (
    <div className={`w-full space-y-1.5 select-none ${className}`}>
      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
        <span className="text-on-surface-variant">Attendance Stat</span>
        <span className={colors.text}>{percentage.toFixed(1)}%</span>
      </div>
      <div className={`w-full ${heightClass} bg-surface-container-high rounded-full overflow-hidden border border-outline-variant/30`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`h-full rounded-full ${colors.bar}`}
        />
      </div>
    </div>
  );
};

export default AttendanceProgress;
