import { useState } from "react";
import { X, Send, CheckCircle } from "lucide-react";
import scannerImg from "../../imports/scanner-1.jpeg";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function OrderModal({ open, onClose }: Props) {
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState({ name: "", email: "", product: "", qty: "1", notes: "" });

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleDone = () => {
    setStep(1);
    setForm({ name: "", email: "", product: "", qty: "1", notes: "" });
    onClose();
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
        overflowY: "visible",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          backgroundColor: "#FFFAF6",
          borderRadius: "28px",
          boxShadow: "0 24px 80px rgba(74,55,40,0.2)",
          width: "100%",
          maxWidth: "460px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div style={{ height: "4px", background: "linear-gradient(90deg, #E7B7B7, #A8B197, #E7B7B7)" }} />

        <div style={{ padding: "32px 36px" }}>
          <button
            onClick={onClose}
            style={{ position: "absolute", top: "18px", right: "18px", color: "#c4a090", background: "none", border: "none", cursor: "pointer" }}
          >
            <X size={20} />
          </button>

          {step === 1 ? (
            <>
              <div className="text-center mb-6">
                <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#4a3728", fontSize: "1.5rem", fontWeight: 700 }}>
                  Place Your Order
                </h2>
                <p style={{ fontFamily: "'Inter', sans-serif", color: "#8a6d5e", fontSize: "0.83rem", marginTop: "4px" }}>
                  Fill in the details and we'll confirm your order shortly 🌸
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label style={{ fontFamily: "'Inter', sans-serif", color: "#6b5748", fontSize: "0.8rem", display: "block", marginBottom: "5px" }}>Your Name *</label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Full name"
                    style={{ width: "100%", padding: "11px 14px", borderRadius: "11px", border: "1.5px solid #E7B7B750", backgroundColor: "#F8F4EE", fontFamily: "'Inter', sans-serif", color: "#4a3728", fontSize: "0.88rem", outline: "none" }}
                  />
                </div>
                <div>
                  <label style={{ fontFamily: "'Inter', sans-serif", color: "#6b5748", fontSize: "0.8rem", display: "block", marginBottom: "5px" }}>Email *</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="your@email.com"
                    style={{ width: "100%", padding: "11px 14px", borderRadius: "11px", border: "1.5px solid #E7B7B750", backgroundColor: "#F8F4EE", fontFamily: "'Inter', sans-serif", color: "#4a3728", fontSize: "0.88rem", outline: "none" }}
                  />
                </div>
                <div>
                  <label style={{ fontFamily: "'Inter', sans-serif", color: "#6b5748", fontSize: "0.8rem", display: "block", marginBottom: "5px" }}>Product *</label>
                  <select
                    required
                    value={form.product}
                    onChange={(e) => setForm({ ...form, product: e.target.value })}
                    style={{ width: "100%", padding: "11px 14px", borderRadius: "11px", border: "1.5px solid #E7B7B750", backgroundColor: "#F8F4EE", fontFamily: "'Inter', sans-serif", color: "#4a3728", fontSize: "0.88rem", outline: "none" }}
                  >
                    <option value="">Select a product</option>
                    <option>Viral Crochet Bouquet — ₹850</option>
                    <option>Cherry Cherry Keychain — ₹199</option>
                    <option>Crochet Blueberry Keychain — ₹199</option>
                    <option>Crochet Fishnet Sleeves — ₹699</option>
                    <option>Crochet Scarf — ₹599</option>
                    <option>Crochet Froggy — ₹299</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontFamily: "'Inter', sans-serif", color: "#6b5748", fontSize: "0.8rem", display: "block", marginBottom: "5px" }}>Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={form.qty}
                    onChange={(e) => setForm({ ...form, qty: e.target.value })}
                    style={{ width: "100%", padding: "11px 14px", borderRadius: "11px", border: "1.5px solid #E7B7B750", backgroundColor: "#F8F4EE", fontFamily: "'Inter', sans-serif", color: "#4a3728", fontSize: "0.88rem", outline: "none" }}
                  />
                </div>
                <div>
                  <label style={{ fontFamily: "'Inter', sans-serif", color: "#6b5748", fontSize: "0.8rem", display: "block", marginBottom: "5px" }}>Special Instructions</label>
                  <textarea
                    rows={3}
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Colour preference, custom message, etc."
                    style={{ width: "100%", padding: "11px 14px", borderRadius: "11px", border: "1.5px solid #E7B7B750", backgroundColor: "#F8F4EE", fontFamily: "'Inter', sans-serif", color: "#4a3728", fontSize: "0.88rem", outline: "none", resize: "vertical" }}
                  />
                </div>
                <button
                  type="submit"
                  style={{ backgroundColor: "#E7B7B7", color: "#fff", borderRadius: "999px", padding: "13px", fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "0.9rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", boxShadow: "0 4px 16px #E7B7B740" }}
                  className="hover:opacity-85 transition-opacity"
                >
                  <Send size={15} /> Confirm Order
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <CheckCircle size={56} style={{ color: "#A8B197", margin: "0 auto 16px" }} />
              <h3 style={{ fontFamily: "'Playfair Display', serif", color: "#4a3728", fontSize: "1.4rem", fontWeight: 700, marginBottom: "8px" }}>
                Order Placed! 🌸
              </h3>
              <p style={{ fontFamily: "'Inter', sans-serif", color: "#7a6050", fontSize: "0.86rem", lineHeight: "1.7", marginBottom: "20px" }}>
                Thank you, <strong>{form.name}</strong>! Please complete payment via UPI to confirm your order.
              </p>

              <div style={{ backgroundColor: "#FDF0F0", borderRadius: "16px", padding: "20px", marginBottom: "20px" }}>
                <p style={{ fontFamily: "'Inter', sans-serif", color: "#6b5748", fontSize: "0.82rem", marginBottom: "12px", fontWeight: 600 }}>
                  Scan QR or pay via UPI ID:
                </p>
                <img
                  src={scannerImg}
                  alt="UPI Payment QR Code"
                  style={{ width: "170px", borderRadius: "12px", margin: "0 auto 10px", display: "block", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                />

                <p style={{ fontFamily: "'Inter', sans-serif", color: "#9a8070", fontSize: "0.74rem", marginTop: "6px" }}>
                  Bhutal Riya Subhash · Paytm UPI
                </p>
              </div>

              <p style={{ fontFamily: "'Inter', sans-serif", color: "#9a8070", fontSize: "0.8rem", marginBottom: "20px" }}>
                Once payment is done, DM your payment screenshot on Instagram{" "}
                <a href="https://www.instagram.com/riyabhutal_" target="_blank" rel="noopener noreferrer" style={{ color: "#E7B7B7" }}>@riyabhutal_</a>
              </p>

              <button
                onClick={handleDone}
                style={{ backgroundColor: "#A8B197", color: "#fff", borderRadius: "999px", padding: "12px 32px", fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "0.88rem" }}
                className="hover:opacity-85 transition-opacity"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
