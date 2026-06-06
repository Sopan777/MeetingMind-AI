"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import StatsCards from "@/components/dashboard/StatsCards";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import {
  Upload,
  CheckSquare,
  FileBarChart,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const quickActions = [
  {
    label: "Upload Meeting",
    description: "Process a new recording",
    icon: Upload,
    gradient: "from-primary to-secondary",
    glowColor: "group-hover:shadow-glow",
  },
  {
    label: "View Tasks",
    description: "Manage action items",
    icon: CheckSquare,
    gradient: "from-secondary to-accent",
    glowColor: "group-hover:shadow-glow-accent",
  },
  {
    label: "Generate Report",
    description: "Create AI summary",
    icon: FileBarChart,
    gradient: "from-accent to-emerald-500",
    glowColor: "group-hover:shadow-glow-accent",
  },
];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function formatToday(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-primary-200" />
            <span className="text-sm text-primary-200 font-medium">
              {getGreeting()}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Welcome back,{" "}
            <span className="gradient-text">Alex</span>
          </h1>
          <p className="text-dark-400 mt-1 text-sm">
            {formatToday()} — Here&apos;s what&apos;s happening with your meetings.
          </p>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center gap-3"
        >
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  "group relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl",
                  "bg-white/[0.04] border border-white/[0.06]",
                  "hover:bg-white/[0.08] hover:border-white/[0.12]",
                  "transition-all duration-300",
                  action.glowColor
                )}
              >
                <div
                  className={cn(
                    "w-7 h-7 rounded-lg bg-gradient-to-br flex items-center justify-center",
                    action.gradient
                  )}
                >
                  <Icon className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="text-left hidden lg:block">
                  <p className="text-sm font-medium text-white leading-none">
                    {action.label}
                  </p>
                  <p className="text-[11px] text-dark-400 mt-0.5">
                    {action.description}
                  </p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-dark-400 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 hidden lg:block" />
              </motion.button>
            );
          })}
        </motion.div>
      </motion.div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Activity Feed */}
      <ActivityFeed />
    </div>
  );
}
