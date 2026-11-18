import { useState } from "react";
import { X, Eye, EyeOff, User, Lock, Mail, CheckCircle } from "lucide-react";

type Mode = "login" | "signup";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function LoginModal({ open, onClose }: Props) {
  const [mode, setMode] = useState<Mode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
      setForm({ name: "", email: "", password: "" });
    }, 2000);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(74,55,40,0.45)",
        backdropFilter: "blur(4px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          backgroundColor: "#FFFAF6",
          borderRadius: "28px",
          boxShadow: "0 24px 80px rgba(74,55,40,0.2)",
          width: "100%",
          maxWidth: "420px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Top accent strip */}
        <div style={{ height: "4px", background: "linear-gradient(90deg, #E7B7B7, #A8B197, #E7B7B7)" }} />

        <div style={{ padding: "32px 36px" }}>
          {/* Close */}
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "18px",
              right: "18px",
              color: "#c4a090",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            <X size={20} />
          </button>

          {/* Logo & title */}
          <div className="text-center mb-6">
            <svg width="52" height="52" viewBox="0 0 44 44" fill="none" className="mx-auto mb-3">
              <circle cx="22" cy="22" r="22" fill="#FDF0F0" />
              <ellipse cx="22" cy="24" rx="8" ry="6" fill="#E7B7B7" opacity="0.5" />
              <circle cx="22" cy="18" r="6" fill="#E7B7B7" />
              <path d="M16 18 Q18 14 22 16 Q26 14 28 18" stroke="#c49090" strokeWidth="1.2" fill="none" />
              <circle cx="22" cy="18" r="2" fill="#fff" opacity="0.6" />
              <path d="M14 26 Q18 30 22 28 Q26 30 30 26" stroke="#A8B197" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </svg>
            <h2
              style={{ fontFamily: "'Playfair Display', serif", color: "#4a3728", fontSize: "1.5rem", fontWeight: 700 }}
            >
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h2>
            <p style={{ fontFamily: "'Inter', sans-serif", color: "#8a6d5e", fontSize: "0.83rem", marginTop: "4px" }}>
              {mode === "login"
                ? "Sign in to track your orders & wishlist"
                : "Join Riya's Crochet Corner today"}
            </p>
          </div>

          {success ? (
            <div className="flex flex-col items-center py-8 gap-3">
              <CheckCircle size={52} style={{ color: "#A8B197" }} />
              <p style={{ fontFamily: "'Playfair Display', serif", color: "#4a3728", fontSize: "1.1rem" }}>
                {mode === "login" ? "Signed In!" : "Account Created!"}
              </p>
              <p style={{ fontFamily: "'Inter', sans-serif", color: "#7a6050", fontSize: "0.83rem" }}>
                Welcome to Riya's Crochet Corner 🌸
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {mode === "signup" && (
                <div style={{ position: "relative" }}>
                  <User size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#c4a090" }} />
                  <input
                    required
                    type="text"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px 16px 12px 40px",
                      borderRadius: "12px",
                      border: "1.5px solid #E7B7B750",
                      backgroundColor: "#F8F4EE",
                      fontFamily: "'Inter', sans-serif",
                      color: "#4a3728",
                      fontSize: "0.9rem",
                      outline: "none",
                    }}
                  />
                </div>
              )}

              <div style={{ position: "relative" }}>
                <Mail size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#c4a090" }} />
                <input
                  required
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "12px 16px 12px 40px",
                    borderRadius: "12px",
                    border: "1.5px solid #E7B7B750",
                    backgroundColor: "#F8F4EE",
                    fontFamily: "'Inter', sans-serif",
                    color: "#4a3728",
                    fontSize: "0.9rem",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ position: "relative" }}>
                <Lock size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#c4a090" }} />
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "12px 44px 12px 40px",
                    borderRadius: "12px",
                    border: "1.5px solid #E7B7B750",
                    backgroundColor: "#F8F4EE",
                    fontFamily: "'Inter', sans-serif",
                    color: "#4a3728",
                    fontSize: "0.9rem",
                    outline: "none",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", color: "#c4a090", background: "none", border: "none", cursor: "pointer" }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <button
                type="submit"
                style={{
                  backgroundColor: "#E7B7B7",
                  color: "#fff",
                  borderRadius: "999px",
                  padding: "13px",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  boxShadow: "0 4px 16px #E7B7B740",
                  marginTop: "4px",
                }}
                className="hover:opacity-85 transition-opacity"
              >
                {mode === "login" ? "Sign In" : "Create Account"}
              </button>
            </form>
          )}

          {!success && (
            <p style={{ fontFamily: "'Inter', sans-serif", color: "#8a6d5e", fontSize: "0.82rem", textAlign: "center", marginTop: "18px" }}>
              {mode === "login" ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                style={{ color: "#E7B7B7", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}
              >
                {mode === "login" ? "Sign Up" : "Sign In"}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
