import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "./api";
import { SparklesIcon } from "./Icons";

function Login({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const response = await API.post("/api/auth/login", credentials);
      const data = response.data;

      // Save token and user details to localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role,
        })
      );

      if (onLoginSuccess) {
        onLoginSuccess({
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role,
        });
      }

      navigate("/");
    } catch (err) {
      const msg =
        err.response?.data ||
        (err.message === "Network Error"
          ? "Unable to connect to backend server. Please verify port 8082 is online."
          : "Invalid email or password credentials.");
      setErrorMsg(typeof msg === "string" ? msg : "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-view-wrapper">
      <div className="auth-glass-container">
        {/* Header */}
        <div className="auth-card-top">
          <div className="auth-badge-icon">
            <SparklesIcon size={18} />
          </div>
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Sign in to manage events or reserve your tickets</p>
        </div>

        {errorMsg && <div className="alert-neon-error">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="auth-form-body">
          <div className="form-field">
            <label className="input-label">Email Address</label>
            <input
              type="email"
              name="email"
              required
              placeholder="e.g. admin@event.com"
              value={credentials.email}
              onChange={handleChange}
              className="sleek-input"
            />
          </div>

          <div className="form-field">
            <label className="input-label">Account Password</label>
            <input
              type="password"
              name="password"
              required
              placeholder="Enter your password"
              value={credentials.password}
              onChange={handleChange}
              className="sleek-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-glow-primary btn-block btn-auth-submit"
          >
            {loading ? "Verifying Credentials..." : "Sign In to Dashboard"}
          </button>
        </form>

        <div className="auth-switch-link">
          <span>Don't have an account? </span>
          <Link to="/register" className="link-purple">
            Register now
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;