import React, { useState } from "react";
import { type TrendPoint, type SubjectComparison } from "../types/attendance";

interface AttendanceChartProps {
  type: "trend" | "comparison" | "distribution";
  trendData?: TrendPoint[];
  comparisonData?: SubjectComparison[];
  distributionData?: Record<string, number>;
}

export const AttendanceChart: React.FC<AttendanceChartProps> = ({
  type,
  trendData = [],
  comparisonData = [],
  distributionData = {}
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // SVG parameters
  const width = 500;
  const height = 200;
  const paddingX = 40;
  const paddingY = 25;

  if (type === "trend") {
    // AREA/LINE CHART
    if (trendData.length === 0) {
      return (
        <div className="flex items-center justify-center h-44 text-on-surface-variant/40 text-[10px] uppercase font-bold select-none">
          No Trend Data
        </div>
      );
    }

    const minVal = 0;
    const maxVal = 100;

    const getX = (index: number) => {
      if (trendData.length <= 1) return width / 2;
      return paddingX + (index * (width - paddingX * 2)) / (trendData.length - 1);
    };

    const getY = (value: number) => {
      const scaleHeight = height - paddingY * 2;
      return height - paddingY - (value * scaleHeight) / 100;
    };

    // Build SVG Path
    let linePath = "";
    trendData.forEach((d, idx) => {
      const x = getX(idx);
      const y = getY(d.percentage);
      if (idx === 0) {
        linePath += `M ${x},${y}`;
      } else {
        linePath += ` L ${x},${y}`;
      }
    });

    const areaPath = trendData.length > 0 
      ? `${linePath} L ${getX(trendData.length - 1)},${height - paddingY} L ${getX(0)},${height - paddingY} Z`
      : "";

    return (
      <div className="relative w-full select-none">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          <defs>
            <linearGradient id="trendAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary, #6200ee)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--color-primary, #6200ee)" stopOpacity="0.00" />
            </linearGradient>
            <linearGradient id="trendLineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--color-primary, #6200ee)" />
              <stop offset="100%" stopColor="#00d8ff" />
            </linearGradient>
          </defs>

          {/* Gridlines */}
          {[0, 25, 50, 75, 100].map((grid, i) => {
            const y = getY(grid);
            return (
              <g key={i}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-outline-variant/30"
                  strokeDasharray={grid === 75 ? "none" : "2,4"}
                />
                <text
                  x={paddingX - 10}
                  y={y + 3}
                  className="text-[8px] font-mono-code font-bold fill-on-surface-variant text-right"
                  textAnchor="end"
                >
                  {grid}%
                </text>
              </g>
            );
          })}

          {/* Area under the line */}
          {areaPath && (
            <path
              d={areaPath}
              fill="url(#trendAreaGrad)"
            />
          )}

          {/* Line Path */}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke="url(#trendLineGrad)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Data Points */}
          {trendData.map((d, idx) => {
            const x = getX(idx);
            const y = getY(d.percentage);
            const isHovered = hoveredIndex === idx;

            return (
              <g key={idx} onMouseEnter={() => setHoveredIndex(idx)} onMouseLeave={() => setHoveredIndex(null)}>
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 5 : 3.5}
                  className="fill-background stroke-primary transition-all duration-100"
                  strokeWidth="2.5"
                  cursor="pointer"
                />
                {isHovered && (
                  <g>
                    {/* Tooltip background */}
                    <rect
                      x={x - 30}
                      y={y - 25}
                      width="60"
                      height="16"
                      rx="4"
                      className="fill-surface-container-high stroke-outline-variant"
                      strokeWidth="0.5"
                    />
                    <text
                      x={x}
                      y={y - 14}
                      className="text-[8px] font-bold fill-primary text-center"
                      textAnchor="middle"
                    >
                      {d.percentage.toFixed(1)}%
                    </text>
                  </g>
                )}
                {/* X Axis Labels */}
                <text
                  x={x}
                  y={height - 8}
                  className="text-[8px] font-bold fill-on-surface-variant"
                  textAnchor="middle"
                >
                  {d.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  }

  if (type === "comparison") {
    // SUBJECT COMPARISON BAR CHART
    if (comparisonData.length === 0) {
      return (
        <div className="flex items-center justify-center h-44 text-on-surface-variant/40 text-[10px] uppercase font-bold select-none">
          No Course Data
        </div>
      );
    }

    const maxBarHeight = height - paddingY * 2;
    const barWidth = Math.max(12, Math.min(30, (width - paddingX * 2) / (comparisonData.length * 2)));
    const spacing = (width - paddingX * 2 - comparisonData.length * barWidth) / (comparisonData.length + 1);

    return (
      <div className="relative w-full select-none">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          {/* Gridlines */}
          {[0, 25, 50, 75, 100].map((grid, i) => {
            const y = paddingY + ((100 - grid) / 100) * maxBarHeight;
            return (
              <g key={i}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-outline-variant/30"
                  strokeDasharray={grid === 75 ? "none" : "2,4"}
                />
                <text
                  x={paddingX - 10}
                  y={y + 3}
                  className="text-[8px] font-mono-code font-bold fill-on-surface-variant text-right"
                  textAnchor="end"
                >
                  {grid}%
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {comparisonData.map((d, idx) => {
            const x = paddingX + spacing + idx * (barWidth + spacing);
            const barHeight = (d.percentage / 100) * maxBarHeight;
            const y = height - paddingY - barHeight;
            const isHovered = hoveredIndex === idx;

            const isBelow = d.percentage < 75.0;
            const barColor = isBelow
              ? "fill-gradient-to-b from-red-400 to-rose-500"
              : "fill-gradient-to-b from-emerald-400 to-teal-500";

            return (
              <g key={idx} onMouseEnter={() => setHoveredIndex(idx)} onMouseLeave={() => setHoveredIndex(null)}>
                {/* Hover overlay bar */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  rx="3"
                  className={isBelow ? "fill-red-500/80 stroke-red-500/30" : "fill-primary/80 stroke-primary/30"}
                  strokeWidth={isHovered ? 1.5 : 0}
                  cursor="pointer"
                  style={{ transition: "all 0.15s ease" }}
                />
                {isHovered && (
                  <g>
                    <rect
                      x={x + barWidth / 2 - 25}
                      y={y - 22}
                      width="50"
                      height="16"
                      rx="4"
                      className="fill-surface-container-high stroke-outline-variant"
                      strokeWidth="0.5"
                    />
                    <text
                      x={x + barWidth / 2}
                      y={y - 11}
                      className="text-[8px] font-bold fill-on-surface text-center"
                      textAnchor="middle"
                    >
                      {d.percentage.toFixed(1)}%
                    </text>
                  </g>
                )}
                {/* Labels */}
                <text
                  x={x + barWidth / 2}
                  y={height - 8}
                  className="text-[7.5px] font-bold fill-on-surface-variant truncate"
                  textAnchor="middle"
                  style={{ maxWidth: barWidth + spacing }}
                >
                  {d.subject_name.substring(0, 7)}..
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  }

  if (type === "distribution") {
    // STATUS DISTRIBUTION PIE/DONUT CHART
    const dataEntries = Object.entries(distributionData).filter(([_, val]) => val > 0);
    if (dataEntries.length === 0) {
      return (
        <div className="flex items-center justify-center h-44 text-on-surface-variant/40 text-[10px] uppercase font-bold select-none">
          No Distribution Data
        </div>
      );
    }

    const total = dataEntries.reduce((sum, [_, val]) => sum + val, 0);
    const radius = 65;
    const strokeWidth = 14;
    const center = 100;
    const circumference = 2 * Math.PI * radius;

    // Color definitions for status
    const statusColors: Record<string, string> = {
      Present: "#10b981",      // Emerald
      Absent: "#ef4444",       // Red
      Cancelled: "#64748b",    // Slate
      Holiday: "#6366f1",      // Indigo
      "Medical Leave": "#3b82f6" // Blue
    };

    let accumulatedAngle = 0;

    return (
      <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-2 select-none select-text">
        <svg width="200" height="200" className="overflow-visible shrink-0 select-none">
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="var(--color-surface-container-high, #212121)"
            strokeWidth={strokeWidth}
          />
          {dataEntries.map(([status, val], idx) => {
            const percentage = val / total;
            const strokeLength = percentage * circumference;
            const strokeOffset = circumference - strokeLength + accumulatedAngle;
            accumulatedAngle -= strokeLength;

            const isHovered = hoveredIndex === idx;

            return (
              <circle
                key={status}
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke={statusColors[status] || "#9e9e9e"}
                strokeWidth={isHovered ? strokeWidth + 3 : strokeWidth}
                strokeDasharray={`${strokeLength} ${circumference - strokeLength}`}
                strokeDashoffset={strokeOffset}
                transform={`rotate(-90 ${center} ${center})`}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                cursor="pointer"
                style={{ transition: "stroke-width 0.15s ease" }}
              />
            );
          })}
          {/* Center text showing total */}
          <text
            x={center}
            y={center - 2}
            textAnchor="middle"
            className="text-xs font-black fill-on-surface select-none"
          >
            {total}
          </text>
          <text
            x={center}
            y={center + 12}
            textAnchor="middle"
            className="text-[8px] font-bold fill-on-surface-variant uppercase tracking-widest select-none"
          >
            Total Logs
          </text>
        </svg>

        {/* Legend */}
        <div className="space-y-2 select-text">
          {dataEntries.map(([status, val], idx) => {
            const pct = (val / total) * 100;
            const isHovered = hoveredIndex === idx;
            return (
              <div
                key={status}
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg border transition-all ${
                  isHovered 
                    ? "bg-surface-container border-outline-variant scale-[1.02]" 
                    : "bg-transparent border-transparent"
                }`}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: statusColors[status] || "#9e9e9e" }}
                />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-on-surface leading-tight">
                    {status}
                  </span>
                  <span className="text-[9px] text-on-surface-variant font-medium">
                    {val} session{val > 1 ? "s" : ""} ({pct.toFixed(1)}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
};

export default AttendanceChart;
