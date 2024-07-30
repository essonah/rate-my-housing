import React from "react";
import './navbar.css';

function Navbar() {
    return (
        <nav className="navbar">
            <ul className="navbar-list">
                <li className="navbar-item"><a href="/" className="navbar-link">Home</a></li>
                <li className="navbar-item"><a href="/rate" className="navbar-link">Rate</a></li>
                <li className="navbar-item"><a href="/faq" className="navbar-link">FAQ</a></li>
            </ul>
        </nav>
    );
}

export default Navbar;