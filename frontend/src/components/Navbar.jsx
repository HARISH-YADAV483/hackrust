import { Link, useNavigate } from "react-router-dom";
import { logout } from "../api/authApi";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <img src="/logo.png" alt="ScamShield" className="navbar-logo" />
      </Link>

      <div className="navbar-links">
        <Link to="/leaderboard" className="nav-link">
          Leaderboard
        </Link>
        
        
        {user ? (
          <>
            <Link to="/profile" className="nav-link">
              Profile
            </Link>
            {user.role === "admin" && (
              <Link to="/admin" className="nav-link">
                Admin
              </Link>
            )}
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/register" className="nav-link">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;