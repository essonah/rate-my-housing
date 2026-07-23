import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./DormModal.css";
import axios from "axios";

function DormModal() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [dorm, setDorm] = useState(state?.dorm || null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchDorm = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/dorms/${id}`);
        setDorm(res.data);
      } catch (err) {
        console.error("Error fetching dorm:", err);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/reviews/dorm/${id}`);
        setReviews(res.data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };

    if (!dorm && id) fetchDorm();
    if (id) fetchReviews();
  }, [id]);

  if (!dorm) {
    return (
      <p className="dorm-loading" role="status" aria-live="polite">
        Loading dorm details…
      </p>
    );
  }

  // ⭐ average overall rating
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  // ✅ category averages (only works if reviews include attributes)
  const categoryKeys = ["cleanliness", "noise", "bathroom", "roomComfort", "location", "community"];

  const getCategoryAverage = (key) => {
    const vals = reviews
      .map((r) => r.attributes?.[key])
      .filter((v) => typeof v === "number");

    if (vals.length === 0) return null;
    return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
  };

  // ✅ dorm facts chips (from your seeded dorm facts)
  const chips = [];
  if (dorm.facts?.Elevator === "Yes" || dorm.facts?.Elevator === true) chips.push("Elevator");
  if (dorm.facts?.Accessible === "Yes" || dorm.facts?.Accessible === true) chips.push("Accessible");
  if (dorm.facts?.["Full Kitchen"] === "Yes") chips.push("Full Kitchen");
  if (dorm.facts?.["Kitchenette on Floors"]) chips.push("Kitchenettes");
  if (dorm.facts?.["Quiet Floors"]) chips.push(`Quiet Floors: ${dorm.facts["Quiet Floors"]}`);

  return (
    <div className="full-page-container">
      {/* Hero */}
      <section className="hero-section">
        <div className="dorm-hero-content">
          <h1>{dorm.name}</h1>
          <p className="location-text">
            Mount Holyoke College • {dorm.location || "South Hadley"}
          </p>

          {/* ✅ Add quick chips under the title */}
          {chips.length > 0 && (
            <div className="facts-chips">
              {chips.map((c) => (
                <span key={c} className="facts-chip">
                  {c}
                </span>
              ))}
            </div>
          )}

          {/* ✅ Always visible rate button */}
          <button
            className="rate-button hero-rate"
            onClick={() => navigate("/rate", { state: { dormId: dorm._id } })}
          >
            Rate this Dorm
          </button>
        </div>
      </section>

      <div className="content-wrapper">
        <div className="main-grid">
          {/* About */}
          <div className="description-card">
            <h3>About the Dorm</h3>
            <p>{dorm.description || "No description available yet."}</p>

            {dorm.images?.length > 0 ? (
              <div className="photo-gallery">
                {dorm.images.map((url, index) => (
                  <img key={index} src={url} alt={`${dorm.name} ${index + 1}`} className="gallery-image" />
                ))}
              </div>
            ) : dorm.imageUrl ? (
              <img src={dorm.imageUrl} alt={dorm.name} className="featured-image" />
            ) : (
              <div className="image-placeholder">
                No dorm image uploaded yet
              </div>
            )}

            {/* ✅ Dorm facts section */}
            {dorm.facts && Object.keys(dorm.facts).length > 0 && (
              <div className="facts-section">
                <h3>Dorm Details</h3>
                <div className="facts-grid">
                  {Object.entries(dorm.facts).map(([k, v]) => {
                    // skip nested objects (like North/South Creighton) for now
                    if (typeof v === "object" && v !== null) return null;

                    return (
                      <div key={k} className="fact-row">
                        <span className="fact-key">{k}</span>
                        <span className="fact-value">{String(v)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="details-sidebar">
            {/* Amenities */}
            <div className="amenities-card">
              <h3>Amenities</h3>
              <div className="pill-container">
                {(dorm.amenities || []).length > 0 ? (
                  dorm.amenities.map((amenity, index) => (
                    <span key={index} className="amenity-pill">
                      {amenity}
                    </span>
                  ))
                ) : (
                  <p className="empty-state">No amenities listed yet.</p>
                )}
              </div>
            </div>

            {/* Rating summary */}
            <div className="rating-summary">
              <h3>Community Rating</h3>
              <div className="big-score">
                {avgRating ? (
                  <>
                    {avgRating} <span>/ 5</span>
                  </>
                ) : (
                  "N/A"
                )}
              </div>
              <p className="small-muted">
                {reviews.length} review{reviews.length !== 1 ? "s" : ""}
              </p>

              {/* ✅ Category breakdown */}
              <div className="category-summary">
                <h4>Rating Breakdown</h4>

                {categoryKeys.map((key) => {
                  const avg = getCategoryAverage(key);
                  return (
                    <div key={key} className="category-row">
                      <span className="category-label">
                        {key === "roomComfort" ? "Room comfort" : key.charAt(0).toUpperCase() + key.slice(1)}
                      </span>
                      <span className="category-value">{avg ? `${avg}/5` : "—"}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <section className="reviews-full-width">
          <div className="reviews-header">
            <h3>User Experiences</h3>
            <button
              className="rate-button"
              onClick={() => navigate("/rate", { state: { dormId: dorm._id } })}
            >
              Rate this Dorm
            </button>
          </div>

          {reviews.length > 0 ? (
            <div className="dorm-reviews-list">
              {reviews.map((review) => (
                <div key={review._id} className="dorm-review-item">
                  <div className="review-meta">
                    <span className="stars">
                      {"⭐".repeat(review.rating)}
                    </span>
                    <span className="date">
                      {new Date(review.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                  </div>

                  {/* ✅ Optional tags if you store them */}
                  {review.attributes?.pros?.length > 0 && (
                    <div className="mini-tags">
                      {review.attributes.pros.slice(0, 5).map((t) => (
                        <span key={t} className="mini-tag">{t}</span>
                      ))}
                    </div>
                  )}

                  <p>{review.review}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">No reviews yet. Share your experience!</p>
          )}
        </section>
      </div>
    </div>
  );
}

export default DormModal;