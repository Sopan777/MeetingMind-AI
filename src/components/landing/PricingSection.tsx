"use client";

import { motion } from "framer-motion";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
}

const tiers: PricingTier[] = [
  {
    name: "Starter",
    price: "$19",
    period: "/month",
    description: "Perfect for individuals and small teams getting started.",
    features: [
      "10 meetings per month",
      "Basic transcription",
      "Action item detection",
      "Email summaries",
      "1 user",
    ],
    cta: "Get Started",
  },
  {
    name: "Professional",
    price: "$49",
    period: "/month",
    description: "For growing teams that need powerful AI insights.",
    features: [
      "Unlimited meetings",
      "Advanced AI analysis",
      "Risk detection",
      "All integrations",
      "Up to 10 users",
      "Priority support",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Tailored solutions for large organizations.",
    features: [
      "Everything in Professional",
      "Custom AI models",
      "SSO & SAML",
      "Dedicated support",
      "Custom integrations",
      "Unlimited users",
    ],
    cta: "Contact Sales",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 80, damping: 15 },
  },
};

export default function PricingSection() {
  return (
    <section id="pricing" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-secondary/20 text-secondary text-sm font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Simple Pricing
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Plans That{" "}
            <span className="gradient-text">Scale With You</span>
          </h2>
          <p className="text-dark-300 text-lg max-w-lg mx-auto">
            Start free, upgrade when you&apos;re ready. No hidden fees, no
            surprises.
          </p>
        </motion.div>

        {/* Pricing cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start"
        >
          {tiers.map((tier) => (
            <motion.div
              key={tier.name}
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className={cn(
                "relative group",
                tier.popular && "md:-mt-4 md:mb-[-16px]"
              )}
            >
              {/* Popular badge */}
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="px-4 py-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-full text-xs font-semibold text-white shadow-lg shadow-primary/20">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Card */}
              <div
                className={cn(
                  "relative rounded-2xl p-8 h-full transition-all duration-300",
                  tier.popular
                    ? "glass-strong border-primary/30 shadow-glow"
                    : "glass group-hover:border-white/15"
                )}
              >
                {/* Gradient border for popular */}
                {tier.popular && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-primary/20 via-transparent to-accent/10 pointer-events-none" />
                )}

                <div className="relative">
                  {/* Tier name */}
                  <h3
                    className={cn(
                      "text-lg font-semibold mb-2",
                      tier.popular ? "gradient-text" : "text-white"
                    )}
                  >
                    {tier.name}
                  </h3>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl md:text-5xl font-bold text-white">
                      {tier.price}
                    </span>
                    {tier.period && (
                      <span className="text-dark-300 text-sm">{tier.period}</span>
                    )}
                  </div>

                  <p className="text-sm text-dark-300 mb-8">
                    {tier.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <div
                          className={cn(
                            "mt-0.5 p-0.5 rounded-full",
                            tier.popular
                              ? "bg-primary/20 text-primary"
                              : "bg-dark-100 text-dark-300"
                          )}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-sm text-dark-400">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    className={cn(
                      "w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 group/btn",
                      tier.popular
                        ? "bg-gradient-to-r from-primary via-secondary to-accent text-white hover:shadow-glow hover:brightness-110"
                        : "glass border border-white/10 text-white hover:bg-white/10 hover:border-white/20"
                    )}
                  >
                    {tier.cta}
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center text-sm text-dark-300 mt-12"
        >
          All plans include a 14-day free trial. No credit card required.
        </motion.p>
      </div>
    </section>
  );
}
