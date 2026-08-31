import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./ProductDetail.css";
import { useCart } from "../context/CartContext";
import Product3DViewer from "../components/Product3DViewer";

function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setSelectedColor(data.colors?.[0] || "");
        setSelectedSize(data.sizes?.[0] || "");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <p style={{ padding: "60px" }}>Loading...</p>;

  if (!product) {
    return (
      <section className="product-detail">
        <p>Product not found.</p>
        <Link to="/shop">← Back to Shop</Link>
      </section>
    );
  }

  return (
    <section className="product-detail">
      <Link to="/shop" className="back-link">
        ← Back to Shop
      </Link>

      <div className="detail-content">
        <Product3DViewer image={product.image} alt={product.name} />
        <div className="detail-info">
          <p className="product-category">{product.category}</p>
          <h1>{product.name}</h1>
          <p className="detail-price">₹{product.price}</p>
          <p className="detail-description">{product.description}</p>

          {product.colors?.length > 0 && (
            <div className="option-group">
              <p className="option-label">Color</p>
              <div className="option-buttons">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    className={`option-btn ${
                      selectedColor === color ? "active" : ""
                    }`}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.sizes?.length > 0 && (
            <div className="option-group">
              <p className="option-label">Size</p>
              <div className="option-buttons">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`option-btn ${
                      selectedSize === size ? "active" : ""
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            className="add-btn detail-add-btn"
            onClick={() => addToCart(product, selectedColor, selectedSize)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </section>
  );
}

export default ProductDetail;