import studentApi from "../../auth/services/api";
import type {
  PlannerTask,
  TimelineEvent,
  PlannerTaskCreatePayload,
  PlannerTaskUpdatePayload
} from "../types/planner";

export const plannerApi = {
  getTasks: async (): Promise<PlannerTask[]> => {
    const response = await studentApi.get<PlannerTask[]>("/api/planner/tasks");
    return response.data;
  },

  createTask: async (payload: PlannerTaskCreatePayload): Promise<PlannerTask> => {
    const response = await studentApi.post<PlannerTask>("/api/planner/tasks", payload);
    return response.data;
  },

  updateTask: async (id: string, payload: PlannerTaskUpdatePayload): Promise<PlannerTask> => {
    const response = await studentApi.put<PlannerTask>(`/api/planner/tasks/${id}`, payload);
    return response.data;
  },

  deleteTask: async (id: string): Promise<{ status: string; message: string }> => {
    const response = await studentApi.delete<{ status: string; message: string }>(`/api/planner/tasks/${id}`);
    return response.data;
  },

  toggleComplete: async (id: string): Promise<PlannerTask> => {
    const response = await studentApi.patch<PlannerTask>(`/api/planner/tasks/${id}/complete`);
    return response.data;
  },

  getTimeline: async (): Promise<TimelineEvent[]> => {
    const response = await studentApi.get<TimelineEvent[]>("/api/planner/timeline");
    return response.data;
  },

  getUpcoming: async (): Promise<TimelineEvent[]> => {
    const response = await studentApi.get<TimelineEvent[]>("/api/planner/upcoming");
    return response.data;
  }
};

export default plannerApi;
