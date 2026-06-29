import React from "react";

interface TimetableGridProps {
  children: React.ReactNode;
}

export const TimetableGrid: React.FC<TimetableGridProps> = ({ children }) => {
  return (
    <div className="grid grid-cols-1 gap-6">
      {children}
    </div>
  );
};

export default TimetableGrid;
