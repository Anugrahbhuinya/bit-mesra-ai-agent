import React from "react";
import { Search, X } from "lucide-react";

interface TaskSearchProps {
  value: string;
  onChange: (val: string) => void;
}

export const TaskSearch: React.FC<TaskSearchProps> = ({ value, onChange }) => {
  return (
    <div className="relative w-full">
      <Search size={14} className="absolute left-3.5 top-3.5 text-on-surface-variant/40" />
      <input
        type="text"
        placeholder="Search tasks, descriptions, or tags..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-9.5 pr-8 py-2.5 bg-surface-container border border-outline-variant focus:border-primary rounded-xl focus:outline-none transition-all text-on-surface placeholder:text-on-surface-variant/30 text-xs font-semibold"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-2.5 top-3 p-1 hover:bg-surface-container-high rounded text-on-surface-variant/60 hover:text-primary transition-all cursor-pointer"
        >
          <X size={10} />
        </button>
      )}
    </div>
  );
};

export default TaskSearch;
