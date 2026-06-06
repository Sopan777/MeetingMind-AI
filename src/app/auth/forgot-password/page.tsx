"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

// ─── Animation helpers ──────────────────────────────────────────────────────

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ForgotPasswordPage() {
  const auth = useAuth();

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setSubmitting(true);
      await auth.forgotPassword(email);
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {!submitted ? (
          /* ── Form State ──────────────────────────────────────────────── */
          <motion.form
            key="form"
            variants={container}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Back link */}
            <motion.div variants={item}>
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                Back to login
              </Link>
            </motion.div>

            {/* Header */}
            <motion.div variants={item}>
              <h2 className="text-2xl font-bold mb-1">Reset your password</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Enter your email address and we&apos;ll send you a link to reset
                your password.
              </p>
            </motion.div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm text-center"
              >
                {error}
              </motion.div>
            )}

            {/* Email */}
            <motion.div variants={item}>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-glass pl-10"
                  autoComplete="email"
                  autoFocus
                />
              </div>
            </motion.div>

            {/* Submit */}
            <motion.div variants={item}>
              <button
                type="submit"
                disabled={submitting}
                className={cn(
                  "btn-primary w-full flex items-center justify-center gap-2",
                  submitting && "opacity-70 cursor-not-allowed",
                )}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </motion.div>
          </motion.form>
        ) : (
          /* ── Success State ───────────────────────────────────────────── */
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center space-y-5 py-4"
          >
            {/* Check icon with animated ring */}
            <div className="flex justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: 0.1,
                }}
                className="relative"
              >
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                </div>
                {/* Animated ring */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1.3, opacity: 0 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                  className="absolute inset-0 rounded-full border-2 border-emerald-400/30"
                />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <h2 className="text-2xl font-bold mb-2">Check your email</h2>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">
                We&apos;ve sent a password reset link to{" "}
                <span className="text-white font-medium">{email}</span>.
                <br />
                Check your inbox and follow the instructions.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-3 pt-2"
            >
              <button
                onClick={() => {
                  setSubmitted(false);
                  setEmail("");
                }}
                className="btn-secondary w-full text-sm"
              >
                Try a different email
              </button>

              <Link
                href="/auth/login"
                className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
