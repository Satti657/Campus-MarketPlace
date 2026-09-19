import { useEffect, useState } from "react";

import API from "./api";

import "./App.css";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [profile, setProfile] = useState(null);

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listingsError, setListingsError] = useState("");

  const [selectedListing, setSelectedListing] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await API.get("/listings");
        setListings(response.data);
      } catch (error) {
        setListingsError("Failed to load listings");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

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

  const viewListing = async (id) => {
    setDetailsLoading(true);
    setDetailsError("");
    setSelectedListing(null);

    try {
      const response = await API.get(`/listings/${id}`);

      setSelectedListing(response.data);
    } catch (error) {
      setDetailsError(
        error.response?.data?.error ||
          "Failed to load listing details"
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  const backToListings = () => {
    setSelectedListing(null);
    setDetailsError("");

    setTimeout(() => {
      document
        .getElementById("marketplace")
        ?.scrollIntoView({
          behavior: "smooth",
        });
    }, 0);
  };

  return (
    <div className="app">

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          Campus<span>Marketplace</span>
        </div>

        <div className="nav-links">
          <a
            href="#"
            onClick={() => {
              setSelectedListing(null);
              setDetailsError("");
            }}
          >
            Home
          </a>

          <a
            href="#marketplace"
            onClick={() => {
              setSelectedListing(null);
              setDetailsError("");
            }}
          >
            Marketplace
          </a>

          <a href="#">
            About
          </a>
        </div>

        <button className="nav-login">
          Login
        </button>
      </nav>

      <main className="main-container">

        {/* Hero Section */}
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

        {/* Login Card */}
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

        {/* Listing Details */}
        {selectedListing ? (
          <section className="listing-details-section">

            <button
              className="back-button"
              onClick={backToListings}
            >
              ← Back to Listings
            </button>

            <div className="listing-details-card">

              <div className="details-image">
                {selectedListing.image_url ? (
                  <img
                    src={selectedListing.image_url}
                    alt={selectedListing.title}
                  />
                ) : (
                  <span>
                    📷 No Photo Available
                  </span>
                )}
              </div>

              <div className="details-content">

                <p className="small-heading">
                  LISTING DETAILS
                </p>

                <h2>
                  {selectedListing.title}
                </h2>

                <p className="details-price">
                  Rs. {selectedListing.price}
                </p>

                <p className="details-category">
                  {selectedListing.category}
                </p>

                <div className="details-divider"></div>

                <h3>
                  Description
                </h3>

                <p className="details-description">
                  {selectedListing.description ||
                    "No description provided for this listing."}
                </p>

                <div className="seller-card">

                  <h3>
                    Seller Information
                  </h3>

                  <div className="seller-info">

                    <div className="seller-avatar">
                      {selectedListing.seller_name
                        ?.charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>
                      <p className="seller-name">
                        {selectedListing.seller_name}
                      </p>

                      <p className="seller-email">
                        {selectedListing.seller_email}
                      </p>
                    </div>

                  </div>

                  {/* Contact Seller */}
                  <a
                    className="contact-seller-button"
                    href={`mailto:${selectedListing.seller_email}?subject=Interested in ${encodeURIComponent(
                      selectedListing.title
                    )}`}
                  >
                    ✉️ Contact Seller
                  </a>

                </div>

              </div>

            </div>

          </section>
        ) : (

          /* Listings Section */
          <section
            className="listings-section"
            id="marketplace"
          >

            <div className="listings-header">

              <p className="small-heading">
                CAMPUS MARKETPLACE
              </p>

              <h2>
                Latest Listings
              </h2>

              <p>
                Discover items available from your campus community.
              </p>

            </div>

            {/* Loading */}
            {loading && (
              <p className="listing-status">
                Loading listings...
              </p>
            )}

            {/* Error */}
            {listingsError && (
              <p className="listing-error">
                {listingsError}
              </p>
            )}

            {/* Empty */}
            {!loading &&
              !listingsError &&
              listings.length === 0 && (
                <p className="listing-status">
                  No listings available.
                </p>
              )}

            {/* Listings */}
            {!loading &&
              !listingsError &&
              listings.length > 0 && (

                <div className="listings-grid">

                  {listings.map((listing) => (

                    <div
                      className="listing-card"
                      key={listing.id}
                      onClick={() => viewListing(listing.id)}
                    >

                      <div className="listing-image">

                        {listing.image_url ? (
                          <img
                            src={listing.image_url}
                            alt={listing.title}
                          />
                        ) : (
                          <span>
                            📷 No Photo
                          </span>
                        )}

                      </div>

                      <div className="listing-content">

                        <h3>
                          {listing.title}
                        </h3>

                        <p className="listing-price">
                          Rs. {listing.price}
                        </p>

                        <p className="listing-category">
                          {listing.category}
                        </p>

                        <button
                          className="view-details-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            viewListing(listing.id);
                          }}
                        >
                          View Details →
                        </button>

                      </div>

                    </div>

                  ))}

                </div>

              )}

          </section>
        )}

      </main>

      {/* Profile Section */}
      {profile && (
        <section className="profile-section">

          <div className="profile-card">

            <div className="profile-header">

              <div className="profile-avatar">
                {profile.name
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div>
                <p className="profile-label">
                  MY ACCOUNT
                </p>

                <h2>
                  {profile.name}
                </h2>
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

      {/* Details Loading/Error */}
      {detailsLoading && (
        <p className="listing-status">
          Loading listing details...
        </p>
      )}

      {detailsError && (
        <p className="listing-error">
          {detailsError}
        </p>
      )}

      {/* Profile Button */}
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