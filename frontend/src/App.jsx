
import { useState } from "react";
import API from "./api";
import "./App.css";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [profile, setProfile] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);

      setMessage(
        `Login successful! Welcome ${response.data.user.name}`
      );
    } catch (error) {
      setMessage(
        error.response?.data?.error || "Login failed"
      );
    }
  };

  const getProfile = async () => {
    try {
      const response = await API.get("/profile");

      setProfile(response.data.user);
      setMessage("Protected profile accessed successfully");
    } catch (error) {
      setMessage(
        error.response?.data?.error || "Profile access failed"
      );
    }
  };

  return (
    <div className="app">

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          Campus<span>Marketplace</span>
        </div>

        <div className="nav-links">
          <a href="#">Home</a>
          <a href="#">Marketplace</a>
          <a href="#">About</a>
        </div>

        <button className="nav-login">
          Login
        </button>
      </nav>

      
      <main className="main-container">

        {/* Left Side */}
        <section className="hero-section">
          <p className="small-heading">
            🎓 UNIVERSITY MARKETPLACE
          </p>

          <h1>
            Buy, Sell & Discover
            <span> Campus Products</span>
          </h1>

          <p className="hero-text">
            A simple marketplace for university students.
            Find books, electronics and other useful items
            from your campus community.
          </p>

          <div className="hero-features">
            <div>
              <strong>📚</strong>
              <p>Books</p>
            </div>

            <div>
              <strong>💻</strong>
              <p>Electronics</p>
            </div>

            <div>
              <strong>🛍️</strong>
              <p>Campus Items</p>
            </div>
          </div>
        </section>

      
        <section className="login-card">

          <div className="login-icon">
            👤
          </div>

          <h2>Welcome Back</h2>

          <p className="login-subtitle">
            Login to access your Campus Marketplace account
          </p>

          <form onSubmit={handleLogin}>

            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              className="login-button"
            >
              Login
            </button>

          </form>

          {message && (
            <div
              className={
                message.includes("successful")
                  ? "message success"
                  : "message error"
              }
            >
              {message}
            </div>
          )}

          <div className="divider">
            <span>SECURE LOGIN</span>
          </div>

          <p className="security-text">
            🔒 Your password is securely protected.
          </p>

        </section>

      </main>

      
      {profile && (
        <section className="profile-section">

          <div className="profile-card">

            <div className="profile-header">
              <div className="profile-avatar">
                {profile.name.charAt(0).toUpperCase()}
              </div>

              <div>
                <p className="profile-label">
                  MY ACCOUNT
                </p>

                <h2>{profile.name}</h2>
              </div>
            </div>

            <div className="profile-info">

              <div className="info-item">
                <span>ID</span>
                <strong>{profile.id}</strong>
              </div>

              <div className="info-item">
                <span>Name</span>
                <strong>{profile.name}</strong>
              </div>

              <div className="info-item">
                <span>Email</span>
                <strong>{profile.email}</strong>
              </div>

            </div>

          </div>

        </section>
      )}

      
      <div className="profile-button-container">
        <button
          onClick={getProfile}
          className="profile-button"
        >
          🔐 Get My Profile
        </button>
      </div>

      {/* Footer */}
      <footer>
        <p>
          © 2026 Campus Marketplace · Built for Students
        </p>
      </footer>

    </div>
  );
}

export default App;

