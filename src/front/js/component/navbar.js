import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/navbar.css";
import logo from "../../img/logo.png"; // Import the logo

const Navbar = () => {
    const navigate = useNavigate();
    const { actions } = useContext(Context);
   
    // Check if the user is logged in
    const isLoggedIn = !!localStorage.getItem("authToken") || !!localStorage.getItem("token");

    const handleSignOut = async () => {
        const success = await actions.logout();
        if (success) {
            alert("You have been signed out.");
            navigate("/login");
        } else {
            alert("Error signing out. Please try again.");
        }
    };

    return (
        <nav className="navbar navbar-expand-lg">
            <div className="container">
                <Link to="/" className="navbar-brand">
                    <img src={logo} alt="SpotMe Logo" className="navbar-logo" />
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link to="/" className="nav-link">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/contact" className="nav-link">Contact Us</Link>
                        </li>
                        {/* {isLoggedIn ? ( */}
                            <>
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
                                    <button onClick={handleSignOut} className="btn btn-outline-primary">Sign Out</button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link to="/login" className="nav-link">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/signup" className="nav-link">Sign Up</Link>
                                </li>
                            </>
                        {/* )} */}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
