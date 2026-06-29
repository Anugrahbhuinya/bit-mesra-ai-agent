import React from "react";
import { type AcademicInsight } from "../types/dashboard";
import { AlertCircle, AlertTriangle, Info, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

interface AcademicInsightsCardProps {
  insights: AcademicInsight[];
}

export const AcademicInsightsCard: React.FC<AcademicInsightsCardProps> = ({ insights }) => {
  const getInsightConfig = (type: string) => {
    return {
      critical: {
        icon: AlertCircle,
        bg: "bg-red-500/10 border-red-500/20 text-red-400"
      },
      warning: {
        icon: AlertTriangle,
        bg: "bg-amber-500/10 border-amber-500/20 text-amber-400"
      },
      info: {
        icon: Info,
        bg: "bg-blue-500/10 border-blue-500/20 text-blue-400"
      },
      success: {
        icon: CheckCircle2,
        bg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
      }
    }[type] || {
      icon: Info,
      bg: "bg-surface-container border-outline-variant text-on-surface-variant"
    };
  };

  return (
    <div className="space-y-3.5 select-text">
      <div className="space-y-2.5 max-h-[190px] overflow-y-auto custom-scrollbar pr-1">
        {insights.map((item, idx) => {
          const config = getInsightConfig(item.type);
          const Icon = config.icon;
          
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15, delay: idx * 0.03 }}
              className={`flex items-start gap-3 p-3.5 border rounded-2xl ${config.bg} select-text`}
            >
              <Icon size={14} className="shrink-0 mt-0.5" />
              <p className="text-[10px] leading-relaxed font-bold">
                {item.message}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AcademicInsightsCard;
