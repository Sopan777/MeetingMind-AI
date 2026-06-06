"use client";

import { motion } from "framer-motion";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Cpu, Activity, Gauge, AlertCircle,
  CheckCircle2, Clock, RefreshCw, Server,
} from "lucide-react";
import { modelMetrics } from "@/lib/mock-data";

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

const inferenceData = [
  { endpoint: "transcribe", count: 12400 },
  { endpoint: "analyze", count: 9800 },
  { endpoint: "summarize", count: 8200 },
  { endpoint: "detect-risks", count: 6500 },
  { endpoint: "extract-actions", count: 11200 },
];

const retrainingHistory = [
  { date: "2024-12-01", status: "success", accuracy: 94.2, duration: "2h 15m" },
  { date: "2024-11-15", status: "success", accuracy: 93.8, duration: "2h 30m" },
  { date: "2024-11-01", status: "failed", accuracy: 91.2, duration: "1h 45m" },
  { date: "2024-10-15", status: "success", accuracy: 93.1, duration: "2h 10m" },
];

const systemHealth = [
  { label: "GPU Utilization", value: 67, color: "#6366F1" },
  { label: "Memory Usage", value: 54, color: "#8B5CF6" },
  { label: "Queue Depth", value: 12, max: 100, color: "#06B6D4" },
];

export default function MLOpsPage() {
  const stats = [
    { label: "Model Version", value: modelMetrics.modelVersion, icon: Cpu, color: "text-primary" },
    { label: "Accuracy", value: `${modelMetrics.accuracy}%`, icon: Activity, color: "text-emerald-400" },
    { label: "Inference Count", value: modelMetrics.inferenceCount.toLocaleString(), icon: Gauge, color: "text-accent" },
    { label: "Avg Latency", value: `${modelMetrics.avgLatency}ms`, icon: Clock, color: "text-amber-400" },
    { label: "Failure Rate", value: `${modelMetrics.failureRate}%`, icon: AlertCircle, color: "text-rose-400" },
    { label: "Retraining", value: modelMetrics.retrainingStatus, icon: RefreshCw, color: "text-secondary" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">MLOps Dashboard</h1>
        <p className="text-slate-400 mt-1">Model performance and operations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="stat-card text-center"
            >
              <Icon className={`w-5 h-5 ${stat.color} mx-auto mb-2`} />
              <p className="text-lg font-bold text-white">{stat.value}</p>
              <p className="text-[10px] text-slate-400 mt-1">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <h3 className="font-semibold text-white mb-1">Model Performance</h3>
          <p className="text-xs text-slate-400 mb-4">Accuracy & latency over time</p>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={modelMetrics.metrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" tick={{ fill: "#94A3B8", fontSize: 10 }} />
              <YAxis yAxisId="left" tick={{ fill: "#94A3B8", fontSize: 10 }} domain={[85, 100]} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: "#94A3B8", fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Line yAxisId="left" type="monotone" dataKey="accuracy" name="Accuracy %" stroke="#10B981" strokeWidth={2} dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="latency" name="Latency ms" stroke="#F59E0B" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Inference Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <h3 className="font-semibold text-white mb-1">Inference Distribution</h3>
          <p className="text-xs text-slate-400 mb-4">Requests by endpoint</p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={inferenceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="endpoint" tick={{ fill: "#94A3B8", fontSize: 10 }} />
              <YAxis tick={{ fill: "#94A3B8", fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Requests" fill="#6366F1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Retraining History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <h3 className="font-semibold text-white mb-4">Retraining History</h3>
          <div className="space-y-3">
            {retrainingHistory.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl bg-dark/50 border border-white/5"
              >
                {item.status === "success" ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white">
                      {new Date(item.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span
                      className={`badge ${
                        item.status === "success" ? "badge-success" : "badge-danger"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <div className="flex gap-4 text-xs text-slate-400 mt-1">
                    <span>Accuracy: {item.accuracy}%</span>
                    <span>Duration: {item.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* System Health */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <div className="flex items-center gap-2 mb-4">
            <Server className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-white">System Health</h3>
          </div>
          <div className="space-y-6">
            {systemHealth.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-300">{item.label}</span>
                  <span className="text-sm font-mono" style={{ color: item.color }}>
                    {item.value}%
                  </span>
                </div>
                <div className="h-2 bg-dark-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: item.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-sm text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              All systems operational
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
