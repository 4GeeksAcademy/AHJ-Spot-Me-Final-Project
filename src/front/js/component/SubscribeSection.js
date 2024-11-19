import React, { useState } from "react";
import "../../styles/subscribeSection.css"; // Ensure this file contains your original styles

const SubscribeSection = () => {
    const [showModal, setShowModal] = useState(false);

    const handleSubscribe = async () => {
        try {
            const response = await fetch("/api/subscribers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            });
    
            const result = await response.json();
            if (response.ok) {
                setMessage("You're subscribed! Check your email for occasional updates from the Spot.Me team.");
            } else {
                setMessage(result.error || "Something went wrong. Please try again.");
            }
            setShowModal(true);
        } catch (error) {
            setMessage("An error occurred. Please try again.");
            setShowModal(true);
        }
    };
    
    

    return (
        <div className="subscribe-section">
            <h3>Get In Touch</h3>
            <form className="contact-form" onSubmit={handleSubscribe}>
                <div className="contact-form-row">
                    <input
                        type="email"
                        className="contact-input"
                        placeholder="Email address"
                        required
                    />
                    <input
                        type="text"
                        className="contact-input"
                        placeholder="Full name"
                        required
                    />
                </div>
                <button className="subscribe-button" type="submit">
                    Subscribe
                </button>
            </form>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h4>You're subscribed!</h4>
                        <p>
                            Check your email for occasional updates from the
                            Spot.Me team.
                        </p>
                        <button
                            className="close-button"
                            onClick={() => setShowModal(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubscribeSection;
