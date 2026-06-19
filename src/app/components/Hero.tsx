import { Instagram, MessageCircle } from "lucide-react";
import { FloralTopLeft, FloralTopRight, YarnBall, SmallFlower } from "./FloralDecor";
import heroImage from "../../imports/image.png";

export function Hero() {
  return (
    <section
      id="home"
      style={{ backgroundColor: "#F8F4EE" }}
      className="relative overflow-hidden py-16 md:py-24"
    >
      <FloralTopLeft />
      <FloralTopRight />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <SmallFlower color="#E7B7B7" />
              <span style={{ color: "#A8B197", fontFamily: "'Inter', sans-serif" }} className="text-sm tracking-widest uppercase">
                Handcrafted with Love
              </span>
              <SmallFlower color="#A8B197" />
            </div>

            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                color: "#4a3728",
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                lineHeight: "1.15",
                fontWeight: 700,
              }}
              className="mb-4"
            >
              Riya's<br />
              <span style={{ color: "#E7B7B7" }}>Crochet</span><br />
              Corner
            </h1>

            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                color: "#6b5748",
                fontSize: "1.2rem",
                fontStyle: "italic",
              }}
              className="mb-4"
            >
              Handmade Crochet Creations Made With Love
            </p>

            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                color: "#8a6d5e",
                lineHeight: "1.7",
              }}
              className="mb-8 max-w-md"
            >
              Discover unique crochet flowers, bouquets, keychains, and custom gifts handcrafted with care. Each piece is made with 100% cotton milk yarn — super soft and beautifully crafted just for you.
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href="#shop"
                style={{
                  backgroundColor: "#E7B7B7",
                  color: "#fff",
                  fontFamily: "'Inter', sans-serif",
                  boxShadow: "0 4px 15px #E7B7B740",
                }}
                className="px-7 py-3 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Shop Now
              </a>

              <a
                href="#contact"
                style={{
                  backgroundColor: "#A8B197",
                  color: "#fff",
                  fontFamily: "'Inter', sans-serif",
                  boxShadow: "0 4px 15px #A8B19740",
                }}
                className="px-7 py-3 rounded-full text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <MessageCircle size={16} />
                Order Online
              </a>

              <a
                href="https://www.instagram.com/riyabhutal_"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  border: "2px solid #E7B7B7",
                  color: "#E7B7B7",
                  fontFamily: "'Inter', sans-serif",
                }}
                className="px-7 py-3 rounded-full text-sm font-medium hover:bg-pink-50 transition-colors flex items-center gap-2"
              >
                <Instagram size={16} />
                Follow on Instagram
              </a>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-10">
              {[
                { num: "500+", label: "Happy Customers" },
                { num: "100%", label: "Handmade" },
                { num: "50+", label: "Products" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div
                    style={{ fontFamily: "'Playfair Display', serif", color: "#4a3728" }}
                    className="text-2xl font-bold"
                  >
                    {stat.num}
                  </div>
                  <div
                    style={{ fontFamily: "'Inter', sans-serif", color: "#8a6d5e" }}
                    className="text-xs"
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Image */}
          <div className="relative flex justify-center">
            {/* Decorative blob background */}
            <div
              style={{
                backgroundColor: "#FDF0F0",
                borderRadius: "60% 40% 70% 30% / 50% 60% 40% 60%",
                width: "100%",
                maxWidth: "480px",
                aspectRatio: "1",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />

            {/* Floating flowers */}
            <div className="absolute -top-4 -left-4 z-20">
              <SmallFlower color="#E7B7B7" />
            </div>
            <div className="absolute top-8 -right-6 z-20">
              <SmallFlower color="#A8B197" />
            </div>
            <div className="absolute -bottom-4 left-8 z-20">
              <SmallFlower color="#E7B7B7" />
            </div>

            {/* Main product image */}
            <div
              style={{
                borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
                overflow: "hidden",
                boxShadow: "0 20px 60px rgba(74,55,40,0.15)",
                width: "100%",
                maxWidth: "420px",
                aspectRatio: "0.85",
                position: "relative",
                zIndex: 10,
              }}
            >
              <img
                src={heroImage}
                alt="Viral Crochet Bouquet - handmade with red flowers"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            {/* Yarn ball decoration */}
            <div className="absolute -bottom-6 -right-4 z-20 opacity-80">
              <YarnBall size={70} />
            </div>

            {/* Tag decoration */}
            <div
              style={{
                backgroundColor: "#FFFAF6",
                borderRadius: "12px",
                boxShadow: "0 8px 24px rgba(74,55,40,0.12)",
                fontFamily: "'Inter', sans-serif",
                border: "1px solid #E7B7B730",
              }}
              className="absolute bottom-10 -left-4 z-20 px-4 py-2.5 hidden md:block"
            >
              <div style={{ color: "#4a3728" }} className="text-xs font-semibold">
                ✨ Bestseller
              </div>
              <div style={{ color: "#E7B7B7" }} className="text-sm font-bold">
                Viral Bouquet ₹850
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
