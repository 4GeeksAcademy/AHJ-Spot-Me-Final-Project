import React, { useEffect, useState, useContext } from "react";
import { Context } from "../store/appContext"
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { store, actions } = useContext(Context)
    const navigate = useNavigate()

    // Handle Google Login Response
    const handleGoogleLogin = async (response) => {
        console.log("Google Sign-In Response:", response);

        try {
            const res = await fetch("/api/google-auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: response.credential })
            });
            const data = await res.json();



            localStorage.setItem('authToken', data.access_token);

        } catch (error) {
            console.error("Error during Google login:", error);
            alert("Login failed. Please try again.");
        }

    };

    // Initialize Google Sign-In
    useEffect(() => {
        /* global google */
        google.accounts.id.initialize({
            client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,  // Uses environment variable
            callback: handleGoogleLogin
        });

        google.accounts.id.renderButton(
            document.getElementById("googleSignInButton"),
            { theme: "outline", size: "large" } // Customize button appearance
        );
    }, []);

    // Handle traditional form submission
    const handleFormSubmit = async (event) => {
        event.preventDefault();
        let success = await actions.login(email, password)
        if (!success) {
            alert("login failed please try again later")
        } else {
            navigate("/")
        }
    };

    return (
        <div className="container">
            <div className="card mt-3" style={{ width: "20rem" }}>
                <div className="card-body">
                    <h5 className="card-title text-center">Login</h5>
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
                    <p className="m-0">-- OR --</p>
                    <div id="googleSignInButton" className="mt-3"></div> {/* Google button placeholder */}
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
