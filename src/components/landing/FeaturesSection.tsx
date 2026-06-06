"use client";

import { motion } from "framer-motion";
import {
  Mic,
  CheckSquare,
  GitBranch,
  AlertTriangle,
  BarChart3,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  iconColor: string;
}

const features: Feature[] = [
  {
    title: "Smart Transcription",
    description:
      "Convert audio and video meetings into highly accurate, speaker-labeled transcripts in real time.",
    icon: Mic,
    gradient: "from-primary/20 to-secondary/10",
    iconColor: "text-primary",
  },
  {
    title: "AI Action Items",
    description:
      "Automatically detect tasks, assigned owners, and deadlines — so nothing falls through the cracks.",
    icon: CheckSquare,
    gradient: "from-emerald-500/20 to-accent/10",
    iconColor: "text-emerald-400",
  },
  {
    title: "Decision Tracking",
    description:
      "Capture every important decision discussed in meetings with full context and stakeholder attribution.",
    icon: GitBranch,
    gradient: "from-secondary/20 to-pink-500/10",
    iconColor: "text-secondary",
  },
  {
    title: "Risk Detection",
    description:
      "Identify blockers, delays, dependencies, and potential risks before they derail your projects.",
    icon: AlertTriangle,
    gradient: "from-amber-500/20 to-orange-500/10",
    iconColor: "text-amber-400",
  },
  {
    title: "Meeting Analytics",
    description:
      "Track participation rates, talk-time distribution, meeting quality scores, and sentiment trends.",
    icon: BarChart3,
    gradient: "from-accent/20 to-primary/10",
    iconColor: "text-accent",
  },
  {
    title: "Workflow Automation",
    description:
      "Automatically create Jira tickets, Trello cards, Slack updates, and email summaries from meetings.",
    icon: Zap,
    gradient: "from-yellow-500/20 to-amber-500/10",
    iconColor: "text-yellow-400",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px]" />
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-primary/20 text-primary text-sm font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Powerful Features
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Everything You Need to{" "}
            <span className="gradient-text">Master Meetings</span>
          </h2>
          <p className="text-dark-300 text-lg max-w-2xl mx-auto">
            From transcription to automation, MeetingMind AI covers every aspect
            of your meeting workflow with intelligent, context-aware AI.
          </p>
        </motion.div>

        {/* Feature cards grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="group relative"
            >
              {/* Hover glow */}
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-primary/20 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />

              <div className="relative glass rounded-2xl p-7 h-full group-hover:border-primary/20 transition-all duration-300">
                {/* Icon */}
                <div
                  className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-5 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon
                    className={`w-6 h-6 ${feature.iconColor}`}
                  />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:gradient-text transition-all duration-300">
                  {feature.title}
                </h3>
                <p className="text-sm text-dark-300 leading-relaxed">
                  {feature.description}
                </p>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-primary/0 to-transparent group-hover:via-primary/30 transition-all duration-500" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
