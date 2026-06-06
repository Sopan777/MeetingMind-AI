"use client";

import { motion } from "framer-motion";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { TrendingUp, Award } from "lucide-react";
import { analyticsData } from "@/lib/mock-data";

const COLORS = {
  primary: "#6366F1",
  secondary: "#8B5CF6",
  accent: "#06B6D4",
  amber: "#F59E0B",
  emerald: "#10B981",
  rose: "#F43F5E",
  slate: "#64748B",
};

const qualityMetrics = [
  { label: "Participation Balance", score: 82, color: COLORS.primary },
  { label: "Action Clarity", score: 91, color: COLORS.emerald },
  { label: "Decision Quality", score: 78, color: COLORS.secondary },
  { label: "Risk Awareness", score: 85, color: COLORS.accent },
  { label: "Overall Productivity", score: 88, color: COLORS.amber },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong rounded-lg px-3 py-2 text-xs">
      <p className="text-slate-300 mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="font-medium">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

export default function AnalyticsPage() {
  const overallScore = Math.round(
    qualityMetrics.reduce((s, m) => s + m.score, 0) / qualityMetrics.length
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-slate-400 mt-1">Meeting intelligence insights</p>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Meeting Count */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <h3 className="font-semibold text-white mb-1">Meeting Trends</h3>
          <p className="text-xs text-slate-400 mb-4">Monthly meeting count</p>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={analyticsData.meetingCounts}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" tick={{ fill: "#94A3B8", fontSize: 11 }} />
              <YAxis tick={{ fill: "#94A3B8", fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="count"
                name="Meetings"
                stroke={COLORS.primary}
                strokeWidth={2}
                dot={{ fill: COLORS.primary, r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Team Participation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <h3 className="font-semibold text-white mb-1">Team Participation</h3>
          <p className="text-xs text-slate-400 mb-4">Meetings attended per member</p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analyticsData.participationData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis type="number" tick={{ fill: "#94A3B8", fontSize: 11 }} />
              <YAxis dataKey="name" type="category" tick={{ fill: "#94A3B8", fontSize: 11 }} width={80} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="meetings" name="Meetings" fill={COLORS.secondary} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Sentiment Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <h3 className="font-semibold text-white mb-1">Sentiment Trend</h3>
          <p className="text-xs text-slate-400 mb-4">Team sentiment over time</p>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={analyticsData.sentimentTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" tick={{ fill: "#94A3B8", fontSize: 11 }} />
              <YAxis tick={{ fill: "#94A3B8", fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="positive" name="Positive" stackId="1" stroke={COLORS.emerald} fill={COLORS.emerald + "40"} />
              <Area type="monotone" dataKey="neutral" name="Neutral" stackId="1" stroke={COLORS.amber} fill={COLORS.amber + "40"} />
              <Area type="monotone" dataKey="negative" name="Negative" stackId="1" stroke={COLORS.rose} fill={COLORS.rose + "40"} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Risk Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <h3 className="font-semibold text-white mb-1">Risk Trend</h3>
          <p className="text-xs text-slate-400 mb-4">Risk levels over time</p>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={analyticsData.riskTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" tick={{ fill: "#94A3B8", fontSize: 11 }} />
              <YAxis tick={{ fill: "#94A3B8", fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: "#94A3B8" }} />
              <Line type="monotone" dataKey="low" name="Low" stroke={COLORS.emerald} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="medium" name="Medium" stroke={COLORS.amber} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="high" name="High" stroke="#F97316" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="critical" name="Critical" stroke={COLORS.rose} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Task Completion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <h3 className="font-semibold text-white mb-1">Task Completion</h3>
          <p className="text-xs text-slate-400 mb-4">Action items by status</p>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={analyticsData.taskCompletion}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="count"
                nameKey="status"
              >
                {analyticsData.taskCompletion.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: "#94A3B8" }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Decision Frequency */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <h3 className="font-semibold text-white mb-1">Decision Frequency</h3>
          <p className="text-xs text-slate-400 mb-4">Decisions per month</p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analyticsData.decisionFrequency}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" tick={{ fill: "#94A3B8", fontSize: 11 }} />
              <YAxis tick={{ fill: "#94A3B8", fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="decisions" name="Decisions" fill={COLORS.accent} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Meeting Quality Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card"
      >
        <div className="flex items-center gap-2 mb-6">
          <Award className="w-5 h-5 text-amber-400" />
          <h3 className="font-semibold text-white text-lg">
            Meeting Quality Score
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Score Circle */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-36 h-36">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#334155" strokeWidth="8" />
                <circle
                  cx="60" cy="60" r="52" fill="none"
                  stroke={overallScore >= 80 ? COLORS.emerald : overallScore >= 60 ? COLORS.amber : COLORS.rose}
                  strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${(overallScore / 100) * 327} 327`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white">{overallScore}</span>
                <span className="text-xs text-slate-400">/ 100</span>
              </div>
            </div>
            <p className="text-sm text-emerald-400 mt-2 font-medium flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Above average
            </p>
          </div>

          {/* Metric Bars */}
          <div className="col-span-2 space-y-4">
            {qualityMetrics.map((metric) => (
              <div key={metric.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-300">{metric.label}</span>
                  <span className="text-sm font-medium" style={{ color: metric.color }}>
                    {metric.score}%
                  </span>
                </div>
                <div className="h-2 bg-dark-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: metric.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.score}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                </div>
              </div>
            ))}

            <div className="mt-4 p-3 rounded-xl bg-primary/5 border border-primary/10">
              <p className="text-sm text-slate-300">
                <span className="text-primary font-medium">AI Recommendation:</span>{" "}
                Consider allocating more time for risk discussion in future meetings.
                Action items could benefit from clearer ownership assignments.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
