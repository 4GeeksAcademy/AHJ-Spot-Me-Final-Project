import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../services/authService"; 

export const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false); 
    const navigate = useNavigate();

    const handleClick = async () => {
        if (!email) {
            alert("Please enter your email.");
            return;
        }

        setIsSubmitting(true); 

        try {
            const resp = await forgotPassword(email); 
            if (resp) {
                console.log("Password reset email sent successfully");
                alert("If your email is registered, you will receive a password reset link shortly.");
                navigate("/login"); // Redirect to the login page after successful request
            } else {
                console.log("Failed to send password reset email");
                alert("Failed to send password reset email. Please try again.");
            }
        } catch (error) {
            console.error("Error during password reset:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false); // Re-enable the button after the request is done
        }
    };

    return (
        <div className="text-center mt-5">
            <h1>Forgot Password</h1>

            <div className="d-flex flex-column gap-3 w-25 mx-auto">
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button
                    className="btn btn-primary w-50 mx-auto mt-3"
                    onClick={handleClick}
                    disabled={isSubmitting} // Disable the button while submitting
                >
                    {isSubmitting ? "Sending..." : "Send Reset Link"}
                </button>
            </div>
        </div>
    );
};
