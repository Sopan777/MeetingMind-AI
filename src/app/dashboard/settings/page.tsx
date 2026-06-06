"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  User, Bell, Palette, Key, Trash2,
  Moon, Sun, Monitor, Eye, EyeOff, RefreshCw,
  Save, Camera,
} from "lucide-react";

export default function SettingsPage() {
  const [name, setName] = useState("Alex Chen");
  const [email, setEmail] = useState("alex@meetingmind.ai");
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    slack: false,
  });
  const [theme, setTheme] = useState("dark");
  const [showApiKey, setShowApiKey] = useState(false);
  const apiKey = "mm_live_sk_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6";

  const sections = [
    {
      id: "profile",
      icon: User,
      title: "Profile",
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl font-bold text-white">
                AC
              </div>
              <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-dark-50 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Camera className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
            <div>
              <p className="font-medium text-white">Alex Chen</p>
              <p className="text-sm text-slate-400">Admin</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Full Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-glass"
              />
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-glass"
              />
            </div>
          </div>
          <button className="btn-primary flex items-center gap-2 w-fit">
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      ),
    },
    {
      id: "notifications",
      icon: Bell,
      title: "Notifications",
      content: (
        <div className="space-y-4">
          {Object.entries(notifications).map(([key, val]) => (
            <div
              key={key}
              className="flex items-center justify-between py-2"
            >
              <div>
                <p className="text-sm font-medium text-white capitalize">
                  {key} Notifications
                </p>
                <p className="text-xs text-slate-400">
                  Receive {key} notifications for updates
                </p>
              </div>
              <button
                onClick={() =>
                  setNotifications((prev) => ({
                    ...prev,
                    [key]: !prev[key as keyof typeof prev],
                  }))
                }
                className={`w-11 h-6 rounded-full transition-all relative ${
                  val ? "bg-primary" : "bg-dark-100"
                }`}
              >
                <motion.div
                  className="w-5 h-5 rounded-full bg-white absolute top-0.5"
                  animate={{ left: val ? 22 : 2 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "appearance",
      icon: Palette,
      title: "Appearance",
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-400">Theme</p>
          <div className="flex gap-3">
            {[
              { key: "dark", icon: Moon, label: "Dark" },
              { key: "light", icon: Sun, label: "Light" },
              { key: "system", icon: Monitor, label: "System" },
            ].map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.key}
                  onClick={() => setTheme(t.key)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    theme === t.key
                      ? "bg-primary/20 text-primary-200 border border-primary/30"
                      : "glass text-slate-400 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {t.label}
                </button>
              );
            })}
          </div>
          <p className="text-sm text-slate-400 mt-4">Accent Color</p>
          <div className="flex gap-3">
            {["#6366F1", "#8B5CF6", "#06B6D4", "#10B981", "#F59E0B", "#F43F5E"].map(
              (c) => (
                <button
                  key={c}
                  className="w-8 h-8 rounded-full border-2 border-white/10 hover:border-white/30 transition-colors"
                  style={{ backgroundColor: c }}
                />
              )
            )}
          </div>
        </div>
      ),
    },
    {
      id: "api",
      icon: Key,
      title: "API Keys",
      content: (
        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-400 mb-1 block">
              API Key
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  readOnly
                  className="input-glass pr-10 font-mono text-sm"
                />
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showApiKey ? (
                    <EyeOff className="w-4 h-4 text-slate-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-slate-400" />
                  )}
                </button>
              </div>
              <button className="btn-secondary flex items-center gap-2">
                <RefreshCw className="w-4 h-4" /> Regenerate
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Last used: 2 hours ago
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "danger",
      icon: Trash2,
      title: "Danger Zone",
      content: (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-red-400">Delete Account</p>
            <p className="text-xs text-slate-400">
              Permanently delete your account and all data
            </p>
          </div>
          <button className="px-4 py-2 rounded-xl text-sm font-medium text-red-400 border border-red-500/20 hover:bg-red-500/10 transition-all">
            Delete Account
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-slate-400 mt-1">Manage your preferences</p>
      </div>

      {sections.map((section, i) => {
        const Icon = section.icon;
        return (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`card ${
              section.id === "danger" ? "border-red-500/20" : ""
            }`}
          >
            <div className="flex items-center gap-2 mb-4">
              <Icon
                className={`w-5 h-5 ${
                  section.id === "danger" ? "text-red-400" : "text-primary"
                }`}
              />
              <h2 className="font-semibold text-white">{section.title}</h2>
            </div>
            {section.content}
          </motion.div>
        );
      })}
    </div>
  );
}
