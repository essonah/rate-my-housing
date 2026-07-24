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
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(!state?.dorm);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const galleryImages = dorm?.images?.length > 0 ? dorm.images : dorm?.imageUrl ? [dorm.imageUrl] : [];

  useEffect(() => {
    if (lightboxIndex === null) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setLightboxIndex(null);
      } else if (event.key === "ArrowRight") {
        setLightboxIndex((prev) => (prev + 1) % galleryImages.length);
      } else if (event.key === "ArrowLeft") {
        setLightboxIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, galleryImages.length]);

  useEffect(() => {
    const fetchDorm = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/dorms/${id}`);
        setDorm(res.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching dorm:", err);
        setError("We couldn't load this dorm right now. Please try again.");
      } finally {
        setLoading(false);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return (
      <p className="dorm-loading" role="status" aria-live="polite">
        Loading dorm details…
      </p>
    );
  }

  if (error || !dorm) {
    return (
      <div className="dorm-error" role="alert">
        <p>{error || "We couldn't find that dorm."}</p>
        <button className="rate-button" onClick={() => navigate("/")}>
          Back to home
        </button>
      </div>
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
                  <button
                    key={index}
                    type="button"
                    className="gallery-image-btn"
                    onClick={() => setLightboxIndex(index)}
                    aria-label={`View ${dorm.name} photo ${index + 1} of ${dorm.images.length} full size`}
                  >
                    <img src={url} alt={`${dorm.name} ${index + 1}`} className="gallery-image" />
                  </button>
                ))}
              </div>
            ) : dorm.imageUrl ? (
              <button
                type="button"
                className="featured-image-btn"
                onClick={() => setLightboxIndex(0)}
                aria-label={`View ${dorm.name} photo full size`}
              >
                <img src={dorm.imageUrl} alt={dorm.name} className="featured-image" />
              </button>
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
                      {new Date(review.date || Date.now()).toLocaleDateString()}
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

      {lightboxIndex !== null && galleryImages[lightboxIndex] && (
        <div
          className="lightbox-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={`${dorm.name} photo ${lightboxIndex + 1} of ${galleryImages.length}`}
          onClick={() => setLightboxIndex(null)}
        >
          <button
            type="button"
            className="lightbox-close"
            aria-label="Close photo"
            onClick={() => setLightboxIndex(null)}
          >
            ×
          </button>

          {galleryImages.length > 1 && (
            <button
              type="button"
              className="lightbox-nav lightbox-prev"
              aria-label="Previous photo"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
              }}
            >
              ‹
            </button>
          )}

          <img
            src={galleryImages[lightboxIndex]}
            alt={`${dorm.name} ${lightboxIndex + 1}`}
            className="lightbox-image"
            onClick={(e) => e.stopPropagation()}
          />

          {galleryImages.length > 1 && (
            <button
              type="button"
              className="lightbox-nav lightbox-next"
              aria-label="Next photo"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev + 1) % galleryImages.length);
              }}
            >
              ›
            </button>
          )}

          {galleryImages.length > 1 && (
            <p className="lightbox-counter">
              {lightboxIndex + 1} / {galleryImages.length}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default DormModal;