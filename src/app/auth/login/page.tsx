"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";
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

// ─── Google Icon ─────────────────────────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setSubmitting(true);
      await auth.login(email, password);
      router.push("/dashboard");
    } catch {
      setError("Invalid credentials. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <motion.form
      variants={container}
      initial="hidden"
      animate="show"
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={item} className="text-center mb-2">
        <h2 className="text-2xl font-bold mb-1">Welcome back</h2>
        <p className="text-slate-400 text-sm">
          Sign in to your MeetingMind account
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
          />
        </div>
      </motion.div>

      {/* Password */}
      <motion.div variants={item}>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-glass pl-10 pr-11"
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </motion.div>

      {/* Remember me + Forgot */}
      <motion.div variants={item} className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 cursor-pointer group">
          <div
            onClick={() => setRememberMe((p) => !p)}
            className={cn(
              "w-4 h-4 rounded border transition-all duration-200 flex items-center justify-center",
              rememberMe
                ? "bg-primary border-primary"
                : "border-slate-600 group-hover:border-slate-400",
            )}
          >
            {rememberMe && (
              <motion.svg
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-3 h-3 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path d="M5 13l4 4L19 7" />
              </motion.svg>
            )}
          </div>
          <span className="text-slate-400 group-hover:text-slate-300 select-none">
            Remember me
          </span>
        </label>

        <Link
          href="/auth/forgot-password"
          className="text-primary hover:text-primary/80 transition-colors font-medium"
        >
          Forgot password?
        </Link>
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
              Signing in…
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </motion.div>

      {/* Divider */}
      <motion.div variants={item} className="flex items-center gap-3">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-xs text-slate-500 uppercase tracking-wider">
          or continue with
        </span>
        <div className="flex-1 h-px bg-white/10" />
      </motion.div>

      {/* Google OAuth */}
      <motion.div variants={item}>
        <button
          type="button"
          className="glass w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-300 active:scale-[0.98]"
        >
          <GoogleIcon />
          Continue with Google
        </button>
      </motion.div>

      {/* Sign up link */}
      <motion.p
        variants={item}
        className="text-center text-sm text-slate-400 pt-2"
      >
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/signup"
          className="text-primary hover:text-primary/80 font-semibold transition-colors"
        >
          Sign up
        </Link>
      </motion.p>
    </motion.form>
  );
}
