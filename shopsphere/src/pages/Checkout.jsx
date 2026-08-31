import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "./Checkout.css";

function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  if (!user) {
    return (
      <section className="checkout-page">
        <h2>Please log in to checkout</h2>
        <Link to="/login" className="primary-btn">
          Go to Login
        </Link>
      </section>
    );
  }

  if (cart.length === 0) {
    return (
      <section className="checkout-page">
        <h2>Your cart is empty</h2>
        <Link to="/shop" className="primary-btn">
          Browse Products
        </Link>
      </section>
    );
  }

  const handlePlaceOrder = async () => {
    setPlacing(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items: cart, totalPrice }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to place order");
        setPlacing(false);
        return;
      }

      clearCart();
      navigate("/order-success", { state: { orderId: data.orderId } });
    } catch (err) {
      setError("Something went wrong. Try again.");
      setPlacing(false);
    }
  };

  return (
    <section className="checkout-page">
      <h2>Checkout</h2>

      <div className="checkout-summary">
        {cart.map((item) => (
          <div className="checkout-item" key={item.cartId}>
            <img src={item.image} alt={item.name} />
            <div className="checkout-item-info">
              <p className="checkout-item-name">{item.name}</p>
              {item.selectedColor && (
                <p className="checkout-item-variant">
                  Color: {item.selectedColor}
                </p>
              )}
              {item.selectedSize && (
                <p className="checkout-item-variant">
                  Size: {item.selectedSize}
                </p>
              )}
              <p className="checkout-item-qty">Qty: {item.quantity}</p>
            </div>
            <p className="checkout-item-price">
              ₹{item.price * item.quantity}
            </p>
          </div>
        ))}
      </div>

      <div className="checkout-total">
        <p>Total</p>
        <p className="checkout-total-price">₹{totalPrice}</p>
      </div>

      {error && <p className="auth-error">{error}</p>}

      <button
        className="primary-btn checkout-place-btn"
        onClick={handlePlaceOrder}
        disabled={placing}
      >
        {placing ? "Placing Order..." : "Place Order"}
      </button>
    </section>
  );
}

export default Checkout;