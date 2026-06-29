import React, { useRef, useState } from "react";
import { Upload, File, Loader2, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  loading: boolean;
  progress: number;
  error: string | null;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  onFileSelect,
  loading,
  progress,
  error,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState<boolean>(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndSelect(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSelect(e.target.files[0]);
    }
  };

  const validateAndSelect = (file: File) => {
    const allowed = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/jpg",
    ];
    if (allowed.includes(file.type)) {
      onFileSelect(file);
    } else {
      alert("Invalid file format. Please upload a PDF, PNG, or JPEG/JPG image.");
    }
  };

  const triggerInputClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-4 select-none">
      <motion.div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={loading ? undefined : triggerInputClick}
        className={`matte-card rounded-2xl p-10 border-dashed flex flex-col items-center justify-center text-center gap-4 transition-all duration-200 cursor-pointer min-h-[260px] bg-surface-container/60 ${
          isDragActive ? "border-primary bg-surface-container" : "border-outline-variant hover:border-primary/50"
        } ${loading ? "pointer-events-none opacity-85" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={handleChange}
          className="hidden"
        />

        {loading ? (
          <div className="space-y-4 w-full max-w-xs flex flex-col items-center">
            <Loader2 size={32} className="animate-spin text-primary" />
            <div className="space-y-2 w-full">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
                {progress < 90 ? "Uploading schedule document..." : "Gemini is extracting timetable..."}
              </span>
              {/* Progress bar */}
              <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden border border-outline-variant/30">
                <div 
                  className="bg-primary h-full rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="text-[9px] font-mono-code font-bold text-on-surface-variant block">
                {progress}%
              </span>
            </div>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-surface-container border border-outline-variant flex items-center justify-center text-on-surface-variant">
              <Upload size={20} className="text-on-surface-variant" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Drag & drop timetable</h4>
              <p className="text-[10px] text-on-surface-variant leading-relaxed">
                Supports PDF, PNG, JPG, or JPEG schedules. Max size: 8MB.
              </p>
            </div>
            <button
              type="button"
              className="mt-2 px-4 py-2 bg-surface-container-low hover:bg-surface-container border border-outline-variant text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all"
            >
              Select File
            </button>
          </>
        )}
      </motion.div>

      {error && (
        <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2.5 text-red-400 text-[10px] font-semibold leading-relaxed">
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default UploadZone;
