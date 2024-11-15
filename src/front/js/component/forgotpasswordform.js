// ForgotPassword.js
import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setMessage("");

        try {
            const response = await actions.forgotPassword(email);
            setMessage(response.message);

            if (response.success) {
                setTimeout(() => {
                    navigate("/login");
                }, 3000); // Redirect after 3 seconds
            }
        } catch (error) {
            setMessage("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="text-center mt-5">
            <h1>Forgot Password</h1>
            {message && (
                <div className={`alert ${message.includes("error") ? "alert-danger" : "alert-success"}`}>
                    {message}
                </div>
            )}
            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3 w-25 mx-auto">
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="form-control mt-3"
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
