import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./Admin.css";

const EMPTY_FORM = {
  name: "",
  price: "",
  category: "",
  image: "",
  description: "",
  colors: "",
  sizes: "",
};

function Admin() {
  const { user, token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  if (!user) {
    return <p style={{ padding: "60px" }}>Please log in.</p>;
  }

  if (user.role !== "admin") {
    return <p style={{ padding: "60px" }}>Access denied — admin only.</p>;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const startEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image || "",
      description: product.description || "",
      colors: (product.colors || []).join(", "),
      sizes: (product.sizes || []).join(", "),
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      name: form.name,
      price: Number(form.price),
      category: form.category,
      image: form.image,
      description: form.description,
      colors: form.colors
        ? form.colors.split(",").map((c) => c.trim()).filter(Boolean)
        : [],
      sizes: form.sizes
        ? form.sizes.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
    };

    try {
      const url = editingId
        ? `http://localhost:5000/api/products/${editingId}`
        : "http://localhost:5000/api/products";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save product");

      cancelEdit();
      fetchProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete product");
      fetchProducts();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <section className="admin-page">
      <h2>Admin Dashboard</h2>

      <form className="admin-form" onSubmit={handleSubmit}>
        <h3>{editingId ? `Edit Product #${editingId}` : "Add New Product"}</h3>

        {error && <p className="admin-error">{error}</p>}

        <div className="admin-form-grid">
          <input
            name="name"
            placeholder="Product name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            name="price"
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
          />
          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            required
          />
          <input
            name="image"
            placeholder="Image URL"
            value={form.image}
            onChange={handleChange}
          />
          <input
            name="colors"
            placeholder="Colors (comma separated)"
            value={form.colors}
            onChange={handleChange}
          />
          <input
            name="sizes"
            placeholder="Sizes (comma separated)"
            value={form.sizes}
            onChange={handleChange}
          />
        </div>

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          rows={3}
        />

        <div className="admin-form-actions">
          <button type="submit" className="primary-btn" disabled={saving}>
            {saving ? "Saving..." : editingId ? "Update Product" : "Add Product"}
          </button>
          {editingId && (
            <button type="button" className="cancel-order-btn" onClick={cancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <h3 className="admin-list-heading">All Products ({products.length})</h3>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="admin-product-list">
          {products.map((p) => (
            <div className="admin-product-row" key={p.id}>
              <img src={p.image} alt={p.name} />
              <div className="admin-product-info">
                <p className="admin-product-name">{p.name}</p>
                <p className="admin-product-meta">
                  {p.category} · ₹{p.price}
                </p>
              </div>
              <div className="admin-product-actions">
                <button onClick={() => startEdit(p)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(p.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Admin;