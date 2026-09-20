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
  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/listings", {
        title,
        description,
        price,
        category,
        image_url: imageUrl || null,
      });

      setMessage(`Listing created successfully! ID: ${response.data.id}`);

      setTitle("");
      setDescription("");
      setPrice("");
      setCategory("");
      setImageUrl("");

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      setMessage(
        error.response?.data?.error ||
          "Failed to create listing."
      );
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
              required
            />
          </div>

          <div className="auth-field">
            <label>Description</label>
            <textarea
              placeholder="Describe your item..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label>Price</label>
            <input
              type="number"
              step="0.01"
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label>Category</label>
            <input
              type="text"
              placeholder="e.g. Books, Electronics"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label>Image URL (optional)</label>
            <input
              type="text"
              placeholder="Paste image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>

          <button type="submit" className="auth-button">
            Create Listing
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