"use client";

import { useState } from "react";
import { use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  Users,
  Star,
  FileText,
  CheckSquare,
  GitBranch,
  AlertTriangle,
  Sparkles,
  Mail,
} from "lucide-react";
import {
  meetings,
  transcript,
  actionItems,
  decisions,
  risks,
  meetingSummaries,
} from "@/lib/mock-data";
import TranscriptView from "@/components/meeting/TranscriptView";
import ActionItemsTable from "@/components/meeting/ActionItemsTable";
import DecisionsList from "@/components/meeting/DecisionsList";
import RiskCards from "@/components/meeting/RiskCards";
import AISummary from "@/components/meeting/AISummary";
import EmailGenerator from "@/components/meeting/EmailGenerator";
import { formatDuration } from "@/lib/utils";

const tabs = [
  { key: "transcript", label: "Transcript", icon: FileText },
  { key: "actions", label: "Action Items", icon: CheckSquare },
  { key: "decisions", label: "Decisions", icon: GitBranch },
  { key: "risks", label: "Risks", icon: AlertTriangle },
  { key: "summary", label: "AI Summary", icon: Sparkles },
  { key: "emails", label: "Emails", icon: Mail },
];

export default function MeetingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState("transcript");

  const meeting = meetings.find((m) => m.id === id) || meetings[0];
  const meetingActions = actionItems.filter((a) => a.meetingId === meeting.id);
  const meetingDecisions = decisions.filter((d) => d.meetingId === meeting.id);
  const meetingRisks = risks.filter((r) => r.meetingId === meeting.id);
  const summary = meetingSummaries[meeting.id] || meetingSummaries["meeting-1"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link
          href="/dashboard/meetings"
          className="p-2 rounded-lg hover:bg-white/5 transition-colors mt-1"
        >
          <ArrowLeft className="w-5 h-5 text-slate-400" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">{meeting.title}</h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-slate-400 flex-wrap">
            <span>
              {new Date(meeting.date).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {formatDuration(meeting.duration)}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {meeting.participants.length} participants
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-400" />
              Quality: {meeting.qualityScore}/100
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const count =
            tab.key === "actions"
              ? meetingActions.length
              : tab.key === "decisions"
              ? meetingDecisions.length
              : tab.key === "risks"
              ? meetingRisks.length
              : null;

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? "bg-primary/15 text-primary-200 border border-primary/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {count !== null && (
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${
                    activeTab === tab.key
                      ? "bg-primary/20 text-primary-200"
                      : "bg-dark-100 text-slate-500"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === "transcript" && <TranscriptView entries={transcript} />}
        {activeTab === "actions" && <ActionItemsTable items={meetingActions} />}
        {activeTab === "decisions" && (
          <DecisionsList decisions={meetingDecisions} />
        )}
        {activeTab === "risks" && <RiskCards risks={meetingRisks} />}
        {activeTab === "summary" && <AISummary summary={summary} />}
        {activeTab === "emails" && (
          <EmailGenerator meetingTitle={meeting.title} />
        )}
      </motion.div>
    </div>
  );
}
