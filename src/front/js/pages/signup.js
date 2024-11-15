import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
// import { login } from "../services/authService";  // Import the login service
import SignupForm from "../component/signUpForm.js";

import "../../styles/signupform.css"

export const Signup = () => {
    // const { store, actions } = useContext(Context);
    // const navigate = useNavigate();

    return (
        <div className="signup-container">
            <div className="signup-card">
                <SignupForm />
            </div>
        </div>
        );


};


