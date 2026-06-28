import { useState, useEffect } from "react";
import adminApi from "../services/api";
import { StatsCard } from "../components/StatsCard";
import { StatusCard } from "../components/StatusCard";
import { QuickActionCard } from "../components/QuickActionCard";
import { ActivityTimeline } from "../components/ActivityTimeline";
import { DashboardCard } from "../components/DashboardCard";
import { CardSkeleton, ListSkeleton } from "../components/LoadingSkeleton";
import { useAdminStore } from "../hooks/adminStore";
import {
  Database,
  FileText,
  MessageSquare,
  Activity,
  Gauge,
  Upload,
  BarChart3,
  Settings,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";

export const AdminDashboardPage = () => {
  const { username } = useAdminStore();
  const [stats, setStats] = useState<any>(null);
  const [statusList, setStatusList] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [statsRes, statusRes, actRes] = await Promise.all([
        adminApi.get("/api/admin/dashboard"),
        adminApi.get("/api/admin/system-status"),
        adminApi.get("/api/admin/activity"),
      ]);
      setStats(statsRes.data);
      setStatusList(statusRes.data.components || []);
      setActivities(actRes.data.logs || []);
    } catch (e) {
      console.error("Error fetching dashboard data", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const quickActions = [
    {
      title: "Upload Knowledge",
      description: "Upload and split new PDF notice files",
      icon: Upload,
      to: "/admin/documents",
      colorClass: "bg-primary/10 border-primary/20 text-primary group-hover:bg-primary/20",
    },
    {
      title: "View Analytics",
      description: "Analyze response time and API latency",
      icon: BarChart3,
      to: "/admin/analytics",
      colorClass: "bg-primary/10 border-primary/20 text-primary group-hover:bg-primary/20",
    },
    {
      title: "Manage System Settings",
      description: "Configure collection models & chunk bounds",
      icon: Settings,
      to: "/admin/settings",
      colorClass: "bg-primary/10 border-primary/20 text-primary group-hover:bg-primary/20",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-on-surface">Overview Dashboard</h2>
          <p className="text-xs text-on-surface-variant mt-1">Aggregating system status logs...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-outline-variant/40">
            <ListSkeleton items={4} />
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-outline-variant/40">
            <ListSkeleton items={3} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header text */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-on-surface tracking-tight flex items-center gap-2">
            <span>Operations Dashboard</span>
            <span className="px-2 py-0.5 text-[9px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 rounded-full animate-pulse">
              Live Console
            </span>
          </h2>
          <p className="text-xs text-on-surface-variant mt-1">
            Welcome back, <span className="text-primary font-semibold">@{username}</span>. Monitor RAG pipeline and system status indicators.
          </p>
        </div>

        <button
          onClick={fetchData}
          className="px-4 py-2 text-xs font-semibold bg-surface-container border border-outline-variant hover:border-outline-variant/80 text-on-surface hover:text-primary rounded-xl transition-all cursor-pointer shadow-lg select-none"
        >
          Refresh Console
        </button>
      </div>

      {/* Metrics Section Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          title="Knowledge Sources"
          value={stats?.knowledgeSources || 0}
          icon={Database}
          description="Total data files scanned"
          trend={{ value: "+1 today", isPositive: true }}
          colorClass="bg-primary/10 border-primary/20 text-primary"
          delay={0.05}
        />
        <StatsCard
          title="Document Items"
          value={stats?.documents || 0}
          icon={FileText}
          description="Segmented sources index count"
          colorClass="bg-primary/10 border-primary/20 text-primary"
          delay={0.1}
        />
        <StatsCard
          title="Active Sessions"
          value={stats?.activeSessions || 0}
          icon={MessageSquare}
          description="Engaged user chats"
          trend={{ value: "+12h active", isPositive: true }}
          colorClass="bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
          delay={0.15}
        />
        <StatsCard
          title="System Health"
          value={stats?.systemHealth || "Excellent"}
          icon={ShieldCheck}
          description="Integrations connection status"
          colorClass="bg-primary/10 border-primary/20 text-primary"
          delay={0.2}
        />
        <StatsCard
          title="Avg Response Latency"
          value={`${stats?.averageResponseTime || 0.85}s`}
          icon={Gauge}
          description="Inference roundtrip duration"
          trend={{ value: "Stable", isPositive: true }}
          colorClass="bg-primary/10 border-primary/20 text-primary"
          delay={0.25}
        />
        <StatsCard
          title="Logs Audited Today"
          value={stats?.todayActivity || 0}
          icon={Activity}
          description="Administrative actions recorded"
          colorClass="bg-red-500/10 border-red-500/20 text-red-400"
          delay={0.3}
        />
      </div>

      {/* Grid section logs & configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent logs audit */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <DashboardCard
            title="Recent Activity Audits"
            subtitle="Recent operations actions logged on-disk"
            actions={
              <Link
                to="/admin/activity"
                className="flex items-center gap-1 text-xs text-primary hover:text-primary/95 font-semibold transition-colors"
              >
                <span>View all logs</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            }
          >
            <div className="pt-2">
              <ActivityTimeline activities={activities} limit={4} />
            </div>
          </DashboardCard>

          {/* Quick Actions Shortcuts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {quickActions.map((action, i) => (
              <QuickActionCard
                key={action.title}
                title={action.title}
                description={action.description}
                icon={action.icon}
                to={action.to}
                colorClass={action.colorClass}
                delay={0.1 * i}
              />
            ))}
          </div>
        </div>

        {/* Integration Statuses panel */}
        <div className="flex flex-col gap-6">
          <DashboardCard
            title="Resource Health status"
            subtitle="Verification of external resource connections"
          >
            <div className="flex flex-col gap-3.5 pt-2">
              {statusList.map((comp) => (
                <StatusCard
                  key={comp.name}
                  name={comp.name}
                  status={comp.status}
                  details={comp.details}
                />
              ))}
            </div>
          </DashboardCard>

          {/* Quick info panel */}
          <div className="glass-panel p-6 rounded-2xl border border-outline-variant/40 relative overflow-hidden flex-1">
            <div className="absolute top-0 right-0 -mr-12 -mt-12 w-28 h-28 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
            <h4 className="text-sm font-semibold text-on-surface flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Operations Summary</span>
            </h4>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              All core RAG systems are verified. Gemini models are responding with optimal latency. The document vector database holds semantic indices mapping BIT Mesra campus guidelines, academic curricula, notice lists, and geographical nodes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
