"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface MeetingTopBarProps {
  status: "ready" | "recording" | "processing" | "connected";
  isSharing: boolean;
  isAnalyzing: boolean;
  onShareScreen: () => void;
  onStopSharing: () => void;
  onStartAnalysis: () => void;
  onStopAnalysis: () => void;
}

const statusConfig: Record<
  MeetingTopBarProps["status"],
  { color: string; label: string }
> = {
  ready: { color: "bg-gray-400", label: "Ready" },
  recording: { color: "bg-green-500", label: "Recording" },
  processing: { color: "bg-yellow-500", label: "Processing" },
  connected: { color: "bg-blue-500", label: "Connected" },
};

export function MeetingTopBar({
  status,
  isSharing,
  isAnalyzing,
  onShareScreen,
  onStopSharing,
  onStartAnalysis,
  onStopAnalysis,
}: MeetingTopBarProps) {
  const { color, label } = statusConfig[status];

  return (
    <div className="flex items-center justify-between bg-card border-b border-border px-6 py-3">
      <div className="flex items-center gap-4">
        <span className="text-base font-semibold tracking-tight text-foreground">
          MeetingMind AI
        </span>
        <Badge variant="outline" className="gap-1.5">
          <span
            className={`inline-block h-2 w-2 rounded-full ${color}`}
            aria-hidden="true"
          />
          {label}
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        {isSharing ? (
          <Button variant="destructive" size="sm" onClick={onStopSharing}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              data-icon="inline-start"
            >
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
              <line x1="2" y1="3" x2="22" y2="17" />
            </svg>
            Stop Sharing
          </Button>
        ) : (
          <Button variant="outline" size="sm" onClick={onShareScreen}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              data-icon="inline-start"
            >
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            Share Screen
          </Button>
        )}

        {isAnalyzing ? (
          <Button variant="destructive" size="sm" onClick={onStopAnalysis}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              data-icon="inline-start"
            >
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
            Stop Analysis
          </Button>
        ) : (
          <Button
            variant="default"
            size="sm"
            onClick={onStartAnalysis}
            disabled={!isSharing}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              data-icon="inline-start"
            >
              <polygon points="6 3 20 12 6 21 6 3" />
            </svg>
            Start Analysis
          </Button>
        )}
      </div>
    </div>
  );
}
