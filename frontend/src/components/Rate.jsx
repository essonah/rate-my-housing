import React, { useState, useEffect } from "react";
import ReactRating from "react-rating";
import { useNavigate } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";
import "./Rate.css";
import axios from "axios";

function Rate() {
  const navigate = useNavigate();

  const [dorms, setDorms] = useState([]);
  const [selectedDorm, setSelectedDorm] = useState("");
  const [review, setReview] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success | error

  // ✅ Simple but meaningful categories (1–5)
  const [ratings, setRatings] = useState({
    overall: 0,
    cleanliness: 3,
    noise: 3,
    bathroom: 3,
    roomComfort: 3,
    location: 3,
    community: 3,
  });

  const [wouldLiveAgain, setWouldLiveAgain] = useState("");
  const [vibe, setVibe] = useState(""); // quiet | balanced | social

  // ✅ Tags (easy to answer + great data)
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

  useEffect(() => {
    const fetchDorms = async () => {
      try {
        const response = await axios.get("http://localhost:5050/api/dorms");
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

    // ✅ Keep it compatible with your backend
    const reviewData = {
      dorm: selectedDorm,
      rating: ratings.overall,   // your backend expects rating
      review,                    // your backend expects review

      // ✅ extra fields (your backend can store later)
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

    try {
      const response = await axios.post(
        "http://localhost:5050/api/reviews/submit",
        reviewData
      );

      setMessage(response.data.message || "Review submitted successfully!");
      setMessageType("success");

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
    } catch (error) {
      console.error("Error submitting review:", error);
      setMessage("Failed to submit review.");
      setMessageType("error");
    }
  };

  return (
    <div className="ratePage">
      <div className="rateTopBar">
        <button className="backBtn" onClick={() => navigate("/")}>
          ← Back
        </button>
      </div>

      <div className="rateContainer">
        <div className="rateHeader">
          <h1>Rate Your Dorm</h1>
          <p className="rateSubtext">
            Help other students choose the best place to live 💙
          </p>
        </div>

        {message && (
          <div className={`alert ${messageType}`}>
            {message}
          </div>
        )}

        <form className="rateForm" onSubmit={handleSubmit}>
          {/* Dorm select */}
          <div className="card">
            <h2 className="cardTitle">Choose Dorm</h2>

            <label className="label">
              Dorm Name
              <select
                className="select"
                value={selectedDorm}
                onChange={(e) => setSelectedDorm(e.target.value)}
                required
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
                <p className="labelTitle">Overall Rating</p>
                <ReactRating
                  initialRating={ratings.overall}
                  onChange={(rate) =>
                    setRatings((prev) => ({ ...prev, overall: rate }))
                  }
                  fullSymbol={<FaStar size={28} />}
                  emptySymbol={<FaRegStar size={28} />}
                />
                <p className="helperText">{ratings.overall}/5</p>
              </div>

              <div className="fieldBlock">
                <p className="labelTitle">Would you live here again?</p>
                <div className="radioRow">
                  <label className="radioOption">
                    <input
                      type="radio"
                      name="wouldLiveAgain"
                      value="yes"
                      checked={wouldLiveAgain === "yes"}
                      onChange={(e) => setWouldLiveAgain(e.target.value)}
                    />
                    Yes
                  </label>
                  <label className="radioOption">
                    <input
                      type="radio"
                      name="wouldLiveAgain"
                      value="no"
                      checked={wouldLiveAgain === "no"}
                      onChange={(e) => setWouldLiveAgain(e.target.value)}
                    />
                    No
                  </label>
                </div>
              </div>

              <div className="fieldBlock">
                <p className="labelTitle">Vibe</p>
                <select
                  className="select"
                  value={vibe}
                  onChange={(e) => setVibe(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="quiet">Quiet</option>
                  <option value="balanced">Balanced</option>
                  <option value="social">Social / lively</option>
                </select>
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
                    onClick={() => toggleTag(tag, "cons")}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Review text */}
          <div className="card">
            <h2 className="cardTitle">Write Your Review</h2>

            <label className="label">
              What should someone know before choosing this dorm?
              <textarea
                className="textarea"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Example: Great location, but the walls are thin. Bathrooms were usually clean. Quiet floors were actually quiet."
                required
                rows={6}
              />
            </label>
          </div>

          <button className="submitBtn" type="submit">
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
}

function CategorySlider({ title, name, value, onChange }) {
  return (
    <div className="sliderCard">
      <div className="sliderTop">
        <p className="sliderTitle">{title}</p>
        <span className="sliderValue">{value}/5</span>
      </div>
      <input
        className="slider"
        type="range"
        name={name}
        min="1"
        max="5"
        value={value}
        onChange={onChange}
      />
      <div className="sliderScale">
        <span>1</span>
        <span>5</span>
      </div>
    </div>
  );
}

export default Rate;