import { Link } from "react-router-dom";
import StarRating from "./StarRating";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const PLACEHOLDER = "https://placehold.co/400x500/f2e9e4/7a2e38?text=No+Image";

export default function ProductCard({ product, onToggleFavorite }) {
  const { user } = useAuth();

  const handleLike = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (product.is_favorited) {
      await api.delete(`/favorites/${product.id}`);
    } else {
      await api.post(`/favorites/${product.id}`);
    }
    onToggleFavorite && onToggleFavorite(product.id, !product.is_favorited);
  };

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-card-image">
        <img src={product.image_url || PLACEHOLDER} alt={product.name} />
        {user && (
          <button
            className={`like-btn ${product.is_favorited ? "liked" : ""}`}
            onClick={handleLike}
            aria-label="Toggle favorite"
            title={product.is_favorited ? "Remove from favorites" : "Add to favorites"}
          >
            {product.is_favorited ? "♥" : "♡"}
          </button>
        )}
      </div>
      <div className="product-card-body">
        {product.color && <span className="product-color-tag">{product.color}</span>}
        <h3>{product.name}</h3>
        <p className="product-price">₹{product.price.toFixed(2)}</p>
        <div className="product-rating-row">
          <StarRating value={Math.round(product.average_rating)} readOnly size={14} />
          <span className="review-count">
            {product.review_count > 0 ? `(${product.review_count})` : "No reviews yet"}
          </span>
        </div>
      </div>
    </Link>
  );
}
