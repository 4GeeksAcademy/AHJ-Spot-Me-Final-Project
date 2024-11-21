import React, { useEffect, useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/login.css";

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    // Check if user is already logged in
    const isLoggedIn = !!localStorage.getItem("authToken");

    // Handle Google Login Response
    const handleGoogleLogin = async (response) => {
        try {
            const res = await fetch(`${process.env.BACKEND_URL}/api/auth-google`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: response.credential }),
            });

            if (res.ok) {
                const data = await res.json();
                const decodedToken = JSON.parse(atob(data.access_token.split('.')[1])); // Decode JWT payload
                const tokenExpiration = decodedToken.exp * 1000; // Convert to milliseconds

                localStorage.setItem("authToken", data.access_token); // Save token
                localStorage.setItem("tokenExpiration", tokenExpiration); // Save expiration time
                navigate("/user-profile"); // Redirect to user profile
            } else {
                const errorData = await res.json();
                console.error("Google Login Error:", errorData);
                alert(errorData.error || "Login failed. Please try again.");
            }
        } catch (error) {
            console.error("Error during Google login:", error);
            alert("An error occurred during Google Sign-In. Please try again.");
        }
    };


    // Initialize Google Sign-In
    useEffect(() => {
        if (!isLoggedIn) {
            /* global google */
            google.accounts.id.initialize({
                client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
                callback: handleGoogleLogin,
            });

            google.accounts.id.renderButton(
                document.getElementById("googleSignInButton"),
                {
                    theme: "outline",
                    size: "large",
                    width: "100%",
                    type: "standard"
                }
            );
        }
    }, [isLoggedIn]);

    // Handle traditional form submission
    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const success = await actions.login(email, password);

        if (success) {
            navigate("/user-profile"); // Redirect to user profile after successful login
        } else {
            alert("Login failed. Please try again.");
        }
    };

    // Sign Out Function
    const signOut = () => {
        localStorage.removeItem("authToken"); // Clear the token
        alert("You have been signed out.");
        navigate("/login"); // Redirect to login page
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h5 className="card-title text-center">Login</h5>
                {!isLoggedIn ? (
                    <>
                        <form id="loginForm" onSubmit={handleFormSubmit}>
                            <div className="mb-3">
                                <label htmlFor="user" className="form-label">Email</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="user"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100 mb-3">Login</button>
                        </form>
                        {/* <p className="text-center m-0">-- OR --</p> */}
                        <div className="divider">
                            <span>or</span>
                        </div>
                        <div id="googleSignInButton" className="google-signin-button mt-3"></div>
                        <Link to="/forgot-password" className="forgot-password-link">
                            Forgot Password?
                        </Link>
                    </>
                ) : (
                    <button onClick={signOut} className="btn btn-secondary w-100 mt-4">
                        Sign Out
                    </button>
                )}
            </div>
        </div>
    );
};

export default LoginForm;
