"use client";

import { useState, useMemo, type FormEvent } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, User, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

// ─── Animation helpers ──────────────────────────────────────────────────────

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

// ─── Password strength ──────────────────────────────────────────────────────

type Strength = "empty" | "weak" | "medium" | "strong";

function getPasswordStrength(pw: string): Strength {
  if (!pw) return "empty";
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (pw.length >= 12) score++;
  if (score <= 1) return "weak";
  if (score <= 3) return "medium";
  return "strong";
}

const strengthConfig: Record<
  Exclude<Strength, "empty">,
  { label: string; color: string; bg: string; width: string }
> = {
  weak: {
    label: "Weak",
    color: "text-red-400",
    bg: "bg-red-500",
    width: "w-1/3",
  },
  medium: {
    label: "Medium",
    color: "text-amber-400",
    bg: "bg-amber-500",
    width: "w-2/3",
  },
  strong: {
    label: "Strong",
    color: "text-emerald-400",
    bg: "bg-emerald-500",
    width: "w-full",
  },
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

export default function SignupPage() {
  const router = useRouter();
  const auth = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const strength = useMemo(() => getPasswordStrength(password), [password]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (strength === "weak") {
      setError("Please choose a stronger password.");
      return;
    }
    if (!agreedToTerms) {
      setError("You must agree to the Terms & Conditions.");
      return;
    }

    try {
      setSubmitting(true);
      await auth.signup(name, email, password);
      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
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
      className="space-y-5"
    >
      {/* Header */}
      <motion.div variants={item} className="text-center mb-1">
        <h2 className="text-2xl font-bold mb-1">Create your account</h2>
        <p className="text-slate-400 text-sm">
          Start transforming your meetings today
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

      {/* Full Name */}
      <motion.div variants={item}>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Full Name
        </label>
        <div className="relative">
          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Alex Johnson"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-glass pl-10"
            autoComplete="name"
          />
        </div>
      </motion.div>

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
            autoComplete="new-password"
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

        {/* Strength indicator */}
        {strength !== "empty" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-2 space-y-1"
          >
            <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className={cn("h-full rounded-full", strengthConfig[strength].bg)}
                initial={{ width: 0 }}
                animate={{
                  width:
                    strength === "weak"
                      ? "33%"
                      : strength === "medium"
                      ? "66%"
                      : "100%",
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className={cn("text-xs font-medium", strengthConfig[strength].color)}>
              {strengthConfig[strength].label} password
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Confirm Password */}
      <motion.div variants={item}>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Confirm Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={cn(
              "input-glass pl-10 pr-11",
              confirmPassword &&
                password !== confirmPassword &&
                "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20",
            )}
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowConfirm((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
            tabIndex={-1}
          >
            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {confirmPassword && password !== confirmPassword && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-1 text-xs text-red-400"
          >
            Passwords do not match
          </motion.p>
        )}
      </motion.div>

      {/* Terms */}
      <motion.div variants={item}>
        <label className="flex items-start gap-2.5 cursor-pointer group">
          <div
            onClick={() => setAgreedToTerms((p) => !p)}
            className={cn(
              "mt-0.5 w-4 h-4 rounded border flex-shrink-0 transition-all duration-200 flex items-center justify-center",
              agreedToTerms
                ? "bg-primary border-primary"
                : "border-slate-600 group-hover:border-slate-400",
            )}
          >
            {agreedToTerms && (
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
          <span className="text-sm text-slate-400 leading-snug select-none">
            I agree to the{" "}
            <span className="text-primary hover:text-primary/80 cursor-pointer font-medium">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="text-primary hover:text-primary/80 cursor-pointer font-medium">
              Privacy Policy
            </span>
          </span>
        </label>
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
              Creating account…
            </>
          ) : (
            "Create Account"
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

      {/* Sign in link */}
      <motion.p
        variants={item}
        className="text-center text-sm text-slate-400 pt-1"
      >
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="text-primary hover:text-primary/80 font-semibold transition-colors"
        >
          Sign in
        </Link>
      </motion.p>
    </motion.form>
  );
}
