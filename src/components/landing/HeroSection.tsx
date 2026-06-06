"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { ArrowRight, Play, CheckCircle2, AlertTriangle, GitBranch, Clock } from "lucide-react";
import { useEffect, useRef } from "react";

/* ---------- Animated transcript lines ---------- */
const transcriptLines = [
  { speaker: "Sarah", color: "#6366F1", text: "Let's finalize the Q3 roadmap today." },
  { speaker: "Mike", color: "#06B6D4", text: "Backend API should be done by June 15th." },
  { speaker: "Sarah", color: "#6366F1", text: "Good. Mark, can you own the dashboard redesign?" },
  { speaker: "Mark", color: "#8B5CF6", text: "Sure, I'll have mockups ready by next week." },
  { speaker: "Mike", color: "#06B6D4", text: "One concern — the auth migration could block us." },
];

/* ---------- Extracted insight cards ---------- */
const insightCards = [
  {
    type: "Action Item",
    icon: CheckCircle2,
    color: "#10B981",
    bg: "rgba(16,185,129,0.1)",
    border: "rgba(16,185,129,0.2)",
    title: "Dashboard Redesign Mockups",
    meta: "Mark · Due next week",
  },
  {
    type: "Decision",
    icon: GitBranch,
    color: "#8B5CF6",
    bg: "rgba(139,92,246,0.1)",
    border: "rgba(139,92,246,0.2)",
    title: "Finalize Q3 Roadmap",
    meta: "Agreed by all",
  },
  {
    type: "Risk",
    icon: AlertTriangle,
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.2)",
    title: "Auth Migration Blocker",
    meta: "High priority",
  },
  {
    type: "Deadline",
    icon: Clock,
    color: "#06B6D4",
    bg: "rgba(6,182,212,0.1)",
    border: "rgba(6,182,212,0.2)",
    title: "Backend API Completion",
    meta: "June 15th",
  },
];

/* ---------- Stat counter hook ---------- */
function useCounter(target: number, duration = 2) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    const controls = animate(count, target, { duration });
    return controls.stop;
  }, [count, target, duration]);

  return rounded;
}

function StatCounter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const count = useCounter(value, 2.5);

  return (
    <div className="text-center">
      <motion.div className="text-2xl md:text-3xl font-bold text-white">
        <motion.span>{count}</motion.span>
        {suffix}
      </motion.div>
      <div className="text-xs text-dark-300 mt-1">{label}</div>
    </div>
  );
}

/* ---------- Main hero component ---------- */
export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16">
      {/* === Background layers === */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Gradient orbs */}
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] left-[15%] w-[500px] h-[500px] bg-primary/15 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, -25, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{
            x: [0, 20, 0],
            y: [0, -15, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[10%] left-[40%] w-[350px] h-[350px] bg-accent/10 rounded-full blur-[100px]"
        />

        {/* Top gradient mesh overlay */}
        <div className="absolute top-0 left-0 right-0 h-[50vh] bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      </div>

      {/* === Main content === */}
      <div className="relative mx-auto max-w-7xl px-6 w-full">
        <div className="text-center mb-16">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-primary/20 text-sm mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="text-dark-400">
              Trusted by <span className="text-white font-medium">2,000+</span> teams worldwide
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
          >
            Turn Every Meeting
            <br />
            Into{" "}
            <span className="relative">
              <span className="gradient-text">Action</span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-full origin-left"
              />
            </span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-lg md:text-xl text-dark-300 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            AI automatically extracts decisions, action items, deadlines, risks, and
            follow-ups from your meetings — so your team can focus on{" "}
            <span className="text-white font-medium">doing</span>, not documenting.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group relative px-8 py-4 rounded-xl font-semibold text-white overflow-hidden transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
              <span className="relative flex items-center gap-2">
                Start Free Trial
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group px-8 py-4 rounded-xl font-semibold glass border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all duration-300 flex items-center gap-2"
            >
              <div className="p-1 rounded-full bg-white/10 group-hover:bg-primary/20 transition-colors">
                <Play className="w-3 h-3 text-white fill-white" />
              </div>
              Watch Demo
            </motion.button>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-12 inline-flex items-center gap-8 md:gap-12 px-8 py-4 rounded-2xl glass"
          >
            <StatCounter value={2000} suffix="+" label="Teams" />
            <div className="w-px h-8 bg-white/10" />
            <StatCounter value={150} suffix="K" label="Meetings Analyzed" />
            <div className="w-px h-8 bg-white/10 hidden sm:block" />
            <div className="hidden sm:block">
              <StatCounter value={99} suffix="%" label="Accuracy" />
            </div>
          </motion.div>
        </div>

        {/* === Visualization: Transcript → Insights === */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Outer glow */}
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 rounded-3xl blur-2xl" />

          <div className="relative glass-strong rounded-2xl border border-white/[0.08] overflow-hidden">
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <div className="ml-4 flex-1 text-center">
                <span className="text-xs text-dark-300 font-medium">
                  MeetingMind AI — Live Analysis
                </span>
              </div>
            </div>

            {/* Content area */}
            <div className="grid md:grid-cols-2 divide-x divide-white/[0.06]">
              {/* Left: Transcript */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs text-dark-300 uppercase tracking-wider font-medium">
                    Live Transcript
                  </span>
                </div>

                <div className="space-y-3">
                  {transcriptLines.map((line, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.4 + i * 0.2 }}
                      className="flex gap-3 group/line"
                    >
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-0.5"
                        style={{ backgroundColor: `${line.color}30`, color: line.color }}
                      >
                        {line.speaker[0]}
                      </div>
                      <div>
                        <span className="text-xs font-medium" style={{ color: line.color }}>
                          {line.speaker}
                        </span>
                        <p className="text-sm text-dark-400 group-hover/line:text-dark-500 transition-colors">
                          {line.text}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right: Extracted insights */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-dark-300 uppercase tracking-wider font-medium">
                    AI Insights
                  </span>
                </div>

                <div className="space-y-3">
                  {insightCards.map((card, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 30, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{
                        delay: 1.8 + i * 0.25,
                        type: "spring",
                        stiffness: 120,
                        damping: 15,
                      }}
                      whileHover={{ scale: 1.02, x: 4 }}
                      className="group/card p-3 rounded-xl cursor-pointer transition-all duration-300"
                      style={{
                        background: card.bg,
                        border: `1px solid ${card.border}`,
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="p-1.5 rounded-lg mt-0.5"
                          style={{ background: `${card.color}20` }}
                        >
                          <card.icon
                            className="w-3.5 h-3.5"
                            style={{ color: card.color }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span
                              className="text-[10px] font-semibold uppercase tracking-wider"
                              style={{ color: card.color }}
                            >
                              {card.type}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-white truncate">
                            {card.title}
                          </p>
                          <p className="text-xs text-dark-300 mt-0.5">{card.meta}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom processing bar */}
            <div className="px-5 py-3 border-t border-white/[0.06] bg-white/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-3.5 h-3.5 rounded-full border-2 border-primary border-t-transparent"
                />
                <span className="text-xs text-dark-300">
                  Processing in real-time...
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-dark-300">
                <span>4 insights extracted</span>
                <span className="text-primary font-medium">98% confidence</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
