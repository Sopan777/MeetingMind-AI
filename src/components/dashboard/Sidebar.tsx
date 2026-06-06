"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  LayoutDashboard,
  Video,
  BarChart3,
  CheckSquare,
  Plug,
  Users,
  Settings,
  Cpu,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Meetings", icon: Video, href: "/dashboard/meetings" },
  { label: "Analytics", icon: BarChart3, href: "/dashboard/analytics" },
  { label: "Tasks", icon: CheckSquare, href: "/dashboard/tasks" },
  { label: "Integrations", icon: Plug, href: "/dashboard/integrations" },
  { label: "Team", icon: Users, href: "/dashboard/team" },
  { label: "Settings", icon: Settings, href: "/dashboard/settings" },
  { label: "MLOps", icon: Cpu, href: "/dashboard/mlops" },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 280 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        "fixed left-0 top-0 h-screen z-40",
        "glass-strong border-r border-white/[0.06]",
        "flex flex-col justify-between",
        "select-none"
      )}
    >
      {/* Logo */}
      <div>
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-5 py-6 group"
        >
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-glow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden whitespace-nowrap"
              >
                <span className="text-lg font-bold gradient-text">
                  MeetingMind
                </span>
                <span className="text-lg font-light text-dark-400 ml-1">
                  AI
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>

        {/* Divider */}
        <div className="mx-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-2" />

        {/* Navigation */}
        <nav className="px-3 mt-2 space-y-1">
          {navItems.map((item, index) => {
            const active = isActive(item.href);
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04, duration: 0.3 }}
                  className={cn(
                    "relative group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer",
                    active
                      ? "text-white bg-primary/10 border border-primary/20"
                      : "text-dark-300 hover:text-white hover:bg-white/5 border border-transparent"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  {/* Active indicator bar */}
                  {active && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-gradient-to-b from-primary to-accent"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}

                  <div
                    className={cn(
                      "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200",
                      active
                        ? "bg-primary/20 text-primary-200"
                        : "text-dark-300 group-hover:text-white group-hover:bg-white/5"
                    )}
                  >
                    <Icon className="w-[18px] h-[18px]" />
                  </div>

                  <AnimatePresence mode="wait">
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className={cn(
                          "text-sm font-medium overflow-hidden whitespace-nowrap",
                          active ? "text-white" : ""
                        )}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="px-3 pb-4 space-y-2">
        {/* Divider */}
        <div className="mx-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-2" />

        {/* User Profile */}
        <div
          className={cn(
            "flex items-center gap-3 px-3 py-3 rounded-xl",
            "bg-white/[0.03] border border-white/[0.04]",
            "hover:bg-white/[0.06] transition-all duration-200 cursor-pointer group"
          )}
        >
          <div className="relative flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-semibold ring-2 ring-primary/20">
              A
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-dark-50" />
          </div>

          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden flex-1 min-w-0"
              >
                <p className="text-sm font-medium text-white truncate">
                  Alex Johnson
                </p>
                <p className="text-xs text-dark-400 truncate">Product Lead</p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <LogOut className="w-4 h-4 text-dark-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={onToggle}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-2 rounded-xl",
            "text-dark-400 hover:text-white hover:bg-white/5",
            "transition-all duration-200"
          )}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span className="text-xs font-medium">Collapse</span>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  );
}
