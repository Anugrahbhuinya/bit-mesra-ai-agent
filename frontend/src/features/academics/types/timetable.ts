export interface ClassEntry {
  id: string;
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
  subject: string;
  faculty: string;
  classroom: string;
  building?: string;
  start_time: string; // HH:MM
  end_time: string;   // HH:MM
  remarks?: string;
}

export interface Timetable {
  student_id: string;
  semester: number;
  department: string;
  section: string;
  academic_year: number;
  classes: ClassEntry[];
  created_at: string;
  updated_at: string;
}

export interface WeeklyGroupedTimetable {
  Monday: ClassEntry[];
  Tuesday: ClassEntry[];
  Wednesday: ClassEntry[];
  Thursday: ClassEntry[];
  Friday: ClassEntry[];
  Saturday: ClassEntry[];
}

export interface ClassEntryFormPayload {
  day: string;
  subject: string;
  faculty: string;
  classroom: string;
  building?: string;
  start_time: string;
  end_time: string;
  remarks?: string;
}
