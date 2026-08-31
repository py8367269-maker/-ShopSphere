import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Orders.css";

function Orders() {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    fetch("http://localhost:5000/api/orders", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch orders");
        return res.json();
      })
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [token]);

  if (!user) {
    return (
      <section className="orders-page">
        <h2>Please log in to view your orders</h2>
        <Link to="/login" className="primary-btn">
          Go to Login
        </Link>
      </section>
    );
  }

  if (loading) return <p style={{ padding: "60px" }}>Loading orders...</p>;
  if (error) return <p style={{ padding: "60px" }}>Error: {error}</p>;

  if (orders.length === 0) {
    return (
      <section className="orders-page">
        <h2>No orders yet</h2>
        <p>You haven't placed any orders so far.</p>
        <Link to="/shop" className="primary-btn">
          Start Shopping
        </Link>
      </section>
    );
  }

  return (
    <section className="orders-page">
      <h2>Your Orders</h2>

      <div className="orders-list">
        {orders.map((order) => (
          <div className="order-card" key={order.id}>
            <div className="order-header">
              <div>
                <p className="order-id">Order #{order.id}</p>
                <p className="order-date">
                  {new Date(order.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="order-status">{order.status}</div>
            </div>

            <div className="order-items">
              {order.items.map((item) => (
                <div className="order-item" key={item.id}>
                  <p className="order-item-name">
                    {item.name}
                    {item.color && ` · ${item.color}`}
                    {item.size && ` · ${item.size}`}
                  </p>
                  <p className="order-item-qty">Qty: {item.quantity}</p>
                  <p className="order-item-price">
                    ₹{item.price * item.quantity}
                  </p>
                </div>
              ))}
            </div>

            <div className="order-total">
              <p>Total</p>
              <p className="order-total-price">₹{order.total_price}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Orders;