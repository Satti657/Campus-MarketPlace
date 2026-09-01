import { useState } from "react";
import API from "./api";

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
        password
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
    <div>
      <h1>Campus Marketplace</h1>

      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br />
        <br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br />
        <br />

        <button type="submit">
          Login
        </button>
      </form>

      <p>{message}</p>

      <hr />

      <button onClick={getProfile}>
        Get My Profile
      </button>

      {profile && (
        <div>
          <h2>My Profile</h2>

          <p>ID: {profile.id}</p>
          <p>Name: {profile.name}</p>
          <p>Email: {profile.email}</p>
        </div>
      )}
    </div>
  );
}

export default App;