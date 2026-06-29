import React from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Calendar, 
  CheckSquare, 
  ClipboardList 
} from "lucide-react";

export const AcademicTabs: React.FC = () => {
  const tabs = [
    { id: "dashboard", label: "Dashboard", path: "/academics", icon: LayoutDashboard, end: true },
    { id: "timetable", label: "Timetable", path: "/academics/timetable", icon: Calendar, end: false },
    { id: "attendance", label: "Attendance", path: "/academics/attendance", icon: CheckSquare, end: false },
    { id: "planner", label: "Planner", path: "/academics/planner", icon: ClipboardList, end: false },
  ];

  return (
    <div className="flex border-b border-outline-variant/30 pb-px gap-2 select-none overflow-x-auto custom-scrollbar">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <NavLink
            key={tab.id}
            to={tab.path}
            end={tab.end}
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 border-b-2 text-xs font-bold uppercase tracking-wider transition-all duration-150 shrink-0 select-none cursor-pointer ${
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-on-surface-variant hover:text-primary"
              }`
            }
          >
            <Icon size={14} className="shrink-0" />
            <span>{tab.label}</span>
          </NavLink>
        );
      })}
    </div>
  );
};

export default AcademicTabs;
