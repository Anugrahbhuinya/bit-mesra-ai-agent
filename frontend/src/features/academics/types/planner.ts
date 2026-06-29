export type TaskCategory = "Study" | "Assignment" | "Revision" | "Exam" | "Meeting" | "Personal";
export type TaskPriority = "High" | "Medium" | "Low";
export type TimelineEventType = "class" | "exam" | "quiz" | "holiday" | "registration" | "attendance_alert" | "task" | "custom";

export interface PlannerTask {
  id: string; // Maps to Mongo's _id alias
  student_id: string;
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  due_date: string; // YYYY-MM-DD
  due_time?: string; // HH:MM
  reminder_enabled: boolean;
  reminder_time?: string;
  completed: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  type: TimelineEventType;
  date: string; // YYYY-MM-DD
  time?: string; // HH:MM or HH:MM - HH:MM
  priority?: TaskPriority;
  completed?: boolean;
  category?: TaskCategory;
  metadata?: Record<string, any>;
}

export interface PlannerTaskCreatePayload {
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  due_date: string;
  due_time?: string;
  reminder_enabled: boolean;
  reminder_time?: string;
  tags?: string[];
}

export interface PlannerTaskUpdatePayload {
  title?: string;
  description?: string;
  category?: TaskCategory;
  priority?: TaskPriority;
  due_date?: string;
  due_time?: string;
  reminder_enabled?: boolean;
  reminder_time?: string;
  completed?: boolean;
  tags?: string[];
}
