"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Integrations", href: "#integrations" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "py-3 bg-[#0F172A]/80 backdrop-blur-2xl border-b border-white/[0.06] shadow-lg shadow-black/20"
            : "py-5 bg-transparent"
        )}
      >
        <nav className="mx-auto max-w-7xl px-6 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 rounded-lg blur-md group-hover:bg-primary/50 transition-colors duration-300" />
              <div className="relative bg-gradient-to-br from-primary to-secondary p-2 rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              Meeting<span className="gradient-text">Mind</span>{" "}
              <span className="text-dark-400 font-medium text-sm">AI</span>
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-sm text-dark-400 hover:text-white transition-colors duration-200 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-primary to-accent group-hover:w-3/4 transition-all duration-300" />
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="#"
              className="px-4 py-2 text-sm text-dark-400 hover:text-white border border-transparent hover:border-white/10 rounded-lg transition-all duration-200"
            >
              Login
            </a>
            <a
              href="#"
              className="group relative px-5 py-2.5 text-sm font-semibold text-white rounded-lg overflow-hidden transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent opacity-100 group-hover:opacity-90 transition-opacity" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent opacity-0 group-hover:opacity-100 blur-xl transition-opacity" />
              <span className="relative">Start Free Trial</span>
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden relative p-2 text-dark-400 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {mobileOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </nav>
      </motion.header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-[#0F172A]/90 backdrop-blur-xl"
              onClick={() => setMobileOpen(false)}
            />

            {/* Menu content */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-[80%] max-w-sm bg-dark-50/95 backdrop-blur-2xl border-l border-white/[0.06] p-8 pt-24"
            >
              <div className="flex flex-col gap-2">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    className="px-4 py-3 text-lg text-dark-400 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200"
                  >
                    {link.label}
                  </motion.a>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3">
                <motion.a
                  href="#"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="px-4 py-3 text-center text-dark-400 hover:text-white border border-white/10 rounded-xl transition-all"
                >
                  Login
                </motion.a>
                <motion.a
                  href="#"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="relative px-4 py-3 text-center font-semibold text-white rounded-xl overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent" />
                  <span className="relative">Start Free Trial</span>
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
