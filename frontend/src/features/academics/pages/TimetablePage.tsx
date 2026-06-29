import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTimetable } from "../hooks/useTimetable";
import EmptyTimetable from "../components/EmptyTimetable";
import WeeklyTimetable from "../components/WeeklyTimetable";
import DailyTimetable from "../components/DailyTimetable";
import TimetableDialog from "../components/TimetableDialog";
import LoadingState from "../components/LoadingState";
import type { ClassEntry, ClassEntryFormPayload } from "../types/timetable";
import { Calendar, LayoutGrid, Clock, Plus, Sparkles, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

export const TimetablePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    timetable,
    loading,
    error,
    addClass,
    updateClass,
    deleteClass,
  } = useTimetable();

  // Active view toggle: "week" or "today"
  const [viewMode, setViewMode] = useState<"week" | "today">("week");

  // Dialog management
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("Add New Class");
  const [dialogSubmitLabel, setDialogSubmitLabel] = useState("Add Class");
  const [dialogInitialValues, setDialogInitialValues] = useState<Partial<ClassEntryFormPayload> | undefined>(undefined);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);

  if (loading) {
    return <LoadingState />;
  }

  if (error && !timetable) {
    return (
      <div className="p-6 select-none">
        <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2.5 text-red-400 text-xs font-semibold max-w-lg mx-auto">
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
          <span>Error loading timetable: {error}</span>
        </div>
      </div>
    );
  }

  const classes = timetable?.classes || [];
  const hasClasses = classes.length > 0;

  // Onboarding handlers
  const handleCreateManual = () => {
    setDialogTitle("Create Timetable Class");
    setDialogSubmitLabel("Create Class");
    setDialogInitialValues({
      day: "Monday",
      subject: "",
      faculty: "",
      classroom: "",
      building: "",
      start_time: "09:00",
      end_time: "10:00",
      remarks: ""
    });
    setEditingEntryId(null);
    setIsDialogOpen(true);
  };

  const handleImportAI = () => {
    navigate("/academics/timetable/import");
  };

  // Add / Edit / Duplicate / Delete handlers
  const handleAddClass = (day: string) => {
    setDialogTitle(`Add Class for ${day}`);
    setDialogSubmitLabel("Add Class");
    setDialogInitialValues({
      day,
      subject: "",
      faculty: "",
      classroom: "",
      building: "",
      start_time: "09:00",
      end_time: "10:00",
      remarks: ""
    });
    setEditingEntryId(null);
    setIsDialogOpen(true);
  };

  const handleEditClass = (entry: ClassEntry) => {
    setDialogTitle("Edit Class");
    setDialogSubmitLabel("Save Changes");
    setDialogInitialValues({
      day: entry.day,
      subject: entry.subject,
      faculty: entry.faculty,
      classroom: entry.classroom,
      building: entry.building || "",
      start_time: entry.start_time,
      end_time: entry.end_time,
      remarks: entry.remarks || ""
    });
    setEditingEntryId(entry.id);
    setIsDialogOpen(true);
  };

  const handleDuplicateClass = (entry: ClassEntry) => {
    setDialogTitle(`Duplicate Class — ${entry.subject}`);
    setDialogSubmitLabel("Create Class");
    setDialogInitialValues({
      day: entry.day,
      subject: entry.subject,
      faculty: entry.faculty,
      classroom: entry.classroom,
      building: entry.building || "",
      start_time: entry.start_time,
      end_time: entry.end_time,
      remarks: entry.remarks || ""
    });
    setEditingEntryId(null); // Will create a new ID
    setIsDialogOpen(true);
  };

  const handleDeleteClass = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this lecture from your timetable?")) {
      try {
        await deleteClass(id);
      } catch (err) {
        console.error("Failed to delete class", err);
      }
    }
  };

  const handleDialogSubmit = async (values: ClassEntryFormPayload) => {
    if (editingEntryId) {
      // Update
      await updateClass(editingEntryId, values);
    } else {
      // Create / Duplicate
      await addClass(values);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
        <div className="space-y-1">
          <h2 className="text-sm font-bold text-primary uppercase tracking-wider">Class Timetable</h2>
          <p className="text-[11px] text-on-surface-variant max-w-2xl leading-relaxed">
            Manage your weekly lectures and laboratory sessions. Your calendar feeds today's classes notifications and AI contextual memory.
          </p>
        </div>

        {hasClasses && (
          <div className="flex items-center gap-3 shrink-0">
            {/* View Toggle */}
            <div className="flex bg-surface-container border border-outline-variant p-1 rounded-xl">
              <button
                onClick={() => setViewMode("week")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  viewMode === "week"
                    ? "bg-surface-container-high text-primary"
                    : "text-on-surface-variant hover:text-primary"
                }`}
              >
                <LayoutGrid size={12} />
                <span>Week</span>
              </button>
              <button
                onClick={() => setViewMode("today")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  viewMode === "today"
                    ? "bg-surface-container-high text-primary"
                    : "text-on-surface-variant hover:text-primary"
                }`}
              >
                <Clock size={12} />
                <span>Today</span>
              </button>
            </div>

            {/* Actions */}
            <button
              onClick={handleImportAI}
              className="flex items-center gap-1.5 px-3 py-2 border border-outline-variant hover:border-primary/50 text-on-surface hover:text-primary rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer bg-surface-container"
              title="Import PDF or image"
            >
              <Sparkles size={11} className="text-primary" />
              <span>Import AI</span>
            </button>

            <button
              onClick={handleCreateManual}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-primary text-background rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all active:scale-[0.98] cursor-pointer shadow-md"
            >
              <Plus size={12} />
              <span>Add Class</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="w-full">
        {!hasClasses ? (
          <EmptyTimetable
            onCreateManual={handleCreateManual}
            onImportClick={handleImportAI}
          />
        ) : viewMode === "week" ? (
          <WeeklyTimetable
            classes={classes}
            onAddClass={handleAddClass}
            onEditClass={handleEditClass}
            onDeleteClass={handleDeleteClass}
          />
        ) : (
          <DailyTimetable
            classes={classes}
            onAddClass={handleAddClass}
            onEditClass={handleEditClass}
            onDeleteClass={handleDeleteClass}
            onDuplicateClass={handleDuplicateClass}
          />
        )}
      </div>

      {/* Manual Creation/Editing Dialog */}
      <TimetableDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={dialogTitle}
        submitLabel={dialogSubmitLabel}
        initialValues={dialogInitialValues}
        onSubmit={handleDialogSubmit}
      />
    </div>
  );
};

export default TimetablePage;
