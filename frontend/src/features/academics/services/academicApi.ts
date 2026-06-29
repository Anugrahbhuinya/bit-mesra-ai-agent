import studentApi from "../../auth/services/api";
import type { AcademicWorkspaceResponse } from "../types/academic";

export const academicApi = {
  getWorkspace: async (): Promise<AcademicWorkspaceResponse> => {
    const response = await studentApi.get<AcademicWorkspaceResponse>("/api/academics/workspace");
    return response.data;
  },

  initializeWorkspace: async (data: {
    semester: number;
    department: string;
    section: string;
    academic_year: number;
  }): Promise<AcademicWorkspaceResponse> => {
    const response = await studentApi.post<AcademicWorkspaceResponse>("/api/academics/workspace/initialize", data);
    return response.data;
  }
};

export default academicApi;
