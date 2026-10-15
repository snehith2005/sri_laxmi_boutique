import { useState } from "react";
import StarRating from "./StarRating";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function ReviewSection({ productId, reviews, onReviewAdded }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const { data } = await api.post(`/products/${productId}/reviews`, { rating, comment });
      onReviewAdded(data);
      setComment("");
      setRating(0);
    } catch (err) {
      setError(err.response?.data?.detail || "Could not submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="review-section">
      <h3>Reviews {reviews.length > 0 && `(${reviews.length})`}</h3>

      {user && (
        <form className="review-form" onSubmit={submit}>
          <label>Your rating</label>
          <StarRating value={rating} onChange={setRating} size={24} />
          <textarea
            placeholder="Share your thoughts on the fit, fabric, or style..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
          />
          {error && <p className="form-error">{error}</p>}
          <button className="btn-primary-sm" type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit review"}
          </button>
        </form>
      )}

      <ul className="review-list">
        {reviews.length === 0 && <p className="muted">No reviews yet — be the first to share your thoughts.</p>}
        {reviews.map((r) => (
          <li key={r.id} className="review-item">
            <div className="review-item-head">
              <strong>{r.user_name || "Customer"}</strong>
              <StarRating value={r.rating} readOnly size={14} />
            </div>
            {r.comment && <p>{r.comment}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
