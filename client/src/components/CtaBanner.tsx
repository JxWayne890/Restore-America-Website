/*
 * PATRIOT DESIGN — CTA Banner
 * Navy background, red accents, white text
 * Urgency-driven final call to action
 */
import { ArrowRight, Phone, Clock, AlertTriangle } from "lucide-react";
import { SERVICE_LOCATIONS } from "@shared/data/locations";

const TEAM_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663322351516/3tYmQwW3anv3iwAxp5tEW5/restoration-team-GjZEbg2NQJAv7Lm2ggu8ZX.webp";

const urgencyPoints = [
  { icon: AlertTriangle, text: "Hidden damage worsens over time — small leaks become structural failures" },
  { icon: Clock, text: "Insurance deadlines are real — late or incomplete claims can mean denied coverage" },
  { icon: AlertTriangle, text: "A denied claim on your record can affect future renewals and premiums" },
];

export default function CtaBanner() {
  return (
    <>
      {/* Urgency section */}
      <section
        className="py-16 relative overflow-hidden"
        style={{ backgroundColor: "#0D1F3C" }}
      >
        <div className="absolute inset-0 opacity-15">
          <img src={TEAM_IMAGE} alt="" className="w-full h-full object-cover" />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to right, #0D1F3C 40%, transparent 100%)" }}
          />
        </div>
        <div className="relative z-10 container">
          <div className="max-w-2xl">
            <div
              className="text-xs tracking-widest uppercase font-bold mb-4"
              style={{ color: "#CC2222", fontFamily: "Oswald, sans-serif" }}
            >
              ⚠ Don't Wait — Act Now
            </div>
            <h2
              className="text-white mb-6"
              style={{
                fontFamily: "Oswald, sans-serif",
                fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
                fontWeight: 700,
                lineHeight: 1.1,
              }}
            >
              STORM DAMAGE GETS WORSE
              <br />
              <span style={{ color: "#CC2222" }}>EVERY DAY YOU WAIT</span>
            </h2>
            <div className="flex flex-col gap-4 mb-8">
              {urgencyPoints.map((point, i) => {
                const PointIcon = point.icon;
                return (
                  <div key={i} className="flex items-start gap-3">
                    <PointIcon className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#CC2222" }} />
                    <p
                      className="text-white/70 text-sm leading-relaxed"
                      style={{ fontFamily: "Roboto, sans-serif" }}
                    >
                      {point.text}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#inspection"
                className="inline-flex items-center justify-center gap-2 text-white px-7 py-4 font-bold tracking-wider uppercase transition-colors hover:opacity-90"
                style={{ backgroundColor: "#CC2222", fontFamily: "Oswald, sans-serif", letterSpacing: "0.12em" }}
              >
                GET FREE INSPECTION NOW
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="tel:8445387737"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/30 hover:border-white text-white px-7 py-4 font-bold tracking-wider uppercase transition-colors"
                style={{ fontFamily: "Oswald, sans-serif", letterSpacing: "0.1em" }}
              >
                <Phone className="w-4 h-4" />
                844-LETS-RESTORE
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Service areas band */}
      <div style={{ backgroundColor: "#CC2222" }} className="py-4">
        <div className="container">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-white text-sm">
            <span
              className="font-bold tracking-widest uppercase"
              style={{ fontFamily: "Oswald, sans-serif" }}
            >
              Serving:
            </span>
            {SERVICE_LOCATIONS.map((location) => (
              <a
                key={location.slug}
                href={`/locations/${location.slug}`}
                className="opacity-90 hover:opacity-100 transition-all px-2.5 py-1 border border-white/20 hover:border-white/60 rounded-sm"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                {location.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
