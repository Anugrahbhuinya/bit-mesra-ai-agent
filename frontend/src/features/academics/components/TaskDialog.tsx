import React from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PlannerTaskForm from "./PlannerTaskForm";
import { type PlannerTask } from "../types/planner";

interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: any) => Promise<void>;
  editTask?: PlannerTask | null;
  defaultCategory?: string;
}

export const TaskDialog: React.FC<TaskDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editTask = null,
  defaultCategory = ""
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm"
        />

        {/* Dialog Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md bg-surface-container border border-outline-variant rounded-2xl p-6 shadow-xl z-10 max-h-[90vh] overflow-y-auto custom-scrollbar"
        >
          {/* Header */}
          <div className="flex justify-between items-center select-none border-b border-outline-variant/30 pb-4 mb-4">
            <div>
              <h3 className="text-xs font-bold text-primary uppercase tracking-wider">
                {editTask ? "Edit Planner Task" : "Create Planner Task"}
              </h3>
              <p className="text-[9px] text-on-surface-variant mt-0.5">
                {editTask ? "Update checklist attributes and due date parameters." : "Add a custom academic task or reminder."}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-surface-container-high border border-outline-variant/60 rounded-lg text-on-surface-variant hover:text-primary transition-all cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>

          <PlannerTaskForm
            onSubmit={async (data) => {
              await onSubmit(data);
              onClose();
            }}
            onCancel={onClose}
            editTask={editTask}
            defaultCategory={defaultCategory}
          />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TaskDialog;
