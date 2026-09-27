import { useState, useEffect } from "react";
import "./Shop.css";
import ProductCard from "../components/ProductCard";

function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(null);
  const [priceBounds, setPriceBounds] = useState({ min: 0, max: 0 });

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);

        if (data.length > 0) {
          const prices = data.map((p) => p.price);
          const min = Math.min(...prices);
          const max = Math.max(...prices);
          setPriceBounds({ min, max });
          setMaxPrice(max);
        }
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p style={{ padding: "60px" }}>Loading products...</p>;
  if (error) return <p style={{ padding: "60px" }}>Error: {error}</p>;

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const matchesPrice = maxPrice === null || product.price <= maxPrice;
    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <section className="shop-page">
      <div className="section-heading">
        <p>ALL PRODUCTS</p>
        <h2>Shop Everything</h2>
      </div>

      <div className="shop-controls">
        <input
          type="text"
          className="search-input"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="category-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${
                selectedCategory === cat ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {priceBounds.max > 0 && (
          <div className="price-filter">
            <label htmlFor="price-range">
              Max Price: ₹{maxPrice}
            </label>
            <input
              id="price-range"
              type="range"
              min={priceBounds.min}
              max={priceBounds.max}
              value={maxPrice ?? priceBounds.max}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="price-slider"
            />
            <div className="price-range-labels">
              <span>₹{priceBounds.min}</span>
              <span>₹{priceBounds.max}</span>
            </div>
          </div>
        )}
      </div>

      {filteredProducts.length === 0 ? (
        <p className="no-results">No products match your search.</p>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

export default Shop;