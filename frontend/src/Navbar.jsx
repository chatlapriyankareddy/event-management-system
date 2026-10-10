import { Link, useLocation, useNavigate } from "react-router-dom";
import { SparklesIcon, CalendarIcon, PlusIcon, TicketIcon, UsersIcon, UserIcon } from "./Icons";

function Navbar({ currentUser, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <header className="navbar">
      <div className="nav-container">
        {/* Brand Logo */}
        <Link to="/" className="nav-brand">
          <div className="brand-icon-box">
            <SparklesIcon size={18} />
          </div>
          <span className="brand-text">
            PULSE<span className="brand-accent">EVENTS</span>
          </span>
        </Link>

        {/* Center Nav Links */}
        <nav className="nav-links">
          <Link to="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>
            <CalendarIcon size={15} />
            <span>Discover</span>
          </Link>

          <Link to="/add-event" className={`nav-link ${isActive("/add-event") ? "active" : ""}`}>
            <PlusIcon size={15} />
            <span>Host Event</span>
          </Link>

          <Link to="/my-bookings" className={`nav-link ${isActive("/my-bookings") ? "active" : ""}`}>
            <TicketIcon size={15} />
            <span>My Passes</span>
          </Link>

          <Link to="/users" className={`nav-link ${isActive("/users") ? "active" : ""}`}>
            <UsersIcon size={15} />
            <span>Community</span>
          </Link>
        </nav>

        {/* User Auth Section */}
        <div className="nav-auth">
          {currentUser ? (
            <div className="user-profile-pill">
              <div className="user-avatar">{getInitials(currentUser.name)}</div>
              <div className="user-meta-text">
                <span className="user-display-name">{currentUser.name}</span>
                <span className={`user-role-tag ${currentUser.role === "ADMIN" ? "role-admin" : "role-user"}`}>
                  {currentUser.role}
                </span>
              </div>
              <button onClick={handleLogout} className="btn-icon-logout" title="Sign Out">
                Sign Out
              </button>
            </div>
          ) : (
            <div className="auth-actions">
              <Link to="/login" className="btn btn-ghost">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-glow-primary">
                Join Now
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
