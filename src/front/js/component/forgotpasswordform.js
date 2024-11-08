// ForgotPassword.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { forgotPassword } from "../services/authService"; // Service to handle password reset request

export const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await forgotPassword(email); // Sends the reset link to the user's email
            if (response.success) {
                alert("A reset link has been sent to your email.");
                navigate("/login"); // Redirect to login page
            } else {
                alert("Failed to send reset link. Please try again.");
            }
        } catch (error) {
            console.error("Error during password reset request:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="text-center mt-5">
            <h1>Forgot Password</h1>
            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3 w-25 mx-auto">
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="form-control"
                />
                <button
                    type="submit"
                    className="btn btn-primary w-100 mt-3"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Sending..." : "Send Reset Link"}
                </button>
            </form>
        </div>
    );
};

export default ForgotPassword;
