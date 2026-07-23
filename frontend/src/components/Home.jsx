import React, { useState, useEffect, useRef } from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaTimes, FaUsers } from 'react-icons/fa';
import FAQ from './faq';
import About from './About';

function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [noResults, setNoResults] = useState(false);
  const [dorms, setDorms] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/dorms`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setDorms(data);
      })
      .catch((error) => console.error('Error fetching dorms:', error));
  }, []);

  const fetchSuggestions = (query) => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/dorms/search?q=${query}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setSuggestions(data);
        setNoResults(data.length === 0);
        setActiveIndex(-1);
      })
      .catch((error) => {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
        setNoResults(false);
      });
  };

  // Debounce suggestion lookups so we're not firing a request per keystroke.
  useEffect(() => {
    if (searchQuery.trim().length <= 1) {
      setSuggestions([]);
      setNoResults(false);
      return undefined;
    }
    const timer = setTimeout(() => fetchSuggestions(searchQuery), 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const handleSearch = (event) => {
    event.preventDefault();
    if (!searchQuery.trim()) return;
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/dorms/search?q=${searchQuery}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setDorms(data);
        if (data.length > 0) {
          navigate(`/dorm/${data[0]._id}`, { state: { dorm: data[0] } });
        } else {
          setNoResults(true);
        }
      })
      .catch((error) => console.error('Error searching dorms:', error));
  };

  const handleRate = () => {
    navigate('/rate');
  };

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.name);
    setSuggestions([]);
    setActiveIndex(-1);
    navigate(`/dorm/${suggestion._id}`, { state: { dorm: suggestion } });
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSuggestions([]);
    setActiveIndex(-1);
    setNoResults(false);
    inputRef.current?.focus();
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === 'Escape') {
      setSuggestions([]);
      setActiveIndex(-1);
      return;
    }
    if (suggestions.length === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1));
    } else if (event.key === 'Enter' && activeIndex >= 0) {
      event.preventDefault();
      handleSuggestionClick(suggestions[activeIndex]);
    }
  };

  const handleExplore = () => {
    navigate('/reviews');
  };

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Find Your Perfect Home At Mount Holyoke College</h1>
          <form
            className="search-filters"
            role="search"
            onSubmit={handleSearch}
          >
            <label htmlFor="dorm-search" className="sr-only">
              Search for housing by dorm name
            </label>
            <div className="search-bar">
              <FaSearch className="search-bar-icon" aria-hidden="true" />
              <input
                id="dorm-search"
                ref={inputRef}
                type="text"
                placeholder="Search for housing..."
                value={searchQuery}
                onChange={handleInputChange}
                onKeyDown={handleSearchKeyDown}
                onBlur={() =>
                  setTimeout(() => {
                    setSuggestions([]);
                    setActiveIndex(-1);
                  }, 100)
                }
                autoComplete="off"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={suggestions.length > 0}
                aria-controls="search-suggestions"
                aria-activedescendant={
                  activeIndex >= 0 ? `suggestion-${activeIndex}` : undefined
                }
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear-btn"
                  aria-label="Clear search"
                  onClick={handleClearSearch}
                >
                  <FaTimes aria-hidden="true" />
                </button>
              )}
              <button id="search-btn" type="submit">Search</button>
            </div>

            {suggestions.length > 0 && (
              <ul className="suggestions" id="search-suggestions" role="listbox">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={suggestion._id}
                    id={`suggestion-${index}`}
                    role="option"
                    aria-selected={index === activeIndex}
                    className={index === activeIndex ? 'active' : ''}
                    onMouseDown={() => handleSuggestionClick(suggestion)}
                    onMouseEnter={() => setActiveIndex(index)}
                  >
                    {suggestion.name}
                  </li>
                ))}
              </ul>
            )}

            {noResults && searchQuery.trim().length > 1 && suggestions.length === 0 && (
              <p className="search-no-results" role="status">
                No dorms found for "{searchQuery}"
              </p>
            )}
          </form>
        </div>
        <div className="hero-art" role="img" aria-label="Illustration of Mount Holyoke College housing at dusk">
          <div className="hero-glow hero-glow-sun" aria-hidden="true"></div>
          <div className="hero-glow hero-glow-accent" aria-hidden="true"></div>
          <div className="hero-skyline" aria-hidden="true">
            <span className="hero-building b1"></span>
            <span className="hero-building b2"></span>
            <span className="hero-building b3 roof-pitched"></span>
            <span className="hero-building b4"></span>
            <span className="hero-building b5"></span>
            <span className="hero-building b6 roof-pitched"></span>
            <span className="hero-building b7"></span>
          </div>
          <div className="hero-ground" aria-hidden="true"></div>
        </div>
      </section>
      <div>
        <section className="introduction">
          <About embedded />
        </section>
      </div>
      <section className="recent-reviews"></section>
      <section className="how-it-works">
        <div className="container">
          <div className="how-it-works-art" aria-hidden="true">
            <FaUsers className="how-it-works-art-icon" />
          </div>
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
      <section className="faq">
        <FAQ />
      </section>
    </div>
  );
}

export default Home;
