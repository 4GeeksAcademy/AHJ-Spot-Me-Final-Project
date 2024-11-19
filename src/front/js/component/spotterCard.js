// src/component/spotterCard.js
import React, { useContext } from "react";
import { Context } from "../store/appContext";
import PropTypes from "prop-types";
import "../../styles/spotterCard.css";
import userIcon from "../../img/user_icon.png"


const SpotterCard = ({ spotter }) => {
    const { actions } = useContext(Context);

    const handleSpotMeClick = async () => {
        const results = await actions.addToFavorites(spotter.id);
        if (results.success) {
            if (results.isMatch) {
                alert("It's A Match! You can nowfind this user in your matches!");
            } else {
                alert("They have been added to your favorites!");
            }

            // actions.getPotentialSpotters();
            actions.getAllUsers();
        } else {
            alert("Failed to add to favorites.  Please try again.");
        }

    };

    // Determine the avatar URL based on gender
    // const avatarUrl = spotter.gender === "male"
    //     ? "https://avatar.iran.liara.run/public/boy"
    //     : "https://avatar.iran.liara.run/public/girl";
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
    const avatarUrl = getAvatarUrl(spotter.gender);

    // TODO: DON'T SHOW THE USERS THAT YOU HAVE ALREADY SENT A REQUEST TO (AND/OR CONNECTED)
    return (
        <div className="spotter-card">
            <img
                src={spotter.profileImage || avatarUrl}
                alt={`${spotter.name}'s avatar`}
                className="spotter-image"
            />
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <h3 className="card-title">{spotter.name}</h3>
                    {/* Spot Me Button */}
                    <button
                        className={`btn btn-spot-me ms-2`}
                        onClick={handleSpotMeClick}
                    >
                        Spot Me!
                    </button>
                </div>


                <p className="card-text">Gender: {spotter.gender}</p>
                <p className="card-text">City: {spotter.city}</p>
                <p className="card-text">State: {spotter.state}</p>

                {/* View Full Profile Button */}
                {/* <button
                    className="btn btn-view-profile"
                    onClick={() => onViewProfile(spotter.id)}
                >
                    View Full Profile
                </button> */}

            </div>
        </div>
    );
};

// SpotterCard.propTypes = {
//     spotter: PropTypes.shape({
//         id: PropTypes.number.isRequired,
//         name: PropTypes.string.isRequired,
//         gender: PropTypes.string, // Optional gender field
//         fitnessLevel: PropTypes.string.isRequired,
//         exerciseInterests: PropTypes.string,
//         preferredDays: PropTypes.arrayOf(PropTypes.string).isRequired,
//         preferredTime: PropTypes.string.isRequired,
//         profileImage: PropTypes.string,
//     }).isRequired,
//     onViewProfile: PropTypes.func.isRequired,
// };

export default SpotterCard;
