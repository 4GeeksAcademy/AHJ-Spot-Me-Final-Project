// src/pages/Profile2.js
import "../../styles/profile2.css";
import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import userIcon from "../../img/user_icon.png"



const Profile2 = () => {
    const { store, actions } = useContext(Context)

    useEffect(() => {
        actions.getMatches();
    }, []);


    const getAvatarUrl = (gender) => {
        switch (gender) {
            case "male":
                return "https://avatar.iran.liara.run/public/boy";
            case "female":
                return "https://avatar.iran.liara.run/public/girl";
            default:
                return userIcon;
        }
    };


    return (
        <div className="matches-container">
            <div className="matches-header">
                <h1>Your Matches</h1>
            </div>

            <div className="card-grid">
                {store.matches && store.matches.length > 0 ? (
                    <div className="card-grid">
                        {store.matches.map(match => (
                            <div className="card" key={match.match_id}>
                                <img
                                    src={match.matched_user.profile_image || getAvatarUrl(match.matched_user.gender)}
                                    alt={`${match.matched_user.name}'s avatar`}
                                    className="match-image"
                                />
                                <div className="card-body">
                                    <h3>{match.matched_user.name}</h3>
                                    <p><strong>City: </strong>{match.matched_user.city}</p>
                                    <p><b>State: </b>{match.matched_user.state}</p>
                                    <p><b>Matched On: </b>{new Date(match.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>

                        ))}
                    </div>
                ) : (
                    <p>No matches found.</p>
                )}
            </div>
        </div >
    );
};

export default Profile2;
