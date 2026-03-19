/*
 * PATRIOT DESIGN — Services Section
 * Navy/red/white color system, interactive damage type tabs
 * Asymmetric layout with process steps
 */
import { useState } from "react";
import {
  Flame, Droplets, CloudHail, Wind,
  Search, FileText, Wrench, ShieldCheck, Home, PackageOpen
} from "lucide-react";

const damageCategories = [
  {
    id: "hail",
    label: "Hail & Wind Storm",
    icon: CloudHail,
    color: "#1B3A6B",
    bgColor: "rgba(27,58,107,0.08)",
    headline: "Hail & Wind Damage Specialists",
    description:
      "Georgia, Florida, and Missouri are prime hail corridors. A single storm event can cause $10,000–$40,000 in roof damage that insurance is required to cover. Our team documents every impact point, fights lowball estimates, and ensures you receive the full replacement your home deserves.",
    services: [
      "Full roof inspection & damage documentation",
      "Hail impact mapping with photo evidence",
      "Insurance adjuster coordination",
      "Supplement & denial appeals",
      "Full roof replacement with premium materials",
      "Gutters, siding, windows & fascia repair",
    ],
  },
  {
    id: "fire",
    label: "Fire & Smoke",
    icon: Flame,
    color: "#CC2222",
    bgColor: "rgba(204,34,34,0.08)",
    headline: "Fire Damage Restoration Experts",
    description:
      "Fire damage requires immediate action to prevent further structural loss. Our certified restoration team handles the full scope — from emergency tarping and board-up to complete mitigation, packout of your belongings, and full build-back to pre-loss condition.",
    services: [
      "Emergency board-up & tarping",
      "Smoke & soot mitigation",
      "Structural damage assessment",
      "Contents packout & storage",
      "Complete structural rebuild",
      "Insurance claim management",
    ],
  },
  {
    id: "flood",
    label: "Flood & Water",
    icon: Droplets,
    color: "#1B3A6B",
    bgColor: "rgba(27,58,107,0.08)",
    headline: "Flood & Water Damage Restoration",
    description:
      "Water damage spreads rapidly and can cause mold within 24–48 hours. Our IICRC-certified team deploys immediately to extract water, dry structures, and restore your home or business to pre-loss condition — handling every step of the insurance process.",
    services: [
      "Emergency water extraction",
      "Industrial drying & dehumidification",
      "Mold prevention & remediation",
      "Structural drying documentation",
      "Contents packout & restoration",
      "Full build-back & reconstruction",
    ],
  },
  {
    id: "wind",
    label: "High Wind Events",
    icon: Wind,
    color: "#1B3A6B",
    bgColor: "rgba(27,58,107,0.08)",
    headline: "Wind Damage Repair & Restoration",
    description:
      "High winds can lift shingles, damage fascia, and compromise your roof's integrity without visible signs from the ground. Our inspectors identify hidden wind damage that adjusters routinely miss, ensuring your claim covers every affected area.",
    services: [
      "Wind damage inspection & documentation",
      "Emergency tarping & temporary repairs",
      "Shingle, fascia & soffit replacement",
      "Structural integrity assessment",
      "Insurance claim advocacy",
      "Full roof replacement if warranted",
    ],
  },
];

const processSteps = [
  { icon: Search, label: "Free Inspection", desc: "We document all damage with photos and detailed reports" },
  { icon: FileText, label: "Claim Review", desc: "We review your policy and identify what's covered" },
  { icon: ShieldCheck, label: "Claim Advocacy", desc: "We fight for your full entitlement — no lowballs" },
  { icon: Wrench, label: "Expert Repair", desc: "Licensed crews restore your property to pre-loss condition" },
  { icon: PackageOpen, label: "Packout & Storage", desc: "We protect your belongings throughout the process" },
  { icon: Home, label: "Build Back", desc: "Full reconstruction to make your home whole again" },
];

export default function ServicesSection() {
  const [activeCategory, setActiveCategory] = useState("hail");
  const active = damageCategories.find((d) => d.id === activeCategory)!;
  const Icon = active.icon;

  return (
    <section id="services" className="py-20" style={{ backgroundColor: "#F4F6F9" }}>
      <div className="container">
        {/* Section header */}
        <div className="mb-12">
          <div
            className="text-xs font-bold tracking-widest uppercase mb-3"
            style={{ color: "#CC2222", fontFamily: "Oswald, sans-serif" }}
          >
            Full-Service Restoration
          </div>
          <h2
            className="leading-tight mb-4"
            style={{
              color: "#1B3A6B",
              fontFamily: "Oswald, sans-serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 700,
            }}
          >
            WE RESTORE WHAT NATURE DESTROYS
          </h2>
          <p
            className="text-gray-600 max-w-2xl text-base leading-relaxed"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            From emergency mitigation to complete build-back, Restore America handles every phase of
            disaster recovery — roofing, structural repair, contents packout, and insurance claim management.
          </p>
        </div>

        {/* Damage type tabs */}
        <div className="flex flex-wrap gap-3 mb-10">
          {damageCategories.map((cat) => {
            const CatIcon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="flex items-center gap-2.5 px-5 py-3 border-2 transition-all text-sm font-medium"
                style={{
                  fontFamily: "Oswald, sans-serif",
                  letterSpacing: "0.05em",
                  borderColor: isActive ? "#1B3A6B" : "#D1D5DB",
                  backgroundColor: isActive ? "#1B3A6B" : "white",
                  color: isActive ? "white" : "#374151",
                }}
              >
                <CatIcon className="w-4 h-4" style={{ color: isActive ? "white" : cat.color }} />
                {cat.label.toUpperCase()}
              </button>
            );
          })}
        </div>

        {/* Active category content */}
        <div className="grid lg:grid-cols-2 gap-10 items-start mb-20">
          <div>
            <div
              className="inline-flex items-center gap-3 mb-5 px-4 py-2"
              style={{ background: active.bgColor, border: `1px solid ${active.color}30` }}
            >
              <Icon className="w-5 h-5" style={{ color: active.color }} />
              <span
                className="text-sm font-medium"
                style={{ fontFamily: "Oswald, sans-serif", color: active.color, letterSpacing: "0.08em" }}
              >
                {active.label.toUpperCase()}
              </span>
            </div>
            <h3
              className="mb-4"
              style={{
                color: "#1B3A6B",
                fontFamily: "Oswald, sans-serif",
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                fontWeight: 700,
              }}
            >
              {active.headline}
            </h3>
            <p
              className="text-gray-600 leading-relaxed mb-6 text-base"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              {active.description}
            </p>
            <a
              href="#inspection"
              className="inline-flex items-center gap-2 text-white px-6 py-3.5 font-bold tracking-wider uppercase transition-colors text-sm hover:opacity-90"
              style={{ backgroundColor: "#CC2222", fontFamily: "Oswald, sans-serif", letterSpacing: "0.1em" }}
            >
              GET FREE INSPECTION
            </a>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {active.services.map((service, i) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-white p-4 border-l-4 shadow-sm"
                style={{ borderLeftColor: active.color }}
              >
                <div
                  className="w-6 h-6 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold mt-0.5"
                  style={{ background: active.color, fontFamily: "Oswald, sans-serif" }}
                >
                  {i + 1}
                </div>
                <span
                  className="text-gray-700 text-sm font-medium"
                  style={{ fontFamily: "Roboto, sans-serif" }}
                >
                  {service}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Process steps */}
        <div id="process">
          <div
            className="text-xs font-bold tracking-widest uppercase mb-3"
            style={{ color: "#CC2222", fontFamily: "Oswald, sans-serif" }}
          >
            How It Works
          </div>
          <h2
            className="mb-10"
            style={{
              color: "#1B3A6B",
              fontFamily: "Oswald, sans-serif",
              fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
              fontWeight: 700,
            }}
          >
            FROM DAMAGE TO DONE — OUR 6-STEP PROCESS
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {processSteps.map((step, i) => {
              const StepIcon = step.icon;
              return (
                <div key={i} className="relative">
                  {i < processSteps.length - 1 && (
                    <div
                      className="hidden lg:block absolute top-8 h-0.5 z-0"
                      style={{
                        backgroundColor: "rgba(27,58,107,0.2)",
                        width: "calc(100% - 2rem)",
                        left: "calc(50% + 1.5rem)",
                      }}
                    />
                  )}
                  <div className="bg-white p-5 text-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative z-10">
                    <div
                      className="w-12 h-12 flex items-center justify-center mx-auto mb-3"
                      style={{ background: "#1B3A6B" }}
                    >
                      <StepIcon className="w-5 h-5 text-white" />
                    </div>
                    <div
                      className="text-xs font-bold mb-1"
                      style={{ color: "#CC2222", fontFamily: "Oswald, sans-serif", letterSpacing: "0.1em" }}
                    >
                      STEP {i + 1}
                    </div>
                    <div
                      className="font-bold text-sm mb-1"
                      style={{ color: "#1B3A6B", fontFamily: "Oswald, sans-serif" }}
                    >
                      {step.label}
                    </div>
                    <p className="text-gray-500 text-xs leading-relaxed" style={{ fontFamily: "Roboto, sans-serif" }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
