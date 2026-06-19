import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export function ReviewForm() {
  const [name, setName] = useState("");
  const [review, setReview] = useState("");
  const [submitted, setSubmitted] = useState(false);
const [rating, setRating] = useState(5);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "reviews"), {
  name,
  review,
  rating,
  createdAt: serverTimestamp(),
});

      setSubmitted(true);
      setName("");
      setReview("");
    } catch (err) {
      console.error(err);
      alert("Failed to submit review");
    }
  };

  if (submitted) {
    return (
      <div
        style={{
          background: "#fff",
          padding: "24px",
          borderRadius: "20px",
          textAlign: "center",
          marginBottom: "40px",
        }}
      >
        Thank you for your review 🌸
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#fff",
        padding: "30px",
        borderRadius: "20px",
        maxWidth: "700px",
        margin: "0 auto 50px auto",
      }}
    >
      <h3
  style={{
    fontFamily: "'Playfair Display', serif",
    color: "#4a3728",
    fontSize: "1.5rem",
    fontWeight: 700,
    marginBottom: "24px",
  }}
>
  Share Your Experience 🌸
</h3>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{
  width: "100%",
  padding: "14px 18px",
  borderRadius: "12px",
  border: "1.5px solid #E7B7B750",
  backgroundColor: "#FFFAF6",
  fontFamily: "'Inter', sans-serif",
  color: "#4a3728",
  fontSize: "0.95rem",
  marginBottom: "16px",
}}
        />
<div style={{ marginBottom: "16px" }}>
  <h3
    style={{
    fontFamily: "'Playfair Display', serif",
    color: "#4a3728",
    fontSize: "1.5rem",
    fontWeight: 700,
    marginBottom: "2px",
  }}
  >
    Rating
  </h3>

  <div className="flex gap-2">
    {[1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        onClick={() => setRating(star)}
        style={{
          cursor: "pointer",
          fontSize: "28px",
          color: star <= rating ? "#F4C842" : "#E5E5E5",
          transition: "0.2s",
        }}
      >
        ★
      </span>
    ))}
  </div>
</div>
        <textarea
          placeholder="Write your review..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
          required
          rows={5}
          style={{
  width: "100%",
  padding: "14px 18px",
  borderRadius: "12px",
  border: "1.5px solid #E7B7B750",
  backgroundColor: "#FFFAF6",
  fontFamily: "'Inter', sans-serif",
  color: "#4a3728",
  fontSize: "0.95rem",
  resize: "none",
  minHeight: "180px",
  marginBottom: "20px",
}}
        />

        <button
          type="submit"
          style={{
  backgroundColor: "#E7B7B7",
  color: "#fff",
  borderRadius: "999px",
  padding: "14px 28px",
  fontFamily: "'Inter', sans-serif",
  fontWeight: 600,
  fontSize: "0.9rem",
  border: "none",
  boxShadow: "0 4px 16px #E7B7B740",
}}
        >
          Submit Review
        </button>
      </form>
    </div>
  );
}

