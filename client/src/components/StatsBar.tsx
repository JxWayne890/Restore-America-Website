/*
 * STORM SHIELD DESIGN — Stats Bar
 * Dark green band with animated counters
 */
import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 500, suffix: "+", label: "Homes Restored" },
  { value: 5.0, suffix: "", label: "Google Rating", decimal: true },
  { value: 113, suffix: "+", label: "5-Star Reviews" },
  { value: 98, suffix: "%", label: "Claims Approved" },
  { value: 24, suffix: "/7", label: "Emergency Response" },
];

function AnimatedNumber({ target, suffix, decimal }: { target: number; suffix: string; decimal?: boolean }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const observed = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !observed.current) {
          observed.current = true;
          const duration = 1500;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(decimal ? Math.round(current * 10) / 10 : Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, decimal]);

  return (
    <span ref={ref}>
      {decimal ? count.toFixed(1) : count}
      {suffix}
    </span>
  );
}

export default function StatsBar() {
  return (
    <section className="py-10 relative z-10" style={{ backgroundColor: "#1B3A6B" }}>
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 text-center">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center">
              <div
                className="text-white font-bold mb-1"
                style={{
                  fontFamily: "Oswald, sans-serif",
                  fontSize: "clamp(2rem, 4vw, 2.75rem)",
                  lineHeight: 1,
                }}
              >
                <AnimatedNumber target={stat.value} suffix={stat.suffix} decimal={stat.decimal} />
              </div>
              <div
                className="text-white/60 text-xs tracking-widest uppercase"
                style={{ fontFamily: "Oswald, sans-serif" }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
