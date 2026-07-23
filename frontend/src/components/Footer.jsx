import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="site-footer">
      <p className="footer-brand">Rate My Housing</p>
      <nav className="footer-links" aria-label="Footer">
        <Link to="/about">About</Link>
        <Link to="/faq">FAQ</Link>
        <Link to="/reviews">Reviews</Link>
      </nav>
      <p className="footer-copy">&copy; {new Date().getFullYear()} Rate My Housing</p>
    </footer>
  );
}

export default Footer;
