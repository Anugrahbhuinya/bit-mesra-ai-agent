import React from "react";
import { type RecentAttendanceLogEnriched, type AttendanceStatus } from "../types/attendance";
import { Edit2, Trash2, Calendar, FileText } from "lucide-react";
import { motion } from "framer-motion";

interface AttendanceHistoryProps {
  logs: RecentAttendanceLogEnriched[];
  onEdit: (log: RecentAttendanceLogEnriched) => void;
  onDelete: (logId: string) => void;
  showSubjectColumn?: boolean;
}

export const AttendanceHistory: React.FC<AttendanceHistoryProps> = ({
  logs,
  onEdit,
  onDelete,
  showSubjectColumn = true
}) => {
  const getStatusBadge = (status: AttendanceStatus) => {
    const config = {
      Present: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
      Absent: "bg-red-500/10 border-red-500/20 text-red-400",
      Cancelled: "bg-slate-500/10 border-slate-500/20 text-slate-400",
      Holiday: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
      "Medical Leave": "bg-blue-500/10 border-blue-500/20 text-blue-400"
    }[status] || "bg-surface-container border-outline-variant text-on-surface-variant";

    return (
      <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 border rounded-full ${config}`}>
        {status}
      </span>
    );
  };

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-10 gap-2 select-none bg-surface-container/20 rounded-2xl border border-dashed border-outline-variant/60">
        <p className="text-on-surface-variant text-[11px]">
          No lecture attendance sessions recorded yet.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto custom-scrollbar border border-outline-variant/30 rounded-2xl bg-surface-container/20 select-text">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-outline-variant/30 text-[9px] font-bold text-on-surface-variant uppercase tracking-wider bg-surface-container/40 select-none">
            <th className="px-5 py-3">Date</th>
            {showSubjectColumn && <th className="px-5 py-3">Course</th>}
            <th className="px-5 py-3">Status</th>
            <th className="px-5 py-3">Remarks</th>
            <th className="px-5 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/20 text-xs font-semibold text-on-surface">
          {logs.map((log, idx) => {
            const formattedDate = new Date(log.class_date).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric"
            });
            return (
              <motion.tr
                key={log.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, delay: idx * 0.03 }}
                className="hover:bg-surface-container/30 transition-colors"
              >
                {/* Date */}
                <td className="px-5 py-3.5 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Calendar size={11} className="text-on-surface-variant/60" />
                    <span className="font-mono-code font-bold">{formattedDate}</span>
                  </div>
                </td>
                
                {/* Subject Column */}
                {showSubjectColumn && (
                  <td className="px-5 py-3.5 font-extrabold text-primary">
                    {log.subject_name}
                  </td>
                )}
                
                {/* Status */}
                <td className="px-5 py-3.5">
                  {getStatusBadge(log.status)}
                </td>
                
                {/* Remarks */}
                <td className="px-5 py-3.5 text-[10px] text-on-surface-variant max-w-[200px] truncate italic">
                  {log.remarks ? (
                    <div className="flex items-center gap-1.5">
                      <FileText size={10} className="shrink-0 text-on-surface-variant/40" />
                      <span className="line-clamp-1">{log.remarks}</span>
                    </div>
                  ) : (
                    <span className="text-on-surface-variant/20">—</span>
                  )}
                </td>
                
                {/* Actions */}
                <td className="px-5 py-3.5 text-right whitespace-nowrap select-none">
                  <div className="inline-flex gap-1.5">
                    <button
                      onClick={() => onEdit(log)}
                      className="p-1 hover:bg-surface-container-high border border-outline-variant/60 rounded-lg text-on-surface-variant hover:text-primary transition-all cursor-pointer"
                      title="Edit log"
                    >
                      <Edit2 size={11} />
                    </button>
                    <button
                      onClick={() => onDelete(log.id)}
                      className="p-1 hover:bg-red-500/10 border border-outline-variant/60 hover:border-red-500/20 rounded-lg text-on-surface-variant hover:text-red-400 transition-all cursor-pointer"
                      title="Delete log"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceHistory;
