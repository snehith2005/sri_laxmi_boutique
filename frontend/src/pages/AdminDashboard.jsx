import { useEffect, useState } from "react";
import api from "../api/axios";

const emptyForm = { name: "", description: "", price: "", color: "", category: "" };

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = async () => {
    const { data } = await api.get("/products");
    setProducts(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("description", form.description);
      fd.append("price", form.price || "0");
      fd.append("color", form.color);
      fd.append("category", form.category);
      if (imageFile) fd.append("image", imageFile);

      await api.post("/products", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setSuccess(`"${form.name}" added to the shop.`);
      setForm(emptyForm);
      setImageFile(null);
      e.target.reset();
      load();
    } catch (err) {
      setError(err.response?.data?.detail || "Could not add product.");
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("Remove this product from the shop?")) return;
    await api.delete(`/products/${id}`);
    load();
  };

  return (
    <div className="page-container">
      <section className="hero hero-compact">
        <h1>Admin dashboard</h1>
        <p>Add new pieces to the shop and manage what's currently listed.</p>
      </section>

      <div className="admin-layout">
        <form className="admin-form" onSubmit={submit}>
          <h2>Add a product</h2>

          <label>Name</label>
          <input name="name" value={form.name} onChange={handleChange} required />

          <label>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3} />

          <div className="form-row">
            <div>
              <label>Price (₹)</label>
              <input name="price" type="number" step="0.01" min="0" value={form.price} onChange={handleChange} required />
            </div>
            <div>
              <label>Color</label>
              <input name="color" value={form.color} onChange={handleChange} placeholder="e.g. Emerald green" />
            </div>
          </div>

          <label>Category</label>
          <input name="category" value={form.category} onChange={handleChange} placeholder="e.g. Dresses" />

          <label>Product image</label>
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />

          {error && <p className="form-error">{error}</p>}
          {success && <p className="form-success">{success}</p>}

          <button className="btn-primary" type="submit" disabled={submitting}>
            {submitting ? "Uploading..." : "Add product"}
          </button>
        </form>

        <div className="admin-list">
          <h2>Current products ({products.length})</h2>
          <ul>
            {products.map((p) => (
              <li key={p.id} className="admin-list-item">
                <img src={p.image_url || "https://placehold.co/60x75/f2e9e4/7a2e38?text=—"} alt={p.name} />
                <div className="admin-list-item-info">
                  <strong>{p.name}</strong>
                  <span className="muted">{p.color || "No color set"} · ₹{p.price.toFixed(2)}</span>
                </div>
                <button className="btn-ghost" onClick={() => remove(p.id)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
