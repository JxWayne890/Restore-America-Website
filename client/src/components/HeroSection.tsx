/*
 * PATRIOT DESIGN — Hero Section
 * Background: Patriotic aerial hero image (roofing crew + American flags)
 * Colors: Navy overlay, red accents, white text
 * Messaging from FB: 844-LETS-RESTORE, water/fire/tree/roof damage
 */
import { useState } from "react";
import { Flame, Droplets, CloudHail, Wind, ArrowRight, Phone, Star, CheckCircle2, TreePine, Shield } from "lucide-react";
import { trpc } from "@/lib/trpc";

const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663322351516/3tYmQwW3anv3iwAxp5tEW5/ra-hero-patriotic_ca160d01.jpg";

const damageTypes = [
  { id: "hail", label: "Hail Damage", icon: CloudHail, color: "#1B3A6B", desc: "Hail & Wind Storm" },
  { id: "wind", label: "Wind Damage", icon: Wind, color: "#1B3A6B", desc: "High Wind Events" },
  { id: "fire", label: "Fire Damage", icon: Flame, color: "#CC2222", desc: "Fire & Smoke" },
  { id: "flood", label: "Flood Damage", icon: Droplets, color: "#1B3A6B", desc: "Water & Flooding" },
  { id: "tree", label: "Tree Damage", icon: TreePine, color: "#2D6A4F", desc: "Impact & Debris" },
  { id: "roof", label: "Roof Damage", icon: Shield, color: "#1B3A6B", desc: "Wear & Aging" },
];

const formSteps = [
  {
    id: 1,
    question: "What type of damage do you have?",
    field: "damageType",
    type: "damage-select",
  },
  {
    id: 2,
    question: "Are you the property owner?",
    field: "isOwner",
    type: "radio",
    options: ["Yes, I own this property", "No, I manage / rent it"],
  },
  {
    id: 3,
    question: "Have you filed an insurance claim yet?",
    field: "claimFiled",
    type: "radio",
    options: ["Not yet — need guidance", "Yes, claim is open", "Claim was denied"],
  },
  {
    id: 4,
    question: "Your contact information",
    field: "contact",
    type: "contact",
  },
];

export default function HeroSection() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [selectedDamage, setSelectedDamage] = useState<string | null>(null);

  const currentStep = formSteps[step];
  const progress = ((step) / formSteps.length) * 100;

  const handleNext = () => {
    if (step < formSteps.length - 1) {
      setStep(step + 1);
    }
  };

  const handleSelect = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (field === "damageType") {
      setSelectedDamage(value);
      setTimeout(() => setStep(1), 300);
    } else if (field !== "contact") {
      setTimeout(() => handleNext(), 300);
    }
  };

  const submitLead = trpc.leads.submit.useMutation({
    onSuccess: () => setSubmitted(true),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    // Map form data to API input
    const claimMap: Record<string, any> = {
      "Not yet — need guidance": "not_filed",
      "Yes, claim is open": "open",
      "Claim was denied": "denied",
    };
    submitLead.mutate({
      name: formData.name,
      phone: formData.phone,
      address: formData.address || undefined,
      damageType: (formData.damageType as any) || "other",
      isOwner: formData.isOwner !== "No, I manage / rent it",
      claimStatus: claimMap[formData.claimFiled] ?? "not_filed",
      source: "website",
    });
  };

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
          <div id="inspection">
            <div
              className="bg-white/98 shadow-2xl shadow-black/40"
              style={{ borderTop: "4px solid #CC2222" }}
            >
              {/* Form header */}
              <div className="px-6 py-5" style={{ backgroundColor: "#1B3A6B" }}>
                <h2
                  className="text-white text-xl font-bold"
                  style={{ fontFamily: "Oswald, sans-serif", letterSpacing: "0.05em" }}
                >
                  GET YOUR FREE INSPECTION
                </h2>
                <p className="text-white/60 text-sm mt-1" style={{ fontFamily: "Roboto, sans-serif" }}>
                  Takes 60 seconds · No obligation · We come to you
                </p>
              </div>

              {/* Progress bar */}
              {!submitted && (
                <div className="h-1 bg-gray-100">
                  <div
                    className="h-full transition-all duration-500"
                    style={{ backgroundColor: "#CC2222", width: `${progress}%` }}
                  />
                </div>
              )}

              <div className="p-6">
                {submitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "#1B3A6B" }}>
                      <CheckCircle2 className="w-8 h-8 text-white" />
                    </div>
                    <h3
                      className="text-[#1B3A6B] text-2xl font-bold mb-2"
                      style={{ fontFamily: "Oswald, sans-serif" }}
                    >
                      REQUEST RECEIVED!
                    </h3>
                    <p className="text-gray-600 text-sm mb-4" style={{ fontFamily: "Roboto, sans-serif" }}>
                      A specialist will contact you within 15 minutes during business hours.
                    </p>
                    <a
                      href="tel:7703735663"
                      className="inline-flex items-center gap-2 text-white px-6 py-3 font-bold uppercase tracking-wider text-sm"
                      style={{ backgroundColor: "#CC2222", fontFamily: "Oswald, sans-serif" }}
                    >
                      <Phone className="w-4 h-4" />
                      CALL NOW: 844-LETS-RESTORE
                    </a>
                  </div>
                ) : (
                  <>
                    <div className="mb-5">
                      <div className="text-xs text-gray-400 mb-1" style={{ fontFamily: "Oswald, sans-serif", letterSpacing: "0.1em" }}>
                        STEP {step + 1} OF {formSteps.length}
                      </div>
                      <p
                        className="font-semibold text-base"
                        style={{ color: "#1B3A6B", fontFamily: "Oswald, sans-serif", letterSpacing: "0.03em" }}
                      >
                        {currentStep.question}
                      </p>
                    </div>

                    {/* Damage type selector */}
                    {currentStep.type === "damage-select" && (
                      <div className="grid grid-cols-2 gap-3">
                        {damageTypes.map((d) => {
                          const Icon = d.icon;
                          return (
                            <button
                              key={d.id}
                              onClick={() => handleSelect("damageType", d.id)}
                              className={`p-4 border-2 text-left transition-all group ${
                                formData.damageType === d.id
                                  ? "border-[#1B3A6B] bg-blue-50"
                                  : "border-gray-200 hover:border-[#1B3A6B]"
                              }`}
                            >
                              <Icon
                                className="w-6 h-6 mb-2"
                                style={{ color: d.color }}
                              />
                              <div
                                className="text-[#1B3A6B] font-bold text-sm"
                                style={{ fontFamily: "Oswald, sans-serif", letterSpacing: "0.05em" }}
                              >
                                {d.label}
                              </div>
                              <div className="text-gray-500 text-xs mt-0.5" style={{ fontFamily: "Roboto, sans-serif" }}>
                                {d.desc}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Radio options */}
                    {currentStep.type === "radio" && currentStep.options && (
                      <div className="flex flex-col gap-3">
                        {currentStep.options.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => handleSelect(currentStep.field, opt)}
                            className={`p-4 border-2 text-left transition-all ${
                              formData[currentStep.field] === opt
                                ? "border-[#1B3A6B] bg-blue-50"
                                : "border-gray-200 hover:border-[#1B3A6B]"
                            }`}
                          >
                            <span
                              className="text-[#1B3A6B] font-medium text-sm"
                              style={{ fontFamily: "Roboto, sans-serif" }}
                            >
                              {opt}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Contact form */}
                    {currentStep.type === "contact" && (
                      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                        <input
                          type="text"
                          placeholder="Your Full Name *"
                          required
                          className="border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#1B3A6B] w-full"
                          style={{ fontFamily: "Roboto, sans-serif" }}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <input
                          type="tel"
                          placeholder="Phone Number *"
                          required
                          className="border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#1B3A6B] w-full"
                          style={{ fontFamily: "Roboto, sans-serif" }}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                        <input
                          type="text"
                          placeholder="Property Address *"
                          required
                          className="border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#1B3A6B] w-full"
                          style={{ fontFamily: "Roboto, sans-serif" }}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                        <button
                          type="submit"
                          disabled={submitLead.isPending}
                          className="text-white py-4 font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-colors mt-1 hover:opacity-90 disabled:opacity-60"
                          style={{ backgroundColor: "#CC2222", fontFamily: "Oswald, sans-serif", letterSpacing: "0.12em" }}
                        >
                          {submitLead.isPending ? "SUBMITTING..." : "CLAIM MY FREE INSPECTION"}
                          <ArrowRight className="w-4 h-4" />
                        </button>
                        {submitLead.isError && (
                          <p className="text-red-600 text-xs text-center">Error submitting. Please call 844-LETS-RESTORE directly.</p>
                        )}
                        <p className="text-gray-400 text-xs text-center" style={{ fontFamily: "Roboto, sans-serif" }}>
                          No spam. No obligation. We respect your privacy.
                        </p>
                      </form>
                    )}

                    {/* Back button */}
                    {step > 0 && currentStep.type !== "damage-select" && (
                      <button
                        onClick={() => setStep(step - 1)}
                        className="mt-4 text-gray-400 hover:text-gray-600 text-xs underline"
                        style={{ fontFamily: "Roboto, sans-serif" }}
                      >
                        ← Go back
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
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
