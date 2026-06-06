"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mic, Brain, Database, FileText, Check, Loader2 } from "lucide-react";

interface ProcessingPipelineProps {
  isProcessing: boolean;
  onComplete?: () => void;
}

const steps = [
  {
    icon: Mic,
    title: "Speech-to-Text",
    description: "Transcribing audio with Whisper AI...",
    completedText: "Transcript generated",
  },
  {
    icon: Brain,
    title: "Meeting Analysis",
    description: "Extracting action items, decisions & risks with GPT-4...",
    completedText: "Insights extracted",
  },
  {
    icon: Database,
    title: "Store Results",
    description: "Saving to database...",
    completedText: "Data stored securely",
  },
  {
    icon: FileText,
    title: "Generate Summary",
    description: "Creating executive, technical & client reports...",
    completedText: "Reports ready",
  },
];

export default function ProcessingPipeline({
  isProcessing,
  onComplete,
}: ProcessingPipelineProps) {
  const [currentStep, setCurrentStep] = useState(-1);

  useEffect(() => {
    if (!isProcessing) return;
    setCurrentStep(0);
    const timers: NodeJS.Timeout[] = [];
    steps.forEach((_, i) => {
      timers.push(
        setTimeout(() => {
          setCurrentStep(i + 1);
          if (i === steps.length - 1) {
            setTimeout(() => onComplete?.(), 500);
          }
        }, (i + 1) * 1500)
      );
    });
    return () => timers.forEach(clearTimeout);
  }, [isProcessing, onComplete]);

  return (
    <div className="space-y-1">
      {steps.map((step, i) => {
        const status =
          currentStep > i
            ? "completed"
            : currentStep === i
            ? "processing"
            : "pending";
        const Icon = step.icon;

        return (
          <div key={i}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-500 ${
                status === "processing"
                  ? "glass border-primary/30"
                  : status === "completed"
                  ? "glass border-emerald-500/20"
                  : "opacity-40"
              }`}
            >
              {/* Icon */}
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500 ${
                  status === "completed"
                    ? "bg-emerald-500/20"
                    : status === "processing"
                    ? "bg-primary/20"
                    : "bg-dark-100"
                }`}
              >
                {status === "completed" ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    <Check className="w-5 h-5 text-emerald-400" />
                  </motion.div>
                ) : status === "processing" ? (
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                ) : (
                  <Icon className="w-5 h-5 text-slate-500" />
                )}
              </div>

              {/* Text */}
              <div className="flex-1">
                <h4
                  className={`font-medium text-sm ${
                    status === "completed"
                      ? "text-emerald-300"
                      : status === "processing"
                      ? "text-white"
                      : "text-slate-500"
                  }`}
                >
                  {step.title}
                </h4>
                <p
                  className={`text-xs mt-0.5 ${
                    status === "completed"
                      ? "text-emerald-400/60"
                      : status === "processing"
                      ? "text-slate-400"
                      : "text-slate-600"
                  }`}
                >
                  {status === "completed" ? step.completedText : step.description}
                </p>
              </div>

              {/* Step number */}
              <span
                className={`text-xs font-mono ${
                  status === "completed"
                    ? "text-emerald-500"
                    : status === "processing"
                    ? "text-primary"
                    : "text-slate-600"
                }`}
              >
                {i + 1}/{steps.length}
              </span>
            </motion.div>

            {/* Connecting line */}
            {i < steps.length - 1 && (
              <div className="ml-9 w-px h-4 bg-dark-100 relative">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-b from-primary to-accent"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: currentStep > i ? 1 : 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  style={{ transformOrigin: "top" }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
