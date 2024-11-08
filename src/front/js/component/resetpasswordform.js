// ResetPassword.js
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../services/authService"; // Service to handle password reset

export const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { token } = useParams(); // Assume the token is passed in the URL as a route param
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await resetPassword(token, password); // Passes token and new password
            if (response.success) {
                alert("Password reset successfully.");
                navigate("/login"); // Redirect to login page after successful reset
            } else {
                alert("Password reset failed. Please try again.");
            }
        } catch (error) {
            console.error("Error during password reset:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="text-center mt-5">
            <h1>Reset Password</h1>
            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3 w-25 mx-auto">
                <input
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="form-control"
                />
                <input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="form-control"
                />
                <button
                    type="submit"
                    className="btn btn-primary w-100 mt-3"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Resetting..." : "Reset Password"}
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;
