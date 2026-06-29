import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePlanner } from "../hooks/usePlanner";
import TaskDialog from "../components/TaskDialog";
import LoadingState from "../components/LoadingState";
import { ArrowLeft, Edit3, Trash2, Calendar, Clock, Layers, Sparkles, AlertCircle, CheckCircle, Circle } from "lucide-react";
import { type PlannerTask } from "../types/planner";

export const TaskDetailsPage: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();

  // Custom hook
  const {
    tasks,
    loading,
    error,
    updateTask,
    deleteTask,
    toggleComplete
  } = usePlanner(true);

  // States
  const [task, setTask] = useState<PlannerTask | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    if (tasks.length > 0 && taskId) {
      const match = tasks.find((t) => t.id === taskId);
      if (match) {
        setTask(match);
      }
    }
  }, [tasks, taskId]);

  const handleToggleComplete = async () => {
    if (!task) return;
    try {
      const updated = await toggleComplete(task.id);
      setTask(updated);
    } catch (err) {
      console.error("Failed to toggle task", err);
    }
  };

  const handleEditSubmit = async (data: any) => {
    if (!task) return;
    try {
      const updated = await updateTask(task.id, data);
      setTask(updated);
      setIsEditDialogOpen(false);
    } catch (err) {
      console.error("Failed to update task", err);
    }
  };

  const handleDelete = async () => {
    if (!task) return;
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(task.id);
        navigate("/academics/planner");
      } catch (err) {
        console.error("Failed to delete task", err);
      }
    }
  };

  if (loading && !task) {
    return <LoadingState />;
  }

  if (!task) {
    return (
      <div className="text-center py-12 select-none space-y-4">
        <AlertCircle className="mx-auto text-yellow-400" size={32} />
        <div>
          <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider">Task Not Found</h3>
          <p className="text-[10px] text-on-surface-variant mt-1.5">
            The requested planner task could not be found or has been deleted.
          </p>
        </div>
        <button
          onClick={() => navigate("/academics/planner")}
          className="text-xs text-primary font-bold hover:underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  const priorityColors = {
    High: "border-red-500/30 text-red-400 bg-red-500/5",
    Medium: "border-amber-500/30 text-amber-400 bg-amber-500/5",
    Low: "border-slate-500/30 text-slate-400 bg-slate-500/5"
  }[task.priority];

  return (
    <div className="space-y-6 select-text">
      {/* Header */}
      <div className="flex justify-between items-center select-none border-b border-outline-variant/30 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/academics/planner")}
            className="p-1 hover:bg-surface-container border border-outline-variant/60 rounded-lg text-on-surface-variant hover:text-primary transition-all cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h2 className="text-sm font-bold text-primary uppercase tracking-wider">Task Details</h2>
            <p className="text-[10px] text-on-surface-variant mt-0.5">
              Inspect, complete, or edit this planner event.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 select-none">
          <button
            onClick={() => setIsEditDialogOpen(true)}
            className="p-2 hover:bg-surface-container-high border border-outline-variant/60 rounded-xl text-on-surface-variant hover:text-primary transition-all cursor-pointer"
            title="Edit task"
          >
            <Edit3 size={12} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 hover:bg-red-500/10 border border-outline-variant/60 hover:border-red-500/20 rounded-xl text-on-surface-variant hover:text-red-400 transition-all cursor-pointer"
            title="Delete task"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {/* Main card */}
      <div className="matte-card rounded-2xl p-6 bg-surface-container/40 border border-outline-variant/60 space-y-6">
        {/* Title and status */}
        <div className="flex items-start gap-4">
          <button
            onClick={handleToggleComplete}
            className="mt-1 text-on-surface-variant hover:text-primary transition-all cursor-pointer shrink-0"
          >
            {task.completed ? (
              <CheckCircle size={22} className="text-emerald-400" />
            ) : (
              <Circle size={22} />
            )}
          </button>
          
          <div className="space-y-2">
            <h3 className={`text-base font-extrabold leading-snug ${
              task.completed ? "text-on-surface-variant line-through font-semibold" : "text-primary"
            }`}>
              {task.title}
            </h3>
            
            <div className="flex items-center gap-2 select-none flex-wrap">
              <span className="text-[8px] font-bold text-on-surface bg-primary/15 border border-primary/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                {task.category}
              </span>
              <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 border rounded-full ${priorityColors}`}>
                {task.priority} Priority
              </span>
              <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 border rounded-full ${
                task.completed 
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                  : "bg-amber-500/10 border-amber-500/20 text-amber-400"
              }`}>
                {task.completed ? "Completed" : "Pending"}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <div className="space-y-1.5 border-t border-outline-variant/20 pt-4">
            <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider block select-none">
              Notes & Description
            </span>
            <p className="text-xs text-on-surface leading-relaxed max-w-2xl font-medium">
              {task.description}
            </p>
          </div>
        )}

        {/* Due parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-outline-variant/20 pt-4 select-none">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-surface-container border border-outline-variant rounded-xl text-primary shrink-0">
              <Calendar size={14} />
            </div>
            <div>
              <span className="text-[8px] font-semibold text-on-surface-variant uppercase tracking-wider block">Due Date</span>
              <span className="text-xs font-bold text-on-surface font-mono-code">
                {new Date(task.due_date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric"
                })}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-surface-container border border-outline-variant rounded-xl text-primary shrink-0">
              <Clock size={14} />
            </div>
            <div>
              <span className="text-[8px] font-semibold text-on-surface-variant uppercase tracking-wider block">Due Time</span>
              <span className="text-xs font-bold text-on-surface font-mono-code">
                {task.due_time || "No specific time set"}
              </span>
            </div>
          </div>
        </div>

        {/* Reminders metadata */}
        <div className="border-t border-outline-variant/20 pt-4 space-y-2 select-none">
          <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider block">
            Reminder Settings
          </span>
          <div className="p-3.5 bg-surface-container/60 border border-outline-variant/40 rounded-2xl flex items-center gap-3 text-[11px] text-on-surface font-medium max-w-sm">
            <div className={`w-2 h-2 rounded-full ${task.reminder_enabled ? "bg-emerald-400" : "bg-on-surface-variant/20"}`} />
            <span>
              {task.reminder_enabled 
                ? `Metadata active (Reminder Time: ${task.reminder_time || "Default"})` 
                : "Reminders disabled for this event"}
            </span>
          </div>
        </div>

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="border-t border-outline-variant/20 pt-4 space-y-1.5">
            <span className="text-[8px] font-bold text-on-surface-variant uppercase tracking-wider block select-none">Tags</span>
            <div className="flex gap-1.5 flex-wrap">
              {task.tags.map((tag) => (
                <span key={tag} className="text-[9px] font-bold text-on-surface bg-surface-container border border-outline-variant/40 px-2 py-0.5 rounded">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <TaskDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSubmit={handleEditSubmit}
        editTask={task}
      />
    </div>
  );
};

export default TaskDetailsPage;
