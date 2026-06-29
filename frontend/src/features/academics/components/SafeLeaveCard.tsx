import React from "react";
import { Smile, AlertTriangle } from "lucide-react";

interface SafeLeaveCardProps {
  safeLeaves: number;
  className?: string;
}

export const SafeLeaveCard: React.FC<SafeLeaveCardProps> = ({ safeLeaves, className = "" }) => {
  const isSafe = safeLeaves > 0;

  return (
    <div
      className={`matte-card rounded-2xl p-5 select-none transition-all duration-200 border ${
        isSafe
          ? "bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/30"
          : "bg-surface-container/60 border-outline-variant/60 hover:border-outline-variant"
      } ${className}`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`p-2.5 rounded-xl border ${
            isSafe
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : "bg-surface-container border-outline-variant/80 text-on-surface-variant"
          }`}
        >
          {isSafe ? <Smile size={18} /> : <AlertTriangle size={18} />}
        </div>
        
        <div className="space-y-1">
          <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
            Safe Leaves Remaining
          </h4>
          <div className="flex items-baseline gap-1.5">
            <span
              className={`text-2xl font-extrabold tracking-tight ${
                isSafe ? "text-emerald-400" : "text-on-surface-variant/50"
              }`}
            >
              {safeLeaves}
            </span>
            <span className="text-[10px] font-semibold text-on-surface-variant lowercase">
              {safeLeaves === 1 ? "class" : "classes"}
            </span>
          </div>
          <p className="text-[9px] text-on-surface-variant leading-relaxed">
            {isSafe
              ? `You can afford to miss up to ${safeLeaves} upcoming class${safeLeaves > 1 ? "es" : ""} and still stay above 75%.`
              : "You cannot miss any classes. Doing so will push your attendance below 75%."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SafeLeaveCard;
