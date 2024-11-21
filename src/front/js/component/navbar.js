import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/navbar.css";
import logo from "../../img/logo.png";
const Navbar = () => {
    const { store, actions } = useContext(Context);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the user is logged in by looking for the token in localStorage
        // const token = localStorage.getItem("authToken"); // Updated token name for consistency
        const token = store.token;
        // setIsLoggedIn(!!token); // Update the `isLoggedIn` state based on token presence
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    }

    const handleLogout = async () => {
        try {
            const success = await actions.logout();
            if (success) {
                // setIsLoggedIn(false);
                closeMenu();
                navigate("/login");
            }
        } catch (error) {
            console.error("Error during logout:", error);
        }
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

    const isLoggedIn = !!localStorage.getItem("authToken") || !!localStorage.getItem("token");

    return (
        <nav className="navbar navbar-expand-lg">
            <div className="container">
                <div className="d-flex justify-content-between w-100">
                    {/* Logo aligned to the left */}
                    <Link to="/" className="navbar-brand" onClick={closeMenu}>
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
                                <Link to="/" className="nav-link" onClick={closeMenu}>Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/contact" className="nav-link" onClick={closeMenu}>Contact Us</Link>
                            </li>
                            {isLoggedIn ? (
                                <>
                                    <li className="nav-item">
                                        <Link to="/user-profile" className="nav-link" onClick={closeMenu}>User Profile</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/spotter-profiles" className="nav-link" onClick={closeMenu}>Find Spotters</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/matches" className="nav-link" onClick={closeMenu}>Matches</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/favorites" className="nav-link" onClick={closeMenu}>Favorites</Link>
                                    </li>
                                    <li className="nav-item">
                                        <button className="btn-link nav-link" onClick={handleLogout}>
                                            Logout
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <Link to="/signup" className="nav-link" onClick={closeMenu}>Sign Up</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/login" className="nav-link" onClick={closeMenu}>Login</Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
};
export default Navbar;