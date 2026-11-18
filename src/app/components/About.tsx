import { YarnBall, SmallFlower } from "./FloralDecor";
import aboutImage from "../../imports/IMG_2222.JPG";

export function About() {
  return (
    <section id="about-me" style={{ backgroundColor: "#F8F4EE" }} className="py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div
        style={{
          position: "absolute",
          top: "-60px",
          right: "-60px",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          backgroundColor: "#E7B7B7",
          opacity: 0.07,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-80px",
          left: "-40px",
          width: "250px",
          height: "250px",
          borderRadius: "50%",
          backgroundColor: "#A8B197",
          opacity: 0.08,
        }}
      />

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-14 items-center">
          {/* Left: Portrait */}
          <div className="relative flex justify-center">
            <div
              style={{
                position: "absolute",
                top: "-20px",
                left: "-20px",
                width: "100%",
                height: "100%",
                borderRadius: "40% 60% 60% 40% / 40% 40% 60% 60%",
                border: "3px solid #E7B7B750",
              }}
            />
            <div
              style={{
                borderRadius: "40% 60% 60% 40% / 60% 40% 60% 40%",
                overflow: "hidden",
                boxShadow: "0 16px 50px rgba(74,55,40,0.15)",
                width: "100%",
                maxWidth: "380px",
                aspectRatio: "0.8",
              }}
            >
              <img
                src={aboutImage}
                alt="Riya - Crochet Artist"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            {/* Floating yarn ball */}
            <div className="absolute -bottom-6 -right-4 opacity-80">
              <YarnBall size={80} />
            </div>

            {/* Floating flowers */}
            <div className="absolute -top-3 -right-3">
              <SmallFlower color="#A8B197" />
            </div>
            <div className="absolute top-1/2 -left-5">
              <SmallFlower color="#E7B7B7" />
            </div>
          </div>

          {/* Right: Text */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <SmallFlower color="#E7B7B7" />
              <span style={{ color: "#A8B197", fontFamily: "'Inter', sans-serif" }} className="text-xs tracking-widest uppercase">
                The Maker Behind the Magic
              </span>
            </div>

            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                color: "#4a3728",
                fontSize: "2.4rem",
                fontWeight: 700,
                lineHeight: 1.2,
                marginBottom: "8px",
              }}
            >
              About Me
            </h2>
            <div style={{ backgroundColor: "#E7B7B7" }} className="w-12 h-1 rounded-full mb-6" />

            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                color: "#6b5748",
                lineHeight: "1.9",
                fontSize: "1rem",
                marginBottom: "18px",
              }}
            >
              Hi, I'm <strong style={{ color: "#4a3728" }}>Riya!</strong> I am passionate about creating handmade crochet pieces that bring joy and beauty to everyday life. Every product is carefully crafted with love, attention to detail, and creativity.
            </p>

            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                color: "#6b5748",
                lineHeight: "1.9",
                fontSize: "1rem",
                marginBottom: "24px",
              }}
            >
              I use a super soft, <strong style={{ color: "#4a3728" }}>100% cotton milk yarn</strong> that works up beautifully — giving every piece a luxuriously soft finish that feels as good as it looks.
            </p>

            {/* Yarn info badge */}
            <div
              style={{
                backgroundColor: "#FFFAF6",
                borderRadius: "16px",
                border: "1px solid #E7B7B740",
                padding: "16px 20px",
                boxShadow: "0 4px 16px rgba(74,55,40,0.07)",
                fontFamily: "'Inter', sans-serif",
              }}
              className="inline-block"
            >
              <p style={{ color: "#A8B197", fontSize: "0.72rem", letterSpacing: "0.1em" }} className="uppercase mb-1">
                🧶 What Yarn Do I Use?
              </p>
              <p style={{ color: "#4a3728", fontSize: "0.9rem", fontWeight: 500 }}>
                Super soft, 100% cotton milk yarn — works up beautifully with a premium feel.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
