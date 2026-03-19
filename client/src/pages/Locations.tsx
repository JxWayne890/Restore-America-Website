import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { SERVICE_LOCATIONS } from "@shared/data/locations";
import { ArrowRight, MapPin, Phone } from "lucide-react";
import { useEffect } from "react";

export default function Locations() {
  useEffect(() => {
    document.title = "Service Areas | Restore America Roofing & Restoration";
    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute(
        "content",
        "Explore Restore America's roofing and restoration service areas across Georgia, Florida, and Missouri."
      );
    }
  }, []);

  return (
    <div className="min-h-screen" style={{ fontFamily: "Roboto, sans-serif" }}>
      <Navbar />

      <section
        className="relative overflow-hidden py-20"
        style={{ background: "linear-gradient(140deg, #0D1F3C 0%, #1B3A6B 60%, #0D1F3C 100%)" }}
      >
        <div className="absolute inset-0 opacity-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, #ffffff 0, transparent 34%), radial-gradient(circle at 80% 30%, #CC2222 0, transparent 24%)",
            }}
          />
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <div
              className="text-xs tracking-[0.24em] uppercase text-white/65 mb-4"
              style={{ fontFamily: "Oswald, sans-serif" }}
            >
              Service Locations
            </div>
            <h1
              className="text-white leading-[0.98]"
              style={{
                fontFamily: "Oswald, sans-serif",
                fontWeight: 700,
                fontSize: "clamp(2.2rem, 5.2vw, 4rem)",
              }}
            >
              GEORGIA, FLORIDA, AND MISSOURI
              <br />
              <span style={{ color: "#CC2222" }}>LOCAL RESTORATION PAGES</span>
            </h1>
            <p
              className="text-white/75 mt-6 text-base leading-relaxed max-w-2xl"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              Choose your city to view location-focused roofing and restoration information, including common storm issues and nearby areas we serve.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/#inspection"
                className="inline-flex items-center gap-2 text-white px-6 py-3 font-bold tracking-wider uppercase hover:opacity-90 transition-opacity text-sm"
                style={{ backgroundColor: "#CC2222", fontFamily: "Oswald, sans-serif", letterSpacing: "0.1em" }}
              >
                GET FREE INSPECTION
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="tel:8445387737"
                className="inline-flex items-center gap-2 text-white border border-white/35 px-6 py-3 font-bold tracking-wider uppercase text-sm hover:border-white"
                style={{ fontFamily: "Oswald, sans-serif", letterSpacing: "0.08em" }}
              >
                <Phone className="w-4 h-4" />
                844-LETS-RESTORE
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16" style={{ backgroundColor: "#F4F6F9" }}>
        <div className="container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {SERVICE_LOCATIONS.map((location) => (
              <a
                key={location.slug}
                href={`/locations/${location.slug}`}
                className="group bg-white border border-gray-200 px-5 py-5 hover:border-[#1B3A6B] hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-2 text-[#CC2222] text-xs tracking-widest uppercase mb-2" style={{ fontFamily: "Oswald, sans-serif" }}>
                  <MapPin className="w-3.5 h-3.5" />
                  {location.stateCode}
                </div>
                <h2
                  className="text-[#1B3A6B] font-bold text-lg group-hover:text-[#0D1F3C]"
                  style={{ fontFamily: "Oswald, sans-serif", letterSpacing: "0.03em" }}
                >
                  {location.label}
                </h2>
                <p className="text-gray-600 text-sm mt-2 leading-relaxed" style={{ fontFamily: "Roboto, sans-serif" }}>
                  {location.heroDescription}
                </p>
                <div
                  className="mt-4 inline-flex items-center gap-1 text-[#1B3A6B] text-xs tracking-widest uppercase"
                  style={{ fontFamily: "Oswald, sans-serif" }}
                >
                  VIEW LOCATION PAGE
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
