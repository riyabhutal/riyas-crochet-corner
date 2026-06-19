import { Instagram, Heart } from "lucide-react";
import { SmallFlower } from "./FloralDecor";

export function Footer() {
  const quickLinks = ["Home", "Shop", "About Me", "Reviews", "Contact"];
  const shopInfo = ["Viral Crochet Bouquet", "Keychains", "Fishnet Sleeves", "Crochet Scarf", "Crochet Froggy", "Custom Gifts"];

  return (
    <footer style={{ backgroundColor: "#4a3728" }} className="relative overflow-hidden">
      {/* Decorative top border */}
      <div style={{ height: "4px", background: "linear-gradient(90deg, #E7B7B7, #A8B197, #E7B7B7)" }} />

      {/* Top footer area */}
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <svg width="40" height="40" viewBox="0 0 44 44" fill="none">
                <circle cx="22" cy="22" r="22" fill="#E7B7B730" />
                <ellipse cx="22" cy="24" rx="8" ry="6" fill="#E7B7B7" opacity="0.5" />
                <circle cx="22" cy="18" r="6" fill="#E7B7B7" />
                <path d="M16 18 Q18 14 22 16 Q26 14 28 18" stroke="#c49090" strokeWidth="1.2" fill="none" />
                <path d="M18 20 Q22 24 26 20" stroke="#c49090" strokeWidth="1" fill="none" />
                <circle cx="22" cy="18" r="2" fill="#fff" opacity="0.6" />
                <path d="M14 26 Q18 30 22 28 Q26 30 30 26" stroke="#A8B197" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              </svg>
              <div>
                <p style={{ fontFamily: "'Playfair Display', serif", color: "#F8F4EE", fontSize: "1rem", fontWeight: 600 }}>
                  Riya's Crochet Corner
                </p>
                <p style={{ fontFamily: "'Inter', sans-serif", color: "#A8B197", fontSize: "0.7rem", letterSpacing: "0.1em" }} className="uppercase">
                  Handmade with Love
                </p>
              </div>
            </div>
            <p style={{ fontFamily: "'Inter', sans-serif", color: "#c4a090", fontSize: "0.83rem", lineHeight: "1.7" }}>
              Unique crochet creations made with 100% cotton milk yarn — soft, beautiful, and crafted just for you.
            </p>
            <div className="flex gap-3 mt-5">
              <a
                href="https://www.instagram.com/riyabhutal_"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  backgroundColor: "#E7B7B720",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#E7B7B7",
                }}
                className="hover:opacity-70 transition-opacity"
              >
                <Instagram size={17} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontFamily: "'Playfair Display', serif", color: "#F8F4EE", fontSize: "1rem", fontWeight: 600, marginBottom: "14px" }}>
              Quick Links
            </h4>
            <ul className="flex flex-col gap-2">
              {quickLinks.map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase().replace(" ", "-")}`}
                    style={{ fontFamily: "'Inter', sans-serif", color: "#c4a090", fontSize: "0.83rem" }}
                    className="hover:text-pink-300 transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop Info */}
          <div>
            <h4 style={{ fontFamily: "'Playfair Display', serif", color: "#F8F4EE", fontSize: "1rem", fontWeight: 600, marginBottom: "14px" }}>
              Shop
            </h4>
            <ul className="flex flex-col gap-2">
              {shopInfo.map((item) => (
                <li key={item}>
                  <a
                    href="#shop"
                    style={{ fontFamily: "'Inter', sans-serif", color: "#c4a090", fontSize: "0.83rem" }}
                    className="hover:text-pink-300 transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Floral */}
          <div>
            <h4 style={{ fontFamily: "'Playfair Display', serif", color: "#F8F4EE", fontSize: "1rem", fontWeight: 600, marginBottom: "14px" }}>
              Reach Us
            </h4>
            <div className="flex flex-col gap-3">
              <div style={{ fontFamily: "'Inter', sans-serif", color: "#c4a090", fontSize: "0.83rem" }}>
                <p style={{ color: "#A8B197", marginBottom: "2px", fontSize: "0.72rem" }} className="uppercase">Instagram</p>
                <a href="https://www.instagram.com/riyabhutal_" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                  @riyabhutal_
                </a>
              </div>
              <div style={{ fontFamily: "'Inter', sans-serif", color: "#c4a090", fontSize: "0.83rem" }}>
                <p style={{ color: "#A8B197", marginBottom: "2px", fontSize: "0.72rem" }} className="uppercase">UPI Payment</p>
                <span style={{ fontFamily: "monospace" }}>riyabhutal@okaxis</span>
              </div>
              <div style={{ fontFamily: "'Inter', sans-serif", color: "#c4a090", fontSize: "0.83rem" }}>
                <p style={{ color: "#A8B197", marginBottom: "2px", fontSize: "0.72rem" }} className="uppercase">Yarn</p>
                <span>100% Cotton Milk Yarn</span>
              </div>
            </div>

            {/* Floral decoration */}
            <div className="mt-6 flex gap-2 opacity-50">
              <SmallFlower color="#E7B7B7" />
              <SmallFlower color="#A8B197" />
              <SmallFlower color="#E7B7B7" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid #6b5748" }} className="py-5 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p style={{ fontFamily: "'Inter', sans-serif", color: "#8a6d5e", fontSize: "0.78rem" }}>
            © 2025 Riya's Crochet Corner · All rights reserved
          </p>
          <p style={{ fontFamily: "'Inter', sans-serif", color: "#8a6d5e", fontSize: "0.78rem", display: "flex", alignItems: "center", gap: "4px" }}>
            Made with <Heart size={12} style={{ color: "#E7B7B7", fill: "#E7B7B7" }} /> by Riya
          </p>
        </div>
      </div>
    </footer>
  );
}
