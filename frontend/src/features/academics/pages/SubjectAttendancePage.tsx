import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAttendance } from "../hooks/useAttendance";
import AttendanceProgress from "../components/AttendanceProgress";
import SafeLeaveCard from "../components/SafeLeaveCard";
import RequiredClassesCard from "../components/RequiredClassesCard";
import AttendanceHistory from "../components/AttendanceHistory";
import AttendanceLogDialog from "../components/AttendanceLogDialog";
import LoadingState from "../components/LoadingState";
import { type RecentAttendanceLogEnriched, type AttendanceStatus } from "../types/attendance";
import { ArrowLeft, BookOpen, User, GraduationCap, Clock, AlertTriangle, Plus } from "lucide-react";
import { motion } from "framer-motion";

export const SubjectAttendancePage: React.FC = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();

  // Custom hook
  const {
    records,
    loading,
    error,
    fetchSubjectHistory,
    updateAttendanceLog,
    deleteAttendanceLog,
    logAttendance
  } = useAttendance(true);

  // States
  const [subjectRecord, setSubjectRecord] = useState<any | null>(null);
  const [subjectLogs, setSubjectLogs] = useState<RecentAttendanceLogEnriched[]>([]);
  const [fetchingHistory, setFetchingHistory] = useState(false);
  
  // Dialog State
  const [isLogDialogOpen, setIsLogDialogOpen] = useState(false);
  const [logToEdit, setLogToEdit] = useState<RecentAttendanceLogEnriched | null>(null);

  useEffect(() => {
    if (records.length > 0 && subjectId) {
      const match = records.find((r) => r.subject_id === subjectId || r.id === subjectId);
      if (match) {
        setSubjectRecord(match);
      }
    }
  }, [records, subjectId]);

  const loadHistory = async () => {
    if (!subjectRecord) return;
    setFetchingHistory(true);
    try {
      const logs = await fetchSubjectHistory(subjectRecord.subject_id);
      // Map to enriched logs structure
      const enriched = logs.map((l) => ({
        ...l,
        subject_name: subjectRecord.subject_name,
        remarks: l.remarks || ""
      }));
      setSubjectLogs(enriched);
    } catch (err) {
      console.error("Failed to load subject logs", err);
    } finally {
      setFetchingHistory(false);
    }
  };

  useEffect(() => {
    if (subjectRecord) {
      loadHistory();
    }
  }, [subjectRecord]);

  const handleEditClick = (log: RecentAttendanceLogEnriched) => {
    setLogToEdit(log);
    setIsLogDialogOpen(true);
  };

  const handleSaveLog = async (data: {
    status: AttendanceStatus;
    remarks?: string;
    class_date: string;
  }) => {
    if (logToEdit) {
      // Edit mode
      await updateAttendanceLog(logToEdit.id, data);
    } else {
      // Create mode
      await logAttendance({
        subject_name: subjectRecord.subject_name,
        class_date: data.class_date,
        status: data.status,
        remarks: data.remarks
      });
    }
    await loadHistory(); // Reload history
  };

  const handleDeleteClick = async (logId: string) => {
    if (window.confirm("Are you sure you want to delete this log?")) {
      await deleteAttendanceLog(logId);
      await loadHistory();
    }
  };

  if (loading && !subjectRecord) {
    return <LoadingState />;
  }

  if (!subjectRecord) {
    return (
      <div className="text-center py-12 select-none space-y-4">
        <AlertTriangle className="mx-auto text-yellow-400" size={32} />
        <div>
          <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider">Subject Not Found</h3>
          <p className="text-[10px] text-on-surface-variant mt-1.5">
            The requested course attendance details could not be found.
          </p>
        </div>
        <button
          onClick={() => navigate("/academics/attendance")}
          className="text-xs text-primary font-bold hover:underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  const isBelow = subjectRecord.attendance_percentage < 75.0;

  return (
    <div className="space-y-6 select-text">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 select-none">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/academics/attendance")}
            className="p-1 hover:bg-surface-container border border-outline-variant/60 rounded-lg text-on-surface-variant hover:text-primary transition-all cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h2 className="text-sm font-extrabold text-primary uppercase tracking-wider leading-tight">
              {subjectRecord.subject_name}
            </h2>
            <div className="flex items-center gap-3 mt-1 text-[9px] text-on-surface-variant font-semibold uppercase tracking-wider">
              <span className="flex items-center gap-1">
                <User size={10} />
                {subjectRecord.faculty}
              </span>
              <span className="flex items-center gap-1">
                <GraduationCap size={10} />
                Sem {subjectRecord.semester} • Section {subjectRecord.section}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setLogToEdit(null);
            setIsLogDialogOpen(true);
          }}
          className="px-4 py-2 bg-primary hover:bg-primary/95 text-background text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all active:scale-[0.98] flex items-center gap-1.5 shadow-md cursor-pointer select-none"
        >
          <Plus size={12} />
          <span>Add Log</span>
        </button>
      </div>

      {/* Stats and calculations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Progress Card */}
        <div className="matte-card rounded-2xl p-5 border border-outline-variant/60 bg-surface-container/30 flex flex-col justify-between gap-4">
          <div className="flex justify-between items-center select-none">
            <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">Course Percentage</span>
            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 border rounded-full ${
              isBelow 
                ? "bg-red-500/10 border-red-500/20 text-red-400" 
                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
            }`}>
              {isBelow ? "Critical" : "Safe"}
            </span>
          </div>

          <div className="flex items-baseline gap-1 select-none">
            <span className={`text-4xl font-extrabold tracking-tight ${isBelow ? "text-red-400" : "text-emerald-400"}`}>
              {subjectRecord.attendance_percentage.toFixed(1)}%
            </span>
            <span className="text-[10px] text-on-surface-variant font-semibold">
              ({subjectRecord.total_attended} / {subjectRecord.total_conducted} lectures)
            </span>
          </div>

          <AttendanceProgress percentage={subjectRecord.attendance_percentage} size="sm" />
        </div>

        {/* Prediction Cards */}
        <SafeLeaveCard safeLeaves={subjectRecord.safe_leaves} />
        <RequiredClassesCard requiredClasses={subjectRecord.required_classes} />
      </div>

      {/* History timeline */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5 select-none">
          <Clock size={12} />
          Attendance Timeline
        </h3>

        {fetchingHistory ? (
          <div className="flex items-center justify-center py-12 select-none">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <AttendanceHistory
            logs={subjectLogs}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            showSubjectColumn={false}
          />
        )}
      </div>

      {/* Log Dialog (Edit / Log) */}
      <AttendanceLogDialog
        isOpen={isLogDialogOpen}
        onClose={() => {
          setIsLogDialogOpen(false);
          setLogToEdit(null);
        }}
        subjects={[subjectRecord.subject_name]}
        editLog={logToEdit}
        onSave={handleSaveLog}
      />
    </div>
  );
};

export default SubjectAttendancePage;
