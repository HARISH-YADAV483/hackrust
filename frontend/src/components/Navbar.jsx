import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../api/authApi";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand" onClick={closeMenu}>
        <img src="/log2o.png" alt="ScamShield" className="navbar-logo" />
      </Link>

      {/* Hamburger button */}
      <button
        className={`hamburger ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span />
        <span />
        <span />
      </button>

      {/* Overlay (mobile only) */}
      {menuOpen && <div className="nav-overlay" onClick={closeMenu} />}

      {/* Nav links */}
      <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
        <Link to="/leaderboard" className="nav-link" onClick={closeMenu}>Leaderboard</Link>
        <Link to="/blogs" className="nav-link" onClick={closeMenu}>Blogs</Link>
        <Link to="/tools" className="nav-link" onClick={closeMenu}>Tools</Link>

        {user ? (
          <>
            <Link to="/profile" className="nav-link" onClick={closeMenu}>Profile</Link>
            {user.role === "admin" && (
              <Link to="/admin" className="nav-link" onClick={closeMenu}>Admin</Link>
            )}
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link" onClick={closeMenu}>Login</Link>
            <Link to="/register" className="nav-link" onClick={closeMenu}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;