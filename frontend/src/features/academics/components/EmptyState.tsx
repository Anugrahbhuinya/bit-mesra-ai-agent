import React from "react";
import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onActionClick?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  onActionClick,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="matte-card rounded-2xl p-8 py-12 flex flex-col items-center justify-center text-center gap-4 max-w-lg mx-auto"
    >
      <div className="w-12 h-12 rounded-full bg-secondary-container border border-outline-variant flex items-center justify-center text-on-surface-variant select-none">
        <Icon size={22} className="text-on-surface-variant" />
      </div>
      <div className="space-y-1.5">
        <h4 className="text-sm font-bold text-primary uppercase tracking-wider">{title}</h4>
        <p className="text-[11px] text-on-surface-variant leading-relaxed max-w-sm">
          {description}
        </p>
      </div>
      {actionText && onActionClick && (
        <button
          onClick={onActionClick}
          className="mt-2 px-5 py-2.5 bg-primary hover:bg-primary/95 text-background text-xs font-bold uppercase tracking-wider rounded-xl transition-all active:scale-[0.98] cursor-pointer shadow-md select-none"
        >
          {actionText}
        </button>
      )}
    </motion.div>
  );
};

export default EmptyState;
