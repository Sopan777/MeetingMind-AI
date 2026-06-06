"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus, Users as UsersIcon, Video, CheckSquare,
  X, Send,
} from "lucide-react";
import { teamMembers } from "@/lib/mock-data";

const roleStyles: Record<string, string> = {
  Admin: "badge-primary",
  Manager: "bg-secondary/20 text-secondary-200",
  Employee: "badge-accent",
  Viewer: "bg-slate-500/20 text-slate-300",
};

const statusDot: Record<string, string> = {
  active: "bg-emerald-400",
  away: "bg-amber-400",
  offline: "bg-slate-500",
};

const avatarColors = [
  "from-primary to-secondary",
  "from-secondary to-accent",
  "from-accent to-emerald-500",
  "from-amber-500 to-rose-500",
  "from-rose-500 to-primary",
  "from-emerald-500 to-primary",
  "from-primary to-accent",
  "from-secondary to-rose-500",
];

export default function TeamPage() {
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Employee");

  const activeCount = teamMembers.filter((m) => m.status === "active").length;
  const totalMeetings = teamMembers.reduce((s, m) => s + m.meetingsAttended, 0);
  const totalTasks = teamMembers.reduce((s, m) => s + m.tasksCompleted, 0);

  const stats = [
    { label: "Total Members", value: teamMembers.length, icon: UsersIcon },
    { label: "Active Now", value: activeCount, icon: UsersIcon },
    { label: "Meetings This Week", value: Math.round(totalMeetings / 4), icon: Video },
    { label: "Tasks Completed", value: totalTasks, icon: CheckSquare },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Team</h1>
          <p className="text-slate-400 mt-1">Manage your workspace members</p>
        </div>
        <button
          onClick={() => setShowInvite(true)}
          className="btn-primary flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Invite Member
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="stat-card"
            >
              <Icon className="w-4 h-4 text-slate-400 mb-2" />
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-slate-400">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {teamMembers.map((member, i) => {
          const initials = member.name
            .split(" ")
            .map((w) => w[0])
            .join("");
          return (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card-hover"
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-br ${
                      avatarColors[i % avatarColors.length]
                    } flex items-center justify-center text-sm font-bold text-white`}
                  >
                    {initials}
                  </div>
                  <div
                    className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-card ${
                      statusDot[member.status]
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white">{member.name}</h3>
                  <p className="text-sm text-slate-400 truncate">{member.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`badge ${roleStyles[member.role]}`}>
                      {member.role}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-white/5 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Video className="w-3 h-3" />
                  {member.meetingsAttended} meetings
                </span>
                <span className="flex items-center gap-1">
                  <CheckSquare className="w-3 h-3" />
                  {member.tasksCompleted} tasks
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Invite Modal */}
      <AnimatePresence>
        {showInvite && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowInvite(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong rounded-2xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">
                  Invite Team Member
                </h2>
                <button
                  onClick={() => setShowInvite(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400 mb-1 block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="colleague@company.com"
                    className="input-glass"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Role</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="input-glass"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Employee">Employee</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>
                <button
                  onClick={() => setShowInvite(false)}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Invite
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
