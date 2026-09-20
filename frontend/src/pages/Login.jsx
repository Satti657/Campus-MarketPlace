import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";
import "../Auth.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);

      setMessage(`Login successful! Welcome ${response.data.user.name}`);

      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (error) {
      setMessage(
        error.response?.data?.error ||
          "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Welcome Back</h1>

        <p className="auth-subtitle">
          Login to your Campus Marketplace account
        </p>

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="auth-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-button">
            Login
          </button>
        </form>

        {message && (
          <p className="auth-message">
            {message}
          </p>
        )}

        <p className="auth-footer">
          Don't have an account?{" "}
          <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;