import { useState, useEffect, useCallback } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Products } from "./components/Products";
import { About } from "./components/About";
import { WhyChooseUs } from "./components/WhyChooseUs";
import { Testimonials } from "./components/Testimonials";
import { ReviewForm } from "./components/ReviewForm";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { LoginModal } from "./components/LoginModal";
import { CheckoutModal } from "./components/CheckoutModal";
import { AdminDashboard } from "./components/AdminDashboard";
import type { Product, Order } from "./components/CheckoutModal";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

export default function App() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

  const handleUpdateStatus = async (
  id: string,
  status: Order["status"]
) => {
  try {
    await updateDoc(
      doc(db, "orders", id),
      {
        status: status
      }
    );

    setOrders((prev) =>
      prev.map((o) =>
        o.id === id
          ? { ...o, status }
          : o
      )
    );
  } catch (error) {
    console.error(
      "Error updating order:",
      error
    );
  }
}; 

useEffect(() => {
  const unsub = onSnapshot(
    collection(db, "orders"),
    (snapshot) => {
      const firestoreOrders = snapshot.docs.map((doc) => ({
        ...doc.data(),
        firestoreId: doc.id,
      })) as Order[];

      setOrders(firestoreOrders);
    },
    (error) => {
      console.error("ORDERS ERROR:", error);
    }
  );

  return () => unsub();
}, []);

  // Secret shortcut: Ctrl + Shift + A
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey && e.shiftKey && e.key === "A") {
      e.preventDefault();
      setAdminOpen(true);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const handleOrderPlaced = (order: Order) => {
  setOrders(prev => [order, ...prev]);
};


  return (
    <div
      style={{
        backgroundColor: "#F8F4EE",
        fontFamily: "'Inter', sans-serif",
      }}
      className="min-h-screen"
    >
      <Header onLoginClick={() => setLoginOpen(true)} />

      <main>
        <Hero />
        <Products onBuyNow={(p) => setCheckoutProduct(p)} />
        <About />
        <WhyChooseUs />

<section
  id="reviews"
  style={{
    backgroundColor: "#F8F4EE",
    padding: "80px 24px",
  }}
>
  <div className="max-w-6xl mx-auto">
    {/* Heading */}
    <div className="text-center mb-14">
      <h2
        style={{
          fontFamily: "'Playfair Display', serif",
          color: "#4a3728",
          fontSize: "2.4rem",
          fontWeight: 700,
        }}
      >
        What Our Customers Say
      </h2>

      <div
        style={{ backgroundColor: "#E7B7B7" }}
        className="w-16 h-1 rounded-full mx-auto mt-3"
      />
    </div>

    <div className="grid md:grid-cols-2 gap-8 items-start">
      <ReviewForm />
      <Testimonials />
    </div>
  </div>
</section>
        <Contact />
      </main>

      <Footer />

      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
      />

      <CheckoutModal
        product={checkoutProduct}
        onClose={() => setCheckoutProduct(null)}
        onOrderPlaced={handleOrderPlaced}
      />

      {adminOpen && (
        <AdminDashboard
          orders={orders}
          onClose={() => setAdminOpen(false)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
}