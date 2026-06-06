import { motion } from "framer-motion";
import { AlertTriangle, Shield } from "lucide-react";
import type { Risk } from "@/lib/mock-data";

const severityStyles: Record<string, { badge: string; border: string }> = {
  low: { badge: "badge-success", border: "border-l-emerald-500" },
  medium: { badge: "badge-warning", border: "border-l-amber-500" },
  high: { badge: "bg-orange-500/20 text-orange-300", border: "border-l-orange-500" },
  critical: { badge: "badge-danger", border: "border-l-red-500" },
};

interface RiskCardsProps {
  risks: Risk[];
}

export default function RiskCards({ risks }: RiskCardsProps) {
  return (
    <div className="grid gap-4">
      {risks.map((risk, i) => {
        const style = severityStyles[risk.severity] || severityStyles.low;
        return (
          <motion.div
            key={risk.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`card border-l-4 ${style.border}`}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h4 className="font-semibold text-white">{risk.title}</h4>
              </div>
              <span className={`badge ${style.badge}`}>
                {risk.severity}
              </span>
            </div>

            <p className="text-sm text-slate-400 mb-3">{risk.description}</p>

            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider w-28 shrink-0 pt-0.5">
                  Impact
                </span>
                <span className="text-sm text-slate-300">{risk.impact}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider w-28 shrink-0 pt-0.5">
                  Recommendation
                </span>
                <span className="text-sm text-slate-300">
                  {risk.recommendation}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider w-28 shrink-0">
                  Detected
                </span>
                <code className="text-xs bg-dark-100 px-2 py-1 rounded text-amber-300 font-mono">
                  &ldquo;{risk.detectedPhrase}&rdquo;
                </code>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
