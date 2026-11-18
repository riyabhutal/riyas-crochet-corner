import { useRef } from "react";
import { X, Download, Printer } from "lucide-react";
import type { Order } from "./CheckoutModal";

interface Props {
  order: Order | null;
  onClose: () => void;
}

function fmt(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

export function InvoiceViewer({ order, onClose }: Props) {
  const printRef = useRef<HTMLDivElement>(null);

  if (!order) return null;

  const date = new Date(order.date);
  const dateStr = date.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
  const timeStr = date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;
    const printWin = window.open("", "_blank", "width=800,height=900");
    if (!printWin) return;
    printWin.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${order.invoiceNumber}</title>
          <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Inter', sans-serif; background: #fff; color: #4a3728; padding: 40px; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          ${content.innerHTML}
        </body>
      </html>
    `);
    printWin.document.close();
    printWin.focus();
    setTimeout(() => { printWin.print(); printWin.close(); }, 600);
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, backgroundColor: "rgba(30,15,5,0.7)", backdropFilter: "blur(8px)", zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", overflowY: "auto" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ backgroundColor: "#fff", borderRadius: "20px", boxShadow: "0 40px 120px rgba(0,0,0,0.3)", width: "100%", maxWidth: "680px", overflow: "hidden", margin: "auto" }}>
        {/* Toolbar */}
        <div style={{ backgroundColor: "#4a3728", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ fontFamily: "'Inter',sans-serif", color: "#F8F4EE", fontSize: "0.9rem", fontWeight: 600 }}>Invoice — {order.invoiceNumber}</p>
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={handlePrint}
              style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "#A8B197", color: "#fff", borderRadius: "8px", padding: "7px 14px", fontFamily: "'Inter',sans-serif", fontSize: "0.78rem", border: "none", cursor: "pointer" }}>
              <Printer size={14} /> Print / Save PDF
            </button>
            <button onClick={handlePrint}
              style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "#E7B7B7", color: "#fff", borderRadius: "8px", padding: "7px 14px", fontFamily: "'Inter',sans-serif", fontSize: "0.78rem", border: "none", cursor: "pointer" }}>
              <Download size={14} /> Download PDF
            </button>
            <button onClick={onClose} style={{ backgroundColor: "transparent", border: "none", cursor: "pointer", color: "#c4a090" }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Invoice content */}
        <div ref={printRef} style={{ padding: "40px 44px", backgroundColor: "#fff" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "36px", paddingBottom: "24px", borderBottom: "2px solid #E7B7B7" }}>
            <div>
              <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.8rem", fontWeight: 700, color: "#4a3728", marginBottom: "4px" }}>
                Riya's Crochet Corner
              </h1>
              <p style={{ color: "#A8B197", fontSize: "0.8rem", letterSpacing: "0.1em" }}>HANDMADE WITH LOVE</p>
              <p style={{ color: "#8a6d5e", fontSize: "0.82rem", marginTop: "8px", lineHeight: "1.5" }}>
                Instagram: @riyabhutal_<br />
                Handcrafted Crochet Creations
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ backgroundColor: "#F2F5EF", borderRadius: "10px", padding: "10px 16px", marginBottom: "8px" }}>
                <p style={{ fontFamily: "'Inter',sans-serif", color: "#A8B197", fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>Invoice No.</p>
                <p style={{ fontFamily: "'Inter',sans-serif", color: "#4a3728", fontSize: "1rem", fontWeight: 700 }}>{order.invoiceNumber}</p>
              </div>
              <p style={{ fontFamily: "'Inter',sans-serif", color: "#6b5748", fontSize: "0.8rem" }}>{dateStr} · {timeStr}</p>
            </div>
          </div>

          {/* Bill to + Order info */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px", marginBottom: "32px" }}>
            <div>
              <p style={{ fontFamily: "'Inter',sans-serif", color: "#A8B197", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "10px" }}>Bill To</p>
              <p style={{ fontFamily: "'Inter',sans-serif", color: "#4a3728", fontSize: "0.95rem", fontWeight: 600 }}>{order.name}</p>
              <p style={{ color: "#6b5748", fontSize: "0.82rem", marginTop: "4px", lineHeight: "1.6" }}>
                {order.email}<br />{order.phone}<br />
                {order.address}<br />
                {order.city}, {order.state} — {order.pincode}
              </p>
            </div>
            <div>
              <p style={{ fontFamily: "'Inter',sans-serif", color: "#A8B197", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "10px" }}>Order Details</p>
              {[
                ["Order ID", order.id],
                ["Date", dateStr],
                ["Payment Status", "Paid ✓"],
              ].map(([label, value]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontFamily: "'Inter',sans-serif", color: "#8a6d5e", fontSize: "0.8rem" }}>{label}</span>
                  <span style={{ fontFamily: "'Inter',sans-serif", color: "#4a3728", fontSize: "0.8rem", fontWeight: 500 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Items table */}
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "24px" }}>
            <thead>
              <tr style={{ backgroundColor: "#4a3728" }}>
                {["#", "Product", "Qty", "Unit Price", "Total"].map((h) => (
                  <th key={h} style={{ fontFamily: "'Inter',sans-serif", color: "#F8F4EE", fontSize: "0.74rem", letterSpacing: "0.06em", textTransform: "uppercase", padding: "10px 14px", textAlign: h === "#" || h === "Qty" ? "center" : h === "Total" || h === "Unit Price" ? "right" : "left" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr style={{ backgroundColor: "#FFFAF6" }}>
                <td style={{ textAlign: "center", padding: "14px", fontFamily: "'Inter',sans-serif", color: "#6b5748", fontSize: "0.85rem", borderBottom: "1px solid #F0E8E0" }}>1</td>
                <td style={{ padding: "14px", fontFamily: "'Playfair Display',serif", color: "#4a3728", fontSize: "0.9rem", fontWeight: 600, borderBottom: "1px solid #F0E8E0" }}>{order.product}</td>
                <td style={{ textAlign: "center", padding: "14px", fontFamily: "'Inter',sans-serif", color: "#6b5748", fontSize: "0.85rem", borderBottom: "1px solid #F0E8E0" }}>1</td>
                <td style={{ textAlign: "right", padding: "14px", fontFamily: "'Inter',sans-serif", color: "#6b5748", fontSize: "0.85rem", borderBottom: "1px solid #F0E8E0" }}>{fmt(order.amount)}</td>
                <td style={{ textAlign: "right", padding: "14px", fontFamily: "'Inter',sans-serif", color: "#4a3728", fontSize: "0.85rem", fontWeight: 600, borderBottom: "1px solid #F0E8E0" }}>{fmt(order.amount)}</td>
              </tr>
            </tbody>
          </table>

          {/* Totals */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "32px" }}>
            <div style={{ minWidth: "240px" }}>
              {[["Subtotal", fmt(order.amount)], ["Shipping", "Free 🌸"], ["Tax (incl.)", "—"]].map(([label, value]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px dashed #EDE0D4" }}>
                  <span style={{ fontFamily: "'Inter',sans-serif", color: "#8a6d5e", fontSize: "0.82rem" }}>{label}</span>
                  <span style={{ fontFamily: "'Inter',sans-serif", color: "#6b5748", fontSize: "0.82rem" }}>{value}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0 0", marginTop: "4px" }}>
                <span style={{ fontFamily: "'Playfair Display',serif", color: "#4a3728", fontSize: "1rem", fontWeight: 700 }}>Total Paid</span>
                <span style={{ fontFamily: "'Playfair Display',serif", color: "#E7B7B7", fontSize: "1.1rem", fontWeight: 700 }}>{fmt(order.amount)}</span>
              </div>
            </div>
          </div>

          {/* Payment confirmed badge */}
          <div style={{ backgroundColor: "#F0FDF4", borderRadius: "12px", border: "1px solid #22C55E30", padding: "14px 18px", display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#22C55E20", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontSize: "1.1rem" }}>✓</span>
            </div>
            <div>
              <p style={{ fontFamily: "'Inter',sans-serif", color: "#22C55E", fontSize: "0.82rem", fontWeight: 700 }}>Payment Screenshot Submitted</p>
              <p
  style={{
    fontFamily: "'Inter',sans-serif",
    color: "#6b5748",
    fontSize: "0.77rem",
  }}
>
  Payment proof uploaded and awaiting verification · {dateStr}
</p>
            </div>
          </div>

          {/* Footer */}
          <div style={{ borderTop: "2px solid #E7B7B7", paddingTop: "20px", textAlign: "center" }}>
            <p style={{ fontFamily: "'Playfair Display',serif", color: "#E7B7B7", fontSize: "1rem", fontStyle: "italic", marginBottom: "6px" }}>
              Thank you for shopping with Riya's Crochet Corner 🌸
            </p>
            <p style={{ fontFamily: "'Inter',sans-serif", color: "#a0887a", fontSize: "0.76rem" }}>
              Every piece is handcrafted with love using 100% cotton milk yarn. Questions? DM us on Instagram @riyabhutal_
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
