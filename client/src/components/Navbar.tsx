/*
 * PATRIOT DESIGN — Navbar
 * Navy dark bg, white text, red CTA, new American flag logo
 * Phone: 844-LETS-RESTORE / (770) 373-5663
 */
import { useState, useEffect } from "react";
import { Phone, Menu, X, ChevronDown } from "lucide-react";
import { SERVICE_LOCATIONS } from "@shared/data/locations";

const LOGO_URL = "https://i.imgur.com/L4Hc0Pd.png";

const services = [
  { label: "Hail Damage Repair", href: "/#services" },
  { label: "Wind Damage Repair", href: "/#services" },
  { label: "Fire Damage Restoration", href: "/#services" },
  { label: "Flood & Water Damage", href: "/#services" },
  { label: "Tree Damage Removal", href: "/#services" },
  { label: "Roof Replacement", href: "/#services" },
  { label: "Mitigation & Packout", href: "/#services" },
  { label: "Insurance Claim Help", href: "/#services" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [locationsOpen, setLocationsOpen] = useState(false);

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
          backgroundColor: scrolled ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.45)",
          backdropFilter: scrolled ? "blur(20px)" : "blur(12px)",
          boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.1)" : "none",
          borderBottom: scrolled ? "1px solid rgba(0,0,0,0.05)" : "none"
        }}
      >
        <div className="container">
          <div className="flex items-center justify-between h-18 md:h-24">
            {/* Logo */}
            <a href="/" className="flex items-center group">
              <img
                src={LOGO_URL}
                alt="Restore America Roofing & Restoration"
                className="h-14 md:h-18 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </a>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-7">
              <a
                href="/#about"
                className="text-[#1B3A6B] hover:text-[#0D1F3C] text-sm font-medium tracking-widest transition-colors uppercase"
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
                  className="flex items-center gap-1 text-[#1B3A6B] hover:text-[#0D1F3C] text-sm font-medium tracking-widest transition-colors uppercase"
                  style={{ fontFamily: "Oswald, sans-serif" }}
                >
                  Services{" "}
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 text-[#CC2222] ${servicesOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {servicesOpen && (
                  <div
                    className="absolute top-full left-0 mt-1 w-56 shadow-2xl overflow-hidden z-50 bg-white border border-gray-200 rounded-sm"
                    style={{
                      borderTop: "3px solid #CC2222",
                    }}
                  >
                    {services.map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        className="block px-4 py-3 text-sm text-[#1B3A6B] hover:text-[#CC2222] hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                        style={{ fontFamily: "Roboto, sans-serif" }}
                      >
                        {s.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Locations dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setLocationsOpen(true)}
                onMouseLeave={() => setLocationsOpen(false)}
              >
                <button
                  className="flex items-center gap-1 text-[#1B3A6B] hover:text-[#0D1F3C] text-sm font-medium tracking-widest transition-colors uppercase"
                  style={{ fontFamily: "Oswald, sans-serif" }}
                >
                  Locations{" "}
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 text-[#CC2222] ${locationsOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {locationsOpen && (
                  <div
                    className="absolute top-full left-0 mt-1 w-56 shadow-2xl overflow-hidden z-50 bg-white border border-gray-200 rounded-sm"
                    style={{
                      borderTop: "3px solid #CC2222",
                    }}
                  >
                    <a
                      href="/locations"
                      className="block px-4 py-3 text-sm text-[#CC2222] font-bold hover:bg-gray-50 transition-colors border-b border-gray-100"
                      style={{ fontFamily: "Oswald, sans-serif", letterSpacing: "0.06em" }}
                    >
                      VIEW ALL LOCATIONS
                    </a>
                    {SERVICE_LOCATIONS.map((location) => (
                      <a
                        key={location.slug}
                        href={`/locations/${location.slug}`}
                        className="block px-4 py-2.5 text-sm text-[#1B3A6B] hover:text-[#CC2222] hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                        style={{ fontFamily: "Roboto, sans-serif" }}
                      >
                        {location.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <a
                href="/#process"
                className="text-[#1B3A6B] hover:text-[#0D1F3C] text-sm font-medium tracking-widest transition-colors uppercase"
                style={{ fontFamily: "Oswald, sans-serif" }}
              >
                Our Process
              </a>
              <a
                href="/#reviews"
                className="text-[#1B3A6B] hover:text-[#0D1F3C] text-sm font-medium tracking-widest transition-colors uppercase"
                style={{ fontFamily: "Oswald, sans-serif" }}
              >
                Reviews
              </a>
              <a
                href="/#faq"
                className="text-[#1B3A6B] hover:text-[#0D1F3C] text-sm font-medium tracking-widest transition-colors uppercase"
                style={{ fontFamily: "Oswald, sans-serif" }}
              >
                FAQ
              </a>
            </div>

            {/* CTA */}
            <div className="hidden lg:flex items-center gap-4">
              <a
                href="tel:7703735663"
                className="flex items-center gap-2 text-[#1B3A6B] hover:text-[#0D1F3C] transition-colors text-sm font-bold"
                style={{ fontFamily: "Oswald, sans-serif", letterSpacing: "0.04em" }}
              >
                <Phone size={15} className="text-[#CC2222]" />
                (770) 373-5663
              </a>
              <a
                href="/#inspection"
                className="patriot-red-btn px-5 py-2.5 rounded-sm text-sm"
              >
                FREE INSPECTION
              </a>
            </div>

            {/* Mobile toggle */}
            <button
              className="lg:hidden text-[#1B3A6B] p-2"
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
            style={{ backgroundColor: "#FFFFFF", borderColor: "rgba(0,0,0,0.05)" }}
          >
            <div className="container py-4 flex flex-col gap-1">
              {[
                { label: "About", href: "/#about" },
                { label: "Services", href: "/#services" },
                { label: "Our Process", href: "/#process" },
                { label: "Reviews", href: "/#reviews" },
                { label: "FAQ", href: "/#faq" },
                { label: "Locations", href: "/locations" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-[#1B3A6B] hover:text-[#CC2222] py-4 px-3 text-sm font-bold uppercase tracking-widest border-b border-gray-100 last:border-0"
                  style={{ fontFamily: "Oswald, sans-serif" }}
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-4 px-2">
                <div
                  className="text-[#1B3A6B]/50 text-xs uppercase tracking-widest py-2"
                  style={{ fontFamily: "Oswald, sans-serif" }}
                >
                  Service Locations
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {SERVICE_LOCATIONS.map((location) => (
                    <a
                      key={location.slug}
                      href={`/locations/${location.slug}`}
                      onClick={() => setMobileOpen(false)}
                      className="text-[#1B3A6B] hover:text-[#CC2222] py-2.5 px-3 text-[0.7rem] font-bold border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors rounded-sm"
                      style={{ fontFamily: "Oswald, sans-serif" }}
                    >
                      {location.label}
                    </a>
                  ))}
                </div>
              </div>
              <div className="pt-6 flex flex-col gap-3">
                <a
                  href="tel:8445387737"
                  className="flex items-center justify-center gap-2 border-2 border-[#1B3A6B] text-[#1B3A6B] px-4 py-3.5 rounded-sm text-center text-sm font-bold tracking-widest"
                  style={{ fontFamily: "Oswald, sans-serif" }}
                >
                  <Phone size={16} className="text-[#CC2222]" />
                  (770) 373-5663
                </a>
                <a
                  href="/#inspection"
                  className="patriot-red-btn px-4 py-4 rounded-sm text-center text-sm font-bold tracking-widest"
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
