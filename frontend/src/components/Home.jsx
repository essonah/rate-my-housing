import React, { useState, useEffect } from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import FAQ from './faq';
import About from './About';
import Navbar from './navbar';
//import ReviewsPage from './ReviewsPage';
import Testimonials from './Testimonials';

function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [dorms, setDorms] = useState([]);
  const [testimonials, setTestimonials] = useState([
    {
      text: "Thanks to this platform I found the best housing suited for my needs.",
      author: "Amanda Adjei"
    },
    {
      text: "I love the location of this dorm. It's so close to all my classes.",
      author: "Akosua Aidoo"
    },
    {
      text: "The facilities are top-notch and the staff are always helpful.",
      author: "Kwame Agyemang"
    }
  ]);

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

  const fetchSuggestions = (query) => {
    fetch(`http://localhost:5050/api/dorms/search?q=${query}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Search suggestions:', data); // Debugging line
        setSuggestions(data);
      })
      .catch((error) => console.error('Error fetching suggestions:', error));
  };

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

  const handleInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    if (query.length > 1) {
      fetchSuggestions(query);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.name);
    setSuggestions([]);
    navigate(`/dorm/${suggestion._id}`, { state: { dorm: suggestion } });
  };

  const handleExplore = () => {
    navigate('/reviews');
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
              onChange={handleInputChange}
              onBlur={() => setTimeout(() => setSuggestions([]), 100)} // Hides suggestions when input loses focus
            />
            <button id="search-btn" type="submit">Search</button>
            {suggestions.length > 0 && (
              <ul className="suggestions">
                {suggestions.map((suggestion) => (
                  <li
                    key={suggestion._id}
                    onMouseDown={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion.name}
                  </li>
                ))}
              </ul>
            )}
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
              <button onClick={handleExplore}>Explore Reviews</button>
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
        <Testimonials testimonials={testimonials} />
      </section>
      <section className="map-view">
        <div id="map">
          {/* Integrate Google Maps or another map service */}
        </div>
      </section>
      <section className="faq">
        <FAQ />
      </section>
      <footer className='footer'>
        <h1>Rate My Housing</h1>
        <p>&copy; 2024 Rate_mY_HouSing</p>
      </footer>
    </div>
  
  );
}

export default Home;