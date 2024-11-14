import React from "react";
import "../../styles/contactUs.css";

const ContactUs = () => {
    return (
        <div className="contact-us">
            <h2>Meet the Developers</h2>
            <div className="developer-cards-container">
                <div className="developer-card">
                    <h3>Adrian Pina</h3>
                    <p>Frontend developer focused on creating responsive and interactive user interfaces.</p>
                    <a href="https://github.com/adrian-pina" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-github"></i> GitHub
                    </a>
                </div>
                <div className="developer-card">
                    <h3>Hannah Garcia</h3>
                    <p>Full-stack developer with a passion for sustainable tech solutions and efficient backend systems.</p>
                    <a href="https://github.com/hannah-garcia" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-github"></i> GitHub
                    </a>
                </div>
                <div className="developer-card">
                    <h3>Joseph Gallop</h3>
                    <p>Backend engineer specializing in API development, database management, and server optimization.</p>
                    <a href="https://github.com/joseph-gallop" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-github"></i> GitHub
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
