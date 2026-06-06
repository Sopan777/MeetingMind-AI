"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Video,
  AlertTriangle,
  CheckSquare,
  UserPlus,
  FileText,
  GitBranch,
  MessageSquare,
  Clock,
  TrendingUp,
  Smile,
  AlertCircle,
  Brain,
  Zap,
  Target,
} from "lucide-react";

type ActivityType =
  | "meeting"
  | "risk"
  | "action"
  | "team"
  | "document"
  | "decision"
  | "comment"
  | "overdue";

interface Activity {
  id: string;
  type: ActivityType;
  description: string;
  timestamp: string;
  detail?: string;
}

interface Insight {
  id: string;
  title: string;
  description: string;
  accentColor: string;
  icon: typeof TrendingUp;
}

const activityIcons: Record<ActivityType, typeof Video> = {
  meeting: Video,
  risk: AlertTriangle,
  action: CheckSquare,
  team: UserPlus,
  document: FileText,
  decision: GitBranch,
  comment: MessageSquare,
  overdue: Clock,
};

const activityColors: Record<ActivityType, string> = {
  meeting: "text-primary-200 bg-primary/10",
  risk: "text-amber-300 bg-amber-500/10",
  action: "text-emerald-300 bg-emerald-500/10",
  team: "text-secondary-200 bg-secondary/10",
  document: "text-accent-200 bg-accent/10",
  decision: "text-blue-300 bg-blue-500/10",
  comment: "text-slate-300 bg-slate-500/10",
  overdue: "text-red-300 bg-red-500/10",
};

const activities: Activity[] = [
  {
    id: "1",
    type: "meeting",
    description: 'Meeting "Sprint Planning" processed',
    timestamp: "2 min ago",
    detail: "12 action items · 3 decisions",
  },
  {
    id: "2",
    type: "risk",
    description: "New risk detected in Q4 Review",
    timestamp: "15 min ago",
    detail: "Budget overrun — high priority",
  },
  {
    id: "3",
    type: "action",
    description: "Action item assigned to Sarah",
    timestamp: "32 min ago",
    detail: "Update design system components",
  },
  {
    id: "4",
    type: "decision",
    description: "Decision logged: Migrate to v3 API",
    timestamp: "1 hour ago",
    detail: "Approved by engineering leads",
  },
  {
    id: "5",
    type: "team",
    description: "Marcus joined the Design team",
    timestamp: "2 hours ago",
  },
  {
    id: "6",
    type: "meeting",
    description: '"Product Roadmap" recording uploaded',
    timestamp: "3 hours ago",
    detail: "Processing transcript...",
  },
  {
    id: "7",
    type: "overdue",
    description: "3 action items overdue",
    timestamp: "5 hours ago",
    detail: "Needs attention from frontend team",
  },
  {
    id: "8",
    type: "comment",
    description: "Lisa commented on Design Review notes",
    timestamp: "6 hours ago",
    detail: '"I agree with the nav approach"',
  },
];

const insights: Insight[] = [
  {
    id: "1",
    title: "Meeting frequency up 23%",
    description:
      "Your team had 23% more meetings this month compared to last. Consider auditing recurring meetings for efficiency.",
    accentColor: "#6366F1",
    icon: TrendingUp,
  },
  {
    id: "2",
    title: "Team sentiment trending positive",
    description:
      "Overall sentiment across meetings improved by 15% this week. Engineering standup is the most positive.",
    accentColor: "#10B981",
    icon: Smile,
  },
  {
    id: "3",
    title: "5 overdue action items",
    description:
      "There are 5 action items past their due date. 3 are assigned to the frontend team, 2 to design.",
    accentColor: "#F59E0B",
    icon: AlertCircle,
  },
  {
    id: "4",
    title: "Decision velocity improved",
    description:
      "Average time from discussion to decision dropped from 3.2 days to 1.8 days this sprint.",
    accentColor: "#06B6D4",
    icon: Zap,
  },
  {
    id: "5",
    title: "Focus area: API migration",
    description:
      'Mentioned in 8 meetings this week. Key stakeholders: Alex, Sarah, Dev. Next milestone: "v3 endpoint rollout".',
    accentColor: "#8B5CF6",
    icon: Target,
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export default function ActivityFeed() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-dark-400" />
            Recent Activity
          </h2>
          <button className="text-xs text-primary-200 hover:text-primary-100 font-medium transition-colors">
            View all
          </button>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-1"
        >
          {activities.map((activity) => {
            const Icon = activityIcons[activity.type];
            const colorClass = activityColors[activity.type];

            return (
              <motion.div
                key={activity.id}
                variants={itemVariants}
                className={cn(
                  "flex items-start gap-3 px-3 py-3 rounded-xl",
                  "hover:bg-white/[0.03] transition-all duration-200 cursor-pointer group"
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5",
                    colorClass
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/90 font-medium leading-snug">
                    {activity.description}
                  </p>
                  {activity.detail && (
                    <p className="text-xs text-dark-400 mt-0.5 truncate">
                      {activity.detail}
                    </p>
                  )}
                </div>

                <span className="text-[11px] text-dark-300 whitespace-nowrap flex-shrink-0 pt-0.5">
                  {activity.timestamp}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>

      {/* Right: AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary-200" />
            AI Insights
          </h2>
          <span className="badge-primary">
            <Zap className="w-3 h-3 mr-1" />
            Live
          </span>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {insights.map((insight) => {
            const Icon = insight.icon;
            return (
              <motion.div
                key={insight.id}
                variants={itemVariants}
                whileHover={{ x: 4, transition: { duration: 0.15 } }}
                className={cn(
                  "relative flex items-start gap-3.5 px-4 py-3.5 rounded-xl",
                  "bg-white/[0.02] border border-white/[0.04]",
                  "hover:bg-white/[0.04] hover:border-white/[0.08]",
                  "transition-all duration-200 cursor-pointer group overflow-hidden"
                )}
              >
                {/* Left accent bar */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl"
                  style={{ backgroundColor: insight.accentColor }}
                />

                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: `${insight.accentColor}15`,
                    color: insight.accentColor,
                  }}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white leading-snug">
                    {insight.title}
                  </p>
                  <p className="text-xs text-dark-400 mt-1 leading-relaxed line-clamp-2">
                    {insight.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </div>
  );
}
