import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Orders.css";

const STATUS_STEPS = ["placed", "shipped", "delivered"];

function Orders() {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    fetchOrders();
  }, [token]);

  const fetchOrders = () => {
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
  };

  const handleCancel = async (orderId) => {
    setCancellingId(orderId);
    try {
      const res = await fetch(
        `http://localhost:5000/api/orders/${orderId}/cancel`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to cancel order");
      fetchOrders();
    } catch (err) {
      alert(err.message);
    } finally {
      setCancellingId(null);
    }
  };

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
              <div className={`order-status status-${order.status}`}>
                {order.status}
              </div>
            </div>

            {STATUS_STEPS.includes(order.status) && (
              <div className="status-tracker">
                {STATUS_STEPS.map((step, i) => {
                  const currentIndex = STATUS_STEPS.indexOf(order.status);
                  const isDone = i <= currentIndex;
                  return (
                    <div key={step} className="status-step">
                      <div
                        className={`status-dot ${isDone ? "done" : ""}`}
                      />
                      <p className={isDone ? "done" : ""}>{step}</p>
                    </div>
                  );
                })}
              </div>
            )}

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

            {order.status === "placed" && (
              <button
                className="cancel-order-btn"
                onClick={() => handleCancel(order.id)}
                disabled={cancellingId === order.id}
              >
                {cancellingId === order.id ? "Cancelling..." : "Cancel Order"}
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default Orders;