import { useState, useEffect, useRef } from "react";
import {
  X,
  MapPin,
  User,
  Phone,
  Mail,
  ChevronRight,
  Smartphone,
  AlertCircle,
  CheckCircle2,
  Lock,
  ShieldCheck,
  Upload,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";
import qrCodeImg from "../../imports/image-5.png";

import {
  collection,
  addDoc,
  serverTimestamp
} from "firebase/firestore";

import {
  ref,
  uploadBytes,
  getDownloadURL
} from "firebase/storage";

import { db,storage } from "../firebase";

export interface Product {
  id: number;
  name: string;
  price: string;
  priceNum: number;
  image: string;
}

export interface Order {
  id: string;
  firestoreId?: string;
  invoiceNumber: string;
  product: string;
  amount: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  pincode: string;
  city: string;
  state: string;
  status:
    | "pending"
    | "paid"
    | "shipped"
    | "delivered";

  paymentStatus: "verified";

  paymentScreenshot?: string;

  date: string;
}

interface Props {
  product: Product | null;
  onClose: () => void;
  onOrderPlaced: (order: Order) => void;
}

type Step = "details" | "payment" | "success";

function generateOrderId() {
  return "RCC" + Date.now().toString().slice(-8).toUpperCase();
}

function generateInvoice() {
  return (
    "INV-" +
    new Date().getFullYear() +
    "-" +
    Math.floor(1000 + Math.random() * 9000)
  );
}

export function CheckoutModal({ product, onClose, onOrderPlaced }: Props) {
  const [step, setStep] = useState<Step>("details");
  const [paymentInitiated, setPaymentInitiated] = useState(false);
  const [timerSec, setTimerSec] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    pincode: "",
    city: "",
    state: "",
  });

  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (!product) return null;

  const UPI_PA = "riyabhutal@okaxis";

  const upiLink = `upi://pay?pa=${UPI_PA}&pn=Riya%20Bhutal%20Subhash&am=${product.priceNum}&cu=INR&tn=${encodeURIComponent(
    product.name
  )}&mc=5945`;

  const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  const startTimer = () => {
    setTimerSec(0);
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimerSec((s) => s + 1);
    }, 1000);
  };

const placeOrder = async (paymentRef: string) => {
  const order: Order = {
    id: generateOrderId(),
    invoiceNumber: generateInvoice(),
    product: product.name,
    amount: product.priceNum,
    name: form.name,
    email: form.email,
    phone: form.phone,
    address: form.address,
    city: form.city,
    state: form.state,
    pincode: form.pincode,
    status: "pending",
    paymentStatus: "verified",
    date: new Date().toISOString(),
    paymentScreenshot: paymentRef,
  };
  await addDoc(
    collection(db, "orders"),
    {
      ...order,
      createdAt: serverTimestamp(),
    }
  );
  setCompletedOrder(order);
  onOrderPlaced(order);
  setStep("success");
};

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
    setPaymentInitiated(false);
    setSelectedFile(null);
    setPreviewUrl(null);
    setFileError("");
  };

  const handleInitiatePayment = () => {
    window.location.href = upiLink;
    setPaymentInitiated(true);
    startTimer();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError("");

    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      setFileError("Only PNG, JPG, JPEG files are allowed.");
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);

    const url = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreviewUrl(url);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFileError("");
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

const uploadScreenshot = async () => {
  if (!selectedFile)
    throw new Error("Please upload payment screenshot.");

  setUploading(true);

  try {
    const formData = new FormData();

    formData.append("file", selectedFile);

    formData.append(
      "upload_preset",
      "payment_screenshots"
    );

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dhwf9udu2/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();


    if (!response.ok) {
      throw new Error(data.error?.message || "Upload failed");
    }

    return data.secure_url;
  } catch (err) {
    console.error("Upload Error:", err);
    throw err;
  } finally {
    setUploading(false);
  }
};

  const handleConfirmPayment = async () => {
    if (!selectedFile) {
      setFileError("Please upload payment screenshot before confirming.");
      return;
    }

    try {
      const paymentRef = await uploadScreenshot();
      await placeOrder(paymentRef);
    } catch (err) {
      setFileError("Upload failed. Please try again.");
    }
  };

  const handleClose = () => {
    setStep("details");
    setForm({
      name: "",
      email: "",
      phone: "",
      address: "",
      pincode: "",
      city: "",
      state: "",
    });
    setSelectedFile(null);
    setPreviewUrl(null);
    setFileError("");
    setPaymentInitiated(false);
    setTimerSec(0);
    setCompletedOrder(null);

    if (timerRef.current) clearInterval(timerRef.current);
    onClose();
  };

  return (
    <div
      style={overlayStyle}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div style={modalStyle}>
        <div style={topBarStyle} />

        <div style={stepsBarStyle}>
          {[
            { k: "details", label: "1. Delivery" },
            { k: "payment", label: "2. Payment" },
            { k: "success", label: "3. Confirmed" },
          ].map(({ k, label }, i) => {
            const stepIdx = step === "details" ? 0 : step === "payment" ? 1 : 2;
            const done = i < stepIdx;
            const active = i === stepIdx;

            return (
              <div key={k} style={stepItemStyle}>
                <div
                  style={{
                    ...stepPillStyle,
                    backgroundColor: active
                      ? "#4a3728"
                      : done
                      ? "#A8B197"
                      : "#E8DDD5",
                  }}
                >
                  <span style={{ ...stepTextStyle, color: active || done ? "#fff" : "#8a7060" }}>
                    {label}
                  </span>
                </div>
                {i < 2 && <ChevronRight size={13} style={{ color: "#c4a090" }} />}
              </div>
            );
          })}
        </div>

        <div style={contentStyle}>
          <button onClick={handleClose} style={closeBtnStyle}>
            <X size={20} />
          </button>

          {step === "details" && (
            <>
              <h3 style={titleStyle}>Delivery Information</h3>

              <form onSubmit={handleDetailsSubmit} className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Full Name *" icon={<User size={13} />}>
                    <input
                      required
                      type="text"
                      placeholder="Your full name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      style={inputStyle}
                    />
                  </Field>

                  <Field label="Phone *" icon={<Phone size={13} />}>
                    <input
                      required
                      type="tel"
                      placeholder="10-digit number"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      style={inputStyle}
                    />
                  </Field>
                </div>

                <Field label="Email Address *" icon={<Mail size={13} />}>
                  <input
                    required
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    style={inputStyle}
                  />
                </Field>

                <Field
                  label="Street Address *"
                  icon={<MapPin size={13} style={{ marginTop: "2px" }} />}
                >
                  <textarea
                    required
                    rows={2}
                    placeholder="House no., Street, Area, Landmark"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    style={{ ...inputStyle, resize: "none", paddingTop: "10px" }}
                  />
                </Field>

                <div className="grid grid-cols-3 gap-3">
                  <Field label="City *">
                    <input
                      required
                      type="text"
                      placeholder="City"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      style={inputStyle}
                    />
                  </Field>

                  <Field label="State *">
                    <input
                      required
                      type="text"
                      placeholder="State"
                      value={form.state}
                      onChange={(e) => setForm({ ...form, state: e.target.value })}
                      style={inputStyle}
                    />
                  </Field>

                  <Field label="Pincode *">
                    <input
                      required
                      type="text"
                      placeholder="Pincode"
                      value={form.pincode}
                      onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                      style={inputStyle}
                    />
                  </Field>
                </div>

                <button type="submit" style={primaryBtnStyle} className="mt-2">
                  Continue to Payment <ChevronRight size={16} />
                </button>
              </form>
            </>
          )}

          {step === "payment" && (
            <>
              <h3 style={titleStyle}>Complete Payment</h3>

              <p style={subTextStyle}>
                Pay exactly <strong style={{ color: "#E7B7B7" }}>{fmt(product.priceNum)}</strong>{" "}
                for <strong style={{ color: "#4a3728" }}>{product.name}</strong>
              </p>

              <div style={qrCardStyle}>
                <p style={qrLabelStyle}>Scan with GPay · PhonePe · Paytm · BHIM</p>

                <img src={qrCodeImg} alt="UPI QR Code" style={qrImageStyle} />

                <p style={upiIdStyle}>riyabhutal@okaxis</p>
                <p style={upiNameStyle}>Bhutal Riya Subhash</p>
              </div>

              <button onClick={handleInitiatePayment} style={upiBtnStyle}>
                <Smartphone size={16} />
                {paymentInitiated
                  ? `UPI App Opened (${timerSec}s ago)`
                  : `Open UPI App — Pay ${fmt(product.priceNum)}`}
              </button>

              <div style={uploadBoxStyle}>
                <p style={uploadTitleStyle}>
                  <ShieldCheck size={14} style={{ color: "#c4a090" }} />
                  Upload Payment Screenshot *
                </p>

                <p style={uploadNoteStyle}>
                  Upload the payment screenshot after completing the UPI transaction. Only PNG, JPG,
                  and JPEG are allowed.
                </p>

                <label style={uploadLabelStyle}>
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                  <span style={uploadLabelInnerStyle}>
                    <Upload size={16} />
                    Choose Screenshot
                  </span>
                </label>

                {fileError && (
                  <p style={errorTextStyle}>
                    <AlertCircle size={12} />
                    {fileError}
                  </p>
                )}

                {previewUrl ? (
                  <div style={previewWrapStyle}>
                    <img src={previewUrl} alt="Payment preview" style={previewImgStyle} />
                    <div style={{ flex: 1 }}>
                      <div style={previewNameStyle}>{selectedFile?.name}</div>
                      <div style={previewSizeStyle}>
                        {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : ""}
                      </div>
                    </div>
                    <button onClick={handleRemoveFile} style={removeBtnStyle} type="button">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ) : (
                  <div style={emptyPreviewStyle}>
                    <ImageIcon size={18} />
                    <span>No screenshot selected yet</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-4">
                <button onClick={() => setStep("details")} style={backBtnStyle}>
                  ← Back
                </button>

                <button
                  onClick={handleConfirmPayment}
                  disabled={!selectedFile || uploading}
                  style={{
                    ...primaryBtnStyle,
                    flex: 1,
                    opacity: !selectedFile || uploading ? 0.45 : 1,
                    cursor: !selectedFile || uploading ? "not-allowed" : "pointer",
                  }}
                >
                  <ShieldCheck size={15} />
                  {uploading ? "Uploading..." : "Confirm Payment"}
                </button>
              </div>

              <p style={footerNoteStyle}>
                <Lock size={11} /> Orders are created only after payment screenshot is uploaded
              </p>
            </>
          )}

          {step === "success" && completedOrder && (
            <div style={successWrapStyle}>
              <div style={successIconStyle}>
                <CheckCircle2 size={40} style={{ color: "#22C55E" }} />
              </div>

              <h3 style={successTitleStyle}>Order Confirmed! 🌸</h3>
              <p style={successSubStyle}>Payment Verified Successfully</p>

              <div style={summaryBoxStyle}>
                <div style={summaryGridStyle}>
                  {[
                    ["Order ID", completedOrder.id],
                    ["Invoice", completedOrder.invoiceNumber],
                    ["Product", completedOrder.product],
                    ["Amount Paid", fmt(completedOrder.amount)],
                    ["Payment Ref", completedOrder.paymentScreenshot],
                    [
                      "Date",
                      new Date(completedOrder.date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }),
                    ],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <p style={summaryLabelStyle}>{label}</p>
                      <p style={summaryValueStyle}>{value}</p>
                    </div>
                  ))}
                </div>

                <div style={summaryAddressWrapStyle}>
                  <p style={summaryLabelStyle}>Shipping To</p>
                  <p style={summaryAddressStyle}>
                    {completedOrder.address}, {completedOrder.city}, {completedOrder.state} —{" "}
                    {completedOrder.pincode}
                  </p>
                </div>
              </div>

              <p style={successTextStyle}>
                A confirmation has been saved for <strong>{form.email}</strong>.
              </p>

              <button onClick={handleClose} style={{ ...primaryBtnStyle, width: "100%" }}>
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label style={fieldLabelStyle}>{label}</label>
      <div style={{ position: "relative" }}>
        {icon && <span style={fieldIconStyle}>{icon}</span>}
        <div style={{ paddingLeft: icon ? "32px" : 0 }}>{children}</div>
      </div>
    </div>
  );
}

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(30,15,5,0.6)",
  backdropFilter: "blur(8px)",
  zIndex: 1000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "16px",
  overflowY: "auto",
};

const modalStyle: React.CSSProperties = {
  backgroundColor: "#FFFAF6",
  borderRadius: "24px",
  boxShadow: "0 40px 120px rgba(74,55,40,0.3)",
  width: "100%",
  maxWidth: "520px",
  overflow: "hidden",
  position: "relative",
  margin: "auto",
};

const topBarStyle: React.CSSProperties = {
  height: "5px",
  background:
    "linear-gradient(90deg, #E7B7B7, #A8B197, #c4a882, #E7B7B7)",
};

const stepsBarStyle: React.CSSProperties = {
  backgroundColor: "#F8F4EE",
  padding: "14px 24px",
  display: "flex",
  alignItems: "center",
  gap: "6px",
  flexWrap: "wrap",
};

const stepItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
};

const stepPillStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  padding: "5px 12px",
  borderRadius: "999px",
  transition: "all 0.2s",
};

const stepTextStyle: React.CSSProperties = {
  fontFamily: "'Inter',sans-serif",
  fontSize: "0.75rem",
  fontWeight: 600,
};

const contentStyle: React.CSSProperties = {
  padding: "24px 28px 28px",
  position: "relative",
};

const closeBtnStyle: React.CSSProperties = {
  position: "absolute",
  top: "16px",
  right: "20px",
  color: "#c4a090",
  background: "none",
  border: "none",
  cursor: "pointer",
};

const titleStyle: React.CSSProperties = {
  fontFamily: "'Playfair Display',serif",
  color: "#4a3728",
  fontSize: "1.15rem",
  fontWeight: 700,
  marginBottom: "18px",
};

const subTextStyle: React.CSSProperties = {
  fontFamily: "'Inter',sans-serif",
  color: "#8a6d5e",
  fontSize: "0.82rem",
  marginBottom: "16px",
};

const qrCardStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  borderRadius: "16px",
  border: "1px solid #EDE0D4",
  padding: "18px",
  marginBottom: "14px",
  textAlign: "center",
};

const qrLabelStyle: React.CSSProperties = {
  fontFamily: "'Inter',sans-serif",
  color: "#4a3728",
  fontSize: "0.82rem",
  fontWeight: 600,
  marginBottom: "12px",
};

const qrImageStyle: React.CSSProperties = {
  width: "160px",
  height: "160px",
  objectFit: "contain",
  margin: "0 auto",
  display: "block",
};

const upiIdStyle: React.CSSProperties = {
  fontFamily: "monospace",
  color: "#A8B197",
  fontSize: "0.8rem",
  marginTop: "10px",
};

const upiNameStyle: React.CSSProperties = {
  fontFamily: "'Inter',sans-serif",
  color: "#A8B197",
  fontSize: "0.72rem",
};

const upiBtnStyle: React.CSSProperties = {
  width: "100%",
  backgroundColor: "#4a3728",
  color: "#fff",
  borderRadius: "12px",
  padding: "13px",
  fontFamily: "'Inter',sans-serif",
  fontWeight: 600,
  fontSize: "0.88rem",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  marginBottom: "16px",
};

const uploadBoxStyle: React.CSSProperties = {
  backgroundColor: "#F8F4EE",
  borderRadius: "13px",
  border: "1.5px solid #E7B7B740",
  padding: "14px",
};

const uploadTitleStyle: React.CSSProperties = {
  fontFamily: "'Inter',sans-serif",
  color: "#4a3728",
  fontSize: "0.8rem",
  fontWeight: 600,
  marginBottom: "6px",
  display: "flex",
  alignItems: "center",
  gap: "6px",
};

const uploadNoteStyle: React.CSSProperties = {
  fontFamily: "'Inter',sans-serif",
  color: "#8a6d5e",
  fontSize: "0.74rem",
  marginBottom: "10px",
  lineHeight: "1.5",
};

const uploadLabelStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
};

const uploadLabelInnerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  width: "100%",
  padding: "12px 14px",
  borderRadius: "10px",
  border: "1.5px dashed #c4a090",
  backgroundColor: "#FFFAF6",
  color: "#4a3728",
  fontFamily: "'Inter',sans-serif",
  fontSize: "0.86rem",
  fontWeight: 600,
  cursor: "pointer",
};

const errorTextStyle: React.CSSProperties = {
  fontFamily: "'Inter',sans-serif",
  color: "#E74C3C",
  fontSize: "0.74rem",
  marginTop: "8px",
  display: "flex",
  alignItems: "center",
  gap: "6px",
};

const previewWrapStyle: React.CSSProperties = {
  marginTop: "12px",
  display: "flex",
  gap: "10px",
  alignItems: "center",
  backgroundColor: "#fff",
  padding: "10px",
  borderRadius: "12px",
  border: "1px solid #EDE0D4",
};

const previewImgStyle: React.CSSProperties = {
  width: "78px",
  height: "78px",
  objectFit: "cover",
  borderRadius: "8px",
  border: "1px solid #EDE0D4",
};

const previewNameStyle: React.CSSProperties = {
  fontFamily: "'Inter',sans-serif",
  color: "#4a3728",
  fontWeight: 600,
  fontSize: "0.86rem",
  wordBreak: "break-word",
};

const previewSizeStyle: React.CSSProperties = {
  fontFamily: "'Inter',sans-serif",
  color: "#8a6d5e",
  fontSize: "0.75rem",
  marginTop: "4px",
};

const removeBtnStyle: React.CSSProperties = {
  background: "transparent",
  border: "none",
  color: "#c4a090",
  cursor: "pointer",
  padding: "6px",
};

const emptyPreviewStyle: React.CSSProperties = {
  marginTop: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  color: "#A8B197",
  fontFamily: "'Inter',sans-serif",
  fontSize: "0.78rem",
};

const backBtnStyle: React.CSSProperties = {
  flex: "0 0 auto",
  padding: "12px 18px",
  borderRadius: "12px",
  border: "1.5px solid #EDE0D4",
  fontFamily: "'Inter',sans-serif",
  fontSize: "0.82rem",
  color: "#8a6d5e",
  backgroundColor: "transparent",
  cursor: "pointer",
};

const primaryBtnStyle: React.CSSProperties = {
  backgroundColor: "#E7B7B7",
  color: "#fff",
  borderRadius: "12px",
  padding: "13px 20px",
  fontFamily: "'Inter',sans-serif",
  fontWeight: 600,
  fontSize: "0.9rem",
  border: "none",
  cursor: "pointer",
  boxShadow: "0 4px 18px #E7B7B750",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
};

const footerNoteStyle: React.CSSProperties = {
  fontFamily: "'Inter',sans-serif",
  color: "#a0887a",
  fontSize: "0.72rem",
  textAlign: "center",
  marginTop: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "4px",
};

const fieldLabelStyle: React.CSSProperties = {
  fontFamily: "'Inter',sans-serif",
  color: "#6b5748",
  fontSize: "0.76rem",
  display: "block",
  marginBottom: "5px",
};

const fieldIconStyle: React.CSSProperties = {
  position: "absolute",
  left: "12px",
  top: "50%",
  transform: "translateY(-50%)",
  color: "#c4a090",
  pointerEvents: "none",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 13px",
  borderRadius: "10px",
  border: "1.5px solid #E7B7B750",
  backgroundColor: "#FFFAF6",
  fontFamily: "'Inter',sans-serif",
  color: "#4a3728",
  fontSize: "0.87rem",
  outline: "none",
};

const successWrapStyle: React.CSSProperties = {
  textAlign: "center",
  paddingTop: "8px",
};

const successIconStyle: React.CSSProperties = {
  width: "72px",
  height: "72px",
  borderRadius: "50%",
  backgroundColor: "#F0FDF4",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto 16px",
  boxShadow: "0 4px 20px #22C55E20",
};

const successTitleStyle: React.CSSProperties = {
  fontFamily: "'Playfair Display',serif",
  color: "#4a3728",
  fontSize: "1.4rem",
  fontWeight: 700,
  marginBottom: "4px",
};

const successSubStyle: React.CSSProperties = {
  fontFamily: "'Inter',sans-serif",
  color: "#22C55E",
  fontSize: "0.82rem",
  fontWeight: 600,
  marginBottom: "16px",
};

const summaryBoxStyle: React.CSSProperties = {
  backgroundColor: "#F8F4EE",
  borderRadius: "16px",
  padding: "18px 20px",
  textAlign: "left",
  marginBottom: "18px",
  border: "1px solid #EDE0D4",
};

const summaryGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "12px 20px",
};

const summaryLabelStyle: React.CSSProperties = {
  fontFamily: "'Inter',sans-serif",
  color: "#A8B197",
  fontSize: "0.68rem",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  marginBottom: "2px",
};

const summaryValueStyle: React.CSSProperties = {
  fontFamily: "'Inter',sans-serif",
  color: "#4a3728",
  fontSize: "0.84rem",
  fontWeight: 600,
};

const summaryAddressWrapStyle: React.CSSProperties = {
  borderTop: "1px solid #EDE0D4",
  marginTop: "12px",
  paddingTop: "12px",
};

const summaryAddressStyle: React.CSSProperties = {
  fontFamily: "'Inter',sans-serif",
  color: "#4a3728",
  fontSize: "0.84rem",
};

const successTextStyle: React.CSSProperties = {
  fontFamily: "'Inter',sans-serif",
  color: "#7a6050",
  fontSize: "0.82rem",
  marginBottom: "20px",
  lineHeight: "1.6",
};
