import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "MeetingMind AI — Turn Every Meeting Into Action",
  description:
    "AI-powered Meeting Intelligence & Workflow Automation Platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen bg-[#0F172A] text-[#F8FAFC]">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

