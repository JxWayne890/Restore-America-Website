import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { AlertTriangle, X, Phone, Zap } from "lucide-react";

const SEVERITY_COLORS = {
  watch: { bg: "#F59E0B", text: "#7C2D12", border: "#D97706" },
  warning: { bg: "#CC2222", text: "white", border: "#991B1B" },
  emergency: { bg: "#7F1D1D", text: "white", border: "#450A0A" },
};

const SEVERITY_LABELS = {
  watch: "STORM WATCH",
  warning: "STORM WARNING",
  emergency: "EMERGENCY ALERT",
};

export default function StormAlertBanner() {
  const [dismissed, setDismissed] = useState(false);
  const { data: alert } = trpc.stormAlerts.getActive.useQuery(undefined, {
    refetchInterval: 60_000, // re-check every minute
  });

  if (!alert || dismissed) return null;

  const colors = SEVERITY_COLORS[alert.severity ?? "warning"];
  const label = SEVERITY_LABELS[alert.severity ?? "warning"];

  return (
    <div
      className="w-full relative z-50"
      style={{ background: colors.bg, borderBottom: `2px solid ${colors.border}` }}
    >
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Zap className="w-4 h-4 animate-pulse" style={{ color: colors.text }} />
            <span
              className="text-xs font-black tracking-widest"
              style={{ color: colors.text, fontFamily: "Oswald, sans-serif" }}
            >
              {label}
            </span>
          </div>
          <div className="h-4 w-px bg-white/30 flex-shrink-0" />
          <p
            className="text-xs font-medium truncate"
            style={{ color: colors.text }}
          >
            <strong>{alert.title}</strong> — {alert.affectedAreas}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <a
            href="tel:+18445387737"
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full transition-all hover:opacity-90"
            style={{
              background: "rgba(255,255,255,0.2)",
              color: colors.text,
              border: "1px solid rgba(255,255,255,0.4)",
            }}
          >
            <Phone className="w-3 h-3" />
            Call Now — Priority Response
          </a>
          <button
            onClick={() => setDismissed(true)}
            className="opacity-70 hover:opacity-100 transition-opacity"
            style={{ color: colors.text }}
            aria-label="Dismiss alert"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
