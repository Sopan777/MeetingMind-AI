"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2, Sparkles } from "lucide-react";
import FileUploader from "@/components/meeting/FileUploader";
import ProcessingPipeline from "@/components/meeting/ProcessingPipeline";

type Stage = "upload" | "processing" | "complete";

export default function UploadPage() {
  const [stage, setStage] = useState<Stage>("upload");

  const handleProcess = () => setStage("processing");
  const handleComplete = useCallback(() => setStage("complete"), []);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/meetings"
          className="p-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-400" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Upload Meeting</h1>
          <p className="text-slate-400 text-sm">
            Upload audio, video, or transcript files for AI analysis
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {stage === "upload" && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <FileUploader onProcess={handleProcess} />
          </motion.div>
        )}

        {stage === "processing" && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">AI Processing</h2>
            </div>
            <ProcessingPipeline isProcessing onComplete={handleComplete} />
          </motion.div>
        )}

        {stage === "complete" && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-2xl p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
            >
              <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
            </motion.div>
            <h2 className="text-xl font-bold text-white mb-2">
              Meeting Processed Successfully!
            </h2>
            <p className="text-slate-400 mb-6">
              AI has extracted action items, decisions, risks, and generated
              summaries.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link href="/dashboard/meetings/meeting-1" className="btn-primary">
                View Results
              </Link>
              <Link href="/dashboard/meetings" className="btn-secondary">
                Back to Meetings
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
