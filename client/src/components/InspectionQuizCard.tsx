import { trpc } from "@/lib/trpc";
import {
  ArrowRight,
  CheckCircle2,
  CloudHail,
  Droplets,
  Flame,
  Phone,
  Shield,
  TreePine,
  Wind,
} from "lucide-react";
import { type FormEvent, useMemo, useState } from "react";

type DamageType = "hail" | "wind" | "fire" | "flood" | "tree" | "roof" | "other";
type ClaimStatus = "not_filed" | "open" | "denied" | "paid";
type LeadSource =
  | "website"
  | "facebook"
  | "google"
  | "referral"
  | "storm_canvass"
  | "other";
type QuizField = "damageType" | "isOwner" | "claimFiled";

type QuizFormState = {
  damageType?: DamageType;
  isOwner?: string;
  claimFiled?: string;
  name?: string;
  phone?: string;
  address?: string;
};

type DamageOption = {
  id: DamageType;
  label: string;
  icon: typeof CloudHail;
  color: string;
  desc: string;
};

type QuizStep = {
  id: number;
  question: string;
  field: QuizField | "contact";
  type: "damage-select" | "radio" | "contact";
  options?: string[];
};

const damageOptions: DamageOption[] = [
  { id: "hail", label: "Hail Damage", icon: CloudHail, color: "#1B3A6B", desc: "Hail & Wind Storm" },
  { id: "wind", label: "Wind Damage", icon: Wind, color: "#1B3A6B", desc: "High Wind Events" },
  { id: "fire", label: "Fire Damage", icon: Flame, color: "#CC2222", desc: "Fire & Smoke" },
  { id: "flood", label: "Flood Damage", icon: Droplets, color: "#1B3A6B", desc: "Water & Flooding" },
  { id: "tree", label: "Tree Damage", icon: TreePine, color: "#2D6A4F", desc: "Impact & Debris" },
  { id: "roof", label: "Roof Damage", icon: Shield, color: "#1B3A6B", desc: "Wear & Aging" },
];

const quizSteps: QuizStep[] = [
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

type InspectionQuizCardProps = {
  id?: string;
  className?: string;
  leadSource?: LeadSource;
  title?: string;
  subtitle?: string;
};

export default function InspectionQuizCard({
  id,
  className = "",
  leadSource = "website",
  title = "GET YOUR FREE INSPECTION",
  subtitle = "Takes 60 seconds · No obligation · We come to you",
}: InspectionQuizCardProps) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<QuizFormState>({});
  const [submitted, setSubmitted] = useState(false);

  const currentStep = quizSteps[step];
  const progress = useMemo(
    () => (step / quizSteps.length) * 100,
    [step]
  );

  const submitLead = trpc.leads.submit.useMutation({
    onSuccess: () => setSubmitted(true),
  });

  const handleSelect = (field: QuizField, value: string) => {
    if (field === "damageType") {
      setFormData((prev) => ({ ...prev, damageType: value as DamageType }));
      setTimeout(() => setStep(1), 300);
      return;
    }

    if (field === "isOwner") {
      setFormData((prev) => ({ ...prev, isOwner: value }));
      setTimeout(() => setStep((prev) => Math.min(prev + 1, quizSteps.length - 1)), 300);
      return;
    }

    setFormData((prev) => ({ ...prev, claimFiled: value }));
    setTimeout(() => setStep((prev) => Math.min(prev + 1, quizSteps.length - 1)), 300);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData.name || !formData.phone) return;

    const claimMap: Record<string, ClaimStatus> = {
      "Not yet — need guidance": "not_filed",
      "Yes, claim is open": "open",
      "Claim was denied": "denied",
    };

    submitLead.mutate({
      name: formData.name,
      phone: formData.phone,
      address: formData.address || undefined,
      damageType: formData.damageType ?? "other",
      isOwner: formData.isOwner !== "No, I manage / rent it",
      claimStatus: claimMap[formData.claimFiled ?? ""] ?? "not_filed",
      source: leadSource,
    });
  };

  return (
    <div id={id} className={className}>
      <div
        className="bg-white/98 shadow-2xl shadow-black/20"
        style={{ borderTop: "4px solid #CC2222" }}
      >
        <div className="px-6 py-5" style={{ backgroundColor: "#1B3A6B" }}>
          <h2
            className="text-white text-xl font-bold"
            style={{ fontFamily: "Oswald, sans-serif", letterSpacing: "0.05em" }}
          >
            {title}
          </h2>
          <p className="text-white/60 text-sm mt-1" style={{ fontFamily: "Roboto, sans-serif" }}>
            {subtitle}
          </p>
        </div>

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
                  STEP {step + 1} OF {quizSteps.length}
                </div>
                <p
                  className="font-semibold text-base"
                  style={{ color: "#1B3A6B", fontFamily: "Oswald, sans-serif", letterSpacing: "0.03em" }}
                >
                  {currentStep.question}
                </p>
              </div>

              {currentStep.type === "damage-select" && (
                <div className="grid grid-cols-2 gap-3">
                  {damageOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.id}
                        onClick={() => handleSelect("damageType", option.id)}
                        className={`p-4 border-2 text-left transition-all group ${
                          formData.damageType === option.id
                            ? "border-[#1B3A6B] bg-blue-50"
                            : "border-gray-200 hover:border-[#1B3A6B]"
                        }`}
                      >
                        <Icon className="w-6 h-6 mb-2" style={{ color: option.color }} />
                        <div
                          className="text-[#1B3A6B] font-bold text-sm"
                          style={{ fontFamily: "Oswald, sans-serif", letterSpacing: "0.05em" }}
                        >
                          {option.label}
                        </div>
                        <div className="text-gray-500 text-xs mt-0.5" style={{ fontFamily: "Roboto, sans-serif" }}>
                          {option.desc}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {currentStep.type === "radio" && currentStep.options && (
                <div className="flex flex-col gap-3">
                  {currentStep.options.map((option) => {
                    const field = currentStep.field === "contact" ? "isOwner" : currentStep.field;
                    const selectedValue =
                      field === "isOwner" ? formData.isOwner : formData.claimFiled;

                    return (
                      <button
                        key={option}
                        onClick={() => handleSelect(field, option)}
                        className={`p-4 border-2 text-left transition-all ${
                          selectedValue === option
                            ? "border-[#1B3A6B] bg-blue-50"
                            : "border-gray-200 hover:border-[#1B3A6B]"
                        }`}
                      >
                        <span
                          className="text-[#1B3A6B] font-medium text-sm"
                          style={{ fontFamily: "Roboto, sans-serif" }}
                        >
                          {option}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {currentStep.type === "contact" && (
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                  <input
                    type="text"
                    placeholder="Your Full Name *"
                    required
                    className="border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#1B3A6B] w-full"
                    style={{ fontFamily: "Roboto, sans-serif" }}
                    onChange={(event) =>
                      setFormData((prev) => ({ ...prev, name: event.target.value }))
                    }
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    required
                    className="border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#1B3A6B] w-full"
                    style={{ fontFamily: "Roboto, sans-serif" }}
                    onChange={(event) =>
                      setFormData((prev) => ({ ...prev, phone: event.target.value }))
                    }
                  />
                  <input
                    type="text"
                    placeholder="Property Address *"
                    required
                    className="border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#1B3A6B] w-full"
                    style={{ fontFamily: "Roboto, sans-serif" }}
                    onChange={(event) =>
                      setFormData((prev) => ({ ...prev, address: event.target.value }))
                    }
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
                    <p className="text-red-600 text-xs text-center">
                      Error submitting. Please call 844-LETS-RESTORE directly.
                    </p>
                  )}
                  <p className="text-gray-400 text-xs text-center" style={{ fontFamily: "Roboto, sans-serif" }}>
                    No spam. No obligation. We respect your privacy.
                  </p>
                </form>
              )}

              {step > 0 && currentStep.type !== "damage-select" && (
                <button
                  onClick={() => setStep((prev) => Math.max(prev - 1, 0))}
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
  );
}
