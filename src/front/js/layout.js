// src/layout.js
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import Home from "./pages/home";
import { Spotters } from "./pages/spotters";
import { Single } from "./pages/single";
import injectContext from "./store/appContext";

import Navbar from "./component/navbar";
import Footer from "./component/footer";
import { Login } from "./pages/login";
import { Signup } from "./pages/signup";
import { ForgotPassword } from "./component/forgotpasswordform";
import { ResetPassword } from "./component/resetpasswordform.js";
import Favorites from "./pages/Favorites.js";
import Profile2 from "./pages/Profile2";

import { Profile } from "./pages/profile";
import UserProfile from "./pages/UserProfile";
import SpotterProfiles from "./pages/SpotterProfiles";
import ContactUs from "./pages/ContactUs"; 
import NotFound from "./pages/NotFound";

const Layout = () => {
    const basename = process.env.BASENAME || "";

    if (!process.env.BACKEND_URL || process.env.BACKEND_URL === "") return <BackendURL />;

    return (
        <div className="layout-wrapper">
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <div className="content-wrapper">
                        <Routes>
                            <Route element={<Home />} path="/" />
                            <Route element={<Login />} path="/login" />
                            <Route element={<Signup />} path="/signup" />
                            <Route element={<ForgotPassword />} path="/forgot-password" />
                            <Route element={<Profile />} path="/profile" />
                            <Route element={<ResetPassword />} path="/reset-password" />
                            <Route element={<Favorites />} path="/favorites" />
                            <Route element={<Profile2 />} path="/matches" /> {/* Added route for /matches */}
                            <Route element={<Spotters />} path="/spotters" />
                            <Route element={<Single />} path="/single/:theid" />
                            <Route element={<UserProfile />} path="/user-profile" />
                            <Route element={<SpotterProfiles />} path="/spotter-profiles" />
                            <Route element={<ContactUs />} path="/contact" />
                            <Route element={<NotFound />} path="*" />
                        </Routes>
                    </div>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
