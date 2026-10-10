import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "./api";
import { SparklesIcon, ShieldIcon, UserIcon } from "./Icons";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "USER",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrorMsg("");
  };

  const handleRoleSelect = (role) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      await API.post("/api/auth/register", formData);
      alert("Registration successful! Please sign in with your credentials.");
      navigate("/login");
    } catch (err) {
      const msg = err.response?.data || "Registration failed. Email might already be taken.";
      setErrorMsg(typeof msg === "string" ? msg : "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-view-wrapper">
      <div className="auth-glass-container">
        <div className="auth-card-top">
          <div className="auth-badge-icon">
            <SparklesIcon size={18} />
          </div>
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Join the campus events network as a student or organizer</p>
        </div>

        {errorMsg && <div className="alert-neon-error">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="auth-form-body">
          <div className="form-field">
            <label className="input-label">Full Name *</label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. Ananya Sen"
              value={formData.name}
              onChange={handleChange}
              className="sleek-input"
            />
          </div>

          <div className="form-field">
            <label className="input-label">University Email *</label>
            <input
              type="email"
              name="email"
              required
              placeholder="e.g. ananya@campus.edu"
              value={formData.email}
              onChange={handleChange}
              className="sleek-input"
            />
          </div>

          <div className="form-field">
            <label className="input-label">Mobile Number</label>
            <input
              type="tel"
              name="phone"
              placeholder="e.g. +91 9876543210"
              value={formData.phone}
              onChange={handleChange}
              className="sleek-input"
            />
          </div>

          {/* Role Pill Selector */}
          <div className="form-field">
            <label className="input-label">Account Tier</label>
            <div className="role-selector-pills">
              <button
                type="button"
                onClick={() => handleRoleSelect("USER")}
                className={`role-choice-pill ${formData.role === "USER" ? "active" : ""}`}
              >
                <UserIcon size={14} />
                <span>Student / Attendee</span>
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect("ADMIN")}
                className={`role-choice-pill ${formData.role === "ADMIN" ? "active" : ""}`}
              >
                <ShieldIcon size={14} />
                <span>Event Organizer (Admin)</span>
              </button>
            </div>
          </div>

          <div className="form-field">
            <label className="input-label">Password (min 6 characters) *</label>
            <input
              type="password"
              name="password"
              required
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange}
              className="sleek-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-glow-primary btn-block btn-auth-submit"
          >
            {loading ? "Creating Profile..." : "Complete Registration"}
          </button>
        </form>

        <div className="auth-switch-link">
          <span>Already registered? </span>
          <Link to="/login" className="link-purple">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;