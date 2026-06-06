"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Upload,
  Video,
  Clock,
  Users,
  Filter,
  Star,
} from "lucide-react";
import { meetings } from "@/lib/mock-data";
import { formatDuration } from "@/lib/utils";

const typeColors: Record<string, string> = {
  standup: "bg-emerald-500/20 text-emerald-300",
  "sprint-planning": "bg-primary/20 text-primary-200",
  retrospective: "bg-secondary/20 text-secondary-200",
  "client-call": "bg-accent/20 text-accent-200",
  "one-on-one": "bg-amber-500/20 text-amber-300",
  "all-hands": "bg-rose-500/20 text-rose-300",
};

const typeLabels: Record<string, string> = {
  standup: "Standup",
  "sprint-planning": "Sprint Planning",
  retrospective: "Retrospective",
  "client-call": "Client Call",
  "one-on-one": "1:1",
  "all-hands": "All Hands",
};

export default function MeetingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = meetings.filter((m) => {
    const matchesSearch = m.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Meetings</h1>
          <p className="text-slate-400 mt-1">
            {meetings.length} meetings recorded
          </p>
        </div>
        <Link
          href="/dashboard/meetings/upload"
          className="btn-primary flex items-center gap-2 w-fit"
        >
          <Upload className="w-4 h-4" />
          Upload Meeting
        </Link>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search meetings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-glass pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          {["all", "completed", "processing"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                statusFilter === s
                  ? "bg-primary/20 text-primary-200 border border-primary/30"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Meeting Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((meeting, i) => (
          <motion.div
            key={meeting.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link href={`/dashboard/meetings/${meeting.id}`}>
              <div className="card-hover cursor-pointer group">
                {/* Type badge */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`badge ${
                      typeColors[meeting.type] || "bg-slate-500/20 text-slate-300"
                    }`}
                  >
                    {typeLabels[meeting.type] || meeting.type}
                  </span>
                  <span
                    className={`badge ${
                      meeting.status === "completed"
                        ? "badge-success"
                        : meeting.status === "processing"
                        ? "badge-warning"
                        : "badge-danger"
                    }`}
                  >
                    {meeting.status}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-semibold text-white group-hover:text-primary-200 transition-colors mb-2">
                  {meeting.title}
                </h3>

                {/* Meta info */}
                <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {formatDuration(meeting.duration)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {meeting.participants.length}
                  </span>
                  <span>
                    {new Date(meeting.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>

                {/* Participants */}
                <div className="flex items-center mb-4">
                  <div className="flex -space-x-2">
                    {meeting.participants.slice(0, 4).map((p, j) => (
                      <div
                        key={j}
                        className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-[10px] font-bold text-white border-2 border-card"
                      >
                        {p
                          .split(" ")
                          .map((w) => w[0])
                          .join("")}
                      </div>
                    ))}
                    {meeting.participants.length > 4 && (
                      <div className="w-7 h-7 rounded-full bg-dark-100 flex items-center justify-center text-[10px] font-medium text-slate-300 border-2 border-card">
                        +{meeting.participants.length - 4}
                      </div>
                    )}
                  </div>
                </div>

                {/* Quality Score */}
                <div className="flex items-center gap-2">
                  <Star className="w-3.5 h-3.5 text-amber-400" />
                  <div className="flex-1 h-1.5 rounded-full bg-dark-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        meeting.qualityScore >= 80
                          ? "bg-emerald-500"
                          : meeting.qualityScore >= 60
                          ? "bg-amber-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${meeting.qualityScore}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-400">
                    {meeting.qualityScore}
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
