import React from "react";
import { Trash2, Plus, AlertCircle } from "lucide-react";
import type { ClassEntry } from "../types/timetable";

interface PreviewTableProps {
  classes: ClassEntry[];
  onChange: (updatedClasses: ClassEntry[]) => void;
}

export const PreviewTable: React.FC<PreviewTableProps> = ({
  classes,
  onChange,
}) => {
  const handleCellChange = (index: number, field: keyof ClassEntry, value: any) => {
    const updated = [...classes];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    onChange(updated);
  };

  const handleDeleteRow = (index: number) => {
    const updated = classes.filter((_, idx) => idx !== index);
    onChange(updated);
  };

  const handleAddRow = () => {
    const newRow: ClassEntry = {
      id: Math.random().toString(36).substr(2, 9),
      day: "Monday",
      subject: "",
      faculty: "",
      classroom: "",
      building: "",
      start_time: "09:00",
      end_time: "10:00",
      remarks: "",
    };
    onChange([...classes, newRow]);
  };

  const validateTimes = (start: string, end: string) => {
    if (!start || !end) return true;
    const startMins = start.split(":").map(Number);
    const endMins = end.split(":").map(Number);
    if (startMins.length !== 2 || endMins.length !== 2) return false;
    const startTotal = startMins[0] * 60 + startMins[1];
    const endTotal = endMins[0] * 60 + endMins[1];
    return startTotal < endTotal;
  };

  return (
    <div className="space-y-4 select-text">
      <div className="overflow-x-auto custom-scrollbar border border-outline-variant rounded-2xl bg-surface-container/60">
        <table className="w-full text-left border-collapse table-auto">
          <thead>
            <tr className="bg-surface-container border-b border-outline-variant text-[9px] font-bold text-on-surface-variant uppercase tracking-wider select-none">
              <th className="px-4 py-3 min-w-[120px]">Day</th>
              <th className="px-4 py-3 min-w-[160px]">Subject</th>
              <th className="px-4 py-3 min-w-[140px]">Faculty</th>
              <th className="px-4 py-3 min-w-[100px]">Classroom</th>
              <th className="px-4 py-3 min-w-[80px]">Start Time</th>
              <th className="px-4 py-3 min-w-[80px]">End Time</th>
              <th className="px-4 py-3 min-w-[100px]">Remarks</th>
              <th className="px-4 py-3 text-center w-12 select-none">Delete</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/30 text-xs">
            {classes.length === 0 ? (
              <tr className="select-none">
                <td colSpan={8} className="px-4 py-8 text-center text-on-surface-variant/60 font-semibold uppercase tracking-wider">
                  No entries listed. Click "+ Add Lecture Row" to begin.
                </td>
              </tr>
            ) : (
              classes.map((cls, idx) => {
                const isTimeValid = validateTimes(cls.start_time, cls.end_time);
                return (
                  <tr key={cls.id} className="hover:bg-surface-container/30 transition-colors">
                    {/* Day select */}
                    <td className="p-2">
                      <select
                        value={cls.day}
                        onChange={(e) => handleCellChange(idx, "day", e.target.value)}
                        className="w-full px-2 py-1.5 bg-surface-container border border-outline-variant focus:border-primary rounded-lg text-xs font-semibold text-on-surface focus:outline-none"
                      >
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((d) => (
                          <option key={d} value={d} className="bg-surface-container-high">
                            {d}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Subject input */}
                    <td className="p-2">
                      <input
                        type="text"
                        value={cls.subject}
                        placeholder="e.g. Distributed Systems"
                        onChange={(e) => handleCellChange(idx, "subject", e.target.value)}
                        className={`w-full px-2 py-1.5 bg-surface-container border focus:border-primary rounded-lg text-xs font-semibold text-on-surface focus:outline-none placeholder:text-on-surface-variant/20 ${
                          !cls.subject.trim() ? "border-red-500/50" : "border-outline-variant"
                        }`}
                      />
                    </td>

                    {/* Faculty input */}
                    <td className="p-2">
                      <input
                        type="text"
                        value={cls.faculty}
                        placeholder="Prof. Name"
                        onChange={(e) => handleCellChange(idx, "faculty", e.target.value)}
                        className={`w-full px-2 py-1.5 bg-surface-container border focus:border-primary rounded-lg text-xs font-semibold text-on-surface focus:outline-none placeholder:text-on-surface-variant/20 ${
                          !cls.faculty.trim() ? "border-red-500/50" : "border-outline-variant"
                        }`}
                      />
                    </td>

                    {/* Classroom input */}
                    <td className="p-2">
                      <input
                        type="text"
                        value={cls.classroom}
                        placeholder="LH-1"
                        onChange={(e) => handleCellChange(idx, "classroom", e.target.value)}
                        className="w-full px-2 py-1.5 bg-surface-container border border-outline-variant focus:border-primary rounded-lg text-xs font-semibold text-on-surface focus:outline-none placeholder:text-on-surface-variant/20"
                      />
                    </td>

                    {/* Start Time input */}
                    <td className="p-2">
                      <input
                        type="text"
                        value={cls.start_time}
                        placeholder="09:00"
                        maxLength={5}
                        onChange={(e) => handleCellChange(idx, "start_time", e.target.value)}
                        className={`w-full px-2 py-1.5 bg-surface-container border focus:border-primary rounded-lg text-xs font-mono-code font-bold text-on-surface focus:outline-none text-center ${
                          !isTimeValid ? "border-red-500/50" : "border-outline-variant"
                        }`}
                      />
                    </td>

                    {/* End Time input */}
                    <td className="p-2">
                      <input
                        type="text"
                        value={cls.end_time}
                        placeholder="10:00"
                        maxLength={5}
                        onChange={(e) => handleCellChange(idx, "end_time", e.target.value)}
                        className={`w-full px-2 py-1.5 bg-surface-container border focus:border-primary rounded-lg text-xs font-mono-code font-bold text-on-surface focus:outline-none text-center ${
                          !isTimeValid ? "border-red-500/50" : "border-outline-variant"
                        }`}
                      />
                    </td>

                    {/* Remarks input */}
                    <td className="p-2">
                      <input
                        type="text"
                        value={cls.remarks || ""}
                        placeholder="None"
                        onChange={(e) => handleCellChange(idx, "remarks", e.target.value)}
                        className="w-full px-2 py-1.5 bg-surface-container border border-outline-variant focus:border-primary rounded-lg text-xs font-semibold text-on-surface focus:outline-none placeholder:text-on-surface-variant/20"
                      />
                    </td>

                    {/* Delete action */}
                    <td className="p-2 text-center select-none">
                      <button
                        type="button"
                        onClick={() => handleDeleteRow(idx)}
                        className="p-1.5 hover:bg-red-500/10 text-on-surface-variant hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                        title="Delete class"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center select-none">
        <button
          type="button"
          onClick={handleAddRow}
          className="flex items-center gap-1.5 px-4 py-2 bg-surface-container hover:bg-surface-container-high border border-outline-variant text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
        >
          <Plus size={12} />
          <span>Add Lecture Row</span>
        </button>

        {classes.some(cls => !cls.subject.trim() || !cls.faculty.trim() || !validateTimes(cls.start_time, cls.end_time)) && (
          <div className="flex items-center gap-1.5 text-red-400 text-[10px] font-bold uppercase tracking-wider bg-red-500/5 border border-red-500/15 px-3.5 py-1.5 rounded-xl">
            <AlertCircle size={12} />
            <span>Review red fields before saving</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewTable;
