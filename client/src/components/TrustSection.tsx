/*
 * STORM SHIELD DESIGN — Trust Section
 * Before/after image, trust signals, insurance advocacy messaging
 */
import { ShieldCheck, Award, Clock, DollarSign, FileCheck, Users } from "lucide-react";

const BEFORE_AFTER = "https://d2xsxph8kpxj0f.cloudfront.net/310519663322351516/3tYmQwW3anv3iwAxp5tEW5/before-after-roof-oWrGuH4MFyZBDZ6UWCjsHE.webp";
const CONSULT_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663322351516/3tYmQwW3anv3iwAxp5tEW5/insurance-consultation-QvcWpiBYiSazVc8cMjQG5S.webp";

const trustPoints = [
  {
    icon: ShieldCheck,
    title: "Licensed & Fully Insured",
    desc: "Our team carries full liability and workers' comp insurance, protecting you from any on-site liability.",
  },
  {
    icon: Award,
    title: "100% Satisfaction Guarantee",
    desc: "We don't consider a job complete until you're completely satisfied with every detail of the restoration.",
  },
  {
    icon: Clock,
    title: "24/7 Emergency Response",
    desc: "Storm damage doesn't wait for business hours. Our emergency team is available around the clock.",
  },
  {
    icon: DollarSign,
    title: "You Only Pay Your Deductible",
    desc: "In most cases, insurance covers the full cost of restoration. We maximize your claim so you pay only your deductible.",
  },
  {
    icon: FileCheck,
    title: "Full Insurance Claim Management",
    desc: "From initial documentation to supplement appeals, we handle every step of the insurance process for you.",
  },
  {
    icon: Users,
    title: "Family-Owned, Community-Focused",
    desc: "Based in Jersey, GA — we treat every home like our own and every family like our neighbors.",
  },
];

export default function TrustSection() {
  return (
    <section id="about" className="py-20" style={{ backgroundColor: "#0D1F3C" }}>
      <div className="container">
        {/* Before/After */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <div className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#CC2222", fontFamily: "Oswald, sans-serif" }}>Real Results</div>
            <h2
              className="text-white mb-6"
              style={{
                fontFamily: "Oswald, sans-serif",
                fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
                fontWeight: 700,
                lineHeight: 1.1,
              }}
            >
              FROM STORM DAMAGE
              <br />
              <span style={{ color: "#CC2222" }}>TO FULLY RESTORED</span>
            </h2>
            <p
              className="text-white/70 leading-relaxed mb-6 text-base"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              This is what we do every day. A family in Georgia called us after a severe hail storm.
              Their insurance adjuster offered $4,200. After our team documented the full extent of damage
              and advocated on their behalf, the final approved claim was $28,500 — covering a complete
              roof replacement, gutters, and siding repair.
            </p>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div
                  className="font-bold"
                  style={{ color: "#CC2222", fontFamily: "Oswald, sans-serif", fontSize: "2rem" }}
                >
                  $4,200
                </div>
                <div className="text-white/50 text-xs tracking-widest uppercase" style={{ fontFamily: "Oswald, sans-serif" }}>
                  Initial Offer
                </div>
              </div>
              <div className="text-white/40 text-3xl font-light">→</div>
              <div className="text-center">
                <div
                  className="text-green-400 font-bold"
                  style={{ fontFamily: "Oswald, sans-serif", fontSize: "2rem" }}
                >
                  $28,500
                </div>
                <div className="text-white/50 text-xs tracking-widest uppercase" style={{ fontFamily: "Oswald, sans-serif" }}>
                  Final Approved
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <img
              src={BEFORE_AFTER}
              alt="Before and after roof restoration by Restore America"
              className="w-full shadow-2xl"
              loading="lazy"
            />
            <div
              className="absolute -bottom-4 -left-4 text-white px-4 py-3"
              style={{ backgroundColor: "#CC2222", fontFamily: "Oswald, sans-serif" }}
            >
              <div className="text-xs tracking-widest uppercase opacity-80">Actual Client Result</div>
              <div className="font-bold text-lg">$24,300 MORE</div>
            </div>
          </div>
        </div>

        {/* Insurance consultation image + trust points */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="relative">
            <img
              src={CONSULT_IMAGE}
              alt="Restore America specialist consulting with homeowners about insurance claim"
              className="w-full shadow-xl"
              loading="lazy"
            />
            <div
              className="absolute top-4 right-4 text-white px-4 py-3 border" style={{ backgroundColor: "rgba(13,31,60,0.92)", borderColor: "rgba(255,255,255,0.2)" }}
            >
              <div
                className="text-white/60 text-xs tracking-widest uppercase mb-1"
                style={{ fontFamily: "Oswald, sans-serif" }}
              >
                We Handle Everything
              </div>
              <div
                className="text-white font-bold text-sm"
                style={{ fontFamily: "Oswald, sans-serif" }}
              >
                Inspection → Claim → Build Back
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#CC2222", fontFamily: "Oswald, sans-serif" }}>Why Choose Us</div>
            <h2
              className="text-white mb-8"
              style={{
                fontFamily: "Oswald, sans-serif",
                fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                fontWeight: 700,
              }}
            >
              THE RESTORE AMERICA DIFFERENCE
            </h2>
            <div className="grid grid-cols-1 gap-5">
              {trustPoints.map((point, i) => {
                const PointIcon = point.icon;
                return (
                  <div key={i} className="flex gap-4 group">
                    <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center border transition-colors" style={{ backgroundColor: "rgba(204,34,34,0.1)", borderColor: "rgba(204,34,34,0.3)" }}>
                      <PointIcon className="w-4 h-4" style={{ color: "#CC2222" }} />
                    </div>
                    <div>
                      <div
                        className="text-white font-bold text-sm mb-1"
                        style={{ fontFamily: "Oswald, sans-serif", letterSpacing: "0.05em" }}
                      >
                        {point.title}
                      </div>
                      <p
                        className="text-white/60 text-sm leading-relaxed"
                        style={{ fontFamily: "Roboto, sans-serif" }}
                      >
                        {point.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
