import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ReviewPage.css'; // Import the CSS file

function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('http://localhost:5050/api/reviews');
        console.log('Fetched reviews:', response.data); // Debugging line
        setReviews(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching reviews:', error); // Debugging line
        setError('Failed to fetch reviews');
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="reviews-page">
      <h1>Dorm Reviews</h1>
      {reviews.length === 0 ? (
        <p>No dorms reviewed yet.</p>
      ) : (
        <div className="reviews-list">
          {reviews.map(review => (
            <div key={review._id} className="review-item">
              <h2>{review.dorm ? review.dorm.name : 'Unknown Dorm'}</h2>
              <p>Rating: {review.rating}</p>
              <p>{review.review}</p>
              <p>Date: {new Date(review.date).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReviewsPage;