"use client";

import { motion } from "framer-motion";
import { Brain, Sparkles, Zap, BarChart3 } from "lucide-react";
import { type ReactNode } from "react";

// ─── Floating decorative orb ─────────────────────────────────────────────────

function FloatingOrb({
  className,
  delay = 0,
  size = 80,
}: {
  className?: string;
  delay?: number;
  size?: number;
}) {
  return (
    <motion.div
      className={`absolute rounded-full blur-2xl opacity-30 pointer-events-none ${className}`}
      style={{ width: size, height: size }}
      animate={{
        y: [0, -20, 0, 15, 0],
        x: [0, 10, -10, 5, 0],
        scale: [1, 1.1, 0.95, 1.05, 1],
      }}
      transition={{
        duration: 8,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

// ─── Feature pill ────────────────────────────────────────────────────────────

function FeaturePill({
  icon: Icon,
  label,
  delay = 0,
}: {
  icon: React.ElementType;
  label: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="glass inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm text-slate-300"
    >
      <Icon className="w-4 h-4 text-accent" />
      {label}
    </motion.div>
  );
}

// ─── Layout ──────────────────────────────────────────────────────────────────

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* ── Left: Branding Panel ─────────────────────────────────────────── */}
      <div className="relative hidden lg:flex lg:w-1/2 xl:w-[55%] flex-col justify-center items-center overflow-hidden">
        {/* Gradient mesh background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(99,102,241,0.25),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(6,182,212,0.20),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_80%,rgba(139,92,246,0.18),transparent_50%)]" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Floating orbs */}
        <FloatingOrb className="top-[15%] left-[10%] bg-primary" size={120} delay={0} />
        <FloatingOrb className="top-[60%] right-[15%] bg-accent" size={90} delay={2} />
        <FloatingOrb className="bottom-[20%] left-[30%] bg-secondary" size={100} delay={4} />
        <FloatingOrb className="top-[35%] right-[25%] bg-primary" size={60} delay={1} />

        {/* Content */}
        <div className="relative z-10 max-w-lg px-12 text-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <motion.div
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <span className="text-2xl font-bold gradient-text">MeetingMind AI</span>
          </motion.div>

          {/* Tagline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl xl:text-5xl font-bold leading-tight mb-4"
          >
            Turn Every Meeting Into{" "}
            <span className="gradient-text">Action</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="text-slate-400 text-lg mb-10 leading-relaxed"
          >
            AI-powered intelligence that transcribes, analyzes, and automates
            your meeting workflows — so nothing slips through the cracks.
          </motion.p>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-3">
            <FeaturePill icon={Sparkles} label="Smart Transcription" delay={0.5} />
            <FeaturePill icon={Zap} label="Action Items" delay={0.6} />
            <FeaturePill icon={BarChart3} label="Analytics" delay={0.7} />
          </div>
        </div>

        {/* Bottom decoration */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-500 text-xs tracking-widest uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          Trusted by 10,000+ teams worldwide
        </motion.div>
      </div>

      {/* ── Right: Form Panel ────────────────────────────────────────────── */}
      <div className="relative flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-16">
        {/* Subtle gradient background on right side */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#131d35] to-[#0F172A]" />

        {/* Mobile-only logo (hidden on large screens) */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-6 left-6 flex items-center gap-2 lg:hidden"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold gradient-text">MeetingMind AI</span>
        </motion.div>

        {/* Glass card wrapper */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-md"
        >
          <div className="glass-strong rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/20">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
