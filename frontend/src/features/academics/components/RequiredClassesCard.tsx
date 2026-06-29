import React from "react";
import { CheckCircle2, ShieldAlert } from "lucide-react";

interface RequiredClassesCardProps {
  requiredClasses: number;
  className?: string;
}

export const RequiredClassesCard: React.FC<RequiredClassesCardProps> = ({
  requiredClasses,
  className = ""
}) => {
  const needsRecovery = requiredClasses > 0;

  return (
    <div
      className={`matte-card rounded-2xl p-5 select-none transition-all duration-200 border ${
        needsRecovery
          ? "bg-red-500/5 border-red-500/20 hover:border-red-500/30 animate-pulse"
          : "bg-teal-500/5 border-teal-500/20 hover:border-teal-500/30"
      } ${className}`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`p-2.5 rounded-xl border ${
            needsRecovery
              ? "bg-red-500/10 border-red-500/20 text-red-400"
              : "bg-teal-500/10 border-teal-500/20 text-teal-400"
          }`}
        >
          {needsRecovery ? <ShieldAlert size={18} /> : <CheckCircle2 size={18} />}
        </div>
        
        <div className="space-y-1">
          <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
            Required Classes
          </h4>
          <div className="flex items-baseline gap-1.5">
            <span
              className={`text-2xl font-extrabold tracking-tight ${
                needsRecovery ? "text-red-400" : "text-teal-400"
              }`}
            >
              {requiredClasses}
            </span>
            <span className="text-[10px] font-semibold text-on-surface-variant lowercase">
              {requiredClasses === 1 ? "class" : "classes"}
            </span>
          </div>
          <p className="text-[9px] text-on-surface-variant leading-relaxed">
            {needsRecovery
              ? `Attend the next ${requiredClasses} classes consecutively to recover and cross the 75% attendance threshold.`
              : "Your attendance is currently within the safe zone. Maintain it by attending regular classes."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RequiredClassesCard;
