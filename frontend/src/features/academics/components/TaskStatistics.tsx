import React from "react";
import { type TaskCategory } from "../types/planner";
import { CheckSquare, AlertTriangle, Clock, ListChecks } from "lucide-react";
import { motion } from "framer-motion";

interface TaskStatisticsProps {
  statistics: {
    total: number;
    completed: number;
    pending: number;
    highPriority: number;
    categoryDistribution: Record<TaskCategory, number>;
  };
}

export const TaskStatistics: React.FC<TaskStatisticsProps> = ({ statistics }) => {
  const items = [
    {
      title: "Total Tasks",
      value: statistics.total,
      icon: ListChecks,
      color: "text-primary",
      bg: "bg-primary/5 border-primary/10"
    },
    {
      title: "Completed",
      value: statistics.completed,
      icon: CheckSquare,
      color: "text-emerald-400",
      bg: "bg-emerald-500/5 border-emerald-500/10"
    },
    {
      title: "Pending Tasks",
      value: statistics.pending,
      icon: Clock,
      color: "text-amber-400",
      bg: "bg-amber-500/5 border-amber-500/10"
    },
    {
      title: "High Priority",
      value: statistics.highPriority,
      icon: AlertTriangle,
      color: "text-red-400",
      bg: "bg-red-500/5 border-red-500/10"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 select-none">
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, delay: idx * 0.03 }}
            className={`matte-card rounded-2xl p-4 border flex items-center justify-between gap-3 ${item.bg}`}
          >
            <div className="space-y-0.5">
              <span className="text-[8px] font-bold text-on-surface-variant uppercase tracking-wider block">
                {item.title}
              </span>
              <span className="text-xl font-black text-on-surface font-mono-code leading-none">
                {item.value}
              </span>
            </div>
            <div className={`p-2 rounded-xl border ${item.color} bg-surface-container border-outline-variant/60`}>
              <Icon size={14} />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default TaskStatistics;
