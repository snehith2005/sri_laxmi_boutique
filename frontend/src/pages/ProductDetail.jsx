import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import StarRating from "../components/StarRating";
import ReviewSection from "../components/ReviewSection";
import { useAuth } from "../context/AuthContext";

const PLACEHOLDER = "https://placehold.co/600x750/f2e9e4/7a2e38?text=No+Image";

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/products/${id}`).then(({ data }) => {
      setProduct(data);
      setLoading(false);
    });
  }, [id]);

  const handleLike = async () => {
    if (!user) return;
    if (product.is_favorited) {
      await api.delete(`/favorites/${product.id}`);
    } else {
      await api.post(`/favorites/${product.id}`);
    }
    setProduct((p) => ({ ...p, is_favorited: !p.is_favorited }));
  };

  const handleReviewAdded = (review) => {
    setProduct((p) => {
      const existingIdx = p.reviews.findIndex((r) => r.user_id === review.user_id);
      const reviews = existingIdx >= 0
        ? p.reviews.map((r, i) => (i === existingIdx ? review : r))
        : [...p.reviews, review];
      const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      return { ...p, reviews, average_rating: Math.round(avg * 10) / 10, review_count: reviews.length };
    });
  };

  if (loading) return <div className="page-container"><p className="muted">Loading...</p></div>;
  if (!product) return <div className="page-container"><p className="muted">Product not found.</p></div>;

  return (
    <div className="page-container">
      <Link to="/" className="back-link">← Back to shop</Link>
      <div className="product-detail">
        <div className="product-detail-image">
          <img src={product.image_url || PLACEHOLDER} alt={product.name} />
        </div>
        <div className="product-detail-info">
          {product.color && <span className="product-color-tag">{product.color}</span>}
          <h1>{product.name}</h1>
          <p className="product-price">₹{product.price.toFixed(2)}</p>
          <div className="product-rating-row">
            <StarRating value={Math.round(product.average_rating)} readOnly size={18} />
            <span className="review-count">
              {product.review_count > 0 ? `${product.average_rating} (${product.review_count} reviews)` : "No reviews yet"}
            </span>
          </div>
          <p className="product-description">{product.description || "No description provided."}</p>
          {user && (
            <button className={`btn-favorite ${product.is_favorited ? "liked" : ""}`} onClick={handleLike}>
              {product.is_favorited ? "♥ Saved to favorites" : "♡ Add to favorites"}
            </button>
          )}
        </div>
      </div>

      <ReviewSection productId={product.id} reviews={product.reviews} onReviewAdded={handleReviewAdded} />
    </div>
  );
}
