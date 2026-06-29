import React from "react";
import { type PlannerTask, type TaskCategory, type TaskPriority } from "../types/planner";
import { Calendar, Clock, Edit2, Trash2, CheckCircle2, Circle } from "lucide-react";
import { motion } from "framer-motion";

interface PlannerTaskCardProps {
  task: PlannerTask;
  onEdit: (task: PlannerTask) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

export const PlannerTaskCard: React.FC<PlannerTaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onToggleComplete
}) => {
  const getCategoryColor = (cat: TaskCategory) => {
    return {
      Study: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
      Assignment: "bg-blue-500/10 border-blue-500/20 text-blue-400",
      Revision: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
      Exam: "bg-red-500/10 border-red-500/20 text-red-400",
      Meeting: "bg-amber-500/10 border-amber-500/20 text-amber-400",
      Personal: "bg-slate-500/10 border-slate-500/20 text-slate-400"
    }[cat] || "bg-surface-container border-outline-variant text-on-surface-variant";
  };

  const getPriorityBadge = (priority: TaskPriority) => {
    const config = {
      High: "border-red-500/30 text-red-400 bg-red-500/5",
      Medium: "border-amber-500/30 text-amber-400 bg-amber-500/5",
      Low: "border-slate-500/30 text-slate-400 bg-slate-500/5"
    }[priority];

    return (
      <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 border rounded-full ${config}`}>
        {priority}
      </span>
    );
  };

  const formattedDate = new Date(task.due_date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className={`matte-card rounded-2xl p-4 border transition-all duration-200 flex flex-col justify-between gap-3 relative group overflow-hidden select-text ${
        task.completed
          ? "bg-surface-container/20 border-outline-variant/20 opacity-60"
          : "bg-surface-container/50 border-outline-variant/60 hover:border-outline-variant"
      }`}
    >
      {/* Accent strip based on priority */}
      {!task.completed && (
        <div
          className={`absolute top-0 bottom-0 left-0 w-1 ${
            task.priority === "High"
              ? "bg-red-500"
              : task.priority === "Medium"
              ? "bg-amber-500"
              : "bg-slate-500"
          }`}
        />
      )}

      {/* Row: Title & Category & Actions */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex items-start gap-3">
          {/* Completion Checkbox */}
          <button
            onClick={() => onToggleComplete(task.id)}
            className="mt-0.5 text-on-surface-variant hover:text-primary transition-all cursor-pointer shrink-0"
            title={task.completed ? "Mark incomplete" : "Mark complete"}
          >
            {task.completed ? (
              <CheckCircle2 size={16} className="text-emerald-400" />
            ) : (
              <Circle size={16} />
            )}
          </button>
          
          <div className="space-y-1">
            <h4
              className={`text-xs font-bold leading-snug line-clamp-1 ${
                task.completed ? "text-on-surface-variant line-through" : "text-primary"
              }`}
            >
              {task.title}
            </h4>
            <div className="flex items-center gap-1.5 flex-wrap select-none">
              <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 border rounded-full ${getCategoryColor(task.category)}`}>
                {task.category}
              </span>
              {getPriorityBadge(task.priority)}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-1 select-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="p-1 hover:bg-surface-container-high border border-outline-variant/60 rounded-lg text-on-surface-variant hover:text-primary transition-all cursor-pointer"
            title="Edit task"
          >
            <Edit2 size={10} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1 hover:bg-red-500/10 border border-outline-variant/60 hover:border-red-500/20 rounded-lg text-on-surface-variant hover:text-red-400 transition-all cursor-pointer"
            title="Delete task"
          >
            <Trash2 size={10} />
          </button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className={`text-[10px] text-on-surface-variant leading-relaxed line-clamp-2 px-7 ${task.completed && "line-through opacity-70"}`}>
          {task.description}
        </p>
      )}

      {/* Footer Info (Tags, Due Date) */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-[9px] font-bold text-on-surface-variant uppercase tracking-wider select-none border-t border-outline-variant/20 pt-2.5 mt-1">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Calendar size={10} className="shrink-0" />
            <span className="font-mono-code font-bold">{formattedDate}</span>
          </div>
          {task.due_time && (
            <div className="flex items-center gap-1">
              <Clock size={10} className="shrink-0" />
              <span className="font-mono-code font-bold">{task.due_time}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex gap-1 flex-wrap select-text">
            {task.tags.map((tag) => (
              <span key={tag} className="text-[7.5px] font-bold text-on-surface bg-surface-container border border-outline-variant/40 px-1.5 py-0.5 rounded leading-none">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PlannerTaskCard;
