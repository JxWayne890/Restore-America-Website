/*
 * PATRIOT DESIGN — Footer
 * Deep navy background, red accents, white text
 * Logo: American flag emblem
 */
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube } from "lucide-react";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663322351516/3tYmQwW3anv3iwAxp5tEW5/ra-logo-new_fe4cd82a.png";

const services = [
  "Roof Repair & Replacement",
  "Hail Damage Restoration",
  "Wind Damage Repair",
  "Fire Damage Restoration",
  "Flood & Water Damage",
  "Mitigation & Packout",
  "Build Back & Reconstruction",
  "Insurance Claim Management",
  "Commercial Roofing",
];

const serviceAreas = [
  "Atlanta, GA",
  "Walton County, GA",
  "Jersey, GA",
  "Covington, GA",
  "Monroe, GA",
  "Loganville, GA",
  "Orlando, FL",
  "Tampa, FL",
  "St. Louis, MO",
  "Kansas City, MO",
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: "#0D1F3C" }}>
      {/* Flag stripe top accent */}
      <div className="flag-stripe-divider" />

      {/* Main footer */}
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <img
                src={LOGO_URL}
                alt="Restore America Roofing & Restoration"
                className="h-14 w-14 object-contain"
              />
              <div>
                <div
                  className="text-white font-black leading-tight"
                  style={{ fontFamily: "Oswald, sans-serif", fontSize: "1rem", letterSpacing: "0.06em" }}
                >
                  RESTORE AMERICA
                </div>
                <div className="text-white/50 text-[0.6rem] tracking-[0.2em] uppercase mt-0.5">
                  Roofing & Restoration
                </div>
              </div>
            </div>
            <p
              className="text-white/55 text-sm leading-relaxed mb-6"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              Full-service roofing and disaster restoration contractor serving Georgia, Florida, and Missouri.
              We fight for your insurance claim and restore your home to pre-loss condition.
            </p>
            <div className="flex flex-col gap-3">
              <a
                href="tel:8445387737"
                className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm"
              >
                <Phone className="w-4 h-4" style={{ color: "#CC2222" }} />
                <span style={{ fontFamily: "Roboto, sans-serif" }}>844-LETS-RESTORE</span>
              </a>
              <a
                href="tel:7703735663"
                className="flex items-center gap-2 text-white/55 hover:text-white transition-colors text-sm"
              >
                <Phone className="w-4 h-4" />
                <span style={{ fontFamily: "Roboto, sans-serif" }}>(770) 373-5663</span>
              </a>
              <a
                href="mailto:office@gorestoreamerica.com"
                className="flex items-center gap-2 text-white/55 hover:text-white transition-colors text-sm"
              >
                <Mail className="w-4 h-4" />
                <span style={{ fontFamily: "Roboto, sans-serif" }}>office@gorestoreamerica.com</span>
              </a>
              <div className="flex items-start gap-2 text-white/55 text-sm">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span style={{ fontFamily: "Roboto, sans-serif" }}>137 Main St, Jersey, GA 30018</span>
              </div>
            </div>
            {/* Social links */}
            <div className="flex items-center gap-3 mt-6">
              <a
                href="https://www.facebook.com/share/14Y8hK53wNQ/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-white/20 hover:border-white/60 flex items-center justify-center transition-all"
                style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
              >
                <Facebook className="w-4 h-4 text-white" />
              </a>
              <a
                href="https://www.instagram.com/letsrestoreamerica"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-white/20 hover:border-white/60 flex items-center justify-center transition-all"
                style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
              >
                <Instagram className="w-4 h-4 text-white" />
              </a>
              <a
                href="#"
                className="w-9 h-9 border border-white/20 hover:border-white/60 flex items-center justify-center transition-all"
                style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
              >
                <Youtube className="w-4 h-4 text-white" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4
              className="text-white font-bold mb-5 text-sm tracking-widest uppercase"
              style={{ fontFamily: "Oswald, sans-serif" }}
            >
              Our Services
            </h4>
            <ul className="flex flex-col gap-2">
              {services.map((service) => (
                <li key={service}>
                  <a
                    href="#services"
                    className="text-white/55 hover:text-white text-sm transition-colors flex items-center gap-2"
                    style={{ fontFamily: "Roboto, sans-serif" }}
                  >
                    <span className="w-1 h-1 flex-shrink-0 rounded-full" style={{ backgroundColor: "#CC2222" }} />
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Areas */}
          <div>
            <h4
              className="text-white font-bold mb-5 text-sm tracking-widest uppercase"
              style={{ fontFamily: "Oswald, sans-serif" }}
            >
              Service Areas
            </h4>
            <ul className="flex flex-col gap-2">
              {serviceAreas.map((area) => (
                <li key={area}>
                  <span
                    className="text-white/55 text-sm flex items-center gap-2"
                    style={{ fontFamily: "Roboto, sans-serif" }}
                  >
                    <span className="w-1 h-1 flex-shrink-0 rounded-full" style={{ backgroundColor: "#1B3A6B" }} />
                    {area}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Emergency CTA */}
          <div>
            <h4
              className="text-white font-bold mb-5 text-sm tracking-widest uppercase"
              style={{ fontFamily: "Oswald, sans-serif" }}
            >
              Emergency Response
            </h4>
            <div
              className="p-5 mb-5 border-l-4"
              style={{ backgroundColor: "rgba(27,58,107,0.5)", borderLeftColor: "#CC2222" }}
            >
              <div
                className="text-xs tracking-widest uppercase mb-2"
                style={{ color: "#CC2222", fontFamily: "Oswald, sans-serif" }}
              >
                24/7 Emergency Line
              </div>
              <a
                href="tel:8445387737"
                className="text-white font-black text-xl block mb-1 hover:text-red-300 transition-colors"
                style={{ fontFamily: "Oswald, sans-serif" }}
              >
                844-LETS-RESTORE
              </a>
              <p
                className="text-white/50 text-xs"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                Immediate response for fire, flood, and storm emergencies
              </p>
            </div>
            <a
              href="#inspection"
              className="block text-white text-center py-3.5 font-bold tracking-wider uppercase transition-colors text-sm hover:opacity-90"
              style={{ backgroundColor: "#CC2222", fontFamily: "Oswald, sans-serif", letterSpacing: "0.1em" }}
            >
              FREE INSPECTION
            </a>

            {/* Trust badges */}
            <div className="mt-5 flex flex-col gap-2">
              {["Licensed & Insured", "BBB Accredited", "5-Star Google Rated"].map((badge) => (
                <div
                  key={badge}
                  className="flex items-center gap-2 text-white/50 text-xs"
                  style={{ fontFamily: "Roboto, sans-serif" }}
                >
                  <span className="w-3 h-3 border border-green-500 flex items-center justify-center flex-shrink-0">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  </span>
                  {badge}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t py-5" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="container flex flex-col md:flex-row justify-between items-center gap-3">
          <p
            className="text-white/35 text-xs"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            © {year} Restore America Roofing & Restoration. All rights reserved. | Jersey, GA 30018
          </p>
          <div className="flex items-center gap-4">
            {["Privacy Policy", "Terms of Service", "Sitemap"].map((link) => (
              <a
                key={link}
                href="#"
                className="text-white/35 hover:text-white/70 text-xs transition-colors"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
