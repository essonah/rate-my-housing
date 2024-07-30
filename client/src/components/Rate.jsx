import React, { useState, useEffect } from 'react';
import ReactRating from 'react-rating';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';
import './Rate.css';
import axios from 'axios';

function Rate() {
  const [dorms, setDorms] = useState([]);
  const [selectedDorm, setSelectedDorm] = useState('');
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  useEffect(() => {
    const fetchDorms = async () => {
      try {
        const response = await axios.get('http://localhost:5050/api/dorms');
        console.log('Dorms fetched:', response.data);
        setDorms(response.data);
      } catch (error) {
        console.error('Failed to fetch dorms', error);
      }
    };

    fetchDorms();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const reviewData = {
      dorm: selectedDorm,
      rating,
      review,
    };
    console.log('Submitting review:', reviewData); // Log the data being submitted
    try {
      const response = await axios.post('http://localhost:5050/api/reviews/submit', reviewData);
      console.log('Response:', response); // Log the response
      setMessage(response.data.message);
      setMessageType('success');
      // Reset the form fields
      setSelectedDorm('');
      setRating(0);
      setReview('');
    } catch (error) {
      console.error('Error submitting review:', error); // Log the error
      setMessage('Failed to submit review');
      setMessageType('error');
    }
  };

  return (
    <div className="rate-page">
      <h1>Rate Your Dorm</h1>
      {message && (
        <p className={`message ${messageType}`}>
          {message}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <label htmlFor="dorm">Dorm Name
          <select
            id="dorm"
            name="dorm"
            value={selectedDorm}
            onChange={(e) => setSelectedDorm(e.target.value)}
            required
          >
            <option value="" disabled>Select a dorm</option>
            {dorms.map((dorm) => (
              <option key={dorm._id} value={dorm._id}>
                {dorm.name}
              </option>
            ))}
          </select>
        </label>

        <label htmlFor="rating">Rating
          <ReactRating
            initialRating={rating}
            onChange={(rate) => setRating(rate)}
            fullSymbol={<FaStar size={32} style={{ color: '#FFD700' }} />}
            emptySymbol={<FaRegStar size={32} style={{ color: '#FFD700' }} />}
            halfSymbol={<FaStarHalfAlt size={32} style={{ color: '#FFD700' }} />}
            fractions={2}
          />
        </label>

        <label htmlFor="review">Review
          <textarea
            id="review"
            name="review"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            required
          />
        </label>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Rate;