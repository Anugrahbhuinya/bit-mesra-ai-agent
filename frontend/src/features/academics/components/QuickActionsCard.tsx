import React from "react";
import { type QuickActionItem } from "../types/dashboard";
import { Calendar, CheckSquare, Plus, ClipboardList, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface QuickActionsCardProps {
  actions: QuickActionItem[];
  onTriggerAction?: (actionName: string) => void;
}

export const QuickActionsCard: React.FC<QuickActionsCardProps> = ({
  actions,
  onTriggerAction
}) => {
  const navigate = useNavigate();

  const iconMap: Record<string, LucideIcon> = {
    Calendar: Calendar,
    CheckSquare: CheckSquare,
    Plus: Plus,
    ClipboardList: ClipboardList,
    Sparkles: Sparkles
  };

  const handleActionClick = (item: QuickActionItem) => {
    if (item.action && onTriggerAction) {
      onTriggerAction(item.action);
    } else {
      navigate(item.path);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-2 select-none text-xs font-semibold">
      {actions.map((item) => {
        const IconComponent = iconMap[item.icon] || ClipboardList;
        return (
          <button
            key={item.label}
            onClick={() => handleActionClick(item)}
            className="flex items-center gap-2.5 p-3 border border-outline-variant/65 rounded-xl bg-surface-container-high/40 hover:bg-surface-container-high/85 text-on-surface hover:text-primary transition-all active:scale-[0.98] cursor-pointer text-left"
          >
            <div className="p-1.5 rounded-lg bg-surface-container border border-outline-variant/45 shrink-0 text-primary">
              <IconComponent size={12} />
            </div>
            <span className="text-[10px] font-bold tracking-tight leading-tight">
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default QuickActionsCard;
