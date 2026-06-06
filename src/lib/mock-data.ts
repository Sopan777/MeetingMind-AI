export interface User {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Manager" | "Employee" | "Viewer";
  avatar?: string;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  duration: number;
  participants: string[];
  status: "processing" | "completed" | "failed";
  type: "standup" | "sprint-planning" | "retrospective" | "client-call" | "one-on-one" | "all-hands" | "design-review";
  qualityScore: number;
}

export interface TranscriptEntry {
  id: string;
  speaker: string;
  timestamp: string;
  text: string;
}

export interface ActionItem {
  id: string;
  meetingId: string;
  task: string;
  owner: string;
  deadline: string;
  status: "todo" | "in-progress" | "review" | "completed";
  priority: "low" | "medium" | "high" | "critical";
}

export interface Decision {
  id: string;
  meetingId: string;
  title: string;
  description: string;
  decidedBy: string;
  date: string;
  impact: "low" | "medium" | "high";
}

export interface Risk {
  id: string;
  meetingId: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  impact: string;
  recommendation: string;
  detectedPhrase: string;
}

export interface Notification {
  id: string;
  type: "meeting-processed" | "risk-detected" | "action-assigned" | "deadline-approaching";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface TeamMember extends User {
  joinedDate: string;
  meetingsAttended: number;
  tasksCompleted: number;
  status: "active" | "away" | "offline";
}

export interface Integration {
  id: string;
  name: string;
  icon: string;
  description: string;
  connected: boolean;
  category: "communication" | "project-management" | "calendar" | "documentation";
}

export interface AnalyticsData {
  meetingCounts: { month: string; count: number }[];
  participationData: { name: string; meetings: number; talkTime: number }[];
  sentimentTrend: { month: string; positive: number; neutral: number; negative: number }[];
  riskTrend: { month: string; low: number; medium: number; high: number; critical: number }[];
  taskCompletion: { status: string; count: number; color: string }[];
  decisionFrequency: { month: string; decisions: number }[];
}

export interface MeetingSummary {
  executive: string;
  technical: string;
  client: string;
}

export interface ModelMetrics {
  modelVersion: string;
  accuracy: number;
  inferenceCount: number;
  avgLatency: number;
  failureRate: number;
  retrainingStatus: string;
  lastRetrained: string;
  metrics: { date: string; accuracy: number; latency: number }[];
}

export const currentUser: User = {
  id: "user-1",
  name: "Alex Chen",
  email: "alex@meetingmind.ai",
  role: "Admin",
};

export const meetings: Meeting[] = [
  { id: "meeting-1", title: "Sprint Planning - Q4 Release", date: "2024-12-10T10:00:00Z", duration: 75, participants: ["Alex Chen", "Sarah Kim", "Mike Rodriguez", "Priya Patel"], status: "completed", type: "sprint-planning", qualityScore: 88 },
  { id: "meeting-2", title: "Client Onboarding - Acme Corp", date: "2024-12-09T14:00:00Z", duration: 45, participants: ["Alex Chen", "Emma Wilson", "David Park"], status: "completed", type: "client-call", qualityScore: 82 },
  { id: "meeting-3", title: "Weekly Standup - Engineering", date: "2024-12-08T09:00:00Z", duration: 15, participants: ["Alex Chen", "Sarah Kim", "Mike Rodriguez", "Priya Patel", "David Park"], status: "completed", type: "standup", qualityScore: 75 },
  { id: "meeting-4", title: "Q4 Budget Review", date: "2024-12-07T13:00:00Z", duration: 60, participants: ["Alex Chen", "Lisa Wang", "James Lee"], status: "completed", type: "all-hands", qualityScore: 90 },
  { id: "meeting-5", title: "Product Roadmap Discussion", date: "2024-12-06T11:00:00Z", duration: 90, participants: ["Alex Chen", "Sarah Kim", "Emma Wilson"], status: "completed", type: "sprint-planning", qualityScore: 85 },
  { id: "meeting-6", title: "Design System Workshop", date: "2024-12-05T15:00:00Z", duration: 45, participants: ["Sarah Kim", "David Park", "Emma Wilson"], status: "completed", type: "retrospective", qualityScore: 78 },
  { id: "meeting-7", title: "Security Audit Follow-up", date: "2024-12-04T10:30:00Z", duration: 30, participants: ["Alex Chen", "Mike Rodriguez"], status: "processing", type: "one-on-one", qualityScore: 0 },
  { id: "meeting-8", title: "All-Hands Meeting - December", date: "2024-12-03T16:00:00Z", duration: 60, participants: ["Alex Chen", "Sarah Kim", "Mike Rodriguez", "Priya Patel", "David Park", "Emma Wilson", "James Lee", "Lisa Wang"], status: "completed", type: "all-hands", qualityScore: 92 },
];

export const transcript: TranscriptEntry[] = [
  { id: "t1", speaker: "Alex Chen", timestamp: "00:00:12", text: "Alright everyone, let's kick off our sprint planning for the Q4 release." },
  { id: "t2", speaker: "Alex Chen", timestamp: "00:00:30", text: "First, let's review what we accomplished last sprint and any carry-overs." },
  { id: "t3", speaker: "Sarah Kim", timestamp: "00:01:15", text: "The frontend redesign is about 80% complete. We still need to finalize the dashboard components." },
  { id: "t4", speaker: "Mike Rodriguez", timestamp: "00:02:00", text: "I've been working on the API integration for the payment gateway. We're blocked by the third-party SDK issue." },
  { id: "t5", speaker: "Priya Patel", timestamp: "00:02:45", text: "The authentication flow redesign is done. I'll need someone to review the PR." },
  { id: "t6", speaker: "Alex Chen", timestamp: "00:03:30", text: "Great progress. Mike, what's the timeline for resolving the SDK issue?" },
  { id: "t7", speaker: "Mike Rodriguez", timestamp: "00:04:00", text: "I've reached out to their support team. Expecting a fix by end of week. This is our biggest blocker right now." },
  { id: "t8", speaker: "Sarah Kim", timestamp: "00:05:15", text: "For the dashboard, I recommend we adopt TypeScript for all new components going forward." },
  { id: "t9", speaker: "Alex Chen", timestamp: "00:06:00", text: "That's a good idea. Let's make that a team decision. All in favor? Great, TypeScript it is." },
  { id: "t10", speaker: "Priya Patel", timestamp: "00:07:30", text: "We should also consider the deployment timeline. The current CI/CD pipeline needs updates for microservices." },
];

export const actionItems: ActionItem[] = [
  { id: "ai-1", meetingId: "meeting-1", task: "Complete API integration for payment gateway", owner: "Mike Rodriguez", deadline: "2024-12-20T00:00:00Z", status: "in-progress", priority: "critical" },
  { id: "ai-2", meetingId: "meeting-1", task: "Update design system documentation", owner: "Sarah Kim", deadline: "2024-12-18T00:00:00Z", status: "todo", priority: "high" },
  { id: "ai-3", meetingId: "meeting-1", task: "Fix authentication flow bug on mobile", owner: "Priya Patel", deadline: "2024-12-15T00:00:00Z", status: "review", priority: "high" },
  { id: "ai-4", meetingId: "meeting-1", task: "Set up TypeScript strict mode for frontend", owner: "Sarah Kim", deadline: "2024-12-22T00:00:00Z", status: "todo", priority: "medium" },
  { id: "ai-5", meetingId: "meeting-2", task: "Prepare client onboarding materials", owner: "Emma Wilson", deadline: "2024-12-16T00:00:00Z", status: "completed", priority: "medium" },
  { id: "ai-6", meetingId: "meeting-2", task: "Schedule follow-up demo with Acme Corp", owner: "David Park", deadline: "2024-12-19T00:00:00Z", status: "in-progress", priority: "high" },
  { id: "ai-7", meetingId: "meeting-3", task: "Deploy hotfix for production API", owner: "Mike Rodriguez", deadline: "2024-12-09T00:00:00Z", status: "completed", priority: "critical" },
  { id: "ai-8", meetingId: "meeting-4", task: "Submit revised Q4 budget proposal", owner: "Lisa Wang", deadline: "2024-12-14T00:00:00Z", status: "review", priority: "high" },
];

export const decisions: Decision[] = [
  { id: "d-1", meetingId: "meeting-1", title: "Migrate to microservices architecture", description: "Team agreed to break the monolith into microservices for the payment module.", decidedBy: "Alex Chen", date: "2024-12-10T00:00:00Z", impact: "high" },
  { id: "d-2", meetingId: "meeting-1", title: "Adopt TypeScript for all new frontend code", description: "All new components and features will use TypeScript with strict mode.", decidedBy: "Sarah Kim", date: "2024-12-10T00:00:00Z", impact: "medium" },
  { id: "d-3", meetingId: "meeting-4", title: "Delay Q4 launch by 2 weeks", description: "Additional time needed for security audit and performance testing.", decidedBy: "Alex Chen", date: "2024-12-07T00:00:00Z", impact: "high" },
];

export const risks: Risk[] = [
  { id: "r-1", meetingId: "meeting-1", title: "API integration delayed", description: "Third-party payment SDK has unresolved bugs.", severity: "high", impact: "May delay Q4 release by 1-2 weeks", recommendation: "Explore alternative payment providers as backup", detectedPhrase: "blocked by the third-party SDK issue" },
  { id: "r-2", meetingId: "meeting-1", title: "Resource constraint for testing", description: "QA team is understaffed for the security audit.", severity: "medium", impact: "Could miss critical security vulnerabilities", recommendation: "Hire contract QA engineers for December", detectedPhrase: "need additional QA resources" },
  { id: "r-3", meetingId: "meeting-4", title: "Budget overrun risk", description: "Q4 marketing spend exceeding projections.", severity: "high", impact: "May need to cut features or delay campaigns", recommendation: "Review and prioritize marketing initiatives", detectedPhrase: "exceeding projections" },
];

export const notifications: Notification[] = [
  { id: "n-1", type: "meeting-processed", title: "Meeting Processed", message: "Sprint Planning - Q4 Release has been processed.", timestamp: "2024-12-10T12:00:00Z", read: false },
  { id: "n-2", type: "risk-detected", title: "New Risk Detected", message: "High severity risk identified in Q4 Budget Review.", timestamp: "2024-12-07T14:30:00Z", read: false },
  { id: "n-3", type: "action-assigned", title: "Action Item Assigned", message: "You have been assigned: Complete API integration.", timestamp: "2024-12-10T11:45:00Z", read: true },
  { id: "n-4", type: "deadline-approaching", title: "Deadline Approaching", message: "Fix authentication flow bug is due in 2 days.", timestamp: "2024-12-13T09:00:00Z", read: false },
];

export const teamMembers: TeamMember[] = [
  { id: "1", name: "Alex Chen", email: "alex@meetingmind.ai", role: "Admin", status: "active", meetingsAttended: 42, tasksCompleted: 38, joinedDate: "2023-01-15T00:00:00Z" },
  { id: "2", name: "Sarah Kim", email: "sarah@meetingmind.ai", role: "Manager", status: "active", meetingsAttended: 38, tasksCompleted: 35, joinedDate: "2023-03-10T00:00:00Z" },
  { id: "3", name: "Mike Rodriguez", email: "mike@meetingmind.ai", role: "Employee", status: "active", meetingsAttended: 35, tasksCompleted: 28, joinedDate: "2023-05-20T00:00:00Z" },
  { id: "4", name: "Priya Patel", email: "priya@meetingmind.ai", role: "Employee", status: "away", meetingsAttended: 30, tasksCompleted: 32, joinedDate: "2023-07-01T00:00:00Z" },
  { id: "5", name: "David Park", email: "david@meetingmind.ai", role: "Employee", status: "active", meetingsAttended: 28, tasksCompleted: 22, joinedDate: "2023-09-15T00:00:00Z" },
];

export const integrations: Integration[] = [
  { id: "i-1", name: "Zoom", icon: "Video", description: "Automatically import Zoom cloud recordings", connected: true, category: "communication" },
  { id: "i-2", name: "Google Meet", icon: "Monitor", description: "Record and import Google Meet calls", connected: false, category: "communication" },
  { id: "i-3", name: "Microsoft Teams", icon: "MonitorSmartphone", description: "Sync Teams meeting transcripts", connected: false, category: "communication" },
  { id: "i-4", name: "Slack", icon: "MessageSquare", description: "Send meeting summaries to Slack channels", connected: true, category: "communication" },
  { id: "i-5", name: "Jira", icon: "SquareKanban", description: "Create Jira issues from action items", connected: true, category: "project-management" },
  { id: "i-6", name: "Trello", icon: "Trello", description: "Create Trello cards for tasks", connected: false, category: "project-management" },
  { id: "i-7", name: "Notion", icon: "BookOpen", description: "Export meeting notes to Notion pages", connected: false, category: "documentation" },
];

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const analyticsData: AnalyticsData = {
  meetingCounts: months.map((m, i) => ({ month: m, count: [12, 15, 18, 22, 20, 25, 28, 30, 32, 35, 38, 42][i] })),
  participationData: [
    { name: "Alex C.", meetings: 42, talkTime: 35 },
    { name: "Sarah K.", meetings: 38, talkTime: 25 },
    { name: "Mike R.", meetings: 35, talkTime: 20 },
    { name: "Priya P.", meetings: 30, talkTime: 15 },
  ],
  sentimentTrend: months.map((m, i) => ({ month: m, positive: [60,62,58,65,68,70,72,75,73,78,80,82][i], neutral: [25,24,28,22,20,18,17,15,17,14,12,11][i], negative: [15,14,14,13,12,12,11,10,10,8,8,7][i] })),
  riskTrend: months.map((m, i) => ({ month: m, low: [5,6,4,7,5,6,8,5,4,6,5,4][i], medium: [3,4,3,5,4,3,4,3,2,3,3,2][i], high: [2,1,2,2,1,2,1,1,1,1,0,1][i], critical: [0,1,0,1,0,0,1,0,0,0,0,0][i] })),
  taskCompletion: [
    { status: "Completed", count: 85, color: "#10B981" },
    { status: "In Progress", count: 32, color: "#6366F1" },
    { status: "Review", count: 18, color: "#8B5CF6" },
    { status: "To Do", count: 25, color: "#64748B" },
  ],
  decisionFrequency: months.map((m, i) => ({ month: m, decisions: [8,10,12,15,13,16,18,20,19,22,24,26][i] })),
};

export const meetingSummaries: Record<string, MeetingSummary> = {
  "meeting-1": {
    executive: "The sprint planning session covered Q4 release priorities. Key decisions include migrating to microservices architecture and adopting TypeScript. Three critical risks were identified, with mitigation plans in place. Overall team alignment is strong with 8 action items assigned.",
    technical: "Technical discussion focused on API integration for the payment gateway using Stripe SDK v3. Frontend will migrate to TypeScript with strict mode. Database schema changes needed for the new analytics module. Performance optimization deferred to Sprint 4. CI/CD pipeline updates required for the new microservices.",
    client: "The team is making excellent progress on the Q4 release. All core features are on track for the December deadline. We've identified and are actively mitigating potential risks around third-party dependencies. Next check-in scheduled for Wednesday.",
  }
};

export const modelMetrics: ModelMetrics = {
  modelVersion: "v2.4.1",
  accuracy: 94.2,
  inferenceCount: 1254300,
  avgLatency: 245,
  failureRate: 0.02,
  retrainingStatus: "Scheduled",
  lastRetrained: "2024-12-01T00:00:00Z",
  metrics: [
    { date: "2024-11-25", accuracy: 93.8, latency: 250 },
    { date: "2024-11-26", accuracy: 93.9, latency: 248 },
    { date: "2024-11-27", accuracy: 94.0, latency: 246 },
    { date: "2024-11-28", accuracy: 94.1, latency: 245 },
    { date: "2024-11-29", accuracy: 94.2, latency: 245 },
    { date: "2024-11-30", accuracy: 94.1, latency: 247 },
    { date: "2024-12-01", accuracy: 94.2, latency: 245 },
  ],
};
