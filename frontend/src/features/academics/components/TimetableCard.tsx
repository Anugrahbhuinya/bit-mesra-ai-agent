import React from "react";

interface TimetableCardProps {
  title: string;
  children: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const TimetableCard: React.FC<TimetableCardProps> = ({
  title,
  children,
  rightElement,
}) => {
  return (
    <div className="matte-card rounded-2xl p-6 bg-surface-container space-y-6">
      <div className="flex justify-between items-center select-none border-b border-outline-variant/30 pb-3">
        <h3 className="text-xs font-bold text-primary uppercase tracking-wider">{title}</h3>
        {rightElement && <div>{rightElement}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
};

export default TimetableCard;
