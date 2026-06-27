import { useState, useEffect } from "react";
import adminApi from "../services/api";
import { SearchBar } from "../components/SearchBar";
import { TableSkeleton } from "../components/LoadingSkeleton";
import { EmptyState } from "../components/EmptyState";
import { 
  History, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  Globe, 
  FileCheck, 
  Clock, 
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Eye
} from "lucide-react";

interface CrawlLog {
  _id: string;
  website_id: string;
  url: string;
  started_at: string;
  completed_at: string;
  duration_ms: number;
  status: string;
  content_changed: boolean;
  old_hash: string;
  new_hash: string;
  old_chunks: number;
  new_chunks: number;
  message: string;
  raw_hash_changed?: boolean;
  normalized_hash_changed?: boolean;
  reindex_triggered?: boolean;
  reason?: string;
}

export const AdminCrawlHistoryPage = () => {
  const [history, setHistory] = useState<CrawlLog[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<CrawlLog[]>([]);
  const [websites, setWebsites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [websiteFilter, setWebsiteFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all"); // 'all', 'today', 'yesterday', 'week'

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal Details State
  const [selectedLog, setSelectedLog] = useState<CrawlLog | null>(null);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const fetchHistoryAndWebsites = async () => {
    setLoading(true);
    try {
      const [historyRes, websitesRes] = await Promise.all([
        adminApi.get("/api/admin/websites/history"),
        adminApi.get("/api/admin/websites")
      ]);
      setHistory(historyRes.data.history || []);
      setWebsites(websitesRes.data.websites || []);
    } catch (e) {
      console.error("Failed to load crawl history data", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncNow = async (websiteId: string, url: string) => {
    setSyncingId(websiteId);
    try {
      const response = await adminApi.post(`/api/admin/websites/${websiteId}/sync`);
      const msg = typeof response.data === "string" ? response.data : response.data.message || "Sync finished.";
      // Refresh list
      await fetchHistoryAndWebsites();
      alert(`Sync triggered for ${url}: ${msg}`);
    } catch (e: any) {
      console.error(e);
      alert(`Manual synchronization failed: ${e.response?.data?.detail || e.message}`);
    } finally {
      setSyncingId(null);
    }
  };

  useEffect(() => {
    fetchHistoryAndWebsites();
  }, []);

  // Filter Logic
  useEffect(() => {
    let result = history;

    // Search Query
    if (searchValue.trim()) {
      const q = searchValue.toLowerCase();
      result = result.filter(
        (log) =>
          log.url.toLowerCase().includes(q) ||
          log.message.toLowerCase().includes(q)
      );
    }

    // Status Filter
    if (statusFilter !== "all") {
      result = result.filter((log) => log.status === statusFilter);
    }

    // Website Filter
    if (websiteFilter !== "all") {
      result = result.filter((log) => log.website_id === websiteFilter);
    }

    // Date Filter
    if (dateFilter !== "all") {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const yesterdayStart = todayStart - 24 * 60 * 60 * 1000;
      const weekStart = todayStart - 7 * 24 * 60 * 60 * 1000;

      result = result.filter((log) => {
        const time = new Date(log.started_at).getTime();
        if (dateFilter === "today") return time >= todayStart;
        if (dateFilter === "yesterday") return time >= yesterdayStart && time < todayStart;
        if (dateFilter === "week") return time >= weekStart;
        return true;
      });
    }

    setFilteredHistory(result);
    setCurrentPage(1); // Reset page on filter changes
  }, [history, searchValue, statusFilter, websiteFilter, dateFilter]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage) || 1;
  const paginatedItems = filteredHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-400" />
            <span>Crawl & Ingestion Logs</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Audit logs of automatic sync operations, manual checks, and vector re-indexing runs.
          </p>
        </div>

        <button
          onClick={fetchHistoryAndWebsites}
          className="px-4 py-2 text-xs font-semibold bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer flex items-center gap-2 select-none"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh History Logs</span>
        </button>
      </div>

      {/* Toolbar filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-900/40 rounded-2xl border border-slate-800/40">
        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1.5">Search URL/Message</label>
          <SearchBar value={searchValue} onChange={setSearchValue} placeholder="Search crawlers..." />
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1.5">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 cursor-pointer focus:outline-none focus:border-indigo-500 transition-colors"
          >
            <option value="all">All Logs</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1.5">Website Source</label>
          <select
            value={websiteFilter}
            onChange={(e) => setWebsiteFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 cursor-pointer focus:outline-none focus:border-indigo-500 transition-colors"
          >
            <option value="all">All Websites</option>
            {websites.map((w) => (
              <option key={w.id} value={w.id}>{w.title}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1.5">Time Frame</label>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 cursor-pointer focus:outline-none focus:border-indigo-500 transition-colors"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="week">Last 7 Days</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="glass-panel rounded-2xl border border-slate-800/40 overflow-hidden">
        {loading ? (
          <div className="p-6">
            <TableSkeleton rows={itemsPerPage} cols={7} />
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No crawl history matching criteria"
              description="Adjust the status, date ranges, or website filters to view logs"
              onAction={() => {
                setSearchValue("");
                setStatusFilter("all");
                setWebsiteFilter("all");
                setDateFilter("all");
              }}
              actionLabel="Reset Filters"
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800/70 text-xs font-semibold text-slate-400 uppercase bg-slate-900/20">
                  <th className="p-4 pl-6">Website Link</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Raw Change</th>
                  <th className="p-4 text-center">Norm Change</th>
                  <th className="p-4 text-center">Re-indexed</th>
                  <th className="p-4 text-right">Started At</th>
                  <th className="p-4 text-right">Duration</th>
                  <th className="p-4">Sync Note</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-xs text-slate-300">
                {paginatedItems.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-900/20 transition-all group">
                    <td className="p-4 pl-6 max-w-xs truncate">
                      <div className="font-semibold text-slate-200">{websites.find(w => w.id === log.website_id)?.title || "Unknown Website"}</div>
                      <a href={log.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-slate-500 hover:text-indigo-400 truncate block mt-0.5">{log.url}</a>
                    </td>

                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                        log.status === "success" 
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                          : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      }`}>
                        {log.status === "success" ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5" />
                            Success
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" />
                            Failed
                          </>
                        )}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        (log.raw_hash_changed ?? log.content_changed)
                          ? "bg-amber-500/15 text-amber-400 border-amber-500/20"
                          : "bg-slate-800 text-slate-500 border-slate-700/50"
                      }`}>
                        {(log.raw_hash_changed ?? log.content_changed) ? "Yes" : "No"}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        (log.normalized_hash_changed ?? log.content_changed)
                          ? "bg-rose-500/15 text-rose-400 border-rose-500/20"
                          : "bg-slate-800 text-slate-500 border-slate-700/50"
                      }`}>
                        {(log.normalized_hash_changed ?? log.content_changed) ? "Yes" : "No"}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        (log.reindex_triggered ?? log.content_changed)
                          ? "bg-indigo-500/15 text-indigo-400 border-indigo-500/20"
                          : "bg-slate-800 text-slate-500 border-slate-700/50"
                      }`}>
                        {(log.reindex_triggered ?? log.content_changed) ? "Yes" : "No"}
                      </span>
                    </td>

                    <td className="p-4 text-right text-slate-400">{formatDate(log.started_at)}</td>
                    <td className="p-4 text-right text-slate-400 font-mono">{formatDuration(log.duration_ms)}</td>
                    <td className="p-4 max-w-xs truncate text-slate-400" title={log.message}>{log.message}</td>
                    
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="p-1.5 text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-lg transition-all cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={syncingId !== null}
                          onClick={() => handleSyncNow(log.website_id, log.url)}
                          className="px-2 py-1 bg-slate-900 border border-slate-800 text-[10px] rounded-lg text-slate-300 hover:text-white cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {syncingId === log.website_id ? "Syncing..." : "Sync Now"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {filteredHistory.length > 0 && (
          <div className="flex items-center justify-between p-4 border-t border-slate-800/40 bg-slate-900/10 text-xs">
            <span className="text-slate-400">
              Showing <span className="font-semibold text-slate-200">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
              <span className="font-semibold text-slate-200">{Math.min(currentPage * itemsPerPage, filteredHistory.length)}</span> of{" "}
              <span className="font-semibold text-slate-200">{filteredHistory.length}</span> records
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 rounded-lg cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed select-none"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-slate-300 font-medium">Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 rounded-lg cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed select-none"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Details Dialog Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel w-full max-w-xl p-6 rounded-2xl border border-slate-800/50 shadow-2xl relative">
            <h3 className="text-base font-bold text-slate-100 mb-4 flex items-center gap-2">
              <Eye className="w-4 h-4 text-indigo-400" />
              <span>Crawl Run Details</span>
            </h3>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar pr-2 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Crawl Status</label>
                  <p className="mt-1 font-semibold text-slate-200 capitalize">{selectedLog.status}</p>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Duration</label>
                  <p className="mt-1 font-semibold text-slate-200 font-mono">{formatDuration(selectedLog.duration_ms)}</p>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Started At</label>
                  <p className="mt-1 font-semibold text-slate-200">{formatDate(selectedLog.started_at)}</p>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Content Changed (Raw)</label>
                  <p className="mt-1 font-semibold text-slate-200">{(selectedLog.raw_hash_changed ?? selectedLog.content_changed) ? "Yes" : "No"}</p>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Normalized Hash Changed</label>
                  <p className="mt-1 font-semibold text-slate-200">{(selectedLog.normalized_hash_changed ?? selectedLog.content_changed) ? "Yes" : "No"}</p>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Reindexing Triggered</label>
                  <p className="mt-1 font-semibold text-slate-200">{(selectedLog.reindex_triggered ?? selectedLog.content_changed) ? "Yes" : "No"}</p>
                </div>
              </div>

              {selectedLog.reason && (
                <div className="p-3 bg-slate-900/40 border border-slate-800 rounded-xl">
                  <label className="text-[10px] text-indigo-400 uppercase font-bold tracking-wider">Crawl Decision Reason</label>
                  <p className="mt-1 font-semibold text-slate-200 leading-normal">{selectedLog.reason}</p>
                </div>
              )}

              <div>
                <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Page URL</label>
                <p className="mt-1 p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 font-mono overflow-x-auto select-all">{selectedLog.url}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Previous Vector Chunks</label>
                  <p className="mt-1 font-semibold text-slate-200">{selectedLog.old_chunks || 0}</p>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Fresh Vector Chunks</label>
                  <p className="mt-1 font-semibold text-slate-200">{selectedLog.new_chunks || 0}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Old text hash</label>
                  <p className="mt-0.5 p-1 bg-slate-950 border border-slate-850 rounded text-slate-400 font-mono truncate">{selectedLog.old_hash || "n/a"}</p>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">New text hash</label>
                  <p className="mt-0.5 p-1 bg-slate-950 border border-slate-850 rounded text-slate-400 font-mono truncate">{selectedLog.new_hash || "n/a"}</p>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Sync Log Notes / Error Message</label>
                <p className="mt-1 p-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 font-mono whitespace-pre-wrap">{selectedLog.message || "No message logged."}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 text-xs font-semibold bg-slate-850 border border-slate-850 hover:bg-slate-800 text-slate-200 rounded-xl transition-all cursor-pointer"
              >
                Close Dialog
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
