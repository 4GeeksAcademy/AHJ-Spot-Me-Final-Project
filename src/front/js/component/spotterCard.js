import React, { useContext } from "react";
import { Context } from "../store/appContext";
import PropTypes from "prop-types";
import "../../styles/spotterCard.css";
import userIcon from "../../img/user_icon.png";

const exerciseCategories = [
    { label: "Strength Training", value: "Strength Training" },
    { label: "Cardio", value: "Cardio" },
    { label: "Crossfit", value: "Crossfit" },
    { label: "Functional Training", value: "Functional Training" },
    { label: "Powerlifting", value: "Powerlifting" },
    { label: "Bodybuilding", value: "Bodybuilding" },
    { label: "HIIT", value: "HIIT" },
    { label: "Yoga", value: "Yoga" },
    { label: "Calisthenics", value: "Calisthenics" },
    { label: "Olympic Weightlifting", value: "Olympic Weightlifting" },
];

const SpotterCard = ({ spotter }) => {
    const { actions } = useContext(Context);

    const handleSpotMeClick = async () => {
        const results = await actions.addToFavorites(spotter.id);
        if (results.success) {
            if (results.isMatch) {
                alert("It's A Match! You can now find this user in your matches!");
            } else {
                alert("They have been added to your favorites!");
            }
            actions.getAllUsers(); // Refresh the users list
        } else {
            alert("Failed to add to favorites. Please try again.");
        }
    };

    const getAvatarUrl = (gender) => {
        switch (gender.toLowerCase()) {
            case "male":
                return "https://avatar.iran.liara.run/public/boy";
            case "female":
                return "https://avatar.iran.liara.run/public/girl";
            default:
                return userIcon; // Default placeholder avatar
        }
    };

    const avatarUrl = getAvatarUrl(spotter.gender);

    return (
        <div className="spotter-card">
            <img
                src={spotter.profileImage || avatarUrl}
                alt={`${spotter.name}'s avatar`}
                className="spotter-image"
            />
            <div className="card-body">
                <h3 className="card-title">{spotter.name}</h3>
                <p className="card-text"><strong>Age:</strong> {spotter.age || "Not provided"}</p>
                <p className="card-text"><strong>Gender:</strong> {spotter.gender || "Unknown"}</p>
                <p className="card-text"><strong>City:</strong> {spotter.city || "Not provided"}</p>
                <p className="card-text"><strong>State:</strong> {spotter.state || "Not provided"}</p>
                <p className="card-text"><strong>Exercise Interests:</strong></p>
                <ul>
                    {(spotter.exerciseInterests || []).map((interest, index) => (
                        <li key={index}>{interest.name}</li>
                    ))}
                </ul>

                <p className="card-text"><strong>Gym Preferences:</strong></p>
                <ul>
                    {(spotter.gymPreferences || []).map((gym, index) => (
                        <li key={index}>
                            {gym.name} - {gym.city}, {gym.state}
                        </li>
                    ))}
                </ul>

                <p className="card-text"><strong>Workout Schedule:</strong></p>
                <ul>
                    {(spotter.workoutSchedules || []).map((schedule, index) => (
                        <li key={index}>
                            {schedule.day_of_week} - {schedule.time_slot}
                        </li>
                    ))}
                </ul>

                <button className="btn btn-spot-me" onClick={handleSpotMeClick}>
                    Spot Me!
                </button>
            </div>
        </div>
    );
};

SpotterCard.propTypes = {
    spotter: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        age: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        gender: PropTypes.string,
        city: PropTypes.string,
        state: PropTypes.string,
        fitnessLevel: PropTypes.string,
        exerciseInterests: PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.string.isRequired,
            })
        ),
        gymPreferences: PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.string.isRequired,
                city: PropTypes.string.isRequired,
                state: PropTypes.string.isRequired,
            })
        ),
        workoutSchedules: PropTypes.arrayOf(
            PropTypes.shape({
                day_of_week: PropTypes.string.isRequired,
                time_slot: PropTypes.string.isRequired,
            })
        ),
        profileImage: PropTypes.string,
    }).isRequired,
};

export default SpotterCard;
