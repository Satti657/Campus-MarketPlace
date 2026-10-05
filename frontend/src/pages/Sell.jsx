
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "../Auth.css";

function Sell() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    // Simple validation
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
      setLoading(true);

      const formData = new FormData();

      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("price", Number(price));
      formData.append("category", category.trim());

      if (image) {
        formData.append("image", image);
      }

      const response = await API.post("/listings", formData);

      setMessage(
        `Listing created successfully! ID: ${response.data.id}`
      );

      setTitle("");
      setDescription("");
      setPrice("");
      setCategory("");
      setImage(null);

      // Reset file input
      document.getElementById("image").value = "";

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      setMessage(
        error.response?.data?.error ||
          "Failed to create listing. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Sell an Item</h1>

        <p className="auth-subtitle">
          Create a listing for your campus community
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Title</label>

            <input
              type="text"
              placeholder="e.g. Engineering Mathematics Book"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="auth-field">
            <label>Description</label>

            <textarea
              placeholder="Describe your item..."
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
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="auth-field">
            <label>Category</label>

            <input
              type="text"
              placeholder="e.g. Books, Electronics"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <div className="auth-field">
            <label>Image (optional)</label>

            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Listing"}
          </button>
        </form>

        {message && (
          <p className="auth-message">
            {message}
          </p>
        )}

        <p className="auth-footer">
          Want to go back?{" "}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
          >
            Back to Marketplace
          </a>
        </p>
      </div>
    </div>
  );
}

export default Sell;

