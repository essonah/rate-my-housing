import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import './DormModal.css';
import axios from 'axios';

function DormModal() {
  const { state } = useLocation();
  const { id } = useParams();
  const dorm = state?.dorm;
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (id) {
      const fetchReviews = async () => {
        try {
          const response = await axios.get(`http://localhost:5050/api/reviews/dorm/${id}`);
          setReviews(response.data);
        } catch (error) {
          console.error('Error fetching reviews:', error);
        }
      };

      fetchReviews();
    }
  }, [id]);

  if (!dorm) {
    return <p>Loading...</p>; // Handle case where dorm is not available
  }

  return (
    <div className="modal-page">
      <h2>{dorm.name}</h2>
      <p>{dorm.description}</p>
      <img src={dorm.imageUrl} alt={dorm.name} />
      <h3>Amenities</h3>
      <ul>
        {dorm.amenities.map((amenity, index) => (
          <li key={index}>{amenity}</li>
        ))}
      </ul>
      <p>Location: {dorm.location}</p>
      <h3>Reviews</h3>
      {reviews.length > 0 ? (
        <ul>
          {reviews.map((review) => (
            <li key={review._id}>
              <p>Rating: {review.rating}</p>
              <p>{review.review}</p>
              <p>Date: {new Date(review.date).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No reviews yet.</p>
      )}
    </div>
  );
}

export default DormModal;