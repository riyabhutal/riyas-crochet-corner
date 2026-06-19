import { useState } from "react";
import { Instagram, Menu, X, User } from "lucide-react";

export function Header({ onLoginClick }: { onLoginClick: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount] = useState(0);

  const navLinks = ["Home", "Shop", "About Me", "Reviews", "Contact"];

  return (
    <header style={{ backgroundColor: "#FFFAF6", borderBottom: "1px solid #E7B7B730" }} className="sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="22" cy="22" r="22" fill="#FDF0F0" />
              <ellipse cx="22" cy="24" rx="8" ry="6" fill="#E7B7B7" opacity="0.5" />
              <circle cx="22" cy="18" r="6" fill="#E7B7B7" />
              <path d="M16 18 Q18 14 22 16 Q26 14 28 18" stroke="#c49090" strokeWidth="1.2" fill="none" />
              <path d="M18 20 Q22 24 26 20" stroke="#c49090" strokeWidth="1" fill="none" />
              <circle cx="22" cy="18" r="2" fill="#fff" opacity="0.6" />
              <path d="M14 26 Q18 30 22 28 Q26 30 30 26" stroke="#A8B197" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", color: "#4a3728" }} className="text-lg font-semibold leading-tight">
              Riya's Crochet
            </div>
            <div style={{ color: "#A8B197", fontFamily: "'Inter', sans-serif" }} className="text-xs tracking-widest uppercase">
              Corner
            </div>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(" ", "-")}`}
              style={{ fontFamily: "'Inter', sans-serif", color: "#6b5748" }}
              className="text-sm hover:opacity-70 transition-opacity"
            >
              {link}
            </a>
          ))}
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-3">
          <a
            href="https://www.instagram.com/riyabhutal_"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#E7B7B7" }}
            className="hover:opacity-70 transition-opacity hidden sm:block"
          >
            <Instagram size={20} />
          </a>
          <button
            onClick={onLoginClick}
            style={{
              backgroundColor: "#E7B7B7",
              color: "#fff",
              borderRadius: "999px",
              padding: "7px 16px",
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.78rem",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
            className="hover:opacity-85 transition-opacity hidden sm:flex"
          >
            <User size={13} /> Login
          </button>
          <button
            style={{ color: "#4a3728", position: "relative" }}
            className="hover:opacity-70 transition-opacity"
          >
            {cartCount > 0 && (
              <span
                style={{ backgroundColor: "#E7B7B7", color: "#fff", fontFamily: "'Inter', sans-serif" }}
                className="absolute -top-1 -right-1 text-xs w-4 h-4 rounded-full flex items-center justify-center"
              >
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ color: "#4a3728" }}
            className="lg:hidden"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div style={{ backgroundColor: "#FFFAF6", borderTop: "1px solid #E7B7B730" }} className="lg:hidden px-6 pb-4">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(" ", "-")}`}
              onClick={() => setMenuOpen(false)}
              style={{ fontFamily: "'Inter', sans-serif", color: "#6b5748" }}
              className="block py-2 text-sm hover:opacity-70 transition-opacity"
            >
              {link}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
