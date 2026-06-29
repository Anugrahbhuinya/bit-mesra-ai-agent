import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import UploadZone from "./UploadZone";

interface ImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onFileSelect: (file: File) => void;
  loading: boolean;
  progress: number;
  error: string | null;
}

export const ImportDialog: React.FC<ImportDialogProps> = ({
  isOpen,
  onClose,
  onFileSelect,
  loading,
  progress,
  error,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={loading ? undefined : onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />

          {/* Modal Content Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-xl matte-card rounded-2xl p-6 bg-surface-container overflow-hidden shadow-2xl z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3 mb-5 select-none">
              <h3 className="text-xs font-bold text-primary uppercase tracking-wider">AI Timetable Import</h3>
              <button
                onClick={onClose}
                disabled={loading}
                className="p-1 hover:bg-surface-container-high border border-outline-variant/40 rounded-lg text-on-surface-variant hover:text-primary transition-colors cursor-pointer disabled:opacity-50"
              >
                <X size={14} />
              </button>
            </div>

            {/* Upload Zone */}
            <UploadZone
              onFileSelect={onFileSelect}
              loading={loading}
              progress={progress}
              error={error}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ImportDialog;
