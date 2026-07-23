import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import "./Rate.css";
import api from "../api";

const VIBE_OPTIONS = [
  { value: "quiet", label: "Quiet" },
  { value: "balanced", label: "Balanced" },
  { value: "social", label: "Social" },
];

function Rate() {
  const { state } = useLocation();
  const [dorms, setDorms] = useState([]);
  const [selectedDorm, setSelectedDorm] = useState(state?.dormId || "");
  const [review, setReview] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success | error
  const [submitting, setSubmitting] = useState(false);

  // Simple but meaningful categories (1-5)
  const [ratings, setRatings] = useState({
    overall: 0,
    cleanliness: 3,
    noise: 3,
    bathroom: 3,
    roomComfort: 3,
    location: 3,
    community: 3,
  });

  const [hoverRating, setHoverRating] = useState(0);
  const [wouldLiveAgain, setWouldLiveAgain] = useState("");
  const [vibe, setVibe] = useState(""); // quiet | balanced | social

  // Tags (easy to answer + great data)
  const prosOptions = [
    "Quiet",
    "Social",
    "Great location",
    "Spacious rooms",
    "Good natural light",
    "Nice common room",
    "Good for first-years",
    "Good for upperclass students",
    "Good bathrooms",
    "Strong WiFi",
  ];

  const consOptions = [
    "Noisy",
    "Small rooms",
    "Bad lighting",
    "Too hot",
    "Too cold",
    "Bathroom issues",
    "Thin walls",
    "Maintenance issues",
    "Far from classes",
  ];

  const [pros, setPros] = useState([]);
  const [cons, setCons] = useState([]);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
    setPreviewUrls(files.map((file) => URL.createObjectURL(file)));
  };

  useEffect(() => {
    const fetchDorms = async () => {
      try {
        const response = await api.get(`/api/dorms`);
        setDorms(response.data);
      } catch (error) {
        console.error("Failed to fetch dorms", error);
      }
    };

    fetchDorms();
  }, []);

  const toggleTag = (tag, type) => {
    if (type === "pros") {
      setPros((prev) =>
        prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
      );
    } else {
      setCons((prev) =>
        prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
      );
    }
  };

  const handleCategoryChange = (e) => {
    const { name, value } = e.target;
    setRatings((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const requirements = [
    { done: Boolean(selectedDorm), label: "Choose a dorm" },
    { done: ratings.overall > 0, label: "Add an overall rating" },
    { done: review.trim().length > 0, label: "Write a short review" },
  ];
  const completedCount = requirements.filter((r) => r.done).length;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDorm) {
      setMessage("Please select a dorm.");
      setMessageType("error");
      return;
    }

    if (!ratings.overall) {
      setMessage("Please add an overall rating.");
      setMessageType("error");
      return;
    }

    if (!review.trim()) {
      setMessage("Please write a short review.");
      setMessageType("error");
      return;
    }

    // Keep it compatible with your backend
    const reviewData = {
      dorm: selectedDorm,
      rating: ratings.overall,   // your backend expects rating
      review,                    // your backend expects review

      // extra fields (your backend can store later)
      attributes: {
        cleanliness: ratings.cleanliness,
        noise: ratings.noise,
        bathroom: ratings.bathroom,
        roomComfort: ratings.roomComfort,
        location: ratings.location,
        community: ratings.community,
        wouldLiveAgain,
        vibe,
        pros,
        cons,
      },
    };

    setSubmitting(true);

    let reviewSucceeded = false;
    let alreadyReviewed = false;
    let reviewErrorMessage = "";

    try {
      await api.post(`/api/reviews/submit`, reviewData);
      reviewSucceeded = true;
    } catch (error) {
      console.error("Error submitting review:", error);
      if (error.response?.status === 409) {
        alreadyReviewed = true;
      } else {
        reviewErrorMessage = error.response?.data?.error || "Failed to submit review.";
      }
    }

    if (reviewErrorMessage) {
      setMessage(reviewErrorMessage);
      setMessageType("error");
      setSubmitting(false);
      return;
    }

    let photosUploaded = false;
    let photoErrorMessage = "";

    if (selectedFiles.length > 0) {
      const formData = new FormData();
      selectedFiles.forEach((file) => formData.append("photos", file));

      try {
        await api.post(`/api/dorms/${selectedDorm}/photos`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        photosUploaded = true;
      } catch (error) {
        console.error("Error uploading photos:", error);
        photoErrorMessage = "Failed to upload photos.";
      }
    }

    if (alreadyReviewed) {
      setMessage(
        photosUploaded
          ? "You've already reviewed this dorm, but your photos were added!"
          : "You've already reviewed this dorm." + (photoErrorMessage ? ` ${photoErrorMessage}` : "")
      );
      setMessageType(photosUploaded ? "success" : "error");
    } else if (reviewSucceeded) {
      setMessage(
        photoErrorMessage
          ? `Review submitted successfully! ${photoErrorMessage}`
          : "Review submitted successfully!"
      );
      setMessageType(photoErrorMessage ? "error" : "success");
    }

    setSubmitting(false);

    if (reviewSucceeded || photosUploaded) {
      // reset
      setSelectedDorm("");
      setReview("");
      setRatings({
        overall: 0,
        cleanliness: 3,
        noise: 3,
        bathroom: 3,
        roomComfort: 3,
        location: 3,
        community: 3,
      });
      setWouldLiveAgain("");
      setVibe("");
      setPros([]);
      setCons([]);
      setSelectedFiles([]);
      setPreviewUrls([]);
    }
  };

  return (
    <div className="ratePage">
      <div className="rateContainer">
        <div className="rateHeader">
          <div className="rateHeaderBadge" aria-hidden="true">
            <FaStar size={20} />
          </div>
          <div>
            <h1>Rate Your Dorm</h1>
            <p className="rateSubtext">
              Help other students choose the best place to live. It only takes a couple of minutes.
            </p>
          </div>
        </div>

        <div className="requirementsBlock">
          <p className="requirementsSummary" aria-live="polite">
            {completedCount} of {requirements.length} required steps complete
          </p>
          <div className="requirementsTrack" aria-hidden="true">
            <div
              className="requirementsFill"
              style={{ width: `${(completedCount / requirements.length) * 100}%` }}
            />
          </div>
        </div>

        <ul className="requirementsList" aria-live="polite">
          {requirements.map((req) => (
            <li key={req.label} className={req.done ? "done" : ""}>
              <span className="requirementIcon" aria-hidden="true">
                {req.done ? "✓" : ""}
              </span>
              {req.label}
            </li>
          ))}
        </ul>

        {message && (
          <div className={`alert ${messageType}`} role="alert">
            {message}
          </div>
        )}

        <form className="rateForm" onSubmit={handleSubmit} noValidate>
          {/* Dorm select */}
          <div className="card">
            <h2 className="cardTitle">Choose Dorm</h2>

            <label className="label" htmlFor="dormSelect">
              Dorm Name
              <select
                id="dormSelect"
                className="select"
                value={selectedDorm}
                onChange={(e) => setSelectedDorm(e.target.value)}
                required
                aria-required="true"
              >
                <option value="" disabled>
                  Select a dorm
                </option>
                {dorms.map((dorm) => (
                  <option key={dorm._id} value={dorm._id}>
                    {dorm.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Overall rating + quick questions */}
          <div className="card">
            <h2 className="cardTitle">Overall</h2>

            <div className="row">
              <div className="fieldBlock">
                <p className="labelTitle" id="overallRatingLabel">Overall Rating</p>
                <div
                  className="star-rating"
                  role="radiogroup"
                  aria-labelledby="overallRatingLabel"
                  onMouseLeave={() => setHoverRating(0)}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <React.Fragment key={n}>
                      <input
                        type="radio"
                        id={`overall-star-${n}`}
                        name="overallRating"
                        className="star-input"
                        value={n}
                        checked={ratings.overall === n}
                        onChange={() =>
                          setRatings((prev) => ({ ...prev, overall: n }))
                        }
                        required
                      />
                      <label
                        htmlFor={`overall-star-${n}`}
                        className={`star-label${n <= (hoverRating || ratings.overall) ? " filled" : ""}`}
                        aria-label={`${n} star${n > 1 ? "s" : ""}`}
                        onMouseEnter={() => setHoverRating(n)}
                      >
                        <FaStar />
                      </label>
                    </React.Fragment>
                  ))}
                </div>
                <p className="helperText" aria-live="polite">
                  {ratings.overall > 0 ? `${ratings.overall}/5` : "Tap a star to rate"}
                </p>
              </div>

              <div className="fieldBlock">
                <p className="labelTitle" id="wouldLiveAgainLabel">Would you live here again?</p>
                <div
                  className="segmented"
                  role="radiogroup"
                  aria-labelledby="wouldLiveAgainLabel"
                >
                  <input
                    type="radio"
                    id="wla-yes"
                    className="segmented-input"
                    name="wouldLiveAgain"
                    value="yes"
                    checked={wouldLiveAgain === "yes"}
                    onChange={(e) => setWouldLiveAgain(e.target.value)}
                  />
                  <label htmlFor="wla-yes" className="segmented-label">Yes</label>

                  <input
                    type="radio"
                    id="wla-no"
                    className="segmented-input"
                    name="wouldLiveAgain"
                    value="no"
                    checked={wouldLiveAgain === "no"}
                    onChange={(e) => setWouldLiveAgain(e.target.value)}
                  />
                  <label htmlFor="wla-no" className="segmented-label">No</label>
                </div>
              </div>

              <div className="fieldBlock">
                <p className="labelTitle" id="vibeLabel">Vibe</p>
                <div
                  className="segmented"
                  role="radiogroup"
                  aria-labelledby="vibeLabel"
                >
                  {VIBE_OPTIONS.map((opt) => (
                    <React.Fragment key={opt.value}>
                      <input
                        type="radio"
                        id={`vibe-${opt.value}`}
                        className="segmented-input"
                        name="vibe"
                        value={opt.value}
                        checked={vibe === opt.value}
                        onChange={(e) => setVibe(e.target.value)}
                      />
                      <label htmlFor={`vibe-${opt.value}`} className="segmented-label">
                        {opt.label}
                      </label>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Category ratings */}
          <div className="card">
            <h2 className="cardTitle">Category Ratings (1–5)</h2>

            <div className="ratingsGrid">
              <CategorySlider
                title="Cleanliness"
                name="cleanliness"
                value={ratings.cleanliness}
                onChange={handleCategoryChange}
              />
              <CategorySlider
                title="Noise level (at night)"
                name="noise"
                value={ratings.noise}
                onChange={handleCategoryChange}
              />
              <CategorySlider
                title="Bathroom situation"
                name="bathroom"
                value={ratings.bathroom}
                onChange={handleCategoryChange}
              />
              <CategorySlider
                title="Room comfort"
                name="roomComfort"
                value={ratings.roomComfort}
                onChange={handleCategoryChange}
              />
              <CategorySlider
                title="Location convenience"
                name="location"
                value={ratings.location}
                onChange={handleCategoryChange}
              />
              <CategorySlider
                title="Community / vibe"
                name="community"
                value={ratings.community}
                onChange={handleCategoryChange}
              />
            </div>
          </div>

          {/* Tags */}
          <div className="card">
            <h2 className="cardTitle">Quick Tags</h2>

            <div className="tagSection">
              <p className="tagTitle">Pros</p>
              <div className="tags">
                {prosOptions.map((tag) => (
                  <button
                    type="button"
                    key={tag}
                    className={`tag ${pros.includes(tag) ? "active" : ""}`}
                    aria-pressed={pros.includes(tag)}
                    onClick={() => toggleTag(tag, "pros")}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="tagSection">
              <p className="tagTitle">Cons</p>
              <div className="tags">
                {consOptions.map((tag) => (
                  <button
                    type="button"
                    key={tag}
                    className={`tag red ${cons.includes(tag) ? "active" : ""}`}
                    aria-pressed={cons.includes(tag)}
                    onClick={() => toggleTag(tag, "cons")}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Photos */}
          <div className="card">
            <h2 className="cardTitle">Add Photos (optional)</h2>

            <label className="label" htmlFor="photoInput">
              Share a picture of the room, common space, or view
              <input
                type="file"
                id="photoInput"
                accept="image/*"
                multiple
                onChange={handleFileChange}
              />
            </label>

            {previewUrls.length > 0 && (
              <div className="photoPreviewGrid">
                {previewUrls.map((url, index) => (
                  <img key={index} src={url} alt={`Selected file ${index + 1}`} />
                ))}
              </div>
            )}
          </div>

          {/* Review text */}
          <div className="card">
            <h2 className="cardTitle">Write Your Review</h2>

            <label className="label" htmlFor="reviewText">
              What should someone know before choosing this dorm?
              <textarea
                id="reviewText"
                className="textarea"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Example: Great location, but the walls are thin. Bathrooms were usually clean. Quiet floors were actually quiet."
                required
                aria-required="true"
                rows={6}
              />
            </label>
          </div>

          <button className="submitBtn" type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
}

function CategorySlider({ title, name, value, onChange }) {
  const inputId = `slider-${name}`;
  const pct = ((value - 1) / 4) * 100;

  return (
    <div className="sliderCard">
      <div className="sliderTop">
        <label className="sliderTitle" htmlFor={inputId}>{title}</label>
        <span className="sliderValue">{value}/5</span>
      </div>
      <input
        id={inputId}
        className="slider"
        type="range"
        name={name}
        min="1"
        max="5"
        value={value}
        onChange={onChange}
        aria-valuetext={`${value} out of 5`}
        style={{ "--pct": `${pct}%` }}
      />
      <div className="sliderScale" aria-hidden="true">
        <span>1</span>
        <span>5</span>
      </div>
    </div>
  );
}

export default Rate;
