/*
 * PATRIOT DESIGN — Navbar
 * Navy dark bg, white text, red CTA, new American flag logo
 * Phone: 844-LETS-RESTORE / (770) 373-5663
 */
import { useState, useEffect } from "react";
import { Phone, Menu, X, ChevronDown } from "lucide-react";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663322351516/3tYmQwW3anv3iwAxp5tEW5/ra-logo-new_fe4cd82a.png";

const services = [
  { label: "Hail Damage Repair", href: "#services" },
  { label: "Wind Damage Repair", href: "#services" },
  { label: "Fire Damage Restoration", href: "#services" },
  { label: "Flood & Water Damage", href: "#services" },
  { label: "Tree Damage Removal", href: "#services" },
  { label: "Roof Replacement", href: "#services" },
  { label: "Mitigation & Packout", href: "#services" },
  { label: "Insurance Claim Help", href: "#services" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top utility bar */}
      <div style={{ backgroundColor: "#0D1F3C" }} className="hidden md:block">
        <div className="container">
          <div className="flex items-center justify-between py-2 text-xs">
            <div className="flex items-center gap-6 text-white/75">
              <span className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full bg-green-400 inline-block"
                  style={{ animation: "pulse-red 2s infinite" }}
                ></span>
                Serving GA · FL · MO — 24/7 Emergency Response
              </span>
              <span>office@gorestoreamerica.com</span>
            </div>
            <div className="flex items-center gap-4 text-white/75">
              <span>Mon–Sat: 8am–8pm</span>
              <a
                href="tel:8445387737"
                className="flex items-center gap-1.5 font-semibold text-white hover:text-red-300 transition-colors"
                style={{ fontFamily: "Oswald, sans-serif", letterSpacing: "0.05em" }}
              >
                <Phone size={12} />
                844-LETS-RESTORE
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Flag stripe accent */}
      <div className="flag-stripe-divider hidden md:block" />

      {/* Main navbar */}
      <nav
        className="sticky top-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: scrolled ? "rgba(13,31,60,0.98)" : "#1B3A6B",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.4)" : "none",
        }}
      >
        <div className="container">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <a href="/" className="flex items-center gap-3 group">
              <img
                src={LOGO_URL}
                alt="Restore America Roofing & Restoration"
                className="h-12 w-12 md:h-14 md:w-14 object-contain group-hover:scale-105 transition-transform duration-300"
              />
              <div className="hidden sm:block">
                <div
                  className="text-white font-black leading-none"
                  style={{ fontFamily: "Oswald, sans-serif", fontSize: "1.2rem", letterSpacing: "0.08em" }}
                >
                  RESTORE AMERICA
                </div>
                <div className="text-white/55 text-[0.6rem] tracking-widest uppercase mt-0.5">
                  Roofing & Restoration
                </div>
              </div>
            </a>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-7">
              <a
                href="#about"
                className="text-white/80 hover:text-white text-sm font-medium tracking-widest transition-colors uppercase"
                style={{ fontFamily: "Oswald, sans-serif" }}
              >
                About
              </a>

              {/* Services dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
              >
                <button
                  className="flex items-center gap-1 text-white/80 hover:text-white text-sm font-medium tracking-widest transition-colors uppercase"
                  style={{ fontFamily: "Oswald, sans-serif" }}
                >
                  Services{" "}
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {servicesOpen && (
                  <div
                    className="absolute top-full left-0 mt-1 w-56 shadow-2xl overflow-hidden z-50"
                    style={{
                      backgroundColor: "#0D1F3C",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderTop: "3px solid #CC2222",
                    }}
                  >
                    {services.map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        className="block px-4 py-2.5 text-sm text-white/75 hover:text-white hover:bg-white/10 transition-colors border-b border-white/5 last:border-0"
                        style={{ fontFamily: "Roboto, sans-serif" }}
                      >
                        {s.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <a
                href="#process"
                className="text-white/80 hover:text-white text-sm font-medium tracking-widest transition-colors uppercase"
                style={{ fontFamily: "Oswald, sans-serif" }}
              >
                Our Process
              </a>
              <a
                href="#reviews"
                className="text-white/80 hover:text-white text-sm font-medium tracking-widest transition-colors uppercase"
                style={{ fontFamily: "Oswald, sans-serif" }}
              >
                Reviews
              </a>
              <a
                href="#faq"
                className="text-white/80 hover:text-white text-sm font-medium tracking-widest transition-colors uppercase"
                style={{ fontFamily: "Oswald, sans-serif" }}
              >
                FAQ
              </a>
            </div>

            {/* CTA */}
            <div className="hidden lg:flex items-center gap-4">
              <a
                href="tel:7703735663"
                className="flex items-center gap-2 text-white/75 hover:text-white transition-colors text-sm"
                style={{ fontFamily: "Oswald, sans-serif", letterSpacing: "0.04em" }}
              >
                <Phone size={15} />
                (770) 373-5663
              </a>
              <a
                href="#contact"
                className="patriot-red-btn px-5 py-2.5 rounded-sm text-sm"
              >
                FREE INSPECTION
              </a>
            </div>

            {/* Mobile toggle */}
            <button
              className="lg:hidden text-white p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            className="lg:hidden border-t"
            style={{ backgroundColor: "#0D1F3C", borderColor: "rgba(255,255,255,0.1)" }}
          >
            <div className="container py-4 flex flex-col gap-1">
              {[
                { label: "About", href: "#about" },
                { label: "Services", href: "#services" },
                { label: "Our Process", href: "#process" },
                { label: "Reviews", href: "#reviews" },
                { label: "FAQ", href: "#faq" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-white/80 hover:text-white py-3 px-2 text-sm uppercase tracking-widest border-b border-white/10"
                  style={{ fontFamily: "Oswald, sans-serif" }}
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-3 flex flex-col gap-2">
                <a
                  href="tel:8445387737"
                  className="patriot-navy-btn px-4 py-3 rounded-sm text-center text-sm"
                  style={{ backgroundColor: "#1B3A6B" }}
                >
                  CALL 844-LETS-RESTORE
                </a>
                <a
                  href="#contact"
                  className="patriot-red-btn px-4 py-3 rounded-sm text-center text-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  GET FREE INSPECTION
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
