"use client";

import { useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TranscriptSegment {
  timestamp: string;
  speaker: string;
  text: string;
}

interface TranscriptPanelProps {
  segments: TranscriptSegment[];
}

export function TranscriptPanel({ segments }: TranscriptPanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [segments]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Transcript
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="max-h-[400px] overflow-auto">
          {segments.length === 0 ? (
            <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
              Waiting for transcript…
            </div>
          ) : (
            <div className="space-y-4 pr-3">
              {segments.map((segment, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs text-muted-foreground font-mono">
                      {segment.timestamp}
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      {segment.speaker}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed pl-0">
                    {segment.text}
                  </p>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export type { TranscriptSegment };
