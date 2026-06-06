"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, File, X, FileAudio, FileVideo, FileText } from "lucide-react";

interface FileUploaderProps {
  onFilesSelected?: (files: File[]) => void;
  onProcess?: () => void;
}

const acceptedTypes = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/x-m4a",
  "audio/mp4",
  "video/mp4",
  "text/plain",
];
const acceptedExtensions = [".mp3", ".mp4", ".wav", ".m4a", ".txt"];

function getFileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext === "mp4") return <FileVideo className="w-5 h-5 text-accent" />;
  if (["mp3", "wav", "m4a"].includes(ext || ""))
    return <FileAudio className="w-5 h-5 text-secondary" />;
  return <FileText className="w-5 h-5 text-primary" />;
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export default function FileUploader({ onFilesSelected, onProcess }: FileUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (newFiles: FileList | File[]) => {
      const arr = Array.from(newFiles).filter((f) => {
        const ext = "." + f.name.split(".").pop()?.toLowerCase();
        return acceptedExtensions.includes(ext);
      });
      const updated = [...files, ...arr];
      setFiles(updated);
      onFilesSelected?.(updated);
    },
    [files, onFilesSelected]
  );

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    onFilesSelected?.(updated);
  };

  const handleProcess = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev === null || prev >= 100) {
          clearInterval(interval);
          onProcess?.();
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <motion.div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        animate={{
          borderColor: isDragging ? "#6366F1" : "rgba(255,255,255,0.1)",
          backgroundColor: isDragging
            ? "rgba(99,102,241,0.08)"
            : "rgba(30,41,59,0.4)",
        }}
        className="relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all hover:border-primary/40 hover:bg-primary/5"
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={acceptedExtensions.join(",")}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />
        <motion.div
          animate={{ y: isDragging ? -8 : 0 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <UploadCloud className="w-12 h-12 text-primary mx-auto mb-4" />
          <p className="text-lg font-medium text-white mb-1">
            Drag & drop your meeting files here
          </p>
          <p className="text-slate-400 text-sm mb-3">
            or{" "}
            <span className="text-primary underline underline-offset-2">
              click to browse
            </span>
          </p>
          <p className="text-xs text-slate-500">
            Supported: MP3, MP4, WAV, M4A, TXT
          </p>
        </motion.div>
      </motion.div>

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {files.map((file, i) => (
              <motion.div
                key={file.name + i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-3 glass rounded-xl px-4 py-3"
              >
                {getFileIcon(file.name)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(i);
                  }}
                  className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </motion.div>
            ))}

            {/* Upload Progress */}
            {uploadProgress !== null && (
              <div className="glass rounded-xl px-4 py-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white">Uploading...</span>
                  <span className="text-sm text-primary">{uploadProgress}%</span>
                </div>
                <div className="h-2 bg-dark-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
              </div>
            )}

            {/* Process Button */}
            {uploadProgress === null && (
              <button onClick={handleProcess} className="btn-primary w-full mt-2">
                Process with AI
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
