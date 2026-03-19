/*
 * STORM SHIELD DESIGN — FAQ Section
 * AEO-optimized FAQ with structured data markup
 * Accordion-style with brand styling
 */
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Do you really offer free roof inspections?",
    a: "Yes — 100% complimentary, no strings attached. Our inspectors come to your property, document all damage with photos and detailed reports, and walk you through everything we find. There is no obligation to hire us, and no cost to you for the inspection.",
  },
  {
    q: "How do insurance claims work for storm damage?",
    a: "After a storm, your insurance company sends an adjuster to assess the damage. Unfortunately, adjusters often miss items or undervalue repairs. Our team documents every point of damage before the adjuster arrives, attends the adjuster meeting with you, and fights for the full replacement your home deserves. In most cases, you only pay your deductible.",
  },
  {
    q: "What is the difference between mitigation, packout, and build back?",
    a: "Mitigation is the emergency phase — stopping further damage (tarping, water extraction, board-up). Packout involves carefully removing and storing your belongings so restoration work can proceed safely. Build back is the full reconstruction phase, restoring your home to pre-loss condition. Restore America handles all three phases under one roof.",
  },
  {
    q: "Do you handle fire and flood damage, not just roofing?",
    a: "Absolutely. We are a full-service restoration contractor. We handle fire damage (including smoke and soot mitigation), flood and water damage (including mold prevention), hail damage, wind damage, and complete structural reconstruction. We also manage the entire insurance claim process for all damage types.",
  },
  {
    q: "What if my insurance claim was denied or lowballed?",
    a: "Don't accept a denial or lowball offer without a fight. We provide video evidence, detailed damage reports, and expert documentation to appeal denied claims and supplement underpaid ones. Many of our clients have had initial offers of a few thousand dollars increased to full replacements worth $20,000–$40,000 after our advocacy.",
  },
  {
    q: "How soon can you start after the inspection?",
    a: "In most cases, we can begin emergency mitigation work within 24 hours of your inspection. For full replacement projects, we typically begin within a few days of your insurance claim being approved. We work efficiently to minimize the time your home is exposed to further damage.",
  },
  {
    q: "Do you work on commercial properties?",
    a: "Yes. We serve both residential and commercial clients — from single-family homes to office buildings, warehouses, retail centers, and multi-family units. Our commercial team has experience with flat roofing systems, TPO, EPDM, and metal roofing.",
  },
  {
    q: "What areas do you serve?",
    a: "We currently serve Georgia (including Atlanta metro, Walton County, and surrounding areas), Florida, and Missouri. If you're unsure whether we serve your area, call us at (770) 373-5663 and we'll let you know immediately.",
  },
  {
    q: "What warranties do you provide?",
    a: "We provide both manufacturer warranties on materials (typically 25–50 years on shingles) and workmanship guarantees on our installation. We use premium materials from trusted manufacturers and stand behind every job we complete.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-white py-20">
      <div className="container">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Left: header */}
          <div className="lg:col-span-2">
            <div className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#CC2222", fontFamily: "Oswald, sans-serif" }}>Common Questions</div>
            <h2
              style={{
                color: "#1B3A6B",
                fontFamily: "Oswald, sans-serif",
                fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                fontWeight: 700,
                lineHeight: 1.1,
              }}
            >
              EVERYTHING YOU NEED TO KNOW
            </h2>
            <p
              className="text-gray-600 leading-relaxed mb-8 text-base"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              Have more questions? Our specialists are available Mon–Sat 8am–8pm and 24/7 for emergencies.
            </p>
            <a
              href="tel:7703735663"
              className="inline-flex items-center gap-2 text-white px-6 py-3.5 font-bold tracking-wider uppercase transition-colors text-sm hover:opacity-90"
              style={{ backgroundColor: "#1B3A6B", fontFamily: "Oswald, sans-serif", letterSpacing: "0.1em" }}
            >
              CALL (770) 373-5663
            </a>
          </div>

          {/* Right: FAQ accordion */}
          <div className="lg:col-span-3 flex flex-col gap-2">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <span
                    className="font-semibold text-sm pr-4"
                    style={{ color: "#1B3A6B", fontFamily: "Oswald, sans-serif", letterSpacing: "0.03em" }}
                  >
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${
                      openIndex === i ? "rotate-180" : ""
                    }`}
                    style={{ color: "#CC2222" }}
                  />
                </button>
                {openIndex === i && (
                  <div className="px-5 pb-4 border-t border-gray-100">
                    <p
                      className="text-gray-600 text-sm leading-relaxed pt-3"
                      style={{ fontFamily: "Roboto, sans-serif" }}
                    >
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
