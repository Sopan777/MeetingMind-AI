"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X, Bell, Video, AlertTriangle, CheckSquare, Clock,
  CheckCheck,
} from "lucide-react";
import { notifications } from "@/lib/mock-data";

const typeIcons: Record<string, any> = {
  "meeting-processed": Video,
  "risk-detected": AlertTriangle,
  "action-assigned": CheckSquare,
  "deadline-approaching": Clock,
};

const typeColors: Record<string, string> = {
  "meeting-processed": "text-primary bg-primary/15",
  "risk-detected": "text-amber-400 bg-amber-400/15",
  "action-assigned": "text-accent bg-accent/15",
  "deadline-approaching": "text-rose-400 bg-rose-400/15",
};

function timeAgo(timestamp: string) {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md glass-strong border-l border-white/5 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-white">Notifications</h2>
                {unreadCount > 0 && (
                  <span className="badge-primary">{unreadCount} new</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button className="text-xs text-primary hover:text-primary-200 transition-colors flex items-center gap-1">
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {notifications.map((notif, i) => {
                const Icon = typeIcons[notif.type] || Bell;
                const colorClass = typeColors[notif.type] || "text-slate-400 bg-slate-400/15";
                return (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className={`flex items-start gap-3 p-3 rounded-xl transition-colors cursor-pointer ${
                      notif.read
                        ? "hover:bg-white/[0.02]"
                        : "bg-white/[0.02] hover:bg-white/[0.04]"
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-white">
                          {notif.title}
                        </p>
                        {!notif.read && (
                          <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                        {notif.message}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-1">
                        {timeAgo(notif.timestamp)}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
