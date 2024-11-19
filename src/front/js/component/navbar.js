import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../styles/navbar.css";
import logo from "../../img/logo.png";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <nav className="navbar navbar-expand-lg">
            <div className="container">
                <div className="d-flex justify-content-between w-100">
                    {/* Logo aligned to the left */}
                    <Link to="/" className="navbar-brand">
                        <img src={logo} alt="SpotMe Logo" className="navbar-logo" />
                    </Link>

                    {/* Hamburger menu */}
                    <button
                        className={`navbar-toggler ${isMenuOpen ? "active" : ""}`}
                        type="button"
                        onClick={toggleMenu}
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    {/* Navbar items aligned to the right */}
                    <div
                        className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`}
                    >
                        <ul className="navbar-nav ms-auto align-items-center">
                            <li className="nav-item">
                                <Link to="/" className="nav-link">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/contact" className="nav-link">Contact Us</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/user-profile" className="nav-link">User Profile</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/spotter-profiles" className="nav-link">Find Spotters</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/matches" className="nav-link">Matches</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/favorites" className="nav-link">Favorites</Link>
                            </li>
                            <li className="nav-item">
                                <button className="btn btn-link nav-link">Logout</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
