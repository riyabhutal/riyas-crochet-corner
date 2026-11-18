import { useState } from "react";
import { Instagram, Send, CheckCircle } from "lucide-react";
import { SmallFlower } from "./FloralDecor";
import scannerImg from "../../imports/scanner-1.jpeg";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    await addDoc(collection(db, "messages"), {
      name: form.name,
      email: form.email,
      message: form.message,
      status: "Unread",
      createdAt: serverTimestamp(),
    });

    setSent(true);

    setForm({
      name: "",
      email: "",
      message: "",
    });
  } catch (error) {
    console.error("Error sending message:", error);
    alert("Failed to send message");
  }
};
  return (
    <section id="contact" style={{ backgroundColor: "#FFFAF6" }} className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-14">
          <div className="flex justify-center items-center gap-3 mb-3">
            <SmallFlower color="#E7B7B7" />
            <span style={{ color: "#A8B197", fontFamily: "'Inter', sans-serif" }} className="text-xs tracking-widest uppercase">
              Get In Touch
            </span>
            <SmallFlower color="#A8B197" />
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#4a3728", fontSize: "2.4rem", fontWeight: 700 }}>
            Contact Us
          </h2>
          <div style={{ backgroundColor: "#E7B7B7" }} className="w-16 h-1 rounded-full mx-auto mt-3" />
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left: Reach out + Payment */}
          <div>
            <h3
              style={{ fontFamily: "'Playfair Display', serif", color: "#4a3728", fontSize: "1.3rem", fontWeight: 600, marginBottom: "8px" }}
            >
              Let's Connect
            </h3>
            <p style={{ fontFamily: "'Inter', sans-serif", color: "#7a6050", fontSize: "0.9rem", lineHeight: "1.7", marginBottom: "24px" }}>
              Reach out on Instagram or use the form — we'd love to hear from you!
            </p>

            {/* Social buttons */}
            <div className="flex flex-col gap-3 mb-8">
              <a
                href="https://www.instagram.com/riyabhutal_"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  backgroundColor: "#FDF0F0",
                  border: "1px solid #E7B7B750",
                  borderRadius: "14px",
                  padding: "14px 20px",
                  fontFamily: "'Inter', sans-serif",
                  color: "#4a3728",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  textDecoration: "none",
                }}
                className="hover:opacity-80 transition-opacity"
              >
                <Instagram size={22} style={{ color: "#E7B7B7" }} />
                <span>
                  <span style={{ fontWeight: 600 }}>Instagram</span>
                  <br />
                  <span style={{ color: "#A8B197", fontSize: "0.8rem" }}>@riyabhutal_</span>
                </span>
              </a>

              {/* Online Chat */}
              <a
                href="#contact-form"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  backgroundColor: "#F2F5EF",
                  border: "1px solid #A8B19750",
                  borderRadius: "14px",
                  padding: "14px 20px",
                  fontFamily: "'Inter', sans-serif",
                  color: "#4a3728",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  textDecoration: "none",
                }}
                className="hover:opacity-80 transition-opacity"
              >
                <Send size={22} style={{ color: "#A8B197" }} />
                <span>
                  <span style={{ fontWeight: 600 }}>Message Us Online</span>
                  <br />
                  <span style={{ color: "#A8B197", fontSize: "0.8rem" }}>Use the form below →</span>
                </span>
              </a>
            </div>

            {/* Payment Section */}
            <div
              style={{
                backgroundColor: "#FDF0F0",
                borderRadius: "20px",
                border: "1px solid #E7B7B740",
                padding: "20px",
                boxShadow: "0 4px 16px rgba(74,55,40,0.07)",
              }}
            >
              <p
                style={{ fontFamily: "'Playfair Display', serif", color: "#4a3728", fontSize: "1.05rem", fontWeight: 600, marginBottom: "6px" }}
              >
                💳 Payment Details
              </p>
              <p style={{ fontFamily: "'Inter', sans-serif", color: "#7a6050", fontSize: "0.82rem", marginBottom: "14px" }}>
                Pay securely via UPI — scan the QR code or use the UPI ID below.
              </p>

              <button
                onClick={() => setShowPayment(!showPayment)}
                style={{
                  backgroundColor: "#E7B7B7",
                  color: "#fff",
                  borderRadius: "999px",
                  padding: "9px 22px",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.82rem",
                  marginBottom: showPayment ? "14px" : "0",
                }}
                className="hover:opacity-85 transition-opacity"
              >
                {showPayment ? "Hide QR Code" : "Show QR Code & UPI ID"}
              </button>

              {showPayment && (
                <div className="text-center">
                  <img
                    src={scannerImg}
                    alt="UPI Payment QR Code — Bhutal Riya Subhash"
                    style={{
                      width: "200px",
                      borderRadius: "16px",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                      margin: "0 auto 10px",
                      display: "block",
                    }}
                  />
                  <p style={{ fontFamily: "'Inter', sans-serif", color: "#4a3728", fontSize: "0.88rem", fontWeight: 600 }}>
                    UPI ID:
                  </p>
                  <p
                    style={{
                      fontFamily: "monospace",
                      color: "#A8B197",
                      fontSize: "0.95rem",
                      backgroundColor: "#fff",
                      padding: "6px 16px",
                      borderRadius: "8px",
                      display: "inline-block",
                      border: "1px solid #A8B19730",
                      margin: "4px 0 8px",
                    }}
                  >
                    riyabhutal@okaxis
                  </p>
                  <p style={{ fontFamily: "'Inter', sans-serif", color: "#7a6050", fontSize: "0.75rem" }}>
                    Bhutal Riya Subhash · Paytm UPI
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Contact Form */}
          <div
            id="contact-form"
            style={{
              backgroundColor: "#fff",
              borderRadius: "24px",
              border: "1px solid #F0E8E0",
              boxShadow: "0 6px 30px rgba(74,55,40,0.09)",
              padding: "36px 32px",
            }}
          >
            <h3
              style={{ fontFamily: "'Playfair Display', serif", color: "#4a3728", fontSize: "1.3rem", fontWeight: 600, marginBottom: "20px" }}
            >
              Send a Message
            </h3>

            {sent ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <CheckCircle size={48} style={{ color: "#A8B197" }} />
                <p style={{ fontFamily: "'Playfair Display', serif", color: "#4a3728", fontSize: "1.1rem" }}>
                  Message Sent!
                </p>
                <p style={{ fontFamily: "'Inter', sans-serif", color: "#7a6050", fontSize: "0.85rem", textAlign: "center" }}>
                  Thank you for reaching out. Riya will get back to you shortly 🌸
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label style={{ fontFamily: "'Inter', sans-serif", color: "#6b5748", fontSize: "0.82rem", display: "block", marginBottom: "6px" }}>
                    Your Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Priya Sharma"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "12px",
                      border: "1.5px solid #E7B7B750",
                      backgroundColor: "#FFFAF6",
                      fontFamily: "'Inter', sans-serif",
                      color: "#4a3728",
                      fontSize: "0.9rem",
                      outline: "none",
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontFamily: "'Inter', sans-serif", color: "#6b5748", fontSize: "0.82rem", display: "block", marginBottom: "6px" }}>
                    Email Address *
                  </label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "12px",
                      border: "1.5px solid #E7B7B750",
                      backgroundColor: "#FFFAF6",
                      fontFamily: "'Inter', sans-serif",
                      color: "#4a3728",
                      fontSize: "0.9rem",
                      outline: "none",
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontFamily: "'Inter', sans-serif", color: "#6b5748", fontSize: "0.82rem", display: "block", marginBottom: "6px" }}>
                    Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell me about your order or ask anything..."
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "12px",
                      border: "1.5px solid #E7B7B750",
                      backgroundColor: "#FFFAF6",
                      fontFamily: "'Inter', sans-serif",
                      color: "#4a3728",
                      fontSize: "0.9rem",
                      outline: "none",
                      resize: "vertical",
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    backgroundColor: "#E7B7B7",
                    color: "#fff",
                    borderRadius: "999px",
                    padding: "14px",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    boxShadow: "0 4px 16px #E7B7B740",
                  }}
                  className="hover:opacity-85 transition-opacity"
                >
                  <Send size={16} />
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
