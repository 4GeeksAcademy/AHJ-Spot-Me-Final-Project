// src/pages/home.js
import React from "react";
import { Link } from "react-router-dom";
import "../../styles/home.css";

const Home = () => {
    return (
        <div className="home">
            {/* Hero Section */}
            <header className="hero-section">
                <div className="hero-content">
                    <h1>Want to hit the gym but have no one to spot you?</h1>
                    <p>Sign up to get matched with someone in your area</p>
                    <Link to="/signup">
                        <button className="btn btn-primary">Get Started</button>
                    </Link>
                </div>
                <div className="hero-image">
                    <img src="https://images.pexels.com/photos/4853664/pexels-photo-4853664.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Gym partners" />
                </div>
            </header>

            {/* Features Section */}
            <section className="features-section">
                <div className="feature">
                    <i className="feature-icon">✔️</i>
                    <h3>Spotters by Exercise Interest</h3>
                </div>
                <div className="feature">
                    <i className="feature-icon">✔️</i>
                    <h3>Spotters by Geographic Distance</h3>
                </div>
                <div className="feature">
                    <i className="feature-icon">✔️</i>
                    <h3>Spotters by Gym Time</h3>
                </div>
            </section>

            {/* Additional CTA Section */}
            <section className="cta-section">
                <div className="cta-content">
                    <h2>Don't limit your exercises cause you don’t know anyone at the gym</h2>
                    <p>Find workout partners near you and make progress together.</p>
                </div>
                <div className="cta-image">
                    <img src="https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=600" alt="People at the gym" />
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="testimonials-section">
                <blockquote>
                    <p>"A spotter is more than just a safety net; it's a partner pushing you to reach your full potential."</p>
                </blockquote>
            </section>

            {/* Contact Form Section */}
            <section className="contact-section">
                <h3>Get In Touch</h3>
                <form>
                    <input type="email" placeholder="Email address" required />
                    <input type="text" placeholder="Full name" required />
                    <button type="submit" className="btn btn-secondary">Subscribe</button>
                </form>
            </section>
        </div>
    );
};

export default Home;
