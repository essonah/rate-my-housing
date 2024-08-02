import React from 'react';
import './About.css'; // Make sure to import your CSS file

function About() {
    return (
        <div className="about">
            <div className="about-text">
                <h1>About Us</h1>
                <p>Our mission is to help students find the best dorms for their needs. We provide information about dorms, including amenities, location, and reviews. We also allow students to rate dorms and share their experiences.</p>
            </div>
            <div className="about-image">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdKntsX-3XHjIAIL4IJrq0NM6nBRDgOyCRXQ&s" alt="About Us" />
            </div>
        </div>
    );
}

export default About;