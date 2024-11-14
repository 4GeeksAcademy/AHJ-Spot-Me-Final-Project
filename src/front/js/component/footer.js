// src/component/footer.js
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="footer bg-dark text-white py-3">
            <div className="container d-flex justify-content-between">
                <div>
                    <p>&copy; 2024 SpotMe. All Rights Reserved.</p>
                </div>
                <div>
                    <Link to="/contact" className="text-decoration-none text-white me-3">Contact Us</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
