import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Cart.css";

function Cart() {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();

  if (cart.length === 0) {
    return (
      <section className="cart-page">
        <h2>Your Cart is Empty</h2>
        <p>Looks like you haven't added anything yet.</p>
        <Link to="/shop" className="primary-btn">
          Browse Products
        </Link>
      </section>
    );
  }

  return (
    <section className="cart-page">
      <h2>Your Cart</h2>

      <div className="cart-items">
        {cart.map((item) => (
          <div className="cart-item" key={item.cartId}>
            <img src={item.image} alt={item.name} className="cart-item-image" />

            <div className="cart-item-info">
              <h3>{item.name}</h3>
              {item.selectedColor && (
                <p className="cart-item-variant">Color: {item.selectedColor}</p>
              )}
              {item.selectedSize && (
                <p className="cart-item-variant">Size: {item.selectedSize}</p>
              )}
              <p className="cart-item-price">₹{item.price}</p>
            </div>

            <div className="cart-item-quantity">
              <button
                onClick={() =>
                  updateQuantity(item.cartId, item.quantity - 1)
                }
              >
                −
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() =>
                  updateQuantity(item.cartId, item.quantity + 1)
                }
              >
                +
              </button>
            </div>

            <p className="cart-item-subtotal">
              ₹{item.price * item.quantity}
            </p>

            <button
              className="remove-btn"
              onClick={() => removeFromCart(item.cartId)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <p>Total</p>
        <p className="cart-total-price">₹{totalPrice}</p>
      </div>

      <Link to="/checkout" className="primary-btn checkout-btn">
  Proceed to Checkout
</Link>
    </section>
  );
}

export default Cart;