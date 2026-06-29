import { useState, useEffect, useCallback, useMemo } from "react";
import plannerApi from "../services/plannerApi";
import type {
  PlannerTask,
  PlannerTaskCreatePayload,
  PlannerTaskUpdatePayload,
  TaskCategory,
  TaskPriority
} from "../types/planner";

export const usePlanner = (autoFetch: boolean = true) => {
  const [tasks, setTasks] = useState<PlannerTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [completionFilter, setCompletionFilter] = useState<"all" | "pending" | "completed">("all");
  const [sortBy, setSortBy] = useState<"due_date" | "priority" | "category">("due_date");

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await plannerApi.getTasks();
      setTasks(data);
    } catch (err: any) {
      console.error("Failed to fetch planner tasks", err);
      setError(err.response?.data?.detail || "Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchTasks();
    }
  }, [autoFetch, fetchTasks]);

  // CRUD Actions
  const createTask = async (payload: PlannerTaskCreatePayload) => {
    setError(null);
    try {
      const newTask = await plannerApi.createTask(payload);
      await fetchTasks();
      return newTask;
    } catch (err: any) {
      const msg = err.response?.data?.detail || "Failed to create planner task.";
      setError(msg);
      throw new Error(msg);
    }
  };

  const updateTask = async (id: string, payload: PlannerTaskUpdatePayload) => {
    setError(null);
    try {
      const updated = await plannerApi.updateTask(id, payload);
      await fetchTasks();
      return updated;
    } catch (err: any) {
      const msg = err.response?.data?.detail || "Failed to update task.";
      setError(msg);
      throw new Error(msg);
    }
  };

  const deleteTask = async (id: string) => {
    setError(null);
    try {
      await plannerApi.deleteTask(id);
      await fetchTasks();
    } catch (err: any) {
      const msg = err.response?.data?.detail || "Failed to delete task.";
      setError(msg);
      throw new Error(msg);
    }
  };

  const toggleComplete = async (id: string) => {
    setError(null);
    try {
      const updated = await plannerApi.toggleComplete(id);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      return updated;
    } catch (err: any) {
      const msg = err.response?.data?.detail || "Failed to toggle task completion.";
      setError(msg);
      throw new Error(msg);
    }
  };

  // Dynamic Statistics
  const statistics = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    const highPriority = tasks.filter((t) => !t.completed && t.priority === "High").length;
    
    const categoryDistribution: Record<TaskCategory, number> = {
      Study: 0,
      Assignment: 0,
      Revision: 0,
      Exam: 0,
      Meeting: 0,
      Personal: 0
    };
    
    tasks.forEach((t) => {
      if (t.category in categoryDistribution) {
        categoryDistribution[t.category]++;
      }
    });

    return {
      total,
      completed,
      pending,
      highPriority,
      categoryDistribution
    };
  }, [tasks]);

  // Filtered and Sorted Tasks
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Completion Filter
    if (completionFilter === "completed") {
      result = result.filter((t) => t.completed);
    } else if (completionFilter === "pending") {
      result = result.filter((t) => !t.completed);
    }

    // Category Filter
    if (selectedCategory !== "all") {
      result = result.filter((t) => t.category === selectedCategory);
    }

    // Priority Filter
    if (selectedPriority !== "all") {
      result = result.filter((t) => t.priority === selectedPriority);
    }

    // Search Query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter((t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "due_date") {
        return a.due_date.localeCompare(b.due_date);
      }
      
      if (sortBy === "priority") {
        const priorityWeight = { High: 3, Medium: 2, Low: 1 };
        return (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
      }
      
      if (sortBy === "category") {
        return a.category.localeCompare(b.category);
      }

      return 0;
    });

    return result;
  }, [tasks, completionFilter, selectedCategory, selectedPriority, searchQuery, sortBy]);

  return {
    tasks,
    filteredTasks,
    loading,
    error,
    statistics,
    refetch: fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleComplete,
    
    // Filter controls
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedPriority,
    setSelectedPriority,
    completionFilter,
    setCompletionFilter,
    sortBy,
    setSortBy
  };
};

export default usePlanner;
