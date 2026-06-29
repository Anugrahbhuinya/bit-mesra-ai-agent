import React from "react";
import { useNavigate } from "react-router-dom";
import { useTimetableImport } from "../hooks/useTimetableImport";
import UploadZone from "../components/UploadZone";
import { Sparkles, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export const ImportTimetablePage: React.FC = () => {
  const navigate = useNavigate();
  const { importFile, loading, progress, error } = useTimetableImport();

  const handleFileSelect = async (file: File) => {
    try {
      const extracted = await importFile(file);
      // Navigate to preview page and pass extracted classes through state
      navigate("/academics/timetable/preview", { state: { classes: extracted } });
    } catch (err) {
      console.error("AI timetable import error", err);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto select-none">
      {/* Top Bar Navigation */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/academics/timetable")}
          disabled={loading}
          className="p-2 bg-surface-container hover:bg-surface-container-high border border-outline-variant/60 rounded-xl text-on-surface-variant hover:text-primary transition-all cursor-pointer disabled:opacity-50"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="space-y-0.5">
          <h2 className="text-xs font-bold text-primary uppercase tracking-wider">AI Import Timetable</h2>
          <p className="text-[10px] text-on-surface-variant font-medium">
            Upload PDF or image timetables for automated schedule processing.
          </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="matte-card rounded-2xl p-8 space-y-8 bg-surface-container"
      >
        <div className="text-center max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-xl bg-secondary-container border border-outline-variant flex items-center justify-center text-primary mx-auto">
            <Sparkles size={22} className="text-primary animate-pulse" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-primary uppercase tracking-wider">Automate Setup with Gemini</h3>
            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              Upload your official semester timetable document. Gemini AI Vision will extract the lectures, times, and classrooms for you to review.
            </p>
          </div>
        </div>

        {/* Upload Zone Component */}
        <UploadZone
          onFileSelect={handleFileSelect}
          loading={loading}
          progress={progress}
          error={error}
        />
      </motion.div>
    </div>
  );
};

export default ImportTimetablePage;
