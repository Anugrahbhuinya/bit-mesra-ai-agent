import React from "react";

interface WorkspaceSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const WorkspaceSection: React.FC<WorkspaceSectionProps> = ({
  title,
  description,
  children,
  rightElement,
}) => {
  return (
    <section className="space-y-4">
      <div className="flex justify-between items-end border-b border-outline-variant/30 pb-3 select-none">
        <div>
          <h2 className="text-sm font-bold text-primary uppercase tracking-wider">{title}</h2>
          {description && (
            <p className="text-[10px] text-on-surface-variant font-medium mt-1">
              {description}
            </p>
          )}
        </div>
        {rightElement && <div>{rightElement}</div>}
      </div>
      <div className="w-full">{children}</div>
    </section>
  );
};

export default WorkspaceSection;
