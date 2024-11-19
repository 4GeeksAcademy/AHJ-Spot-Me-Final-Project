import React from "react";
import { Link } from "react-router-dom";
import "../../styles/home.css";
import SubscribeSection from "../component/SubscribeSection"; // Import the SubscribeSection component
import spottingVideo from "../../../../public/spotting-gym.mp4";

const Home = () => {
    return (
        <div className="home">
            {/* Hero Section */}
            <div className="hero-section">
                <video className="hero-video" autoPlay loop muted>
                    <source src={spottingVideo} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div className="hero-overlay">
                    <div className="hero-content">
                        <h1>Want to hit the gym but have no one to spot you?</h1>
                        <p>Sign up to get matched with someone in your area</p>
                        <Link to="/signup">
                            <button className="btn">Get Started</button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <section className="features-section">
                <div className="feature-card">
                    <i className="fas fa-check-circle feature-icon"></i>
                    <h3>Spotters by Exercise Interest</h3>
                </div>
                <div className="feature-card">
                    <i className="fas fa-check-circle feature-icon"></i>
                    <h3>Spotters by Geographic Distance</h3>
                </div>
                <div className="feature-card">
                    <i className="fas fa-check-circle feature-icon"></i>
                    <h3>Spotters by Gym Time</h3>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-overlay">
                    <h2>Don't limit your exercises cause you don’t know anyone at the gym</h2>
                    <p className="quote">"A spotter is more than just a safety net; it's a partner pushing you to reach your full potential."</p>
                </div>
            </section>

            {/* Subscribe Section */}
            <SubscribeSection />
        </div>
    );
};

export default Home;
