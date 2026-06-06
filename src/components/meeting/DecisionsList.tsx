import { motion } from "framer-motion";
import { GitBranch } from "lucide-react";
import type { Decision } from "@/lib/mock-data";

const impactStyles: Record<string, string> = {
  low: "badge-success",
  medium: "badge-warning",
  high: "badge-danger",
};

interface DecisionsListProps {
  decisions: Decision[];
}

export default function DecisionsList({ decisions }: DecisionsListProps) {
  return (
    <div className="grid gap-4">
      {decisions.map((decision, i) => (
        <motion.div
          key={decision.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="card group"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-secondary/15 flex items-center justify-center shrink-0">
              <GitBranch className="w-4 h-4 text-secondary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h4 className="font-semibold text-white">{decision.title}</h4>
                <span className={impactStyles[decision.impact]}>
                  {decision.impact} impact
                </span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed mb-2">
                {decision.description}
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span>
                  Decided by{" "}
                  <span className="text-slate-300">{decision.decidedBy}</span>
                </span>
                <span>
                  {new Date(decision.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
