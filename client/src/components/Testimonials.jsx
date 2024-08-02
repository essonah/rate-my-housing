import React from 'react';
import './Testimonials.css';

const Testimonials = ({ testimonials }) => {
  return (
    <div className="testimonials">
      {testimonials.map((testimonial, index) => (
        <div key={index} className="testimonial">
          <p className="testimonial-text">"{testimonial.text}"</p>
          <p className="testimonial-author">- {testimonial.author}</p>
        </div>
      ))}
    </div>
  );
};

export default Testimonials;