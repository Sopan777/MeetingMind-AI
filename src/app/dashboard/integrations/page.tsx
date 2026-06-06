"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Video, Monitor, MonitorSmartphone, MessageSquare,
  SquareKanban, Trello, BookOpen, CheckCircle2, XCircle,
} from "lucide-react";
import { integrations, type Integration } from "@/lib/mock-data";

const iconMap: Record<string, any> = {
  Video, Monitor, MonitorSmartphone, MessageSquare,
  SquareKanban, Trello, BookOpen,
};

const categories = ["all", "communication", "project-management", "calendar", "documentation"];

export default function IntegrationsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [items, setItems] = useState<Integration[]>(integrations);

  const filtered =
    activeCategory === "all"
      ? items
      : items.filter((i) => i.category === activeCategory);

  const toggle = (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, connected: !i.connected } : i))
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Integrations</h1>
        <p className="text-slate-400 mt-1">Connect your favorite tools</p>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
              activeCategory === cat
                ? "bg-primary/20 text-primary-200 border border-primary/30"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {cat.replace("-", " ")}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((item, i) => {
          const Icon = iconMap[item.icon] || Monitor;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card-hover"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary-200" />
                </div>
                <span
                  className={`badge ${
                    item.connected ? "badge-success" : "bg-slate-500/20 text-slate-400"
                  }`}
                >
                  {item.connected ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Connected
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <XCircle className="w-3 h-3" /> Disconnected
                    </span>
                  )}
                </span>
              </div>

              <h3 className="font-semibold text-white mb-1">{item.name}</h3>
              <p className="text-sm text-slate-400 mb-4">{item.description}</p>

              <div className="flex items-center justify-between">
                <span className="badge bg-dark-100 text-slate-400 capitalize">
                  {item.category.replace("-", " ")}
                </span>
                <button
                  onClick={() => toggle(item.id)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    item.connected
                      ? "text-red-400 hover:bg-red-500/10 border border-red-500/20"
                      : "btn-primary !py-1.5 !px-4"
                  }`}
                >
                  {item.connected ? "Disconnect" : "Connect"}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
