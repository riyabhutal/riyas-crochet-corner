import { useState, useMemo, useEffect} from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { db } from "../firebase";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { auth } from "../firebase";
import {
  Package,
  IndianRupee,
  Clock,
  CheckCircle2,
  Truck,
  Search,
  LogOut,
  Download,
  FileText,
  ChevronDown,
  TrendingUp,
  Users,
  Eye,
  X,
  ShieldCheck,
  BarChart3,
  MessageSquare,
} from "lucide-react";
import type { Order } from "./CheckoutModal";
import { InvoiceViewer } from "./InvoiceViewer";

interface Props {
  orders: Order[];
  onClose: () => void;
  onUpdateStatus: (id: string, status: Order["status"]) => void;
}

const STATUS_META: Record<
  Order["status"],
  { bg: string; color: string; border: string; label: string; icon: React.ReactNode }
> = {
  pending: {
    bg: "#FFF8E6",
    color: "#B45309",
    border: "#D4A01740",
    label: "Pending",
    icon: <Clock size={11} />,
  },
  paid: {
    bg: "#EFF6FF",
    color: "#1D4ED8",
    border: "#3B82F640",
    label: "Paid",
    icon: <ShieldCheck size={11} />,
  },
  shipped: {
    bg: "#F0FDF4",
    color: "#15803D",
    border: "#22C55E40",
    label: "Shipped",
    icon: <Truck size={11} />,
  },
  delivered: {
    bg: "#F2F5EF",
    color: "#3f6b35",
    border: "#A8B19740",
    label: "Delivered",
    icon: <CheckCircle2 size={11} />,
  },
};

type SidebarTab =
  | "dashboard"
  | "orders"
  | "analytics"
  | "messages";

const isValidStatus = (status: any): status is Order["status"] => {
  return status === "pending" || status === "paid" || status === "shipped" || status === "delivered";
};

const getStatusMeta = (status: any) => {
  return STATUS_META[isValidStatus(status) ? status : "pending"];
};

export function AdminDashboard({ orders, onClose, onUpdateStatus }: Props) {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState(false);
  const [activeTab, setActiveTab] = useState<SidebarTab>("dashboard");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Order["status"] | "all">("all");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [viewInvoice, setViewInvoice] = useState<Order | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  useEffect(() => {
  const unsub = onSnapshot(
    collection(db, "messages"),
    (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    }
  );

  return () => unsub();
}, []);
  const normalizedOrders = useMemo(
    () =>
      orders.map((o) => ({
        ...o,
        status: isValidStatus((o as any).status) ? (o.status as Order["status"]) : "pending",
      })),
    [orders]
  );

  const totalRevenue = normalizedOrders.reduce((s, o) => s + (Number(o.amount) || 0),0);
  const pendingCount = normalizedOrders.filter((o) => o.status === "pending").length;
  const paidCount = normalizedOrders.filter((o) => o.status === "paid").length;
  const shippedCount = normalizedOrders.filter((o) => o.status === "shipped").length;
  const deliveredCount = normalizedOrders.filter((o) => o.status === "delivered").length;

  const filtered = useMemo(
    () =>
      normalizedOrders.filter((o) => {
        const q = search.toLowerCase();
        const matchSearch =
          !search ||
          o.name.toLowerCase().includes(q) ||
          o.product.toLowerCase().includes(q) ||
          o.id.toLowerCase().includes(q) ||
          o.email?.toLowerCase().includes(q);
        const matchStatus = statusFilter === "all" || o.status === statusFilter;
        return matchSearch && matchStatus;
      }),
    [normalizedOrders, search, statusFilter]
  );

  const fmt = (n?: number) =>
  `₹${(n ?? 0).toLocaleString("en-IN")}`;

  const exportCSV = () => {
    const header =
      "Order ID,Invoice,Customer,Email,Phone,Product,Amount,Payment Screenshot,Status,Date,Address\n";
    const rows = normalizedOrders
      .map(
        (o) =>
          `${o.id},${o.invoiceNumber},"${o.name}","${o.email || ""}","${o.phone}","${o.product}",${o.amount},"${o.paymentScreenshot || ""}","${o.status}","${new Date(
            o.date
          ).toLocaleString("en-IN")}","${o.address}, ${o.city}, ${o.state} - ${o.pincode}"`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `riya-orders-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!authed) {
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          zIndex: 2000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <div
          style={{
            backgroundColor: "#FFFAF6",
            borderRadius: "28px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            padding: "32px",
            width: "100%",
            maxWidth: "360px",
          }}
        >
          <div style={{ textAlign: "center", fontSize: "42px", marginBottom: "12px" }}>🌸</div>

          <h2
            style={{
              textAlign: "center",
              fontFamily: "'Playfair Display', serif",
              color: "#4a3728",
              marginBottom: "8px",
            }}
          >
            Welcome Back
          </h2>

          <p
            style={{
              textAlign: "center",
              color: "#8a6d5e",
              marginBottom: "24px",
            }}
          >
            Sign in to manage your store
          </p>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setErrorMessage("");

              try {
                const userCredential = await signInWithEmailAndPassword(auth, email, pw);
                const uid = userCredential.user.uid;
                const userDoc = await getDoc(doc(db, "users", uid));

                if (!userDoc.exists()) {
                  setErrorMessage("User record not found.");
                  setPwError(true);
                  return;
                }

                const userData = userDoc.data() as { role?: string };
                if (userData.role === "admin") {
                  setAuthed(true);
                  setPwError(false);
                } else {
                  setErrorMessage("This account is not an admin account.");
                  setPwError(true);
                }
              } catch (error: any) {
                setPwError(true);
                console.error(error);

                if (error?.code === "auth/invalid-email") {
                  setErrorMessage("Please enter a valid email address.");
                } else if (error?.code === "auth/wrong-password") {
                  setErrorMessage("Incorrect password.");
                } else if (error?.code === "auth/user-not-found") {
                  setErrorMessage("No account found for this email.");
                } else {
                  setErrorMessage("Login failed.");
                }
              }
            }}
          >
            <label style={{ display: "block", marginBottom: "8px", color: "#4a3728", fontWeight: 500 }}>
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "12px",
                border: "1px solid #ddd",
                marginBottom: "16px",
              }}
            />

            <label style={{ display: "block", marginBottom: "8px", color: "#4a3728", fontWeight: 500 }}>
              Password
            </label>

            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="Enter your password"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "12px",
                border: pwError ? "1px solid red" : "1px solid #ddd",
                marginBottom: "10px",
              }}
            />

            {errorMessage && (
              <p style={{ color: "#dc2626", fontSize: "14px", marginBottom: "14px" }}>
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "14px",
                border: "none",
                borderRadius: "14px",
                backgroundColor: "#6B4423",
                color: "white",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Sign In
            </button>
          </form>

          <button
            type="button"
            onClick={onClose}
            style={{
              marginTop: "16px",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#8a6d5e",
              width: "100%",
            }}
          >
            ← Back to Store
          </button>
        </div>
      </div>
    );
  }

  const sidebarItems = [
  { key: "dashboard", icon: <BarChart3 size={18} />, label: "Overview" },
  { key: "orders", icon: <Package size={18} />, label: `Orders (${normalizedOrders.length})` },
  { key: "analytics", icon: <TrendingUp size={18} />, label: "Analytics" },
  { key: "messages", icon: <MessageSquare size={18} />, label: `Messages (${messages.length})` },
];

  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 2000,
          display: "flex",
          backgroundColor: "#F4F0EB",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "220px",
            flexShrink: 0,
            backgroundColor: "#2d1f14",
            display: "flex",
            flexDirection: "column",
            boxShadow: "4px 0 20px rgba(0,0,0,0.2)",
          }}
        >
          <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid #4a3728" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  backgroundColor: "#E7B7B720",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 44 44" fill="none">
                  <circle cx="22" cy="18" r="7" fill="#E7B7B7" />
                  <path
                    d="M13 28 Q18 33 22 31 Q26 33 31 28"
                    stroke="#A8B197"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div>
                <p style={{ fontFamily: "'Playfair Display',serif", color: "#F8F4EE", fontSize: "0.88rem", fontWeight: 600, lineHeight: 1.2 }}>
                  Riya's Crochet
                </p>
                <p style={{ fontFamily: "'Inter',sans-serif", color: "#A8B197", fontSize: "0.65rem", letterSpacing: "0.1em" }}>
                  ADMIN PANEL
                </p>
              </div>
            </div>
          </div>

          <nav style={{ flex: 1, padding: "16px 12px" }}>
            {sidebarItems.map(({ key, icon, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as SidebarTab)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "11px 12px",
                  borderRadius: "10px",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'Inter',sans-serif",
                  fontSize: "0.83rem",
                  fontWeight: activeTab === key ? 600 : 400,
                  backgroundColor: activeTab === key ? "#E7B7B720" : "transparent",
                  color: activeTab === key ? "#E7B7B7" : "#a0887a",
                  marginBottom: "4px",
                  textAlign: "left",
                }}
              >
                {icon} {label}
              </button>
            ))}
          </nav>

          <div style={{ padding: "16px 12px", borderTop: "1px solid #4a3728" }}>
            <button
              onClick={() => {
                setAuthed(false);
                onClose();
              }}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 12px",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                fontFamily: "'Inter',sans-serif",
                fontSize: "0.82rem",
                backgroundColor: "transparent",
                color: "#a0887a",
              }}
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div
            style={{
              backgroundColor: "#fff",
              borderBottom: "1px solid #EDE0D4",
              padding: "14px 28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
            }}
          >
            <h1 style={{ fontFamily: "'Playfair Display',serif", color: "#4a3728", fontSize: "1.2rem", fontWeight: 700 }}>
              {
  activeTab === "dashboard"
    ? "Overview"
    : activeTab === "orders"
    ? "All Orders"
    : activeTab === "analytics"
    ? "Analytics"
    : "Customer Messages"
}
            </h1>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={exportCSV}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  backgroundColor: "#A8B197",
                  color: "#fff",
                  borderRadius: "8px",
                  padding: "8px 16px",
                  fontFamily: "'Inter',sans-serif",
                  fontSize: "0.78rem",
                  fontWeight: 500,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <Download size={14} /> Export CSV
              </button>
              <button
                onClick={onClose}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  backgroundColor: "#FDF0F0",
                  color: "#E7B7B7",
                  borderRadius: "8px",
                  padding: "8px 16px",
                  fontFamily: "'Inter',sans-serif",
                  fontSize: "0.78rem",
                  fontWeight: 500,
                  border: "1px solid #E7B7B740",
                  cursor: "pointer",
                }}
              >
                <X size={14} /> Close
              </button>
            </div>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              overflowX: "hidden",
              padding: "24px 28px",
            }}
          >
            {activeTab === "dashboard" && (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "28px" }}>
                  {[
                    { label: "Total Orders", value: normalizedOrders.length, icon: <Package size={22} style={{ color: "#E7B7B7" }} />, bg: "#FDF0F0", border: "#E7B7B730" },
                    { label: "Total Revenue", value: fmt(totalRevenue), icon: <IndianRupee size={22} style={{ color: "#A8B197" }} />, bg: "#F2F5EF", border: "#A8B19730" },
                    { label: "Pending Orders", value: pendingCount, icon: <Clock size={22} style={{ color: "#D4A017" }} />, bg: "#FFF8E6", border: "#D4A01730" },
                    { label: "Delivered", value: deliveredCount, icon: <CheckCircle2 size={22} style={{ color: "#22C55E" }} />, bg: "#F0FDF4", border: "#22C55E30" },
                  ].map((s) => (
                    <div key={s.label} style={{ backgroundColor: "#fff", borderRadius: "16px", padding: "20px", border: `1px solid ${s.border}`, boxShadow: "0 2px 10px rgba(74,55,40,0.05)" }}>
                      <div style={{ width: "44px", height: "44px", borderRadius: "12px", backgroundColor: s.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}>
                        {s.icon}
                      </div>
                      <p style={{ fontFamily: "'Playfair Display',serif", color: "#4a3728", fontSize: "1.6rem", fontWeight: 700, lineHeight: 1 }}>{s.value}</p>
                      <p style={{ fontFamily: "'Inter',sans-serif", color: "#8a7060", fontSize: "0.78rem", marginTop: "5px" }}>{s.label}</p>
                    </div>
                  ))}
                </div>

                <div style={{ backgroundColor: "#fff", borderRadius: "16px", padding: "22px 24px", marginBottom: "24px", border: "1px solid #EDE0D4" }}>
                  <h3 style={{ fontFamily: "'Playfair Display',serif", color: "#4a3728", fontSize: "1rem", fontWeight: 600, marginBottom: "18px" }}>
                    Order Status Breakdown
                  </h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px" }}>
                    {(["pending", "paid", "shipped", "delivered"] as const).map((s) => {
                      const m = getStatusMeta(s);
                      const count = normalizedOrders.filter((o) => o.status === s).length;
                      const pct = normalizedOrders.length ? Math.round((count / normalizedOrders.length) * 100) : 0;
                      return (
                        <div key={s} style={{ backgroundColor: m.bg, borderRadius: "12px", padding: "14px", border: `1px solid ${m.border}` }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                            <span style={{ fontFamily: "'Inter',sans-serif", color: m.color, fontSize: "0.76rem", fontWeight: 600, textTransform: "capitalize" }}>
                              {m.label}
                            </span>
                            <span style={{ fontFamily: "'Inter',sans-serif", color: m.color, fontSize: "0.72rem" }}>{pct}%</span>
                          </div>
                          <p style={{ fontFamily: "'Playfair Display',serif", color: "#4a3728", fontSize: "1.4rem", fontWeight: 700 }}>{count}</p>
                          <div style={{ height: "4px", backgroundColor: "#E8DDD5", borderRadius: "2px", marginTop: "8px" }}>
                            <div style={{ height: "100%", width: `${pct}%`, backgroundColor: m.color, borderRadius: "2px" }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div style={{ backgroundColor: "#fff", borderRadius: "16px", border: "1px solid #EDE0D4", overflow: "visible" }}>
                  <div style={{ padding: "16px 22px", borderBottom: "1px solid #EDE0D4", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <h3 style={{ fontFamily: "'Playfair Display',serif", color: "#4a3728", fontSize: "1rem", fontWeight: 600 }}>Recent Orders</h3>
                    <button onClick={() => setActiveTab("orders")} style={{ fontFamily: "'Inter',sans-serif", color: "#E7B7B7", fontSize: "0.8rem", background: "none", border: "none", cursor: "pointer" }}>
                      View All →
                    </button>
                  </div>
                  {normalizedOrders.slice(0, 5).map((o, i) => {
                    const m = getStatusMeta(o.status);
                    return (
                      <div key={o.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 22px", backgroundColor: i % 2 === 0 ? "#fff" : "#FFFAF6", borderBottom: "1px solid #F5EDE5" }}>
                        <div>
                          <p style={{ fontFamily: "'Inter',sans-serif", color: "#4a3728", fontSize: "0.85rem", fontWeight: 500 }}>{o.name}</p>
                          <p style={{ fontFamily: "'Inter',sans-serif", color: "#A8B197", fontSize: "0.75rem" }}>
                            {o.product} · {o.id}
                          </p>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                          <span style={{ fontFamily: "'Inter',sans-serif", color: "#E7B7B7", fontSize: "0.9rem", fontWeight: 600 }}>{fmt(o.amount)}</span>
                          <span style={{ backgroundColor: m.bg, color: m.color, borderRadius: "999px", padding: "3px 10px", fontSize: "0.72rem", fontFamily: "'Inter',sans-serif", fontWeight: 600 }}>
                            {m.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  {normalizedOrders.length === 0 && (
                    <div style={{ padding: "40px", textAlign: "center" }}>
                      <Package size={36} style={{ color: "#E7B7B7", margin: "0 auto 10px" }} />
                      <p style={{ fontFamily: "'Inter',sans-serif", color: "#8a6d5e", fontSize: "0.85rem" }}>
                        No orders yet. They'll appear here once customers check out.
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === "orders" && (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px", flexWrap: "wrap" }}>
                  <div style={{ position: "relative", flex: "1 1 200px" }}>
                    <Search size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#c4a090" }} />
                    <input
                      type="text"
                      placeholder="Search by name, product, order ID, email..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      style={{
                        width: "100%",
                        paddingLeft: "34px",
                        paddingRight: "14px",
                        paddingTop: "9px",
                        paddingBottom: "9px",
                        borderRadius: "10px",
                        border: "1.5px solid #EDE0D4",
                        backgroundColor: "#fff",
                        fontFamily: "'Inter',sans-serif",
                        fontSize: "0.82rem",
                        color: "#4a3728",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {(["all", "pending", "paid", "shipped", "delivered"] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        style={{
                          padding: "7px 14px",
                          borderRadius: "8px",
                          fontFamily: "'Inter',sans-serif",
                          fontSize: "0.76rem",
                          fontWeight: 500,
                          cursor: "pointer",
                          border: "1.5px solid",
                          borderColor: statusFilter === s ? "#4a3728" : "#EDE0D4",
                          backgroundColor: statusFilter === s ? "#4a3728" : "#fff",
                          color: statusFilter === s ? "#fff" : "#6b5748",
                        }}
                      >
                        {s === "all" ? "All" : getStatusMeta(s).label}
                      </button>
                    ))}
                  </div>

                  <p style={{ fontFamily: "'Inter',sans-serif", color: "#A8B197", fontSize: "0.78rem", marginLeft: "auto" }}>
                    {filtered.length} order{filtered.length !== 1 ? "s" : ""}
                  </p>
                </div>

                <div style={{ backgroundColor: "#fff", borderRadius: "16px", border: "1px solid #EDE0D4", overflow: "visible", boxShadow: "0 2px 12px rgba(74,55,40,0.05)" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "0.9fr 1.4fr 1.3fr 0.7fr 0.9fr 0.8fr 0.7fr", padding: "12px 18px", backgroundColor: "#4a3728", gap: "8px" }}>
                    {["Order ID", "Customer", "Product", "Amount", "Status", "Invoice", "Action"].map((h) => (
                      <p key={h} style={{ fontFamily: "'Inter',sans-serif", color: "#c4a090", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                        {h}
                      </p>
                    ))}
                  </div>

                  {filtered.length === 0 ? (
                    <div style={{ padding: "52px", textAlign: "center" }}>
                      <Users size={40} style={{ color: "#E7B7B7", margin: "0 auto 12px" }} />
                      <p style={{ fontFamily: "'Playfair Display',serif", color: "#4a3728", fontSize: "1.05rem", marginBottom: "6px" }}>
                        No orders found
                      </p>
                      <p style={{ fontFamily: "'Inter',sans-serif", color: "#8a6d5e", fontSize: "0.82rem" }}>
                        Try a different search or filter.
                      </p>
                    </div>
                  ) : (
                    filtered.map((order, i) => {
                      const m = getStatusMeta(order.status);
                      const isExpanded = expandedRow === order.id;

                      return (
                        <div key={order.id}>
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "0.9fr 1.4fr 1.3fr 0.7fr 0.9fr 0.8fr 0.7fr",
                              padding: "13px 18px",
                              gap: "8px",
                              alignItems: "center",
                              backgroundColor: i % 2 === 0 ? "#fff" : "#FFFAF6",
                              borderBottom: "1px solid #F5EDE5",
                              cursor: "pointer",
                            }}
                            onClick={() => setExpandedRow(isExpanded ? null : order.id)}
                          >
                            <div>
                              <p style={{ fontFamily: "monospace", color: "#4a3728", fontSize: "0.76rem", fontWeight: 600 }}>{order.id}</p>
                              <p style={{ fontFamily: "'Inter',sans-serif", color: "#A8B197", fontSize: "0.68rem" }}>
                                {new Date(order.date).toLocaleDateString("en-IN")}
                              </p>
                            </div>

                            <div>
                              <p style={{ fontFamily: "'Inter',sans-serif", color: "#4a3728", fontSize: "0.83rem", fontWeight: 500 }}>{order.name}</p>
                              <p style={{ fontFamily: "'Inter',sans-serif", color: "#A8B197", fontSize: "0.72rem" }}>{order.email || "—"}</p>
                            </div>

                            <p style={{ fontFamily: "'Inter',sans-serif", color: "#6b5748", fontSize: "0.82rem" }}>{order.product}</p>

                            <p style={{ fontFamily: "'Inter',sans-serif", color: "#E7B7B7", fontSize: "0.9rem", fontWeight: 700 }}>{fmt(order.amount)}</p>

                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                backgroundColor: m.bg,
                                color: m.color,
                                border: `1px solid ${m.border}`,
                                borderRadius: "999px",
                                padding: "4px 10px",
                                fontSize: "0.72rem",
                                fontFamily: "'Inter',sans-serif",
                                fontWeight: 600,
                                width: "fit-content",
                              }}
                            >
                              {m.icon} {m.label}
                            </span>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setViewInvoice(order);
                              }}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                backgroundColor: "#FDF0F0",
                                border: "1px solid #E7B7B740",
                                borderRadius: "7px",
                                padding: "6px 10px",
                                fontFamily: "'Inter',sans-serif",
                                fontSize: "0.74rem",
                                color: "#E7B7B7",
                                cursor: "pointer",
                              }}
                            >
                              <FileText size={12} /> Invoice
                            </button>

                            <div style={{ position: "relative" }} onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => setOpenDropdown(openDropdown === order.id ? null : order.id)}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  backgroundColor: "#F8F4EE",
                                  border: "1px solid #EDE0D4",
                                  borderRadius: "7px",
                                  padding: "6px 10px",
                                  fontFamily: "'Inter',sans-serif",
                                  fontSize: "0.74rem",
                                  color: "#6b5748",
                                  cursor: "pointer",
                                }}
                              >
                                Update <ChevronDown size={11} />
                              </button>

                              {openDropdown === order.id && (
                                <div
                                  style={{
                                    position: "absolute",
                                    top: "100%",
                                    right: 0,
                                    marginTop: "6px",
                                    backgroundColor: "#fff",
                                    borderRadius: "12px",
                                    boxShadow: "0 8px 32px rgba(74,55,40,0.16)",
                                    border: "1px solid #EDE0D4",
                                    zIndex: 9999,
                                    minWidth: "140px",
                                    overflow: "visible",
                                  }}
                                >
                                  {(["pending", "paid", "shipped", "delivered"] as const).map((s) => {
                                    const sm = getStatusMeta(s);
                                    return (
                                      <button
                                        key={s}
                                        onClick={() => {
                                          onUpdateStatus(order.firestoreId!, s);
                                          setOpenDropdown(null);
                                        }}
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: "8px",
                                          width: "100%",
                                          textAlign: "left",
                                          padding: "10px 14px",
                                          fontFamily: "'Inter',sans-serif",
                                          fontSize: "0.8rem",
                                          color: sm.color,
                                          backgroundColor: order.status === s ? sm.bg : "transparent",
                                          border: "none",
                                          cursor: "pointer",
                                          fontWeight: order.status === s ? 600 : 400,
                                        }}
                                      >
                                        {sm.icon} {sm.label}
                                      </button>
                                    );
                                  })}

                                  <button
                                    onClick={() => {
                                      onUpdateStatus(order.firestoreId!, "paid");
                                      setOpenDropdown(null);
                                    }}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "8px",
                                      width: "100%",
                                      textAlign: "left",
                                      padding: "10px 14px",
                                      fontFamily: "'Inter',sans-serif",
                                      fontSize: "0.8rem",
                                      color: "#fff",
                                      backgroundColor: "#22C55E",
                                      border: "none",
                                      cursor: "pointer",
                                      fontWeight: 600,
                                    }}
                                  >
                                    Verify Payment
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          {isExpanded && (
                            <div style={{ backgroundColor: "#FFFAF6", borderBottom: "1px solid #F0E8E0", padding: "16px 18px" }}>
                              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
                                {[
                                  ["Invoice No.", order.invoiceNumber],
                                  ["Phone", order.phone],
                                  ["Time", new Date(order.date).toLocaleTimeString("en-IN")],
                                  ["Full Address", `${order.address}, ${order.city}, ${order.state} - ${order.pincode}`],
                                ].map(([label, value]) => (
                                  <div key={label as string} style={{ gridColumn: label === "Full Address" ? "span 2" : undefined }}>
                                    <p
                                      style={{
                                        fontFamily: "'Inter',sans-serif",
                                        color: "#A8B197",
                                        fontSize: "0.68rem",
                                        letterSpacing: "0.08em",
                                        textTransform: "uppercase",
                                        marginBottom: "3px",
                                      }}
                                    >
                                      {label}
                                    </p>
                                    <p style={{ fontFamily: "'Inter',sans-serif", color: "#4a3728", fontSize: "0.82rem", fontWeight: 500 }}>
                                      {value}
                                    </p>
                                  </div>
                                ))}
                              </div>

                              {order.paymentScreenshot && (
                                <div style={{ marginTop: "12px" }}>
                                  <p style={{ fontWeight: 600, marginBottom: "8px", fontFamily: "'Inter',sans-serif", color: "#4a3728" }}>
                                    Payment Screenshot
                                  </p>
                                  <img
                                    src={order.paymentScreenshot}
                                    alt="Payment Proof"
                                    style={{ width: "300px", maxWidth: "100%", borderRadius: "12px", border: "1px solid #EDE0D4" }}
                                  />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            )}

            {activeTab === "analytics" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div style={{ backgroundColor: "#fff", borderRadius: "16px", padding: "24px", border: "1px solid #EDE0D4", gridColumn: "span 2" }}>
                  <h3
                    style={{
                      fontFamily: "'Playfair Display',serif",
                      color: "#4a3728",
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      marginBottom: "20px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <TrendingUp size={18} style={{ color: "#A8B197" }} /> Revenue Breakdown by Product
                  </h3>
                  {normalizedOrders.length === 0 ? (
                    <p style={{ fontFamily: "'Inter',sans-serif", color: "#A8B197", fontSize: "0.85rem", textAlign: "center", padding: "32px 0" }}>
                      No data yet. Orders will show analytics here.
                    </p>
                  ) : (
                    (() => {
                      const productMap: Record<string, { count: number; revenue: number }> = {};
                      normalizedOrders.forEach((o) => {
                        if (!productMap[o.product]) productMap[o.product] = { count: 0, revenue: 0 };
                        productMap[o.product].count++;
                        productMap[o.product].revenue += o.amount;
                      });
                      const sorted = Object.entries(productMap).sort((a, b) => b[1].revenue - a[1].revenue);
                      const maxRev = sorted[0]?.[1].revenue || 1;
                      return (
                        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                          {sorted.map(([product, { count, revenue }]) => (
                            <div key={product}>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                                <span style={{ fontFamily: "'Inter',sans-serif", color: "#4a3728", fontSize: "0.83rem", fontWeight: 500 }}>
                                  {product}
                                </span>
                                <span style={{ fontFamily: "'Inter',sans-serif", color: "#E7B7B7", fontSize: "0.83rem", fontWeight: 600 }}>
                                  {fmt(revenue)} · {count} order{count !== 1 ? "s" : ""}
                                </span>
                              </div>
                              <div style={{ height: "8px", backgroundColor: "#F0E8E0", borderRadius: "4px" }}>
                                <div
                                  style={{
                                    height: "100%",
                                    width: `${(revenue / maxRev) * 100}%`,
                                    background: "linear-gradient(90deg,#E7B7B7,#A8B197)",
                                    borderRadius: "4px",
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()
                  )}
                </div>

                <div style={{ backgroundColor: "#fff", borderRadius: "16px", padding: "24px", border: "1px solid #EDE0D4" }}>
                  <h3 style={{ fontFamily: "'Playfair Display',serif", color: "#4a3728", fontSize: "1rem", fontWeight: 600, marginBottom: "18px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <Eye size={16} style={{ color: "#E7B7B7" }} /> Key Metrics
                  </h3>
                  {[
                    ["Avg. Order Value", normalizedOrders.length ? fmt(Math.round(totalRevenue / normalizedOrders.length)) : "—"],
                    ["Unique Customers", new Set(normalizedOrders.map((o) => o.phone)).size],
                    ["Paid + Shipped + Delivered", normalizedOrders.filter((o) => o.status !== "pending").length],
                    ["Pending Revenue", fmt(normalizedOrders.filter((o) => o.status === "pending").reduce((s, o) => s + o.amount, 0))],
                  ].map(([label, value]) => (
                    <div
                      key={label as string}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "10px 0",
                        borderBottom: "1px dashed #EDE0D4",
                      }}
                    >
                      <span style={{ fontFamily: "'Inter',sans-serif", color: "#6b5748", fontSize: "0.82rem" }}>{label}</span>
                      <span style={{ fontFamily: "'Playfair Display',serif", color: "#4a3728", fontSize: "0.95rem", fontWeight: 700 }}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>

                <div style={{ backgroundColor: "#fff", borderRadius: "16px", padding: "24px", border: "1px solid #EDE0D4" }}>
                  <h3 style={{ fontFamily: "'Playfair Display',serif", color: "#4a3728", fontSize: "1rem", fontWeight: 600, marginBottom: "18px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <MapPinIcon /> Top Delivery Cities
                  </h3>
                  {normalizedOrders.length === 0 ? (
                    <p style={{ fontFamily: "'Inter',sans-serif", color: "#A8B197", fontSize: "0.82rem" }}>No data yet.</p>
                  ) : (
                    (() => {
                      const cityMap: Record<string, number> = {};
                      normalizedOrders.forEach((o) => {
                        cityMap[o.city] = (cityMap[o.city] || 0) + 1;
                      });
                      return Object.entries(cityMap)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 6)
                        .map(([city, count]) => (
                          <div key={city} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px dashed #EDE0D4" }}>
                            <span style={{ fontFamily: "'Inter',sans-serif", color: "#6b5748", fontSize: "0.82rem" }}>{city}</span>
                            <span style={{ fontFamily: "'Inter',sans-serif", color: "#E7B7B7", fontSize: "0.82rem", fontWeight: 600 }}>
                              {count} order{count !== 1 ? "s" : ""}
                            </span>
                          </div>
                        ));
                    })()
                  )}
                </div>
              </div>
            )}
            {activeTab === "messages" && (
  <div>
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: "16px",
        border: "1px solid #EDE0D4",
        overflow: "hidden",
        boxShadow: "0 2px 12px rgba(74,55,40,0.05)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 2fr 1fr",
          padding: "12px 18px",
          backgroundColor: "#4a3728",
          gap: "8px",
        }}
      >
        <p style={{ color: "#c4a090", fontSize: "0.75rem", fontWeight: 600 }}>
          NAME
        </p>
        <p style={{ color: "#c4a090", fontSize: "0.75rem", fontWeight: 600 }}>
          EMAIL
        </p>
        <p style={{ color: "#c4a090", fontSize: "0.75rem", fontWeight: 600 }}>
          MESSAGE
        </p>
        <p style={{ color: "#c4a090", fontSize: "0.75rem", fontWeight: 600 }}>
          STATUS
        </p>
      </div>

      {messages.length === 0 ? (
        <div style={{ padding: "30px", textAlign: "center" }}>
          No messages yet
        </div>
      ) : (
        messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 2fr 1fr",
              padding: "16px 18px",
              gap: "8px",
              borderBottom: "1px solid #F5EDE5",
            }}
          >
            <div>{msg.name}</div>
            <div>{msg.email}</div>
            <div>{msg.message}</div>
            <div>
              <span
                style={{
                  backgroundColor: "#FDF0F0",
                  color: "#E7B7B7",
                  padding: "4px 10px",
                  borderRadius: "999px",
                  fontSize: "0.75rem",
                }}
              >
                {msg.status}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
)}
          </div>
        </div>
      </div>

      {viewInvoice && <InvoiceViewer order={viewInvoice} onClose={() => setViewInvoice(null)} />}
    </>
  );
}

function MapPinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A8B197" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}