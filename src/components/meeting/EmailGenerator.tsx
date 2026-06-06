"use client";

import { useState } from "react";
import { Mail, Copy, Download, ExternalLink, Check } from "lucide-react";

interface EmailGeneratorProps {
  meetingTitle: string;
}

const templates = [
  { key: "client", label: "Client Follow-up" },
  { key: "internal", label: "Internal Follow-up" },
  { key: "sprint", label: "Sprint Summary" },
  { key: "stakeholder", label: "Stakeholder Update" },
];

const emailData: Record<string, { to: string; subject: string; body: string }> = {
  client: {
    to: "client@acmecorp.com",
    subject: "Meeting Follow-up: Sprint Planning - Q4 Release",
    body: `Dear Team,

Thank you for joining today's sprint planning session. Here's a summary of our discussion and the agreed-upon next steps.

Key Decisions Made:
• Migrating to microservices architecture for the payment module
• Adopting TypeScript for all new frontend development
• Q4 release timeline adjusted to accommodate additional testing

Action Items:
1. Complete API integration for payment gateway — Rahul (Due: Dec 20)
2. Update design system documentation — Sarah (Due: Dec 18)
3. Security audit for authentication flow — Mike (Due: Dec 22)

Risks Identified:
• Third-party API dependency may cause delays — mitigation plan in place
• Resource allocation needs review for Q1 planning

Please don't hesitate to reach out if you have any questions. Our next check-in is scheduled for next Wednesday.

Best regards,
Alex Chen
MeetingMind AI`,
  },
  internal: {
    to: "engineering@meetingmind.ai",
    subject: "Internal Notes: Sprint Planning - Q4 Release",
    body: `Hi Team,

Quick recap from today's sprint planning:

What went well:
• Clear alignment on Q4 priorities
• Good discussion on technical debt items
• Identified 3 critical risks early

What needs attention:
• Payment gateway integration is behind schedule
• Need additional QA resources for security testing
• Frontend performance optimization not yet started

Sprint Commitments:
• 8 story points committed for this sprint
• 3 carry-over items from last sprint
• 2 new high-priority items added

Blockers:
• Waiting for API credentials from payment provider
• Design review needed for new dashboard components

Let's sync on blockers in tomorrow's standup.

— Alex`,
  },
  sprint: {
    to: "product@meetingmind.ai",
    subject: "Sprint Summary: Q4 Release Sprint 3",
    body: `Sprint Summary Report

Sprint: Q4 Release - Sprint 3
Duration: Dec 4 - Dec 18, 2024
Team Velocity: 42 points (target: 45)

Completed:
✅ User authentication redesign
✅ Dashboard analytics module
✅ API rate limiting implementation
✅ Mobile responsive fixes

In Progress:
🔄 Payment gateway integration (70%)
🔄 Design system v2 migration (50%)

Carried Over:
⏳ Performance optimization suite
⏳ E2E test coverage expansion

Metrics:
• Bug resolution rate: 94%
• Code review turnaround: 4.2 hours avg
• Sprint goal completion: 82%

Risks & Mitigations tracked in MeetingMind AI dashboard.`,
  },
  stakeholder: {
    to: "leadership@meetingmind.ai",
    subject: "Q4 Release Status Update",
    body: `Executive Summary — Q4 Release Status

Overall Status: 🟡 On Track (with risks)

Progress Highlights:
• Core platform features 85% complete
• User testing phase begins next week
• Security audit completed with no critical findings

Key Metrics:
• Meeting intelligence accuracy: 94.2%
• User satisfaction score: 4.6/5
• Platform uptime: 99.97%

Budget Status: Within allocated budget (92% utilized)

Timeline:
• Beta release: December 20, 2024
• Public launch: January 15, 2025
• Enterprise features: February 2025

Risks Requiring Attention:
1. Third-party API dependency — medium risk, mitigation in place
2. Resource availability during holiday season — contingency plan ready

Recommendation: Proceed with current timeline. Next update in 1 week.

Best regards,
Alex Chen`,
  },
};

export default function EmailGenerator({ meetingTitle }: EmailGeneratorProps) {
  const [selected, setSelected] = useState("client");
  const [copied, setCopied] = useState(false);
  const data = emailData[selected];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(data.body);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Template selector */}
      <div className="flex gap-2 flex-wrap">
        {templates.map((t) => (
          <button
            key={t.key}
            onClick={() => setSelected(t.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selected === t.key
                ? "bg-primary/20 text-primary-200 border border-primary/30"
                : "glass text-slate-400 hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Email Preview */}
      <div className="card space-y-3">
        <div className="flex items-center gap-2 text-primary mb-2">
          <Mail className="w-5 h-5" />
          <h3 className="font-semibold text-white">Email Preview</h3>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-500 w-16">To:</span>
            <span className="text-slate-300">{data.to}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-500 w-16">Subject:</span>
            <span className="text-white font-medium">{data.subject}</span>
          </div>
        </div>

        <div className="border-t border-white/5 pt-4">
          <pre className="text-sm text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
            {data.body}
          </pre>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="flex gap-3">
        <button onClick={handleCopy} className="btn-primary flex items-center gap-2">
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copied!" : "Copy to Clipboard"}
        </button>
        <button className="btn-secondary flex items-center gap-2">
          <Download className="w-4 h-4" />
          Download PDF
        </button>
        <button className="btn-secondary flex items-center gap-2">
          <ExternalLink className="w-4 h-4" />
          Open in Email
        </button>
      </div>
    </div>
  );
}
