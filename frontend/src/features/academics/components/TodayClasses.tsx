import React, { useState, useEffect } from "react";
import { type ClassEntry } from "../types/timetable";
import { Clock, MapPin, User, Check, X, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import attendanceApi from "../services/attendanceApi";
import { type AttendanceStatus } from "../types/attendance";

interface TodayClassesProps {
  classes: ClassEntry[];
}

export const TodayClasses: React.FC<TodayClassesProps> = ({ classes }) => {
  const [attendanceStatusMap, setAttendanceStatusMap] = useState<Record<string, { status: AttendanceStatus; logId: string; recordId: string }>>({});
  const [loadingStatus, setLoadingStatus] = useState(false);

  // Parse time to minutes for comparison
  const getMinutes = (timeStr: string) => {
    const parts = timeStr.split(":").map(Number);
    return parts[0] * 60 + parts[1];
  };

  // Resolve current active/upcoming status
  const now = new Date();
  const currentMins = now.getHours() * 60 + now.getMinutes();

  const getLectureStatus = (cls: ClassEntry) => {
    const start = getMinutes(cls.start_time);
    const end = getMinutes(cls.end_time);
    if (currentMins >= start && currentMins <= end) return "live";
    if (currentMins < start) return "upcoming";
    return "completed";
  };

  // Fetch current logging status for today's classes
  const fetchTodayAttendanceStatus = async () => {
    setLoadingStatus(true);
    try {
      const summary = await attendanceApi.getDashboardSummary();
      const newMap: Record<string, { status: AttendanceStatus; logId: string; recordId: string }> = {};
      summary.today_attendance.forEach((item) => {
        if (item.logged_status && item.log_id && item.attendance_record_id) {
          newMap[item.subject.toLowerCase()] = {
            status: item.logged_status,
            logId: item.log_id,
            recordId: item.attendance_record_id
          };
        }
      });
      setAttendanceStatusMap(newMap);
    } catch (err) {
      console.error("Failed to load today's attendance status", err);
    } finally {
      setLoadingStatus(false);
    }
  };

  useEffect(() => {
    fetchTodayAttendanceStatus();
  }, [classes]);

  const handleQuickLog = async (subjectName: string, status: AttendanceStatus) => {
    try {
      const today = new Date();
      const offset = today.getTimezoneOffset();
      const localDate = new Date(today.getTime() - (offset * 60 * 1000));
      const todayStr = localDate.toISOString().split("T")[0];

      const record = await attendanceApi.createLog({
        subject_name: subjectName,
        class_date: todayStr,
        status: status,
        remarks: "Logged via Today's Classes widget"
      });

      // Refetch to update status mapping and trigger recalculation
      await fetchTodayAttendanceStatus();
    } catch (err) {
      console.error("Failed to quick log class attendance", err);
    }
  };

  if (classes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-8 gap-2 select-none">
        <p className="text-on-surface-variant text-[11px]">
          No classes scheduled for today. Enjoy your day!
        </p>
      </div>
    );
  }

  // Sort classes by start time
  const sortedClasses = [...classes].sort((a, b) => getMinutes(a.start_time) - getMinutes(b.start_time));

  return (
    <div className="relative border-l border-outline-variant/40 ml-2.5 pl-6 space-y-6 select-text py-2">
      {sortedClasses.map((cls, idx) => {
        const lectureStatus = getLectureStatus(cls);
        const logInfo = attendanceStatusMap[cls.subject.toLowerCase()];
        const isLogged = !!logInfo;

        return (
          <motion.div
            key={cls.id}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: idx * 0.05 }}
            className={`relative flex flex-col justify-between p-4 border rounded-xl transition-all gap-3 ${
              lectureStatus === "live"
                ? "bg-surface-container border-primary shadow-sm"
                : lectureStatus === "completed"
                ? "bg-surface-container/30 border-outline-variant/30 opacity-80"
                : "bg-surface-container border-outline-variant/50"
            }`}
          >
            {/* Timeline Dot */}
            <div
              className={`absolute -left-[31px] top-5 w-2.5 h-2.5 rounded-full border-2 bg-background ${
                lectureStatus === "live"
                  ? "border-primary scale-125 bg-primary"
                  : lectureStatus === "completed"
                  ? "border-outline-variant/50"
                  : "border-outline"
              }`}
            />

            <div className="flex justify-between items-start gap-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="text-xs font-bold text-primary leading-tight">{cls.subject}</h4>
                  {lectureStatus === "live" && (
                    <span className="text-[8px] font-bold text-background bg-primary px-1.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse select-none">
                      Live
                    </span>
                  )}
                  {lectureStatus === "completed" && (
                    <span className="text-[8px] font-bold text-on-surface-variant/60 bg-surface-container-high px-1.5 py-0.5 rounded-full uppercase tracking-wider select-none">
                      Done
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-on-surface-variant">
                  <User size={10} className="shrink-0" />
                  <span>{cls.faculty}</span>
                </div>
              </div>

              <div className="text-[10px] font-mono-code font-bold text-primary/80 shrink-0 select-none bg-surface-container-high border border-outline-variant/40 px-2 py-0.5 rounded">
                {cls.start_time} - {cls.end_time}
              </div>
            </div>

            {/* Quick Logging Buttons / Logging Status */}
            <div className="flex justify-between items-center select-none border-t border-outline-variant/20 pt-2.5 mt-1 text-[9px] font-semibold uppercase tracking-wider text-on-surface-variant">
              <div className="flex items-center gap-1">
                <MapPin size={9} />
                <span>{cls.classroom}{cls.building ? `, ${cls.building}` : ""}</span>
              </div>
              
              <div className="flex items-center gap-1">
                {isLogged ? (
                  <span
                    className={`text-[8px] font-bold px-2 py-0.5 border rounded-full ${
                      logInfo.status === "Present"
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                        : logInfo.status === "Absent"
                        ? "bg-red-500/10 border-red-500/20 text-red-400"
                        : "bg-slate-500/10 border-slate-500/20 text-slate-400"
                    }`}
                  >
                    Logged: {logInfo.status}
                  </span>
                ) : (
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleQuickLog(cls.subject, "Present")}
                      className="px-2 py-0.5 border border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[8px] font-bold rounded cursor-pointer"
                    >
                      Present
                    </button>
                    <button
                      onClick={() => handleQuickLog(cls.subject, "Absent")}
                      className="px-2 py-0.5 border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[8px] font-bold rounded cursor-pointer"
                    >
                      Absent
                    </button>
                    <button
                      onClick={() => handleQuickLog(cls.subject, "Cancelled")}
                      className="px-2 py-0.5 border border-slate-500/20 bg-slate-500/10 hover:bg-slate-500/20 text-slate-400 text-[8px] font-bold rounded cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default TodayClasses;
