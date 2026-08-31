import { useLocation, Link } from "react-router-dom";
import "./Checkout.css";

function OrderSuccess() {
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <section className="order-success">
      <div className="order-success-icon">✓</div>
      <h2>Order Placed Successfully!</h2>
      {orderId && <p>Order ID: #{orderId}</p>}
      <p className="order-success-text">
        Thank you for shopping with ShopSphere. Your order is being processed.
      </p>
      <Link to="/shop" className="primary-btn">
        Continue Shopping
      </Link>
    </section>
  );
}

export default OrderSuccess;