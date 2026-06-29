import React from "react";
import type { AttendanceAnalytics as AttendanceAnalyticsData } from "../types/attendance";
import AttendanceChart from "./AttendanceChart";
import { LineChart, BarChart2, PieChart, Activity } from "lucide-react";
import { motion } from "framer-motion";

interface AttendanceAnalyticsProps {
  analytics: AttendanceAnalyticsData;
}

export const AttendanceAnalytics: React.FC<AttendanceAnalyticsProps> = ({ analytics }) => {
  return (
    <div className="space-y-6 select-text">
      {/* Overview Metric Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Average Attendance widget */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="matte-card rounded-2xl p-5 border border-outline-variant/60 bg-surface-container/30 flex items-center justify-between gap-4 select-none"
        >
          <div className="space-y-1">
            <h4 className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">
              Mean Semester Attendance
            </h4>
            <p className="text-2xl font-black text-primary font-mono-code leading-none">
              {analytics.average_attendance.toFixed(1)}%
            </p>
            <p className="text-[9px] text-on-surface-variant/80">
              Average rate across all courses.
            </p>
          </div>
          <div className="p-3 bg-primary/10 border border-primary/20 text-primary rounded-xl">
            <Activity size={18} />
          </div>
        </motion.div>

        {/* Weekly Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="matte-card rounded-2xl p-5 border border-outline-variant/60 bg-surface-container/30 flex items-center justify-between gap-4 select-none"
        >
          <div className="space-y-1">
            <h4 className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">
              Weekly Activity Trend
            </h4>
            <p className="text-2xl font-black text-teal-400 font-mono-code leading-none">
              {analytics.weekly_trend.length > 0
                ? `${analytics.weekly_trend[analytics.weekly_trend.length - 1].percentage.toFixed(1)}%`
                : "— %"}
            </p>
            <p className="text-[9px] text-on-surface-variant/80">
              Current weekly attendance rate.
            </p>
          </div>
          <div className="p-3 bg-teal-500/10 border border-teal-500/20 text-teal-400 rounded-xl">
            <LineChart size={18} />
          </div>
        </motion.div>

        {/* Total Sessions tracked */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="matte-card rounded-2xl p-5 border border-outline-variant/60 bg-surface-container/30 flex items-center justify-between gap-4 select-none"
        >
          <div className="space-y-1">
            <h4 className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">
              Tracked Class Sessions
            </h4>
            <p className="text-2xl font-black text-indigo-400 font-mono-code leading-none">
              {Object.values(analytics.status_distribution).reduce((sum, v) => sum + v, 0)}
            </p>
            <p className="text-[9px] text-on-surface-variant/80">
              Total historical logged states.
            </p>
          </div>
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
            <BarChart2 size={18} />
          </div>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Analysis */}
        <div className="matte-card rounded-2xl p-5 border border-outline-variant/60 bg-surface-container/40 flex flex-col justify-between gap-4">
          <div className="flex items-center gap-2 select-none border-b border-outline-variant/30 pb-3">
            <LineChart size={14} className="text-primary" />
            <h4 className="text-[10px] font-bold text-primary uppercase tracking-wider">
              Lecture Attendance Trend (Weekly)
            </h4>
          </div>
          <AttendanceChart type="trend" trendData={analytics.weekly_trend} />
        </div>

        {/* Subject Comparison */}
        <div className="matte-card rounded-2xl p-5 border border-outline-variant/60 bg-surface-container/40 flex flex-col justify-between gap-4">
          <div className="flex items-center gap-2 select-none border-b border-outline-variant/30 pb-3">
            <BarChart2 size={14} className="text-primary" />
            <h4 className="text-[10px] font-bold text-primary uppercase tracking-wider">
              Course Comparison (%)
            </h4>
          </div>
          <AttendanceChart type="comparison" comparisonData={analytics.subject_comparison} />
        </div>

        {/* Status Distribution */}
        <div className="matte-card rounded-2xl p-5 border border-outline-variant/60 bg-surface-container/40 flex flex-col justify-between gap-4 lg:col-span-2">
          <div className="flex items-center gap-2 select-none border-b border-outline-variant/30 pb-3">
            <PieChart size={14} className="text-primary" />
            <h4 className="text-[10px] font-bold text-primary uppercase tracking-wider">
              Logged Status Distribution
            </h4>
          </div>
          <AttendanceChart type="distribution" distributionData={analytics.status_distribution} />
        </div>
      </div>
    </div>
  );
};

export default AttendanceAnalytics;
