import React, { useState, useEffect } from "react";
import { type PlannerTask, type TaskCategory, type TaskPriority } from "../types/planner";
import { BookOpen, Layers, Clock, CalendarDays, MessageSquare, AlertCircle, Sparkles } from "lucide-react";

interface PlannerTaskFormProps {
  onSubmit: (payload: {
    title: string;
    description: string;
    category: TaskCategory;
    priority: TaskPriority;
    due_date: string;
    due_time?: string;
    reminder_enabled: boolean;
    reminder_time?: string;
    tags?: string[];
  }) => Promise<void>;
  onCancel: () => void;
  editTask?: PlannerTask | null;
  defaultCategory?: string;
}

export const PlannerTaskForm: React.FC<PlannerTaskFormProps> = ({
  onSubmit,
  onCancel,
  editTask = null,
  defaultCategory = ""
}) => {
  const isEditing = !!editTask;

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<TaskCategory>("Study");
  const [priority, setPriority] = useState<TaskPriority>("Medium");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper to format local date YYYY-MM-DD
  const getTodayDateString = () => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const localDate = new Date(today.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().split("T")[0];
  };

  useEffect(() => {
    setError(null);
    if (editTask) {
      setTitle(editTask.title);
      setDescription(editTask.description || "");
      setCategory(editTask.category);
      setPriority(editTask.priority);
      setDueDate(editTask.due_date);
      setDueTime(editTask.due_time || "");
      setReminderEnabled(editTask.reminder_enabled);
      setReminderTime(editTask.reminder_time || "");
      setTagsInput(editTask.tags ? editTask.tags.join(", ") : "");
    } else {
      setTitle("");
      setDescription("");
      setCategory((defaultCategory as TaskCategory) || "Study");
      setPriority("Medium");
      setDueDate(getTodayDateString());
      setDueTime("");
      setReminderEnabled(false);
      setReminderTime("");
      setTagsInput("");
    }
  }, [editTask, defaultCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Please enter a task title.");
      return;
    }
    if (!dueDate) {
      setError("Please select a due date.");
      return;
    }

    setLoading(true);
    try {
      // Parse tags from comma separated input
      const tags = tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");

      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        due_date: dueDate,
        due_time: dueTime.trim() || undefined,
        reminder_enabled: reminderEnabled,
        reminder_time: reminderEnabled ? (reminderTime || undefined) : undefined,
        tags
      });
    } catch (err: any) {
      setError(err.message || "Failed to save planner task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2 text-red-400 text-[10px] font-bold">
          <AlertCircle size={14} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Title */}
      <div className="space-y-1.5">
        <label className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5 select-none">
          <BookOpen size={10} />
          Task Title
        </label>
        <input
          type="text"
          placeholder="e.g. Revise Compiler Design"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={100}
          className="w-full px-4.5 py-3 bg-surface-container-high border border-outline-variant focus:border-primary rounded-xl focus:outline-none transition-all text-on-surface placeholder:text-on-surface-variant/30 text-xs font-semibold"
        />
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5 select-none">
          <MessageSquare size={10} />
          Description
        </label>
        <textarea
          placeholder="Enter details or notes..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={500}
          rows={3}
          className="w-full px-4.5 py-3 bg-surface-container-high border border-outline-variant focus:border-primary rounded-xl focus:outline-none transition-all text-on-surface placeholder:text-on-surface-variant/30 text-xs font-semibold resize-none"
        />
      </div>

      {/* Category and Priority Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Category */}
        <div className="space-y-1.5">
          <label className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5 select-none">
            <Layers size={10} />
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as TaskCategory)}
            className="w-full px-4.5 py-3 bg-surface-container-high border border-outline-variant focus:border-primary rounded-xl focus:outline-none transition-all text-on-surface text-xs font-semibold cursor-pointer"
          >
            <option value="Study">Study</option>
            <option value="Assignment">Assignment</option>
            <option value="Revision">Revision</option>
            <option value="Exam">Exam</option>
            <option value="Meeting">Meeting</option>
            <option value="Personal">Personal</option>
          </select>
        </div>

        {/* Priority */}
        <div className="space-y-1.5">
          <label className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5 select-none">
            <AlertCircle size={10} />
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            className="w-full px-4.5 py-3 bg-surface-container-high border border-outline-variant focus:border-primary rounded-xl focus:outline-none transition-all text-on-surface text-xs font-semibold cursor-pointer"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Due Date & Time Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Due Date */}
        <div className="space-y-1.5">
          <label className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5 select-none">
            <CalendarDays size={10} />
            Due Date
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
            className="w-full px-4.5 py-3 bg-surface-container-high border border-outline-variant focus:border-primary rounded-xl focus:outline-none transition-all text-on-surface text-xs font-semibold cursor-pointer"
          />
        </div>

        {/* Due Time */}
        <div className="space-y-1.5">
          <label className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5 select-none">
            <Clock size={10} />
            Due Time (Optional)
          </label>
          <input
            type="time"
            value={dueTime}
            onChange={(e) => setDueTime(e.target.value)}
            className="w-full px-4.5 py-3 bg-surface-container-high border border-outline-variant focus:border-primary rounded-xl focus:outline-none transition-all text-on-surface text-xs font-semibold cursor-pointer"
          />
        </div>
      </div>

      {/* Reminder Config */}
      <div className="p-4 border border-outline-variant/60 rounded-2xl bg-surface-container/30 space-y-3">
        <div className="flex items-center gap-2 select-none">
          <input
            type="checkbox"
            id="reminderEnabled"
            checked={reminderEnabled}
            onChange={(e) => setReminderEnabled(e.target.checked)}
            className="w-3.5 h-3.5 rounded border border-outline focus:ring-primary text-primary"
          />
          <label htmlFor="reminderEnabled" className="text-[10px] font-bold text-on-surface uppercase tracking-wider cursor-pointer">
            Enable Reminder Metadata
          </label>
        </div>

        {reminderEnabled && (
          <div className="space-y-1.5 animate-fade-in">
            <label className="text-[8px] font-bold text-on-surface-variant uppercase tracking-wider block">
              Reminder Time Details
            </label>
            <input
              type="text"
              placeholder="e.g. 15 minutes before, or specific timestamp"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container-high border border-outline-variant focus:border-primary rounded-xl focus:outline-none transition-all text-on-surface placeholder:text-on-surface-variant/30 text-[10px] font-semibold"
            />
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="space-y-1.5">
        <label className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5 select-none">
          <Sparkles size={10} />
          Tags (Comma-separated)
        </label>
        <input
          type="text"
          placeholder="e.g. theory, homework, cse"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          className="w-full px-4.5 py-3 bg-surface-container-high border border-outline-variant focus:border-primary rounded-xl focus:outline-none transition-all text-on-surface placeholder:text-on-surface-variant/30 text-xs font-semibold"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end pt-2 select-none">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-outline-variant/60 rounded-xl text-on-surface text-xs font-semibold cursor-pointer hover:bg-surface-container-high transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 bg-primary text-background text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-primary/95 transition-all shadow-md cursor-pointer disabled:opacity-50"
        >
          {loading ? "Saving..." : isEditing ? "Save Changes" : "Create Task"}
        </button>
      </div>
    </form>
  );
};

export default PlannerTaskForm;
