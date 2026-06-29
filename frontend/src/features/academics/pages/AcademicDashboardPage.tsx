import React, { useState } from "react";
import { useAcademicDashboard } from "../hooks/useAcademicDashboard";
import { usePlanner } from "../hooks/usePlanner";
import DashboardHeader from "../components/DashboardHeader";
import DashboardGrid from "../components/DashboardGrid";
import DashboardSection from "../components/DashboardSection";
import TodayClassesCard from "../components/TodayClassesCard";
import AttendanceSummaryCard from "../components/AttendanceSummaryCard";
import UpcomingExamCard from "../components/UpcomingExamCard";
import UpcomingQuizCard from "../components/UpcomingQuizCard";
import PlannerSummaryCard from "../components/PlannerSummaryCard";
import CalendarHighlightsCard from "../components/CalendarHighlightsCard";
import QuickActionsCard from "../components/QuickActionsCard";
import AcademicInsightsCard from "../components/AcademicInsightsCard";
import TaskDialog from "../components/TaskDialog";
import LoadingState from "../components/LoadingState";
import { 
  CalendarDays, 
  CheckSquare, 
  Layers, 
  ClipboardList, 
  AlertCircle, 
  Play, 
  Sparkles,
  RefreshCw
} from "lucide-react";

export const AcademicDashboardPage: React.FC = () => {
  const { dashboardData, loading, error, refetch } = useAcademicDashboard(true);
  const { createTask } = usePlanner(false); // only needed for quick actions create
  
  // Dialog state for quick action task
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);

  const handleTriggerQuickAction = (actionName: string) => {
    if (actionName === "create_task") {
      setIsTaskDialogOpen(true);
    }
  };

  const handleQuickTaskSubmit = async (data: any) => {
    try {
      await createTask(data);
      // Refresh dashboard info
      await refetch();
    } catch (err) {
      console.error("Failed to add quick task", err);
    }
  };

  if (loading && !dashboardData) {
    return <LoadingState />;
  }

  if (error || !dashboardData) {
    return (
      <div className="text-center py-12 select-none space-y-4">
        <AlertCircle className="mx-auto text-red-400" size={32} />
        <div>
          <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider">Failed to Load Dashboard</h3>
          <p className="text-[10px] text-on-surface-variant mt-1.5">
            {error || "An unexpected error occurred while compiling academic insights."}
          </p>
        </div>
        <button
          onClick={refetch}
          className="px-4 py-2 border border-outline-variant hover:border-primary rounded-xl text-xs font-semibold text-primary transition-colors cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  const {
    todayClasses,
    attendanceSummary,
    upcomingExam,
    upcomingQuiz,
    plannerSummary,
    calendarHighlights,
    quickActions,
    academicInsights
  } = dashboardData;

  const rightRefreshElement = (
    <button
      onClick={refetch}
      className="p-1 hover:bg-surface-container border border-outline-variant/60 rounded-lg text-on-surface-variant hover:text-primary transition-all cursor-pointer"
      title="Refresh data"
    >
      <RefreshCw size={11} className={loading ? "animate-spin" : ""} />
    </button>
  );

  return (
    <div className="space-y-6 select-text">
      {/* Welcome banner */}
      <DashboardHeader profile={attendanceSummary?.profile} />

      {/* Grid wrapper */}
      <DashboardGrid>
        
        {/* Slot 1: Today's Lectures */}
        <DashboardSection title="Today's Classes" icon={CalendarDays}>
          <TodayClassesCard classes={todayClasses} />
        </DashboardSection>

        {/* Slot 2: Attendance Summary */}
        <DashboardSection title="Attendance Summary" icon={CheckSquare}>
          <AttendanceSummaryCard summary={attendanceSummary} />
        </DashboardSection>

        {/* Slot 3: Quick Action shortcuts */}
        <DashboardSection title="Quick Actions" icon={Layers}>
          <QuickActionsCard
            actions={quickActions}
            onTriggerAction={handleTriggerQuickAction}
          />
        </DashboardSection>

        {/* Slot 4: Upcoming exam countdown */}
        <DashboardSection title="Upcoming Exam" icon={AlertCircle}>
          <UpcomingExamCard exam={upcomingExam} />
        </DashboardSection>

        {/* Slot 5: Upcoming quiz countdown */}
        <DashboardSection title="Upcoming Quiz" icon={Play}>
          <UpcomingQuizCard quiz={upcomingQuiz} />
        </DashboardSection>

        {/* Slot 6: Tasks checklist highlights */}
        <DashboardSection title="Planner Checklist" icon={ClipboardList}>
          <PlannerSummaryCard summary={plannerSummary} />
        </DashboardSection>

        {/* Slot 7: Academic Calendar milestones */}
        <DashboardSection title="Calendar Highlights" icon={CalendarDays}>
          <CalendarHighlightsCard highlights={calendarHighlights} />
        </DashboardSection>

        {/* Slot 8: Academic Insights warnings */}
        <DashboardSection title="Academic Insights" icon={Sparkles} rightElement={rightRefreshElement}>
          <AcademicInsightsCard insights={academicInsights} />
        </DashboardSection>

      </DashboardGrid>

      {/* Quick Task Creation Dialog */}
      <TaskDialog
        isOpen={isTaskDialogOpen}
        onClose={() => setIsTaskDialogOpen(false)}
        onSubmit={handleQuickTaskSubmit}
      />
    </div>
  );
};

export default AcademicDashboardPage;
