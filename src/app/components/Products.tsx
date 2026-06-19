import { useState, useEffect } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import { SmallFlower } from "./FloralDecor";
import type { Product } from "./CheckoutModal";

import viralBouquetImg from "../../imports/image.png";
import cherryKeychainImg from "../../imports/image-1.png";
import blueberryKeychainImg from "../../imports/image-2.png";
import froggyImg from "../../imports/image-3.png";
import fishnetSleevesImg from "../../imports/image-4.png";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const imageMap = [
  viralBouquetImg,
  cherryKeychainImg,
  blueberryKeychainImg,
  fishnetSleevesImg,
  "https://images.unsplash.com/photo-1622648147611-e817249f3b73?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=600",
  froggyImg,
];

export function Products({
  onBuyNow,
}: {
  onBuyNow: (product: Product) => void;
}) {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, "products"));

        const firebaseProducts = snapshot.docs.map((doc) => {
          const data: any = doc.data();

          return {
            id: doc.id,
            imageId: Number(data.imageId || 1),
            name: data.name || "Unnamed Product",
            price: `₹${data.price || 0}`,
            priceNum: Number(data.price || 0),
            tag: data.category || "New",
            image: imageMap[(Number(data.imageId || 1) - 1)] || viralBouquetImg,
            alt: data.name || "Crochet Product",
          };
        });

          firebaseProducts.sort(
            (a, b) => a.imageId - b.imageId
          );

          setProducts(firebaseProducts);


      } catch (error) {
        console.error("Firebase Error:", error);
      }
    };

    fetchProducts();
  }, []);

  const toggleWishlist = (id: number) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]
    );
  };

  return (
    <section
      id="shop"
      style={{ backgroundColor: "#FFFAF6" }}
      className="py-20"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <div className="flex justify-center items-center gap-3 mb-3">
            <SmallFlower color="#E7B7B7" />
            <span
              style={{
                color: "#A8B197",
                fontFamily: "'Inter', sans-serif",
              }}
              className="text-xs tracking-widest uppercase"
            >
              Handpicked for You
            </span>
            <SmallFlower color="#A8B197" />
          </div>

          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "#4a3728",
              fontSize: "2.4rem",
              fontWeight: 700,
            }}
          >
            Featured Products
          </h2>

          <div
            style={{ backgroundColor: "#E7B7B7" }}
            className="w-16 h-1 rounded-full mx-auto mt-3"
          />
        </div>

        <div className="overflow-x-auto pb-4">
          <div className="flex gap-5" style={{ minWidth: "max-content" }}>
            {products.map((product) => (
              <div
                key={product.id}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "20px",
                  boxShadow: "0 4px 20px rgba(74,55,40,0.08)",
                  border: "1px solid #F0E8E0",
                  width: "220px",
                  flexShrink: 0,
                  overflow: "hidden",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                className="hover:shadow-lg hover:-translate-y-1"
              >
                <div
                  style={{
                    position: "relative",
                    height: "200px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.alt}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />

                  <span
                    style={{
                      position: "absolute",
                      top: "10px",
                      left: "10px",
                      backgroundColor: "#E7B7B7",
                      color: "#fff",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.65rem",
                      padding: "3px 10px",
                      borderRadius: "999px",
                    }}
                  >
                    {product.tag}
                  </span>

                  <button
                    onClick={() => toggleWishlist(product.id)}
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      backgroundColor: "#fff",
                      borderRadius: "50%",
                      width: "32px",
                      height: "32px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                    }}
                  >
                    <Heart
                      size={15}
                      style={{
                        fill: wishlist.includes(product.id)
                          ? "#E7B7B7"
                          : "transparent",
                        stroke: wishlist.includes(product.id)
                          ? "#E7B7B7"
                          : "#c4a090",
                      }}
                    />
                  </button>
                </div>

                <div className="p-4">
                  <h3
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      color: "#4a3728",
                      fontSize: "0.95rem",
                      fontWeight: 600,
                      marginBottom: "4px",
                    }}
                  >
                    {product.name}
                  </h3>

                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      color: "#E7B7B7",
                      fontWeight: 600,
                      fontSize: "1rem",
                      marginBottom: "12px",
                    }}
                  >
                    {product.price}
                  </p>

                  <button
                    onClick={() => onBuyNow(product)}
                    style={{
                      width: "100%",
                      backgroundColor: "#E7B7B7",
                      color: "#fff",
                      borderRadius: "999px",
                      padding: "8px 0",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.8rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                    }}
                    className="hover:opacity-85 transition-opacity"
                  >
                    <ShoppingBag size={13} />
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            color: "#A8B197",
            fontSize: "0.8rem",
          }}
          className="text-center mt-6"
        >
          ← Scroll to see all products →
        </p>
      </div>
    </section>
  );
}