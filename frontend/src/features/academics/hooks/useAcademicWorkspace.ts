import { createContext, useContext } from "react";
import type { AcademicWorkspace } from "../types/academic";

export interface AcademicWorkspaceContextType {
  workspace: AcademicWorkspace | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  refetch: () => Promise<void>;
  initialize: (data: {
    semester: number;
    department: string;
    section: string;
    academic_year: number;
  }) => Promise<void>;
}

export const AcademicWorkspaceContext = createContext<AcademicWorkspaceContextType | undefined>(undefined);

export const useAcademicWorkspace = (): AcademicWorkspaceContextType => {
  const context = useContext(AcademicWorkspaceContext);
  if (context === undefined) {
    throw new Error("useAcademicWorkspace must be used within an AcademicWorkspaceProvider");
  }
  return context;
};

export default useAcademicWorkspace;
