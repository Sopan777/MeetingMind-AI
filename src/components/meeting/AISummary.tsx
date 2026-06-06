"use client";

import { useState } from "react";
import { FileText, Briefcase, Code, Users } from "lucide-react";
import type { MeetingSummary } from "@/lib/mock-data";

interface AISummaryProps {
  summary: MeetingSummary;
}

const tabs = [
  { key: "executive" as const, label: "Executive Summary", icon: Briefcase },
  { key: "technical" as const, label: "Technical Summary", icon: Code },
  { key: "client" as const, label: "Client Summary", icon: Users },
];

export default function AISummary({ summary }: AISummaryProps) {
  const [active, setActive] = useState<keyof MeetingSummary>("executive");

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-1 p-1 glass rounded-xl w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActive(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                active === tab.key
                  ? "bg-primary/20 text-primary-200 border border-primary/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-white">
            {tabs.find((t) => t.key === active)?.label}
          </h3>
        </div>
        <div className="prose prose-invert prose-sm max-w-none">
          {summary[active].split("\n\n").map((paragraph, i) => (
            <p key={i} className="text-slate-300 leading-relaxed mb-3">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
