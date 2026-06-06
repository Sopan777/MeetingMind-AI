"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";

const pageTitles: Record<string, { title: string; subtitle?: string }> = {
  "/dashboard": { title: "Dashboard", subtitle: "Your meeting intelligence overview" },
  "/dashboard/meetings": { title: "Meetings", subtitle: "All recorded meetings and transcripts" },
  "/dashboard/analytics": { title: "Analytics", subtitle: "Meeting insights and performance metrics" },
  "/dashboard/tasks": { title: "Tasks", subtitle: "Action items and follow-ups" },
  "/dashboard/integrations": { title: "Integrations", subtitle: "Connected tools and services" },
  "/dashboard/team": { title: "Team", subtitle: "Team members and permissions" },
  "/dashboard/settings": { title: "Settings", subtitle: "Account and workspace settings" },
  "/dashboard/mlops": { title: "MLOps", subtitle: "AI model monitoring and pipeline management" },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();

  const pageInfo = pageTitles[pathname] || { title: "Dashboard" };

  return (
    <div className="flex min-h-screen bg-[#0F172A]">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <motion.main
        initial={false}
        animate={{
          marginLeft: sidebarCollapsed ? 72 : 280,
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="flex-1 min-h-screen flex flex-col"
      >
        <TopBar title={pageInfo.title} subtitle={pageInfo.subtitle} />

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-8 py-6">
            {children}
          </div>
        </div>
      </motion.main>
    </div>
  );
}
