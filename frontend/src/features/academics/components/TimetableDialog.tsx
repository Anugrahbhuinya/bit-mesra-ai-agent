import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import TimetableForm from "./TimetableForm";
import type { ClassEntryFormPayload } from "../types/timetable";

interface TimetableDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  initialValues?: Partial<ClassEntryFormPayload>;
  onSubmit: (values: ClassEntryFormPayload) => Promise<void>;
  submitLabel?: string;
}

export const TimetableDialog: React.FC<TimetableDialogProps> = ({
  isOpen,
  onClose,
  title,
  initialValues,
  onSubmit,
  submitLabel,
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
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />

          {/* Modal Content Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-lg matte-card rounded-2xl p-6 bg-surface-container overflow-hidden shadow-2xl z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3 mb-4 select-none">
              <h3 className="text-xs font-bold text-primary uppercase tracking-wider">{title}</h3>
              <button
                onClick={onClose}
                className="p-1 hover:bg-surface-container-high border border-outline-variant/40 rounded-lg text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            {/* Form */}
            <TimetableForm
              initialValues={initialValues}
              onSubmit={async (values) => {
                await onSubmit(values);
                onClose();
              }}
              onCancel={onClose}
              submitLabel={submitLabel}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TimetableDialog;
