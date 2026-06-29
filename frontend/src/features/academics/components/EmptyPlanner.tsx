import React from "react";
import { ClipboardList } from "lucide-react";
import { EmptyState } from "./EmptyState";

interface EmptyPlannerProps {
  onActionClick?: () => void;
}

export const EmptyPlanner: React.FC<EmptyPlannerProps> = ({ onActionClick }) => {
  return (
    <div className="py-12 select-none">
      <EmptyState
        icon={ClipboardList}
        title="No Tasks Scheduled"
        description="Your planner is currently empty. Schedule personal study sessions, mock revision runs, exam prep checklist items, or custom student meetings to keep your context updated."
        actionText={onActionClick ? "Add Task" : undefined}
        onActionClick={onActionClick}
      />
    </div>
  );
};

export default EmptyPlanner;
