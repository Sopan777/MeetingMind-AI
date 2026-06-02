"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ActionItem {
  owner: string;
  task: string;
  deadline: string;
}

interface Decision {
  decision: string;
  timestamp: string;
}

interface Risk {
  description: string;
  timestamp: string;
}

interface InsightsPanelsProps {
  actionItems: ActionItem[];
  decisions: Decision[];
  risks: Risk[];
}

function CheckCircleIcon() {
  return (
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
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function ScaleIcon() {
  return (
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
      <path d="M12 3v18" />
      <path d="M5 6l7-3 7 3" />
      <path d="M2 12l3-6 3 6a5.12 5.12 0 0 1-6 0z" />
      <path d="M16 12l3-6 3 6a5.12 5.12 0 0 1-6 0z" />
    </svg>
  );
}

function AlertTriangleIcon() {
  return (
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
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-24 items-center justify-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}

export function InsightsPanels({
  actionItems,
  decisions,
  risks,
}: InsightsPanelsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Action Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-400">
            <CheckCircleIcon />
            Action Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          {actionItems.length === 0 ? (
            <EmptyState message="No action items detected." />
          ) : (
            <div className="space-y-3">
              {actionItems.map((item, i) => (
                <div key={i}>
                  {i > 0 && <Separator className="mb-3" />}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {item.owner}
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground">{item.task}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.deadline}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Decisions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-400">
            <ScaleIcon />
            Decisions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {decisions.length === 0 ? (
            <EmptyState message="No decisions detected." />
          ) : (
            <div className="space-y-3">
              {decisions.map((item, i) => (
                <div key={i}>
                  {i > 0 && <Separator className="mb-3" />}
                  <div className="space-y-1">
                    <p className="text-sm text-foreground">{item.decision}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Risks & Blockers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-400">
            <AlertTriangleIcon />
            Risks & Blockers
          </CardTitle>
        </CardHeader>
        <CardContent>
          {risks.length === 0 ? (
            <EmptyState message="No risks detected." />
          ) : (
            <div className="space-y-3">
              {risks.map((item, i) => (
                <div key={i}>
                  {i > 0 && <Separator className="mb-3" />}
                  <div className="space-y-1">
                    <p className="text-sm text-foreground">
                      {item.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export type { ActionItem, Decision, Risk };
