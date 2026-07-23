import React from 'react';
import { FaHome } from 'react-icons/fa';
import './About.css'; // Make sure to import your CSS file

function About({ embedded = false }) {
    const Heading = embedded ? 'h2' : 'h1';
    return (
        <div className="about">
            <div className="about-text">
                <Heading>About Us</Heading>
                <p>Our mission is to help students find the best dorms for their needs. We provide information about dorms, including amenities, location, and reviews. We also allow students to rate dorms and share their experiences.</p>
            </div>
            <div className="about-image">
                <div className="about-art" role="img" aria-label="Rate My Housing">
                    <FaHome className="about-art-icon" aria-hidden="true" />
                </div>
            </div>
        </div>
    );
}

export default About;