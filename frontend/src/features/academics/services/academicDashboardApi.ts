import studentApi from "../../auth/services/api";
import type { AcademicDashboardPayload } from "../types/dashboard";

export const academicDashboardApi = {
  getDashboard: async (): Promise<AcademicDashboardPayload> => {
    const response = await studentApi.get<AcademicDashboardPayload>("/api/academics/dashboard");
    return response.data;
  }
};

export default academicDashboardApi;
