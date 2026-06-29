import React from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface AcademicCardProps {
  title: string;
  icon?: LucideIcon;
  actionText?: string;
  onActionClick?: () => void;
  children: React.ReactNode;
  badge?: string;
}

export const AcademicCard: React.FC<AcademicCardProps> = ({
  title,
  icon: Icon,
  actionText,
  onActionClick,
  children,
  badge,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="matte-card rounded-2xl p-6 flex flex-col justify-between h-full bg-surface-container"
    >
      <div className="space-y-4 flex-1">
        <div className="flex justify-between items-start select-none">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="bg-secondary-container p-2 rounded-xl border border-outline-variant text-primary">
                <Icon size={16} className="text-primary" />
              </div>
            )}
            <h3 className="text-xs font-bold text-primary uppercase tracking-wider">{title}</h3>
          </div>
          {badge && (
            <span className="text-[9px] font-mono-code font-bold bg-surface-container-high border border-outline-variant px-2 py-0.5 rounded text-on-surface-variant">
              {badge}
            </span>
          )}
        </div>

        <div className="text-xs text-on-surface-variant font-medium leading-relaxed">
          {children}
        </div>
      </div>

      {actionText && onActionClick && (
        <button
          onClick={onActionClick}
          className="mt-4 text-[10px] font-bold text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 uppercase tracking-wider self-start select-none cursor-pointer"
        >
          <span>{actionText}</span>
          <span>→</span>
        </button>
      )}
    </motion.div>
  );
};

export default AcademicCard;
