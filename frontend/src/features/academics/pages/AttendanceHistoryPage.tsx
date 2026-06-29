import React, { useState, useEffect } from "react";
import { useAttendance } from "../hooks/useAttendance";
import AttendanceHistory from "../components/AttendanceHistory";
import AttendanceLogDialog from "../components/AttendanceLogDialog";
import LoadingState from "../components/LoadingState";
import { type RecentAttendanceLogEnriched, type AttendanceStatus } from "../types/attendance";
import { ArrowLeft, Filter, Search, Calendar, FileText, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const AttendanceHistoryPage: React.FC = () => {
  const navigate = useNavigate();

  // Custom hook
  const {
    records,
    summary,
    loading,
    error,
    updateAttendanceLog,
    deleteAttendanceLog,
    refetchAll
  } = useAttendance();

  // States
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Dialog State
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [logToEdit, setLogToEdit] = useState<RecentAttendanceLogEnriched | null>(null);

  // Compile full log list
  const [filteredLogs, setFilteredLogs] = useState<RecentAttendanceLogEnriched[]>([]);

  useEffect(() => {
    if (summary && summary.recent_logs) {
      // Fetch full history logs list
      // Since summary.recent_logs is only 5 items, we can fetch all logs by combining
      // history fetches for each subject, OR we can fetch them. Wait, let's think:
      // We added `get_all_logs_for_records` on the backend, which returns ALL logs, but the summary endpoint only limits it to 5.
      // To get the full list of logs, we can call `fetchSubjectHistory` for all subjects or call the backend directly.
      // Wait, is there a direct API to get all logs?
      // In the backend, we defined:
      // `GET /api/attendance/history/{subjectId}` to get logs of a single subject.
      // Wait, does the API have an endpoint for ALL logs history?
      // Let's check `backend/app/routes/attendance.py`:
      // - `GET /api/attendance` -> records list.
      // - `GET /api/attendance/summary` -> contains `recent_logs` (limited to 5).
      // - `GET /api/attendance/history/{subject_id}` -> logs for a subject.
      // Ah! So we can fetch logs for all subjects or select a subject to fetch. If "all" is selected, we can fetch logs for all subjects in parallel!
      // This is perfect! Let's do that: fetch logs for all subjects in parallel when selectedSubject is "all", or fetch for the specific subject if it's set.
      // Let's implement this beautifully.
    }
  }, [summary]);

  const [allLogs, setAllLogs] = useState<RecentAttendanceLogEnriched[]>([]);
  const [fetchingLogs, setFetchingLogs] = useState(false);

  const fetchFullHistory = async () => {
    if (records.length === 0) return;
    setFetchingLogs(true);
    try {
      const promises = records.map(async (rec) => {
        // Fetch logs for this subject
        const response = await fetch(`/api/attendance/history/${rec.subject_id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("bit_student_access_token") || sessionStorage.getItem("bit_student_access_token")}`
          }
        });
        if (!response.ok) return [];
        const logs: any[] = await response.json();
        return logs.map((l) => ({
          ...l,
          subject_name: rec.subject_name
        }));
      });

      const results = await Promise.all(promises);
      const flattened = results.flat().sort((a, b) => b.class_date.localeCompare(a.class_date));
      setAllLogs(flattened);
    } catch (err) {
      console.error("Failed to load logs history", err);
    } finally {
      setFetchingLogs(false);
    }
  };

  useEffect(() => {
    if (records.length > 0) {
      fetchFullHistory();
    }
  }, [records]);

  // Apply filters
  useEffect(() => {
    let result = [...allLogs];

    if (selectedSubject !== "all") {
      result = result.filter((l) => l.subject_name.toLowerCase() === selectedSubject.toLowerCase());
    }

    if (selectedStatus !== "all") {
      result = result.filter((l) => l.status === selectedStatus);
    }

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter((l) =>
        l.remarks.toLowerCase().includes(q) ||
        l.subject_name.toLowerCase().includes(q)
      );
    }

    setFilteredLogs(result);
  }, [allLogs, selectedSubject, selectedStatus, searchQuery]);

  const handleEditClick = (log: RecentAttendanceLogEnriched) => {
    setLogToEdit(log);
    setIsEditDialogOpen(true);
  };

  const handleEditSave = async (data: {
    status: AttendanceStatus;
    remarks?: string;
    class_date: string;
  }) => {
    if (!logToEdit) return;
    await updateAttendanceLog(logToEdit.id, data);
    await fetchFullHistory(); // Reload history
  };

  const handleDeleteClick = async (logId: string) => {
    if (window.confirm("Are you sure you want to delete this attendance log? This will modify your attendance percentage.")) {
      await deleteAttendanceLog(logId);
      await fetchFullHistory(); // Reload history
    }
  };

  if (loading && allLogs.length === 0) {
    return <LoadingState />;
  }

  const subjectNames = Array.from(new Set(records.map((r) => r.subject_name)));

  return (
    <div className="space-y-6 select-text">
      {/* Header */}
      <div className="flex items-center gap-3 select-none">
        <button
          onClick={() => navigate("/academics/attendance")}
          className="p-1 hover:bg-surface-container border border-outline-variant/60 rounded-lg text-on-surface-variant hover:text-primary transition-all cursor-pointer"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h2 className="text-sm font-bold text-primary uppercase tracking-wider">Attendance History</h2>
          <p className="text-[10px] text-on-surface-variant mt-0.5">
            Audit and modify your previous logs to keep records in sync.
          </p>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4.5 bg-surface-container/30 border border-outline-variant/40 rounded-2xl select-none">
        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3.5 top-3.5 text-on-surface-variant/40" />
          <input
            type="text"
            placeholder="Search remarks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9.5 pr-4 py-2.5 bg-surface-container border border-outline-variant focus:border-primary rounded-xl focus:outline-none transition-all text-on-surface placeholder:text-on-surface-variant/30 text-xs font-semibold"
          />
        </div>

        {/* Subject Filter */}
        <div className="relative">
          <Filter size={14} className="absolute left-3.5 top-3.5 text-on-surface-variant/40" />
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full pl-9.5 pr-4 py-2.5 bg-surface-container border border-outline-variant focus:border-primary rounded-xl focus:outline-none transition-all text-on-surface text-xs font-semibold cursor-pointer"
          >
            <option value="all">All Subjects</option>
            {subjectNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="relative">
          <Filter size={14} className="absolute left-3.5 top-3.5 text-on-surface-variant/40" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full pl-9.5 pr-4 py-2.5 bg-surface-container border border-outline-variant focus:border-primary rounded-xl focus:outline-none transition-all text-on-surface text-xs font-semibold cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Holiday">Holiday</option>
            <option value="Medical Leave">Medical Leave</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      {fetchingLogs ? (
        <div className="flex items-center justify-center py-12 select-none">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <AttendanceHistory
          logs={filteredLogs}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          showSubjectColumn={true}
        />
      )}

      {/* Edit Log Dialog */}
      {logToEdit && (
        <AttendanceLogDialog
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setLogToEdit(null);
          }}
          subjects={subjectNames}
          editLog={logToEdit}
          onSave={handleEditSave}
        />
      )}
    </div>
  );
};

export default AttendanceHistoryPage;
