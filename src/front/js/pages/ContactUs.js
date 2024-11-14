// src/pages/ContactUs.js
import React from "react";
import "../../styles/contactUs.css";
import adrianImage from "../../img/adrian.jpeg";
import josephImage from "../../img/joseph.jpeg";
import hannahImage from "../../img/hannah.jpeg";

const ContactUs = () => {
    return (
        <div className="contact-us">
            <h2>Meet the Developers</h2>
            <div className="developer-cards-container">
                <div className="developer-card">
                    <img src={adrianImage} alt="Adrian Pina" className="developer-image" />
                    <h3>Adrian Pina</h3>
                    <p>Frontend developer focused on creating responsive and interactive user interfaces.</p>
                    <div className="links">
                        <a href="https://github.com/adrian-pina" target="_blank" rel="noopener noreferrer" className="github-link">
                            <i className="fab fa-github"></i> GitHub
                        </a>
                        <a href="https://www.linkedin.com/in/adrianpina11/" target="_blank" rel="noopener noreferrer" className="linkedin-link">
                            <i className="fab fa-linkedin"></i> LinkedIn
                        </a>
                    </div>
                </div>
                <div className="developer-card">
                    <img src={josephImage} alt="Joseph Gallop" className="developer-image" />
                    <h3>Joseph Gallop</h3>
                    <p>Backend engineer specializing in API development, database management, and server optimization.</p>
                    <div className="links">
                        <a href="https://github.com/joseph-gallop" target="_blank" rel="noopener noreferrer" className="github-link">
                            <i className="fab fa-github"></i> GitHub
                        </a>
                        <a href="https://www.linkedin.com/in/joseph-gallop-9b2b8027/" target="_blank" rel="noopener noreferrer" className="linkedin-link">
                            <i className="fab fa-linkedin"></i> LinkedIn
                        </a>
                    </div>
                </div>
                <div className="developer-card">
                    <img src={hannahImage} alt="Hannah Garcia" className="developer-image" />
                    <h3>Hannah Garcia</h3>
                    <p>Full-stack developer with a passion for sustainable tech solutions and efficient backend systems.</p>
                    <div className="links">
                        <a href="https://github.com/hannah-garcia" target="_blank" rel="noopener noreferrer" className="github-link">
                            <i className="fab fa-github"></i> GitHub
                        </a>
                        <a href="https://www.linkedin.com/in/hannah-kacso-garcia/" target="_blank" rel="noopener noreferrer" className="linkedin-link">
                            <i className="fab fa-linkedin"></i> LinkedIn
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
