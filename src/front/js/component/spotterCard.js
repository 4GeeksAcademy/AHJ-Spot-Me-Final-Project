// src/component/spotterCard.js
import React, { useState } from "react";
import PropTypes from "prop-types";
import "../../styles/spotterCard.css";

const SpotterCard = ({ spotter, onViewProfile }) => {
    const [isMatched, setIsMatched] = useState(false);

    const handleSpotMeClick = () => {
        setIsMatched(true);
        alert("It's a match!");
        // Additional logic for handling the match can go here
    };

    // Determine the avatar URL based on gender
    const avatarUrl = spotter.gender === "male"
        ? "https://avatar.iran.liara.run/public/boy"
        : "https://avatar.iran.liara.run/public/girl";

    return (
        <div className="spotter-card">
            <img 
                src={spotter.profileImage || avatarUrl} 
                alt={`${spotter.name}'s avatar`} 
                className="spotter-image" 
            />
            <div className="card-body">
                <h3 className="card-title">{spotter.name}</h3>
                <p className="card-text">Fitness Level: {spotter.fitnessLevel}</p>
                <p className="card-text">Preferred Days: {spotter.preferredDays.join(", ")}</p>
                <p className="card-text">Preferred Time: {spotter.preferredTime}</p>
                
                {/* View Full Profile Button */}
                <button
                    className="btn btn-view-profile"
                    onClick={() => onViewProfile(spotter.id)}
                >
                    View Full Profile
                </button>

                {/* Spot Me Button */}
                <button
                    className={`btn btn-spot-me ${isMatched ? "matched" : ""}`}
                    onClick={handleSpotMeClick}
                    disabled={isMatched}
                >
                    {isMatched ? "Matched!" : "Spot Me!"}
                </button>
            </div>
        </div>
    );
};

SpotterCard.propTypes = {
    spotter: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        gender: PropTypes.string, // Optional gender field
        fitnessLevel: PropTypes.string.isRequired,
        preferredDays: PropTypes.arrayOf(PropTypes.string).isRequired,
        preferredTime: PropTypes.string.isRequired,
        profileImage: PropTypes.string,
    }).isRequired,
    onViewProfile: PropTypes.func.isRequired,
};

export default SpotterCard;
