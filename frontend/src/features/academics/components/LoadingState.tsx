import React from "react";

export const LoadingState: React.FC = () => {
  return (
    <div className="w-full space-y-8 animate-pulse p-6">
      {/* Header skeleton */}
      <div className="h-20 bg-surface-container rounded-2xl border border-outline-variant/30 flex items-center justify-between px-6">
        <div className="space-y-2">
          <div className="h-4 w-40 bg-surface-container-high rounded"></div>
          <div className="h-3 w-60 bg-surface-container-high rounded opacity-60"></div>
        </div>
        <div className="h-8 w-24 bg-surface-container-high rounded-lg"></div>
      </div>

      {/* Tabs skeleton */}
      <div className="flex gap-2 border-b border-outline-variant/30 pb-px">
        <div className="h-8 w-24 bg-surface-container rounded-t-lg"></div>
        <div className="h-8 w-24 bg-surface-container rounded-t-lg"></div>
        <div className="h-8 w-24 bg-surface-container rounded-t-lg"></div>
        <div className="h-8 w-24 bg-surface-container rounded-t-lg"></div>
      </div>

      {/* Content grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-40 bg-surface-container rounded-2xl border border-outline-variant/30 col-span-2"></div>
        <div className="h-40 bg-surface-container rounded-2xl border border-outline-variant/30"></div>
        <div className="h-32 bg-surface-container rounded-2xl border border-outline-variant/30"></div>
        <div className="h-32 bg-surface-container rounded-2xl border border-outline-variant/30"></div>
        <div className="h-32 bg-surface-container rounded-2xl border border-outline-variant/30"></div>
      </div>
    </div>
  );
};

export default LoadingState;
