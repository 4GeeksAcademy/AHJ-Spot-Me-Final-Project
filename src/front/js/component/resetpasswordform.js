// ResetPassword.js
import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

export const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const { actions } = useContext(Context);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    // const { token } = useParams(); // Assume the token is passed in the URL as a route param


    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage("");

        if (!token) {
            setMessage("Invalid reset link. Please request a new one.");
            return;
        }

        if (password !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        if (password.length < 8) {
            setMessage("Password must be at least 8 characters long.");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await actions.resetPassword(token, password);
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
            <h1>Reset Password</h1>
            {message && (
                <div className={`alert ${message.includes("error") ? "alert-danger" : "alert-success"}`}>
                    {message}
                </div>
            )}
            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3 w-25 mx-auto">
                <input
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="form-control mt-3"
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
