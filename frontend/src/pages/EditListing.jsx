import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api";
import "../Auth.css";

function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await API.get(`/listings/${id}`);

        const listing = response.data;

        setTitle(listing.title || "");
        setDescription(listing.description || "");
        setPrice(listing.price || "");
        setCategory(listing.category || "");
        setImageUrl(listing.image_url || "");
      } catch (error) {
        setMessage(
          error.response?.data?.error ||
            "Failed to load listing."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!title.trim()) {
      setMessage("Title is required.");
      return;
    }

    if (!description.trim()) {
      setMessage("Description is required.");
      return;
    }

    if (!price || Number(price) <= 0) {
      setMessage("Please enter a valid price.");
      return;
    }

    if (!category.trim()) {
      setMessage("Category is required.");
      return;
    }

    try {
      setSaving(true);

      await API.put(`/listings/${id}`, {
        title: title.trim(),
        description: description.trim(),
        price: Number(price),
        category: category.trim(),
        image_url: imageUrl.trim() || null,
      });

      setMessage("Listing updated successfully!");

      setTimeout(() => {
        navigate("/my-listings");
      }, 800);
    } catch (error) {
      setMessage(
        error.response?.data?.error ||
          "Failed to update listing."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <p className="auth-message">Loading listing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Edit Listing</h1>

        <p className="auth-subtitle">
          Update your marketplace item
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Title</label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="auth-field">
            <label>Description</label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="auth-field">
            <label>Price</label>

            <input
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="auth-field">
            <label>Category</label>

            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <div className="auth-field">
            <label>Image URL (optional)</label>

            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>

        {message && (
          <p className="auth-message">
            {message}
          </p>
        )}

        <p className="auth-footer">
          <button
            type="button"
            onClick={() => navigate("/my-listings")}
            style={{
              background: "none",
              border: "none",
              color: "#0d47a1",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Back to My Listings
          </button>
        </p>
      </div>
    </div>
  );
}

export default EditListing;