"use client";

import { motion } from "framer-motion";
import {
  Video,
  Monitor,
  MonitorSmartphone,
  MessageSquare,
  KanbanSquare,
  Layout,
  BookOpen,
} from "lucide-react";

const integrations = [
  { name: "Zoom", icon: Video, color: "#2D8CFF" },
  { name: "Google Meet", icon: Monitor, color: "#00BFA5" },
  { name: "MS Teams", icon: MonitorSmartphone, color: "#6264A7" },
  { name: "Slack", icon: MessageSquare, color: "#E01E5A" },
  { name: "Jira", icon: KanbanSquare, color: "#0052CC" },
  { name: "Trello", icon: Layout, color: "#0079BF" },
  { name: "Notion", icon: BookOpen, color: "#FFFFFF" },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 150, damping: 15 },
  },
};

export default function IntegrationsSection() {
  return (
    <section id="integrations" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-accent/20 text-accent text-sm font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Ecosystem
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Seamless{" "}
            <span className="gradient-text">Integrations</span>
          </h2>
          <p className="text-dark-300 text-lg max-w-lg mx-auto">
            Connect with your favorite tools. MeetingMind AI works where your
            team already works.
          </p>
        </motion.div>

        {/* Integration cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="flex flex-wrap items-center justify-center gap-5"
        >
          {integrations.map((item) => (
            <motion.div
              key={item.name}
              variants={itemVariants}
              whileHover={{ scale: 1.08, y: -4 }}
              className="group relative"
            >
              {/* Glow on hover */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"
                style={{ background: `${item.color}20` }}
              />

              <div className="relative glass rounded-2xl p-6 w-[130px] h-[130px] flex flex-col items-center justify-center gap-3 group-hover:border-white/20 transition-all duration-300 cursor-pointer">
                <div
                  className="p-3 rounded-xl transition-all duration-300"
                  style={{
                    background: `${item.color}15`,
                  }}
                >
                  <item.icon
                    className="w-6 h-6 transition-colors duration-300"
                    style={{ color: item.color }}
                  />
                </div>
                <span className="text-xs font-medium text-dark-300 group-hover:text-white transition-colors">
                  {item.name}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Connecting line decoration */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="mt-12 mx-auto max-w-md h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
        />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="text-center text-sm text-dark-300 mt-6"
        >
          And many more integrations coming soon…
        </motion.p>
      </div>
    </section>
  );
}
