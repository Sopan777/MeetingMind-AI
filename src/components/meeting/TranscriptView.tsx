"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import type { TranscriptEntry } from "@/lib/mock-data";

const speakerColors: Record<string, string> = {
  "Alex Chen": "#6366F1",
  "Sarah Kim": "#8B5CF6",
  "Mike Rodriguez": "#06B6D4",
  "Priya Patel": "#F59E0B",
  "David Park": "#10B981",
  "Emma Wilson": "#EC4899",
};

interface TranscriptViewProps {
  entries: TranscriptEntry[];
}

export default function TranscriptView({ entries }: TranscriptViewProps) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return entries;
    return entries.filter(
      (e) =>
        e.text.toLowerCase().includes(search.toLowerCase()) ||
        e.speaker.toLowerCase().includes(search.toLowerCase())
    );
  }, [entries, search]);

  const highlightText = (text: string) => {
    if (!search) return text;
    const parts = text.split(new RegExp(`(${search})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === search.toLowerCase() ? (
        <mark key={i} className="bg-amber-500/30 text-amber-200 px-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search transcript..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-glass pl-10"
        />
      </div>

      <div className="space-y-1">
        {filtered.map((entry) => {
          const color = speakerColors[entry.speaker] || "#94A3B8";
          const initials = entry.speaker
            .split(" ")
            .map((w) => w[0])
            .join("");

          return (
            <div
              key={entry.id}
              className="flex gap-3 p-3 rounded-xl hover:bg-white/[0.02] transition-colors group"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5"
                style={{ backgroundColor: color + "33" }}
              >
                <span style={{ color }}>{initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-medium" style={{ color }}>
                    {entry.speaker}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    {entry.timestamp}
                  </span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {highlightText(entry.text)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
