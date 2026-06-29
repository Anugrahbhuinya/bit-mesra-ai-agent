export interface AcademicWorkspace {
  student_id: string;
  semester?: number;
  department?: string;
  section?: string;
  academic_year?: number;
  initialized: boolean;
  created_at: string;
  updated_at: string;
}

export interface AcademicWorkspaceResponse {
  workspace: AcademicWorkspace;
  initialized: boolean;
}

export interface DashboardCard {
  title: string;
  description: string;
  type: string;
}

export interface AcademicWorkspaceState {
  workspace: AcademicWorkspace | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

export interface AcademicTab {
  id: string;
  label: string;
  path: string;
}
