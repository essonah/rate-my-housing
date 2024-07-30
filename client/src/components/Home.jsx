import React, { useState, useEffect } from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import FAQ from './faq';
import About from './About';
import Navbar from './navbar';

function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [dorms, setDorms] = useState([]);
  const [selectedDorm, setSelectedDorm] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5050/api/dorms')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Fetched dorms:', data); // Debugging line
        setDorms(data);
      })
      .catch((error) => console.error('Error fetching dorms:', error));
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    fetch(`http://localhost:5050/api/dorms/search?q=${searchQuery}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Search results:', data); // Debugging line
        setDorms(data);
        if (data.length > 0) {
          navigate(`/dorm/${data[0]._id}`, { state: { dorm: data[0] } });
        }
      })
      .catch((error) => console.error('Error searching dorms:', error));
  };

  const handleRate = () => {
    navigate('/rate');
  };

  return (
    <div className="home">
      <Navbar />
      <section className="hero">
        <div className="hero-content">
          <h1>Find Your Perfect Home At Mount Holyoke College</h1>
          <form className="search-filters" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search for housing..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
        </div>
        <img
          id="housing-image"
          src="https://www.woolfcollegeconsulting.com/content/uploads/2019/04/IMG_2224-1024x768.jpg"
          alt="Mount Holyoke College Housing"
        />
      </section>
      <div>
        <section className="introduction">
          <About />
        </section>
      </div>
      <section className="recent-reviews"></section>
      <section className="how-it-works">
        <div className="container">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCrQsqYw8rRMARen2Zpges7XJCsvz5ch6oPQ&s" alt="How it works" />
          <div className="text">
            <h2>How it works</h2>
            <p>Sign up, Rate your dorm, and leave feedback to help others</p>
            <section className="call-to-action">
              <button onClick={handleRate}>Rate Your Dorm</button>
              <button>Explore Reviews</button>
            </section>
          </div>
        </div>
      </section>
      {/* <section className="top-rated">
       {dorms.map((dorm) => (
          <div key={dorm._id} className="dorm">
            <h3>{dorm.name}</h3>
            <p>{dorm.description}</p>
            <img src={dorm.imageUrl} alt={dorm.name} />
          </div>
        ))}
      </section> */}
      <section className="user-testimonials">
        <h2>What Students Say</h2>
        <div className="testimonials">
          {/* Add testimonials here */}
        </div>
      </section>
      <section className="map-view">
        <h2>Explore Housing Locations</h2>
        <div id="map">
          {/* Integrate Google Maps or another map service */}
        </div>
      </section>
      <section className="faq">
        <FAQ />
      </section>
    </div>
  );
}

export default Home;