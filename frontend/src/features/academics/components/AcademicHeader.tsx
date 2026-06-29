import React from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import { useAcademicWorkspace } from "../hooks/useAcademicWorkspace";
import { GraduationCap, Shield } from "lucide-react";

export const AcademicHeader: React.FC = () => {
  const { currentUser } = useAuth();
  const { workspace } = useAcademicWorkspace();

  if (!currentUser) return null;

  return (
    <div className="matte-card rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-secondary-container border border-outline-variant flex items-center justify-center text-primary">
          <GraduationCap size={24} className="fill-current text-primary" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-primary">{currentUser.name}</h1>
            <span className="text-[9px] font-mono-code font-bold bg-surface-container-high border border-outline-variant px-1.5 py-0.5 rounded text-on-surface-variant">
              {currentUser.roll_number}
            </span>
          </div>
          <p className="text-[11px] text-on-surface-variant font-medium">
            {currentUser.email}
          </p>
        </div>
      </div>

      {workspace && workspace.initialized && (
        <div className="flex flex-wrap gap-2 md:self-center">
          <div className="flex flex-col px-3 py-1.5 bg-surface-container-low border border-outline-variant rounded-xl min-w-[80px]">
            <span className="text-[8px] font-bold text-on-surface-variant/60 uppercase tracking-wider">Dept</span>
            <span className="text-xs font-bold text-primary">{workspace.department}</span>
          </div>
          <div className="flex flex-col px-3 py-1.5 bg-surface-container-low border border-outline-variant rounded-xl min-w-[70px]">
            <span className="text-[8px] font-bold text-on-surface-variant/60 uppercase tracking-wider">Semester</span>
            <span className="text-xs font-bold text-primary">Sem {workspace.semester}</span>
          </div>
          <div className="flex flex-col px-3 py-1.5 bg-surface-container-low border border-outline-variant rounded-xl min-w-[50px]">
            <span className="text-[8px] font-bold text-on-surface-variant/60 uppercase tracking-wider">Sec</span>
            <span className="text-xs font-bold text-primary">{workspace.section}</span>
          </div>
          <div className="flex flex-col px-3 py-1.5 bg-surface-container-low border border-outline-variant rounded-xl min-w-[70px]">
            <span className="text-[8px] font-bold text-on-surface-variant/60 uppercase tracking-wider">Year</span>
            <span className="text-xs font-bold text-primary">Year {workspace.academic_year}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademicHeader;
