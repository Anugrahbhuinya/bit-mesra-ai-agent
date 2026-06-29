import type { ClassEntry } from "./timetable";
import type { DashboardSummary } from "./attendance";
import type { PlannerTask } from "./planner";

export interface AcademicInsight {
  type: "critical" | "warning" | "info" | "success";
  message: string;
}

export interface CalendarHighlightEvent {
  event: string;
  start_date: string;
  end_date: string;
}

export interface QuickActionItem {
  label: string;
  icon: string;
  path: string;
  action?: string;
}

export interface PlannerSummaryData {
  totalTasksCount: number;
  completedTasksCount: number;
  pendingTasksCount: number;
  highPriorityCount: number;
  todayTasksCount: number;
  recentPending: PlannerTask[];
}

export interface AcademicDashboardPayload {
  todayClasses: ClassEntry[];
  attendanceSummary: DashboardSummary;
  upcomingExam: PlannerTask | null;
  upcomingQuiz: PlannerTask | null;
  plannerSummary: PlannerSummaryData;
  calendarHighlights: CalendarHighlightEvent[];
  quickActions: QuickActionItem[];
  academicInsights: AcademicInsight[];
}
