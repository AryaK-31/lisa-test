import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // 👈 Link import केला
import api from "../api.js";
import { setAuth } from "../utils/auth.jsx";
import "./Login.css";

const LOGIN_PATH = "/auth/login";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post(LOGIN_PATH, { email, password });
      console.log("👉 Login API Response:", data);

      const token = data.token || data.jwt || data.accessToken;
      const role = data.role;
      localStorage.setItem("role", role);

      const name =
      data?.user?.name ??
      data?.user?.fullName ??
      data?.name ??
      data?.username ??
      email; // fallback
      localStorage.setItem("name", name);
      localStorage.setItem("email", email);

      if (!token) {
        console.error("❌ Token backend कडून आला नाही!");
        setError("Login failed: No token received");
        return;
      }

      localStorage.setItem("token", token);
      setAuth(token, role);

      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="screen">
      <form className="card" onSubmit={handleSubmit}>
       <img
          src="/../public/image.png"
          alt="Legal Intake Services of America"
          className="login-logo"
        />
        {error && <div className="error">{error}</div>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* 👇 Forgot Password link */}
        <div style={{ marginTop: "10px", textAlign: "center" }}>
          <Link to="/forgot-password" className="forgot-link">
            Forgot Password?
          </Link>
        </div>
      </form>
    </div>
  );
}
