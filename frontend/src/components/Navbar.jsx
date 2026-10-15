import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        Sri Laxmi <span className="brand-accent">Boutiques</span>
      </Link>
      <nav className="nav-links">
        <Link to="/">Shop</Link>
        {user && !isAdmin && <Link to="/favorites">Favorites</Link>}
        {isAdmin && <Link to="/admin">Admin</Link>}
        {user ? (
          <>
            <span className="nav-user">Hi, {(user.name || "there").split(" ")[0]}</span>
            <button
              className="btn-ghost"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Log in</Link>
            <Link to="/register" className="btn-primary-sm">Sign up</Link>
          </>
        )}
      </nav>
    </header>
  );
}
