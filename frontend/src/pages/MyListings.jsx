import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./MyListings.css";

function MyListings() {
  const navigate = useNavigate();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this listing?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await API.delete(`/listings/${id}`);

      setListings((currentListings) =>
        currentListings.filter((listing) => listing.id !== id)
      );

      setMessage("Listing deleted successfully.");
    } catch (error) {
      setMessage(
        error.response?.data?.error ||
          "Failed to delete listing."
      );
    }
  };

  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        const userData = localStorage.getItem("user");

        if (!userData) {
          setMessage("Please login first.");
          setLoading(false);
          return;
        }

        const user = JSON.parse(userData);

        const response = await API.get("/listings");

        const myListings = response.data.filter(
          (listing) => Number(listing.user_id) === Number(user.id)
        );

        setListings(myListings);
      } catch (error) {
        setMessage(
          error.response?.data?.error ||
            "Failed to load your listings."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMyListings();
  }, []);

  if (loading) {
    return (
      <div className="my-listings-page">
        <div className="my-listings-empty">
          Loading your listings...
        </div>
      </div>
    );
  }

  return (
    <div className="my-listings-page">
      <div className="my-listings-header">
        <h1>My Listings</h1>

        <p>
          Manage the items you have posted on Campus Marketplace
        </p>
      </div>

      {message && listings.length === 0 && (
        <div className="my-listings-empty">
          {message}
        </div>
      )}

      {listings.length === 0 && !message && (
        <div className="my-listings-empty">
          You have not posted any items yet.
        </div>
      )}

      <div className="my-listings-grid">
        {listings.map((listing) => (
          <div
            className="my-listing-card"
            key={listing.id}
          >
            <h2>{listing.title}</h2>

            <p className="my-listing-description">
              {listing.description}
            </p>

            <div className="my-listing-info">
              <div className="my-listing-price">
                Rs. {Number(listing.price).toFixed(2)}
              </div>

              <span className="my-listing-category">
                {listing.category}
              </span>
            </div>

            <div className="my-listing-actions">
              <button
                className="edit-button"
                onClick={() =>
                  navigate(`/edit-listing/${listing.id}`)
                }
              >
                Edit
              </button>

              <button
                className="delete-button"
                onClick={() => handleDelete(listing.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            background: "none",
            border: "none",
            color: "#0d47a1",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          ← Back to Marketplace
        </button>
      </div>
    </div>
  );
}

export default MyListings;