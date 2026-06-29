import React from "react";
import { AcademicCard } from "../components/AcademicCard";
import TodayClasses from "../components/TodayClasses";
import useTimetable from "../hooks/useTimetable";
import { 
  Clock, 
  UserCheck, 
  FileQuestion, 
  GraduationCap, 
  CalendarDays, 
  Sparkles,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { todayClasses, loading: loadingTimetable } = useTimetable();

  const handleActionClick = (actionName: string) => {
    console.log(`Action clicked: ${actionName}`);
    // Future integration point
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Today's Classes */}
      <AcademicCard
        title="Today's Classes"
        icon={Clock}
        actionText={todayClasses.length === 0 ? "Setup Timetable" : "View Timetable"}
        onActionClick={() => navigate("/academics/timetable")}
      >
        {loadingTimetable ? (
          <div className="flex items-center justify-center py-6 select-none">
            <Loader2 size={16} className="animate-spin text-primary" />
          </div>
        ) : todayClasses.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-6 gap-2">
            <p className="text-on-surface-variant text-[11px]">
              No schedule loaded for today. Verify your sections and set up your class timetable.
            </p>
          </div>
        ) : (
          <div className="max-h-[220px] overflow-y-auto custom-scrollbar pr-1 pt-1">
            <TodayClasses classes={todayClasses} />
          </div>
        )}
      </AcademicCard>

      {/* Attendance Summary */}
      <AcademicCard
        title="Attendance Summary"
        icon={UserCheck}
        actionText="Track Attendance"
        onActionClick={() => navigate("/academics/attendance")}
      >
        <div className="flex flex-col items-center justify-center text-center py-6 gap-2">
          <p className="text-on-surface-variant text-[11px]">
            No lecture attendance logs found. Initialize logging to stay above the 75% limit.
          </p>
        </div>
      </AcademicCard>

      {/* Upcoming Quiz */}
      <AcademicCard
        title="Upcoming Quiz"
        icon={FileQuestion}
        actionText="View Planner"
        onActionClick={() => navigate("/academics/planner")}
      >
        <div className="flex flex-col items-center justify-center text-center py-6 gap-2">
          <p className="text-on-surface-variant text-[11px]">
            Zero upcoming quizzes listed. Quizzes added to your planner will populate here.
          </p>
        </div>
      </AcademicCard>

      {/* Upcoming Exam */}
      <AcademicCard
        title="Upcoming Exam"
        icon={GraduationCap}
        actionText="View Planner"
        onActionClick={() => navigate("/academics/planner")}
      >
        <div className="flex flex-col items-center justify-center text-center py-6 gap-2">
          <p className="text-on-surface-variant text-[11px]">
            No upcoming examination dates scheduled in the current semester.
          </p>
        </div>
      </AcademicCard>

      {/* Academic Planner */}
      <AcademicCard
        title="Academic Planner"
        icon={CalendarDays}
        actionText="Add Event"
        onActionClick={() => navigate("/academics/planner")}
      >
        <div className="flex flex-col items-center justify-center text-center py-6 gap-2">
          <p className="text-on-surface-variant text-[11px]">
            Your academic task checklist is completely clear. Enjoy the free time!
          </p>
        </div>
      </AcademicCard>

      {/* Quick AI Actions */}
      <AcademicCard
        title="Quick AI Actions"
        icon={Sparkles}
      >
        <div className="space-y-2.5 py-1">
          {[
            "Draft study schedule",
            "Predict attendance impact",
            "Summarize syllabus documents",
          ].map((action) => (
            <button
              key={action}
              onClick={() => handleActionClick(action)}
              className="w-full flex items-center justify-between p-2.5 bg-surface-container-low hover:bg-surface-container-high border border-outline-variant rounded-xl transition-all text-[11px] font-bold text-on-surface hover:text-primary cursor-pointer text-left select-none"
            >
              <span>{action}</span>
              <span className="text-primary opacity-60">✦</span>
            </button>
          ))}
        </div>
      </AcademicCard>
    </div>
  );
};

export default DashboardPage;
