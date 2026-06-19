import { SmallFlower } from "./FloralDecor";

const reasons = [
  {
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="18" r="17" stroke="#E7B7B7" strokeWidth="1.5" />
        <path d="M10 22 Q14 14 18 18 Q22 22 26 14" stroke="#E7B7B7" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="18" cy="12" r="2.5" stroke="#E7B7B7" strokeWidth="1.5" fill="none" />
        <path d="M13 26 L23 26" stroke="#E7B7B7" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: "100% Handmade",
    desc: "Every single stitch is crafted by hand with care and dedication. No machines — just love and skill.",
    color: "#FDF0F0",
    accent: "#E7B7B7",
  },
  {
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="18" r="17" stroke="#A8B197" strokeWidth="1.5" />
        <rect x="10" y="13" width="16" height="12" rx="3" stroke="#A8B197" strokeWidth="1.5" />
        <path d="M14 13 V11 Q14 9 18 9 Q22 9 22 11 V13" stroke="#A8B197" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M15 19 L17 21 L21 17" stroke="#A8B197" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Quality Assured",
    desc: "Every crochet creation is carefully checked before it reaches you, ensuring beautiful craftsmanship and lasting quality.",
    color: "#F2F5EF",
    accent: "#A8B197",
  },
  {
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="18" r="17" stroke="#C4A882" strokeWidth="1.5" />
        <path d="M12 20 Q18 10 24 20" stroke="#C4A882" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <rect x="10" y="20" width="16" height="3" rx="1.5" stroke="#C4A882" strokeWidth="1.5" />
        <rect x="13" y="23" width="10" height="2.5" rx="1" stroke="#C4A882" strokeWidth="1.5" />
        <path d="M18 10 V8" stroke="#C4A882" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M18 8 Q20 6 22 8" stroke="#C4A882" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </svg>
    ),
    title: "Perfect for Gifting",
    desc: "Beautiful, meaningful, and unique — our crochet creations make heartfelt gifts for birthdays, anniversaries, and every occasion.",
    color: "#FBF6EF",
    accent: "#C4A882",
  },
  {
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="18" r="17" stroke="#E7B7B7" strokeWidth="1.5" />
        <path d="M18 26 L10 18 Q8 14 12 12 Q15 10 18 14 Q21 10 24 12 Q28 14 26 18 Z" stroke="#E7B7B7" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      </svg>
    ),
    title: "Made With Love",
    desc: "Each piece carries the warmth and joy poured into it during creation. You can feel the love in every stitch.",
    color: "#FDF0F0",
    accent: "#E7B7B7",
  },
];

export function WhyChooseUs() {
  return (
    <section style={{ backgroundColor: "#FFFAF6" }} className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-14">
          <div className="flex justify-center items-center gap-3 mb-3">
            <SmallFlower color="#A8B197" />
            <span style={{ color: "#A8B197", fontFamily: "'Inter', sans-serif" }} className="text-xs tracking-widest uppercase">
              Our Promise to You
            </span>
            <SmallFlower color="#E7B7B7" />
          </div>
          <h2
            style={{ fontFamily: "'Playfair Display', serif", color: "#4a3728", fontSize: "2.4rem", fontWeight: 700 }}
          >
            Why Choose Us
          </h2>
          <div style={{ backgroundColor: "#A8B197" }} className="w-16 h-1 rounded-full mx-auto mt-3" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason) => (
            <div
              key={reason.title}
              style={{
                backgroundColor: reason.color,
                borderRadius: "20px",
                border: `1px solid ${reason.accent}30`,
                boxShadow: "0 4px 18px rgba(74,55,40,0.07)",
                padding: "28px 22px",
                textAlign: "center",
                transition: "transform 0.2s",
              }}
              className="hover:-translate-y-1"
            >
              <div className="flex justify-center mb-4">{reason.icon}</div>
              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: "#4a3728",
                  fontSize: "1.05rem",
                  fontWeight: 600,
                  marginBottom: "10px",
                }}
              >
                {reason.title}
              </h3>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  color: "#7a6050",
                  fontSize: "0.85rem",
                  lineHeight: "1.7",
                }}
              >
                {reason.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
