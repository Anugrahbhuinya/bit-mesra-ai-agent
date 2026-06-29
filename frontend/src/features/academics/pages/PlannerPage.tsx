import React, { useState } from "react";
import { usePlanner } from "../hooks/usePlanner";
import { useTimeline } from "../hooks/useTimeline";
import TaskStatistics from "../components/TaskStatistics";
import TaskSearch from "../components/TaskSearch";
import TaskFilters from "../components/TaskFilters";
import PlannerTaskCard from "../components/PlannerTaskCard";
import TaskDialog from "../components/TaskDialog";
import UpcomingEvents from "../components/UpcomingEvents";
import EmptyPlanner from "../components/EmptyPlanner";
import LoadingState from "../components/LoadingState";
import { Plus, Calendar, RefreshCw, ClipboardList, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { type PlannerTask } from "../types/planner";

export const PlannerPage: React.FC = () => {
  const navigate = useNavigate();

  // Custom Hooks
  const {
    filteredTasks,
    loading: loadingPlanner,
    error: plannerError,
    statistics,
    refetch: refetchTasks,
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
  } = usePlanner(true);

  const {
    upcoming,
    loading: loadingTimeline,
    refetch: refetchTimeline
  } = useTimeline(true);

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<PlannerTask | null>(null);

  const handleOpenCreateDialog = () => {
    setTaskToEdit(null);
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (task: PlannerTask) => {
    setTaskToEdit(task);
    setIsDialogOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    if (taskToEdit) {
      await updateTask(taskToEdit.id, data);
    } else {
      await createTask(data);
    }
    // Refresh timeline highlights as well
    await refetchTimeline();
  };

  const handleDeleteTask = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await deleteTask(id);
      await refetchTimeline();
    }
  };

  const handleRefreshAll = async () => {
    await Promise.all([refetchTasks(), refetchTimeline()]);
  };

  const isPageLoading = loadingPlanner && filteredTasks.length === 0;

  if (isPageLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6 select-text">
      {/* Header Banner */}
      <div className="flex justify-between items-start gap-4 select-none">
        <div className="space-y-1">
          <h2 className="text-sm font-bold text-primary uppercase tracking-wider">Academic Planner</h2>
          <p className="text-[11px] text-on-surface-variant max-w-2xl leading-relaxed">
            Create, audit, and prioritize personal study tasks, revision plans, homework, and guest events.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/academics/timeline")}
            className="px-4 py-2 border border-outline-variant hover:border-primary rounded-xl text-on-surface hover:text-primary text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <Calendar size={12} />
            <span>Timeline</span>
          </button>

          <button
            onClick={handleOpenCreateDialog}
            className="px-4 py-2 bg-primary hover:bg-primary/95 text-background text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all active:scale-[0.98] flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Plus size={12} />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {plannerError && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2 text-red-400 text-[10px] font-bold">
          <AlertCircle size={14} className="shrink-0 mt-0.5" />
          <span>{plannerError}</span>
        </div>
      )}

      {/* Statistics counters */}
      <TaskStatistics statistics={statistics} />

      {/* Layout Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left main: Planner Checklist */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center select-none">
            <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
              <ClipboardList size={12} />
              Checklist & Tasks
            </h3>
            <button
              onClick={handleRefreshAll}
              className="p-1 hover:bg-surface-container border border-outline-variant/60 rounded-lg text-on-surface-variant hover:text-primary transition-all cursor-pointer"
              title="Refresh planner"
            >
              <RefreshCw size={11} className={loadingPlanner ? "animate-spin" : ""} />
            </button>
          </div>

          {/* Filters and search toolbar */}
          <div className="space-y-3">
            <TaskSearch value={searchQuery} onChange={setSearchQuery} />
            <TaskFilters
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedPriority={selectedPriority}
              onPriorityChange={setSelectedPriority}
              completionFilter={completionFilter}
              onCompletionFilterChange={setCompletionFilter}
              sortBy={sortBy}
              onSortByChange={setSortBy}
            />
          </div>

          {/* Task cards list */}
          {filteredTasks.length === 0 ? (
            <EmptyPlanner onActionClick={handleOpenCreateDialog} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredTasks.map((task) => (
                <div key={task.id} className="cursor-pointer" onClick={(e) => {
                  // If clicking inside actions buttons or complete toggle, prevent navigate
                  const target = e.target as HTMLElement;
                  if (target.closest("button") || target.closest("input")) {
                    return;
                  }
                  navigate(`/academics/planner/task/${task.id}`);
                }}>
                  <PlannerTaskCard
                    task={task}
                    onEdit={handleOpenEditDialog}
                    onDelete={handleDeleteTask}
                    onToggleComplete={toggleComplete}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right sidebar: Academic Timeline highlights */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5 select-none">
            <Calendar size={12} />
            Timeline Highlights
          </h3>

          <div className="matte-card rounded-2xl p-5 border border-outline-variant/40 bg-surface-container/20 space-y-4">
            <UpcomingEvents events={upcoming} maxItems={6} />
            
            <button
              onClick={() => navigate("/academics/timeline")}
              className="w-full py-2.5 bg-surface-container hover:bg-surface-container-high border border-outline-variant text-[9px] font-bold uppercase tracking-wider rounded-xl transition-all text-on-surface hover:text-primary cursor-pointer select-none"
            >
              Open Full Timeline →
            </button>
          </div>
        </div>

      </div>

      {/* Task Dialog */}
      <TaskDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setTaskToEdit(null);
        }}
        onSubmit={handleFormSubmit}
        editTask={taskToEdit}
      />
    </div>
  );
};

export default PlannerPage;
