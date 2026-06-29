import React, { useState } from "react";
import { useAttendance } from "../hooks/useAttendance";
import AttendanceSummary from "../components/AttendanceSummary";
import AttendanceCard from "../components/AttendanceCard";
import AttendanceHistory from "../components/AttendanceHistory";
import AttendanceLogDialog from "../components/AttendanceLogDialog";
import AttendanceAnalytics from "../components/AttendanceAnalytics";
import SafeLeaveCard from "../components/SafeLeaveCard";
import RequiredClassesCard from "../components/RequiredClassesCard";
import LoadingState from "../components/LoadingState";
import { UserCheck, ShieldAlert, Plus, Calendar, BarChart2, BookOpen, Clock, MapPin, User, Check, X, AlertOctagon } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const AttendancePage: React.FC = () => {
  const navigate = useNavigate();
  
  // Custom Hook
  const {
    records,
    summary,
    analytics,
    loading,
    error,
    logAttendance,
    updateAttendanceLog,
    deleteAttendanceLog
  } = useAttendance();

  // Dialog State
  const [isLogDialogOpen, setIsLogDialogOpen] = useState(false);
  const [dialogPreselectedSubject, setDialogPreselectedSubject] = useState("");
  const [activeTab, setActiveTab] = useState<"dashboard" | "courses" | "analytics">("dashboard");

  // Get unique subjects for manual logging dialog dropdown
  const subjectList = records.map((r) => r.subject_name);

  const handleOpenLogDialog = (subjectName: string = "") => {
    setDialogPreselectedSubject(subjectName);
    setIsLogDialogOpen(true);
  };

  const handleQuickLog = async (subjectName: string, status: "Present" | "Absent" | "Cancelled") => {
    try {
      // Get today's local date YYYY-MM-DD
      const today = new Date();
      const offset = today.getTimezoneOffset();
      const localDate = new Date(today.getTime() - (offset * 60 * 1000));
      const todayStr = localDate.toISOString().split("T")[0];

      await logAttendance({
        subject_name: subjectName,
        class_date: todayStr,
        status: status,
        remarks: "Logged via Today's Classes widget"
      });
    } catch (err) {
      console.error("Quick log failed", err);
    }
  };

  if (loading && !summary) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6 select-text">
      {/* Page Header */}
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-1 select-none">
          <h2 className="text-sm font-bold text-primary uppercase tracking-wider">Attendance Tracking</h2>
          <p className="text-[11px] text-on-surface-variant max-w-xl leading-relaxed">
            Monitor attendance percentages, estimate allowed leaves, and stay above the mandatory 75% threshold.
          </p>
        </div>
        
        <button
          onClick={() => handleOpenLogDialog("")}
          className="px-4 py-2 bg-primary hover:bg-primary/95 text-background text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all active:scale-[0.98] flex items-center gap-1.5 shadow-md cursor-pointer select-none"
        >
          <Plus size={12} />
          <span>Manual Entry</span>
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2 text-red-400 text-[10px] font-bold">
          <AlertOctagon size={14} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {summary && (
        <>
          {/* Tabs Nav */}
          <div className="flex border-b border-outline-variant/30 pb-px gap-2 select-none overflow-x-auto custom-scrollbar">
            {(["dashboard", "courses", "analytics"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 border-b-2 text-[10px] font-bold uppercase tracking-wider transition-all duration-150 shrink-0 cursor-pointer ${
                  activeTab === tab
                    ? "border-primary text-primary"
                    : "border-transparent text-on-surface-variant hover:text-primary"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Active Tab View */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Overall cumulative stats */}
              <AttendanceSummary summary={summary} />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Today's schedule section */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex justify-between items-center select-none">
                    <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                      <Clock size={12} />
                      Today's Classes
                    </h3>
                    <span className="text-[9px] font-bold text-on-surface-variant bg-surface-container border border-outline-variant/60 px-2 py-0.5 rounded-lg">
                      {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" })}
                    </span>
                  </div>

                  <div className="matte-card rounded-2xl p-5 border border-outline-variant/40 bg-surface-container/20 space-y-4">
                    {summary.today_attendance.length === 0 ? (
                      <div className="flex flex-col items-center justify-center text-center py-6 gap-2 select-none">
                        <p className="text-on-surface-variant text-[11px]">
                          No classes scheduled for today. Enjoy your day!
                        </p>
                      </div>
                    ) : (
                      <div className="relative border-l border-outline-variant/30 ml-2 pl-5 space-y-5 py-1">
                        {summary.today_attendance.map((cls) => {
                          const isLogged = !!cls.logged_status;
                          return (
                            <div key={cls.id} className="relative flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-outline-variant/40 rounded-xl bg-surface-container/60 gap-4">
                              {/* Timeline Dot */}
                              <div
                                className={`absolute -left-[26px] top-[22px] w-2 h-2 rounded-full border bg-background ${
                                  isLogged ? "border-primary bg-primary" : "border-outline"
                                }`}
                              />

                              <div className="space-y-1">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <h4 className="text-xs font-bold text-primary leading-tight">{cls.subject}</h4>
                                  <span className="text-[9px] font-mono-code font-bold text-on-surface-variant bg-surface-container px-1.5 py-0.5 border border-outline-variant/30 rounded">
                                    {cls.start_time} - {cls.end_time}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3 text-[10px] text-on-surface-variant font-medium select-none">
                                  <span className="flex items-center gap-1">
                                    <User size={10} />
                                    {cls.faculty}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <MapPin size={10} />
                                    {cls.classroom}{cls.building ? `, ${cls.building}` : ""}
                                  </span>
                                </div>
                              </div>

                              {/* Logging Actions */}
                              <div className="flex items-center gap-2 select-none self-end sm:self-center shrink-0">
                                {isLogged ? (
                                  <div className="flex items-center gap-1.5">
                                    <span
                                      className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 border rounded-full ${
                                        cls.logged_status === "Present"
                                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                          : cls.logged_status === "Absent"
                                          ? "bg-red-500/10 border-red-500/20 text-red-400"
                                          : "bg-slate-500/10 border-slate-500/20 text-slate-400"
                                      }`}
                                    >
                                      {cls.logged_status}
                                    </span>
                                    <button
                                      onClick={() => navigate(`/academics/attendance/subject/${cls.attendance_record_id}`)}
                                      className="text-[9px] font-bold text-primary hover:underline hover:text-primary/80 transition-all cursor-pointer"
                                    >
                                      Edit
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => handleQuickLog(cls.subject, "Present")}
                                      className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer"
                                    >
                                      Present
                                    </button>
                                    <button
                                      onClick={() => handleQuickLog(cls.subject, "Absent")}
                                      className="px-2.5 py-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-[9px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer"
                                    >
                                      Absent
                                    </button>
                                    <button
                                      onClick={() => handleQuickLog(cls.subject, "Cancelled")}
                                      className="px-2.5 py-1 bg-slate-500/10 hover:bg-slate-500/20 border border-slate-500/20 text-slate-400 text-[9px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right sidebar for summary widgets */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5 select-none">
                    <ShieldAlert size={12} />
                    Compliance & Safety
                  </h3>

                  <div className="space-y-4">
                    {/* Safe Leaves calculation widget */}
                    {records.length > 0 ? (
                      <>
                        <SafeLeaveCard
                          safeLeaves={records.reduce((sum, r) => sum + r.safe_leaves, 0)}
                        />
                        <RequiredClassesCard
                          requiredClasses={records.reduce((sum, r) => sum + r.required_classes, 0)}
                        />
                      </>
                    ) : (
                      <div className="matte-card rounded-2xl p-5 border border-outline-variant bg-surface-container/20 text-center select-none">
                        <p className="text-[10px] text-on-surface-variant font-medium">
                          No safety parameters calculated yet.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="space-y-3">
                <div className="flex justify-between items-center select-none">
                  <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar size={12} />
                    Recent Logs
                  </h3>
                  <button
                    onClick={() => navigate("/academics/attendance/history")}
                    className="text-[9px] font-bold text-primary hover:underline hover:text-primary/80 transition-all cursor-pointer"
                  >
                    View All History →
                  </button>
                </div>
                <AttendanceHistory
                  logs={summary.recent_logs}
                  onEdit={(log) => navigate(`/academics/attendance/history`)}
                  onDelete={async (logId) => {
                    if (window.confirm("Are you sure you want to delete this log?")) {
                      await deleteAttendanceLog(logId);
                    }
                  }}
                />
              </div>
            </div>
          )}

          {activeTab === "courses" && (
            <div className="space-y-6">
              {records.length === 0 ? (
                <div className="py-12 select-none">
                  <div className="matte-card border-dashed border-outline-variant/60 rounded-2xl p-8 max-w-sm mx-auto text-center space-y-3">
                    <UserCheck className="mx-auto text-on-surface-variant/40" size={28} />
                    <div>
                      <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider">No Courses Registered</h4>
                      <p className="text-[10px] text-on-surface-variant mt-1.5 leading-normal">
                        Initialize your course schedule inside the Timetable workspace to start monitoring attendance.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {records.map((rec) => (
                    <AttendanceCard
                      key={rec.id}
                      record={rec}
                      onLogClick={handleOpenLogDialog}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "analytics" && analytics && (
            <AttendanceAnalytics analytics={analytics} />
          )}
        </>
      )}

      {/* Manual Entry Dialog */}
      <AttendanceLogDialog
        isOpen={isLogDialogOpen}
        onClose={() => setIsLogDialogOpen(false)}
        subjects={subjectList}
        editLog={null}
        onSave={async (data) => {
          await logAttendance(data);
        }}
      />
    </div>
  );
};

export default AttendancePage;
