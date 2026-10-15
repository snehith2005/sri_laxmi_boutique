import { useEffect, useState } from "react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await api.get("/favorites");
    setFavorites(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const toggleFavorite = (productId, isFav) => {
    if (!isFav) {
      setFavorites((prev) => prev.filter((p) => p.id !== productId));
    }
  };

  return (
    <div className="page-container">
      <section className="hero hero-compact">
        <h1>Your favorites</h1>
        <p>Everything you've saved, in one place.</p>
      </section>

      {loading ? (
        <p className="muted">Loading...</p>
      ) : favorites.length === 0 ? (
        <p className="muted">You haven't saved anything yet. Tap the heart on a piece you love.</p>
      ) : (
        <div className="product-grid">
          {favorites.map((p) => (
            <ProductCard key={p.id} product={p} onToggleFavorite={toggleFavorite} />
          ))}
        </div>
      )}
    </div>
  );
}
