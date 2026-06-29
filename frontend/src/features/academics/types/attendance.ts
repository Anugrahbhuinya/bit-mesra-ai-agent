export type AttendanceStatus = "Present" | "Absent" | "Cancelled" | "Holiday" | "Medical Leave";

export interface AttendanceLog {
  id: string;
  attendance_record_id: string;
  class_date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  remarks?: string;
  created_at: string;
  updated_at: string;
}

export interface AttendanceRecord {
  id: string; // Maps to Mongo's _id
  student_id: string;
  subject_id: string;
  subject_name: string;
  faculty: string;
  semester: number;
  section: string;
  department: string;
  total_conducted: number;
  total_attended: number;
  attendance_percentage: number;
  safe_leaves: number;
  required_classes: number;
  created_at: string;
  updated_at: string;
}

export interface SummaryStats {
  conducted: number;
  attended: number;
  percentage: number;
}

export interface SubjectSummary {
  subject_id: string;
  subject_name: string;
  faculty: string;
  attendance_percentage: number;
  total_conducted: number;
  total_attended: number;
  safe_leaves: number;
  required_classes: number;
  updated_at: string;
}

export interface RecentAttendanceLogEnriched {
  id: string;
  attendance_record_id: string;
  subject_name: string;
  class_date: string;
  status: AttendanceStatus;
  remarks: string;
  created_at: string;
}

export interface TodayClassAttendance {
  id: string; // Class entry ID from timetable
  subject: string;
  faculty: string;
  start_time: string;
  end_time: string;
  classroom: string;
  building?: string;
  remarks?: string;
  logged_status: AttendanceStatus | null;
  log_id: string | null;
  attendance_record_id: string | null;
}

export interface DashboardSummary {
  overall_attendance: number;
  total_conducted: number;
  total_attended: number;
  best_subject: SubjectSummary | null;
  lowest_subject: SubjectSummary | null;
  below_threshold_count: number;
  recent_logs: RecentAttendanceLogEnriched[];
  today_attendance: TodayClassAttendance[];
  weekly_summary: SummaryStats;
  monthly_summary: SummaryStats;
  profile?: {
    branch?: string;
    semester?: number;
  };
}

export interface TrendPoint {
  label: string;
  percentage: number;
  conducted: number;
  attended: number;
}

export interface SubjectComparison {
  subject_name: string;
  percentage: number;
  conducted: number;
  attended: number;
}

export interface AttendanceAnalytics {
  weekly_trend: TrendPoint[];
  monthly_trend: TrendPoint[];
  subject_comparison: SubjectComparison[];
  status_distribution: Record<AttendanceStatus, number>;
  average_attendance: number;
}

export interface AttendanceLogCreatePayload {
  subject_name: string;
  class_date: string;
  status: AttendanceStatus;
  remarks?: string;
}

export interface AttendanceLogUpdatePayload {
  status?: AttendanceStatus;
  remarks?: string;
  class_date?: string;
}
