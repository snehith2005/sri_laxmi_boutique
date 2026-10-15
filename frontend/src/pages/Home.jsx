import { useEffect, useState } from "react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [colorFilter, setColorFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProducts = async (params = {}) => {
    setLoading(true);
    const { data } = await api.get("/products", { params });
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts({ search: query || undefined, color: colorFilter || undefined });
  };

  const colors = [...new Set(products.map((p) => p.color).filter(Boolean))];

  const toggleFavorite = (productId, isFav) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, is_favorited: isFav } : p))
    );
  };

  return (
    <div className="page-container">
      <section className="hero">
        <h1>Pieces made to be noticed.</h1>
        <p>Hand-picked dresses and separates, curated in-store and online.</p>
      </section>

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by name, description, or color..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select value={colorFilter} onChange={(e) => setColorFilter(e.target.value)}>
          <option value="">All colors</option>
          {colors.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <button type="submit" className="btn-primary-sm">Search</button>
        {(query || colorFilter) && (
          <button
            type="button"
            className="btn-ghost"
            onClick={() => {
              setQuery("");
              setColorFilter("");
              fetchProducts();
            }}
          >
            Clear
          </button>
        )}
      </form>

      {loading ? (
        <p className="muted">Loading pieces...</p>
      ) : products.length === 0 ? (
        <p className="muted">No products match your search yet.</p>
      ) : (
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} onToggleFavorite={toggleFavorite} />
          ))}
        </div>
      )}
    </div>
  );
}
