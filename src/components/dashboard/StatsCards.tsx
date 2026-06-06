"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Video,
  CheckSquare,
  GitBranch,
  AlertTriangle,
  Clock,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const stats = [
  {
    label: "Total Meetings",
    value: "247",
    change: "+12%",
    trend: "up" as const,
    icon: Video,
    gradient: "from-primary to-primary-600",
    glowColor: "rgba(99, 102, 241, 0.15)",
    iconBg: "bg-primary/10",
    iconColor: "text-primary-200",
  },
  {
    label: "Action Items",
    value: "1,284",
    change: "+8%",
    trend: "up" as const,
    icon: CheckSquare,
    gradient: "from-secondary to-secondary-600",
    glowColor: "rgba(139, 92, 246, 0.15)",
    iconBg: "bg-secondary/10",
    iconColor: "text-secondary-200",
  },
  {
    label: "Decisions Extracted",
    value: "856",
    change: "+23%",
    trend: "up" as const,
    icon: GitBranch,
    gradient: "from-accent to-accent-600",
    glowColor: "rgba(6, 182, 212, 0.15)",
    iconBg: "bg-accent/10",
    iconColor: "text-accent-200",
  },
  {
    label: "Risks Detected",
    value: "142",
    change: "+5%",
    trend: "up" as const,
    icon: AlertTriangle,
    gradient: "from-amber-500 to-amber-600",
    glowColor: "rgba(245, 158, 11, 0.15)",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-300",
  },
  {
    label: "Hours Saved",
    value: "380+",
    change: "+18%",
    trend: "up" as const,
    icon: Clock,
    gradient: "from-emerald-500 to-emerald-600",
    glowColor: "rgba(16, 185, 129, 0.15)",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-300",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export default function StatsCards() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
    >
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            variants={cardVariants}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="stat-card group cursor-default"
          >
            {/* Radial glow on hover */}
            <div
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: `radial-gradient(circle at 50% 0%, ${stat.glowColor} 0%, transparent 60%)`,
              }}
            />

            <div className="relative z-10 flex flex-col gap-3">
              {/* Icon + Change */}
              <div className="flex items-center justify-between">
                <div
                  className={cn(
                    "w-11 h-11 rounded-xl flex items-center justify-center",
                    stat.iconBg,
                    "ring-1 ring-white/[0.06]"
                  )}
                >
                  <Icon className={cn("w-5 h-5", stat.iconColor)} />
                </div>

                <div
                  className={cn(
                    "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg",
                    stat.trend === "up"
                      ? "text-emerald-400 bg-emerald-500/10"
                      : "text-red-400 bg-red-500/10"
                  )}
                >
                  {stat.trend === "up" ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {stat.change}
                </div>
              </div>

              {/* Value */}
              <div>
                <p className="text-2xl font-bold text-white tracking-tight">
                  {stat.value}
                </p>
                <p className="text-sm text-dark-400 mt-0.5">{stat.label}</p>
              </div>
            </div>

            {/* Decorative gradient corner */}
            <div
              className="absolute top-0 right-0 w-20 h-20 opacity-[0.08]"
              style={{
                background: `radial-gradient(circle at 100% 0%, ${stat.glowColor.replace("0.15", "1")} 0%, transparent 70%)`,
              }}
            />
          </motion.div>
        );
      })}
    </motion.div>
  );
}
