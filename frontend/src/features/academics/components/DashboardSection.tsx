import React from "react";

interface DashboardSectionProps {
  title: string;
  icon?: React.ComponentType<any>;
  rightElement?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const DashboardSection: React.FC<DashboardSectionProps> = ({
  title,
  icon: Icon,
  rightElement,
  children,
  className = ""
}) => {
  return (
    <div className={`matte-card rounded-2xl p-5 border border-outline-variant/60 bg-surface-container/30 flex flex-col justify-between gap-4 h-full relative overflow-hidden select-text ${className}`}>
      {/* Section Header */}
      <div className="flex items-center justify-between gap-4 select-none border-b border-outline-variant/20 pb-3">
        <div className="flex items-center gap-2">
          {Icon && <Icon size={14} className="text-primary" />}
          <h4 className="text-[10px] font-extrabold text-primary uppercase tracking-wider">
            {title}
          </h4>
        </div>
        {rightElement && <div className="shrink-0">{rightElement}</div>}
      </div>

      {/* Children content wrapper */}
      <div className="flex-1 flex flex-col justify-center">
        {children}
      </div>
    </div>
  );
};

export default DashboardSection;
