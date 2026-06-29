import React from "react";
import { Filter, ArrowUpDown } from "lucide-react";

interface TaskFiltersProps {
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  selectedPriority: string;
  onPriorityChange: (pri: string) => void;
  completionFilter: "all" | "pending" | "completed";
  onCompletionFilterChange: (status: "all" | "pending" | "completed") => void;
  sortBy: "due_date" | "priority" | "category";
  onSortByChange: (sort: "due_date" | "priority" | "category") => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  selectedCategory,
  onCategoryChange,
  selectedPriority,
  onPriorityChange,
  completionFilter,
  onCompletionFilterChange,
  sortBy,
  onSortByChange
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-surface-container/30 border border-outline-variant/40 rounded-2xl select-none text-xs font-semibold">
      {/* Category Filter */}
      <div className="relative">
        <label className="text-[8px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">
          Category
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full px-3 py-2 bg-surface-container border border-outline-variant focus:border-primary rounded-xl focus:outline-none text-on-surface cursor-pointer text-xs font-semibold"
        >
          <option value="all">All Categories</option>
          <option value="Study">Study</option>
          <option value="Assignment">Assignment</option>
          <option value="Revision">Revision</option>
          <option value="Exam">Exam</option>
          <option value="Meeting">Meeting</option>
          <option value="Personal">Personal</option>
        </select>
      </div>

      {/* Priority Filter */}
      <div className="relative">
        <label className="text-[8px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">
          Priority
        </label>
        <select
          value={selectedPriority}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="w-full px-3 py-2 bg-surface-container border border-outline-variant focus:border-primary rounded-xl focus:outline-none text-on-surface cursor-pointer text-xs font-semibold"
        >
          <option value="all">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      {/* Status Filter */}
      <div className="relative">
        <label className="text-[8px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">
          Task Status
        </label>
        <select
          value={completionFilter}
          onChange={(e) => onCompletionFilterChange(e.target.value as any)}
          className="w-full px-3 py-2 bg-surface-container border border-outline-variant focus:border-primary rounded-xl focus:outline-none text-on-surface cursor-pointer text-xs font-semibold"
        >
          <option value="all">All Tasks</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Sort By */}
      <div className="relative">
        <label className="text-[8px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1 flex items-center gap-1">
          <ArrowUpDown size={10} />
          Sort By
        </label>
        <select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value as any)}
          className="w-full px-3 py-2 bg-surface-container border border-outline-variant focus:border-primary rounded-xl focus:outline-none text-on-surface cursor-pointer text-xs font-semibold"
        >
          <option value="due_date">Due Date</option>
          <option value="priority">Priority</option>
          <option value="category">Category</option>
        </select>
      </div>
    </div>
  );
};

export default TaskFilters;
