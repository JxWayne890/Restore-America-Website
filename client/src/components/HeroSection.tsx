/*
 * PATRIOT DESIGN — Hero Section
 * Background: Patriotic aerial hero image (roofing crew + American flags)
 * Colors: Navy overlay, red accents, white text
 * Messaging from FB: 844-LETS-RESTORE, water/fire/tree/roof damage
 */
import { Phone, Star, CheckCircle2 } from "lucide-react";
import InspectionQuizCard from "@/components/InspectionQuizCard";

const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663322351516/3tYmQwW3anv3iwAxp5tEW5/ra-hero-patriotic_ca160d01.jpg";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: "#0D1F3C" }}
    >
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src={HERO_IMAGE}
          alt="Storm damaged home being restored by Restore America team"
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(105deg, rgba(13,31,60,0.95) 0%, rgba(13,31,60,0.88) 40%, rgba(13,31,60,0.55) 70%, rgba(13,31,60,0.2) 100%)",
          }}
        />
        {/* Topographic overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative z-10 container py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Headline */}
          <div className="text-white">
            {/* Trust badge */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-4 h-4 fill-[#FBBF24] text-[#FBBF24]" />
                ))}
              </div>
              <span className="text-white/70 text-sm">113 Google Reviews · 5.0 Stars</span>
            </div>

            <div
              className="text-white/60 text-xs tracking-[0.25em] uppercase font-medium mb-4"
              style={{ fontFamily: "Oswald, sans-serif" }}
            >
              Georgia · Florida · Missouri
            </div>

            <h1
              className="text-white leading-[0.95] mb-6"
              style={{
                fontFamily: "Oswald, sans-serif",
                fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)",
                fontWeight: 700,
                letterSpacing: "0.02em",
              }}
            >
              ROOFING &amp;
              <br />
              <span style={{ color: "#CC2222" }}>STORM DAMAGE</span>
              <br />
              RESTORATION
              <br />
              <span className="text-white/60" style={{ fontSize: "clamp(1rem, 2vw, 1.5rem)", letterSpacing: "0.08em" }}>GA · FL · MO</span>
            </h1>

            {/* AEO Answer Nugget — snippet-ready paragraph */}
            <p
              className="text-white/75 text-lg mb-8 leading-relaxed max-w-lg"
              style={{ fontFamily: "Roboto, sans-serif", fontWeight: 300 }}
            >
              Restore America is a full-service roofing and disaster restoration contractor serving Georgia, Florida, and Missouri. We specialize in fire, flood, hail, and wind damage repair — handling your insurance claim from free inspection through complete build-back, so you only pay your deductible.
            </p>

            {/* Trust signals */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              {[
                "Licensed & Insured",
                "100% Satisfaction Guarantee",
                "No Upfront Costs",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-white/80 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span style={{ fontFamily: "Roboto, sans-serif" }}>{item}</span>
                </div>
              ))}
            </div>

            {/* Emergency phone */}
            <a
              href="tel:8445387737"
              className="inline-flex items-center gap-3 px-5 py-3 transition-all group"
              style={{ backgroundColor: "rgba(204,34,34,0.2)", borderLeft: "4px solid #CC2222" }}
            >
              <Phone className="w-5 h-5 flex-shrink-0" style={{ color: "#CC2222" }} />
              <div>
                <div className="text-white/60 text-xs tracking-widest uppercase" style={{ fontFamily: "Oswald, sans-serif" }}>
                  24/7 Emergency Line
                </div>
                <div className="text-white font-bold text-xl group-hover:text-red-300 transition-colors" style={{ fontFamily: "Oswald, sans-serif" }}>
                  844-LETS-RESTORE
                </div>
              </div>
            </a>
            <p className="text-white/50 text-xs mt-3 italic">
              "Your trusted partner in restoration and roofing excellence in the heart of Georgia!"
            </p>
          </div>

          {/* Right: Lead capture form */}
          <InspectionQuizCard id="inspection" leadSource="website" />
        </div>
      </div>

      {/* Diagonal bottom cut */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16 bg-white"
        style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%)" }}
      />
    </section>
  );
}
