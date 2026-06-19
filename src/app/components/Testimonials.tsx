
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { SmallFlower } from "./FloralDecor";

function StarRating({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill={star <= count ? "#F4C842" : "#E5E5E5"}
        >
          <path d="M8 1l1.85 3.75L14 5.5l-3 2.93.71 4.13L8 10.4l-3.71 2.16.71-4.13L2 5.5l4.15-.75L8 1z" />
        </svg>
      ))}
    </div>
  );
}

interface Review {
  id: string;
  name: string;
  review: string;
  rating: number;
}

export function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "reviews"), (snapshot) => {
      const reviewData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Review, "id">),
      }));

      setReviews(reviewData);
    });

    return () => unsub();
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: "20px",
        border: "1px solid #F0E8E0",
        boxShadow: "0 4px 20px rgba(74,55,40,0.08)",
        padding: "36px",
        minHeight: "100%",
      }}
    >
      <h3
        style={{
          fontFamily: "'Playfair Display', serif",
          color: "#4a3728",
          fontSize: "1.5rem",
          fontWeight: 700,
          marginBottom: "20px",
        }}
      >
        Customer Love 🌸
      </h3>

      {reviews.length === 0 ? (
        <div
  style={{
    backgroundColor: "#FFFAF6",
    borderRadius: "16px",
    border: "1px solid #F0E8E0",
    padding: "32px 24px",
    minHeight: "260px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  }}
>
          <div className="mb-4">
            <SmallFlower color="#E7B7B7" />
          </div>

          <p
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "#4a3728",
              fontSize: "1.2rem",
              fontWeight: 600,
              marginBottom: "12px",
            }}
          >
            No Reviews Yet
          </p>

          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              color: "#6b5748",
              lineHeight: "1.75",
              fontSize: "0.95rem",
            }}
          >
            Be the first to share your experience with Riya's handmade crochet creations!
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              style={{
                backgroundColor: "#FFFAF6",
                borderRadius: "16px",
                border: "1px solid #F0E8E0",
                padding: "18px",
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <h4
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    color: "#4a3728",
                    fontSize: "1rem",
                    fontWeight: 600,
                  }}
                >
                  {review.name}
                </h4>

                <StarRating count={review.rating || 5} />
              </div>

              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  color: "#6b5748",
                  lineHeight: "1.75",
                  fontSize: "0.9rem",
                }}
              >
                "{review.review}"
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
