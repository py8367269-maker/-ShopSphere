import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";

function Navbar() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="logo">
        Shop<span>Sphere</span>
      </div>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/shop">Shop</Link>
        <a href="/#about">About</a>
      </div>

      <div className="nav-actions">
        {user ? (
          <>
          {user.role === "admin" && (
  <Link to="/admin" className="login-link">
    Admin
  </Link>
)}
            <Link to="/orders" className="login-link">
              My Orders
            </Link>
            <Link to="/wishlist" className="login-link">
              ♥ Wishlist {wishlist.length > 0 && `(${wishlist.length})`}
            </Link>
            <span className="nav-username">Hi, {user.name}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="login-link">
            Login
          </Link>
        )}

        <Link to="/cart" className="cart-btn">
          🛒 Cart {totalItems > 0 && `(${totalItems})`}
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;