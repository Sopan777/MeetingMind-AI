"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Search,
  Bell,
  ChevronDown,
  Settings,
  LogOut,
  User,
  Moon,
  HelpCircle,
} from "lucide-react";

interface TopBarProps {
  title: string;
  subtitle?: string;
}

const notifications = [
  {
    id: 1,
    title: "Sprint Planning processed",
    description: "12 action items extracted",
    time: "2 min ago",
    unread: true,
  },
  {
    id: 2,
    title: "New risk detected",
    description: "Q4 Budget Review flagged high-priority risk",
    time: "15 min ago",
    unread: true,
  },
  {
    id: 3,
    title: "Action item overdue",
    description: "Update API docs — assigned to you",
    time: "1 hour ago",
    unread: false,
  },
  {
    id: 4,
    title: "Team sentiment alert",
    description: "Negative sentiment detected in Design Sync",
    time: "3 hours ago",
    unread: false,
  },
];

export default function TopBar({ title, subtitle }: TopBarProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setNotifOpen(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 w-full">
      <div
        className={cn(
          "flex items-center justify-between",
          "px-8 py-4",
          "bg-dark/80 backdrop-blur-xl",
          "border-b border-white/[0.04]"
        )}
      >
        {/* Left: Title */}
        <div>
          <h1 className="text-xl font-semibold text-white">{title}</h1>
          {subtitle && (
            <p className="text-sm text-dark-400 mt-0.5">{subtitle}</p>
          )}
        </div>

        {/* Right: Search + Notifications + Profile */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <motion.div
            animate={{ width: searchFocused ? 320 : 240 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative hidden md:block"
          >
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search meetings, tasks..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className={cn(
                "w-full pl-10 pr-4 py-2.5 rounded-xl text-sm",
                "bg-white/[0.04] border border-white/[0.06]",
                "text-white placeholder-dark-400",
                "focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 focus:bg-white/[0.06]",
                "transition-all duration-300"
              )}
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-dark-400 bg-white/5 px-1.5 py-0.5 rounded font-mono border border-white/10">
              ⌘K
            </kbd>
          </motion.div>

          {/* Notifications */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => {
                setNotifOpen(!notifOpen);
                setProfileOpen(false);
              }}
              className={cn(
                "relative w-10 h-10 rounded-xl flex items-center justify-center",
                "hover:bg-white/[0.06] transition-all duration-200",
                notifOpen && "bg-white/[0.06]"
              )}
            >
              <Bell className="w-[18px] h-[18px] text-dark-400" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-dark">
                  <span className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75" />
                </span>
              )}
            </button>

            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "absolute right-0 mt-2 w-80",
                    "glass-strong rounded-2xl overflow-hidden",
                    "shadow-glass border border-white/[0.08]"
                  )}
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                    <h3 className="text-sm font-semibold text-white">
                      Notifications
                    </h3>
                    <span className="badge-primary">{unreadCount} new</span>
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={cn(
                          "px-4 py-3 hover:bg-white/[0.03] transition-colors cursor-pointer border-b border-white/[0.03] last:border-0",
                          notif.unread && "bg-primary/[0.03]"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          {notif.unread && (
                            <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                          )}
                          <div
                            className={cn(
                              "flex-1 min-w-0",
                              !notif.unread && "ml-5"
                            )}
                          >
                            <p className="text-sm font-medium text-white truncate">
                              {notif.title}
                            </p>
                            <p className="text-xs text-dark-400 mt-0.5 truncate">
                              {notif.description}
                            </p>
                            <p className="text-[10px] text-dark-300 mt-1">
                              {notif.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="px-4 py-2.5 border-t border-white/[0.06]">
                    <button className="text-xs text-primary-200 hover:text-primary-100 font-medium transition-colors w-full text-center">
                      View all notifications
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile Dropdown */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => {
                setProfileOpen(!profileOpen);
                setNotifOpen(false);
              }}
              className={cn(
                "flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-xl",
                "hover:bg-white/[0.06] transition-all duration-200",
                profileOpen && "bg-white/[0.06]"
              )}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-semibold">
                A
              </div>
              <ChevronDown
                className={cn(
                  "w-3.5 h-3.5 text-dark-400 transition-transform duration-200",
                  profileOpen && "rotate-180"
                )}
              />
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "absolute right-0 mt-2 w-56",
                    "glass-strong rounded-2xl overflow-hidden",
                    "shadow-glass border border-white/[0.08]"
                  )}
                >
                  <div className="px-4 py-3 border-b border-white/[0.06]">
                    <p className="text-sm font-medium text-white">
                      Alex Johnson
                    </p>
                    <p className="text-xs text-dark-400 mt-0.5">
                      alex@meetingmind.ai
                    </p>
                  </div>

                  <div className="py-1">
                    {[
                      { icon: User, label: "Profile" },
                      { icon: Settings, label: "Settings" },
                      { icon: Moon, label: "Appearance" },
                      { icon: HelpCircle, label: "Help & Support" },
                    ].map((item) => (
                      <button
                        key={item.label}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-dark-400 hover:text-white hover:bg-white/[0.04] transition-colors"
                      >
                        <item.icon className="w-4 h-4" />
                        {item.label}
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-white/[0.06] py-1">
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors">
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
