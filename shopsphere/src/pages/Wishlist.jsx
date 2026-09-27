import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import "./Cart.css";

function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <section className="cart-page">
        <h2>Your Wishlist is Empty</h2>
        <p>Save products you like by tapping the heart icon.</p>
        <Link to="/shop" className="primary-btn">
          Browse Products
        </Link>
      </section>
    );
  }

  return (
    <section className="cart-page">
      <h2>Your Wishlist</h2>

      <div className="cart-items">
        {wishlist.map((item) => (
          <div className="cart-item" key={item.id}>
            <img src={item.image} alt={item.name} className="cart-item-image" />

            <div className="cart-item-info">
              <h3>{item.name}</h3>
              <p className="cart-item-price">₹{item.price}</p>
            </div>

            <button
              className="primary-btn"
              onClick={() =>
                addToCart(item, item.colors?.[0] || "", item.sizes?.[0] || "")
              }
            >
              Add to Cart
            </button>

            <button
              className="remove-btn"
              onClick={() => removeFromWishlist(item.id)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Wishlist;