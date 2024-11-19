import React, { useState } from "react";
import "../../styles/subscribeSection.css"; // Ensure this file contains your original styles
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const SubscribeSection = () => {
    const [email, setEmail] = useState(""); // State to track email input
    const [name, setName] = useState(""); // State to track name input
    const [message, setMessage] = useState(""); // State for modal message
    const [modalTitle, setModalTitle] = useState(""); // State for modal title
    const [showModal, setShowModal] = useState(false); // State to toggle modal visibility
    
    const handleSubscribe = async (e) => {
        e.preventDefault(); // Prevent form submission from refreshing the page

        try {
            const response = await fetch(`${BACKEND_URL}/api/subscriber`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, name }),
            });
            

            const result = await response.json();
            if (response.ok) {
                setModalTitle("You're subscribed!"); // Success title
                setMessage("Check your email for occasional updates from the Spot.Me team.");
            } else {
                setModalTitle("Oops...");
                setMessage(result.error || "Something went wrong. Please try again.");
            }
        } catch (error) {
            setModalTitle("Oops...");
            setMessage("An error occurred. Please try again.");
        }

        setShowModal(true); // Show the modal with the result message
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
                        value={email} // Bind email input to state
                        onChange={(e) => setEmail(e.target.value)} // Update state on input change
                        required
                    />
                    <input
                        type="text"
                        className="contact-input"
                        placeholder="Full name"
                        value={name} // Bind name input to state
                        onChange={(e) => setName(e.target.value)} // Update state on input change
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
                        <h4>{modalTitle}</h4>
                        <p>{message}</p>
                        <button className="close-button" onClick={() => setShowModal(false)}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubscribeSection;
