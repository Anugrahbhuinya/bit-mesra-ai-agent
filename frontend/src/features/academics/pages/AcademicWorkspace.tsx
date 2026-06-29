import React, { useState, useEffect, useCallback } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import academicApi from "../services/academicApi";
import type { AcademicWorkspace as IAcademicWorkspace } from "../types/academic";
import { AcademicWorkspaceContext } from "../hooks/useAcademicWorkspace";
import AcademicHeader from "../components/AcademicHeader";
import AcademicTabs from "../components/AcademicTabs";
import LoadingState from "../components/LoadingState";
import { motion } from "framer-motion";
import { GraduationCap, ArrowRight, ShieldAlert, CheckCircle2 } from "lucide-react";

export const AcademicWorkspace: React.FC = () => {
  const { currentUser } = useAuth();
  
  // Workspace states
  const [workspace, setWorkspace] = useState<IAcademicWorkspace | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState<boolean>(false);

  // Setup Form inputs
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState<number>(1);
  const [section, setSection] = useState("");
  const [academicYear, setAcademicYear] = useState<number>(1);
  
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Fetch workspace
  const fetchWorkspace = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await academicApi.getWorkspace();
      setWorkspace(data.workspace);
      setInitialized(data.initialized);
      
      // Auto-fill onboarding form inputs if not initialized
      if (!data.initialized && data.workspace) {
        setDepartment(data.workspace.department || currentUser?.department || "");
        setSemester(data.workspace.semester || currentUser?.semester || 1);
        setSection(data.workspace.section || currentUser?.section || "");
        setAcademicYear(data.workspace.academic_year || currentUser?.year || 1);
      }
    } catch (err: any) {
      console.error("Failed to load workspace", err);
      setError(err.response?.data?.detail || "Could not retrieve academic workspace settings.");
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      fetchWorkspace();
    }
  }, [currentUser, fetchWorkspace]);

  // Handle onboarding submission
  const handleInitialize = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!department.trim()) {
      setFormError("Please enter your department.");
      return;
    }
    if (!section.trim()) {
      setFormError("Please enter your class section.");
      return;
    }

    setSubmitting(true);
    try {
      const data = await academicApi.initializeWorkspace({
        semester,
        department: department.trim(),
        section: section.trim().toUpperCase(),
        academic_year: academicYear
      });
      setWorkspace(data.workspace);
      setInitialized(data.initialized);
    } catch (err: any) {
      console.error("Initialization failed:", err);
      setFormError(err.response?.data?.detail || "Workspace initialization failed. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Build Context value
  const contextValue = {
    workspace,
    loading,
    error,
    initialized,
    refetch: fetchWorkspace,
    initialize: async (data: {
      semester: number;
      department: string;
      section: string;
      academic_year: number;
    }) => {
      const resp = await academicApi.initializeWorkspace(data);
      setWorkspace(resp.workspace);
      setInitialized(resp.initialized);
    }
  };

  if (loading) {
    return (
      <div className="h-full overflow-y-auto custom-scrollbar bg-background">
        <div className="max-w-[1200px] mx-auto px-6 py-8">
          <LoadingState />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full overflow-y-auto custom-scrollbar bg-background flex items-center justify-center p-6 select-none">
        <div className="matte-card rounded-2xl p-8 max-w-md text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto">
            <ShieldAlert size={24} />
          </div>
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-primary uppercase tracking-wider">Workspace Error</h2>
            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              {error}
            </p>
          </div>
          <button
            onClick={fetchWorkspace}
            className="w-full py-2.5 bg-primary hover:bg-primary/95 text-background text-xs font-bold uppercase tracking-wider rounded-xl transition-all active:scale-[0.98] cursor-pointer"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  // Onboarding Setup view
  if (!initialized) {
    return (
      <div className="h-full overflow-y-auto custom-scrollbar bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md matte-card rounded-2xl p-8 space-y-6"
        >
          <div className="text-center select-none">
            <div className="inline-flex p-3 bg-surface-container border border-outline-variant rounded-xl text-primary mb-4">
              <GraduationCap className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-primary">
              Academic Setup
            </h2>
            <p className="text-on-surface-variant mt-1.5 text-[11px] leading-relaxed">
              Confirm your branch and class details to synchronize your notifications, study planners, and AI assistant context.
            </p>
          </div>

          {formError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2.5 text-red-400 text-[11px] font-semibold">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleInitialize} className="space-y-4">
            {/* Department */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider block">
                Department / Branch
              </label>
              <input
                type="text"
                placeholder="e.g. Computer Science & Engineering"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
                className="w-full px-4 py-3 bg-surface-container border border-outline-variant focus:border-primary rounded-xl focus:outline-none transition-all text-on-surface placeholder:text-on-surface-variant/20 text-xs font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Semester */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider block">
                  Semester
                </label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-surface-container border border-outline-variant focus:border-primary rounded-xl focus:outline-none transition-all text-on-surface text-xs font-semibold"
                >
                  {Array.from({ length: 10 }, (_, i) => (
                    <option key={i + 1} value={i + 1} className="bg-surface-container-high text-on-surface">
                      Sem {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              {/* Section */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider block">
                  Section
                </label>
                <input
                  type="text"
                  placeholder="e.g. A"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  maxLength={5}
                  required
                  className="w-full px-4 py-3 bg-surface-container border border-outline-variant focus:border-primary rounded-xl focus:outline-none transition-all text-on-surface placeholder:text-on-surface-variant/20 text-xs font-semibold"
                />
              </div>
            </div>

            {/* Academic Year */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider block">
                Academic Year
              </label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(Number(e.target.value))}
                className="w-full px-4 py-3 bg-surface-container border border-outline-variant focus:border-primary rounded-xl focus:outline-none transition-all text-on-surface text-xs font-semibold"
              >
                {Array.from({ length: 5 }, (_, i) => (
                  <option key={i + 1} value={i + 1} className="bg-surface-container-high text-on-surface">
                    Year {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-5 mt-4 bg-primary text-background font-bold text-xs uppercase tracking-wider rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 group cursor-pointer disabled:opacity-50 disabled:pointer-events-none select-none shadow-md"
            >
              {submitting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-background border-t-transparent"></div>
              ) : (
                <>
                  <span>Create Workspace</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // Active initialized Workspace view
  return (
    <AcademicWorkspaceContext.Provider value={contextValue}>
      <div className="h-full overflow-y-auto custom-scrollbar bg-background">
        <div className="max-w-[1200px] mx-auto px-6 py-8 space-y-8">
          {/* Main layout elements */}
          <AcademicHeader />
          <AcademicTabs />
          
          {/* Subroutes rendered here */}
          <div className="pt-2">
            <Outlet />
          </div>
        </div>
      </div>
    </AcademicWorkspaceContext.Provider>
  );
};

export default AcademicWorkspace;
