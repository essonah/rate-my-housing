import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import './navbar.css';

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = async () => {
        setMenuOpen(false);
        await logout();
        navigate("/");
    };

    const linkClass = ({ isActive }) => `navbar-link${isActive ? " active" : ""}`;

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <NavLink to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
                    Rate My Housing
                </NavLink>

                <button
                    type="button"
                    className="navbar-toggle"
                    aria-label={menuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={menuOpen}
                    aria-controls="primary-navigation"
                    onClick={() => setMenuOpen((open) => !open)}
                >
                    {menuOpen ? <FaTimes aria-hidden="true" /> : <FaBars aria-hidden="true" />}
                </button>

                <ul id="primary-navigation" className={`navbar-list${menuOpen ? " open" : ""}`}>
                    <li className="navbar-item">
                        <NavLink to="/" end className={linkClass} onClick={() => setMenuOpen(false)}>Home</NavLink>
                    </li>
                    <li className="navbar-item">
                        <NavLink to="/rate" className={linkClass} onClick={() => setMenuOpen(false)}>Rate</NavLink>
                    </li>
                    <li className="navbar-item">
                        <NavLink to="/reviews" className={linkClass} onClick={() => setMenuOpen(false)}>Reviews</NavLink>
                    </li>

                    {user ? (
                        <>
                            <li className="navbar-item navbar-user" aria-label="Logged in as">
                                {user.email}
                            </li>
                            <li className="navbar-item">
                                <button type="button" className="navbar-logout" onClick={handleLogout}>
                                    Log Out
                                </button>
                            </li>
                        </>
                    ) : (
                        <li className="navbar-item">
                            <NavLink to="/login" className={linkClass} onClick={() => setMenuOpen(false)}>Login</NavLink>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
