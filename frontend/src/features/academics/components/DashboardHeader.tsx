import React from "react";
import { Sparkles, GraduationCap } from "lucide-react";
import { useAuth } from "../../auth/hooks/useAuth";

interface StudentProfile {
  branch?: string;
  semester?: number;
}

interface DashboardHeaderProps {
  profile?: StudentProfile;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ profile }) => {
  const { currentUser } = useAuth();
  
  const formattedDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const studentName = currentUser?.name || "Student";
  const branchName = profile?.branch || "Computer Science";
  const semesterStr = profile?.semester ? `Semester ${profile.semester}` : "Academic Session";

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 select-none pb-4 border-b border-outline-variant/30">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-extrabold text-primary flex items-center gap-1.5 leading-none">
            Welcome, {studentName}
            <Sparkles size={14} className="text-amber-400 animate-pulse" />
          </h2>
        </div>
        <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider flex items-center gap-1">
          <GraduationCap size={12} className="text-primary/70" />
          <span>{branchName}</span>
          <span className="text-on-surface-variant/30">•</span>
          <span>{semesterStr}</span>
        </p>
      </div>

      <div className="text-left md:text-right shrink-0">
        <span className="text-[8px] font-bold text-on-surface-variant uppercase tracking-widest block mb-0.5">
          Current Date
        </span>
        <span className="text-xs font-bold text-primary font-mono-code leading-none">
          {formattedDate}
        </span>
      </div>
    </div>
  );
};

export default DashboardHeader;
