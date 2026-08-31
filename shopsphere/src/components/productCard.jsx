import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import TiltCard from "./TiltCard";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product, product.colors?.[0] || "", product.sizes?.[0] || "");
  };

  return (
    <Link to={`/product/${product.id}`} style={{ textDecoration: "none" }}>
      <TiltCard className="product-card">
        <img src={product.image} alt={product.name} className="product-image" />
        <div className="product-info">
          <p className="product-category">{product.category}</p>
          <h3>{product.name}</h3>
          <p className="product-price">₹{product.price}</p>
          <button className="add-btn" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </TiltCard>
    </Link>
  );
}

export default ProductCard;