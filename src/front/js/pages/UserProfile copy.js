import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext.js";
import "../../styles/userProfile.css";
import userIcon from "../../img/user_icon.png"

const UserProfile = () => {
    const { store, actions } = useContext(Context);
    const [profile, setProfile] = useState({
        name: "",
        age: "",
        bio: "",
        gender: null,
        email: "",
        city: "",
        state: "",
        exercise_interests: [],
        gym_preferences: [],
        profile_image: null,
    });

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(profile);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const token = await store.token;
            const response = await fetch(`${process.env.BACKEND_URL}/api/profile`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                setProfile(data.user);
                setFormData(data.user);
            } else {
                const errorData = await response.json();
                setError(errorData.error);
            }
        } catch (error) {
            setError("Error fetching user data");
            console.error("Error fetching user data:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        try {
            const token = await store.token;
            const response = await fetch(`${process.env.BACKEND_URL}/api/edit-profile`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name,
                    bio: formData.bio,
                    age: parseInt(formData.age),
                    gender: formData.gender,
                    city: formData.city,
                    state: formData.state,
                }),
            });

            const data = await response.json();
            if (response.ok && data.user) {
                setProfile(data.user);
                setIsEditing(false);
                setError(null);
            } else {
                const errorData = await response.json();
                setError(errorData.error);
            }
        } catch (error) {
            setError("Error updating profile");
            console.error("Error updating profile:", error);
        }
    };

    // const avatarUrl =
    //     profile.gender === "male"
    //         ? "https://avatar.iran.liara.run/public/boy"
    //         : "https://avatar.iran.liara.run/public/girl";

    //         if (error) {
    //             return (
    //                 <div className="error-container">
    //                     <h2>Error updating profile!</h2>
    //                     <p>Please refresh the page and try again.</p>
    //                 </div>
    //             );
    //         }

    const getAvatarUrl = (gender) => {
        switch (gender?.toLowerCase()) {
            case "male":
                return "https://avatar.iran.liara.run/public/boy";
            case "female":
                return "https://avatar.iran.liara.run/public/girl";
            default:
                return userIcon;
        }
    };


    return (
        <div className="user-profile-page">
            {/* Add message above the user profile */}
            <div className="user-profile-message">
                Filling out your user profile with the most up-to-date information will help us find you better matches!
            </div>

            {/* User Profile Card */}
            <div className="user-profile-container">
                <div className="user-profile">
                    <img src={profile.profile_image || getAvatarUrl(profile.gender)} alt="User Avatar" className="user-avatar" />
                    <h2 className="profile-heading">Your Profile</h2>
                    {isEditing ? (
                        <div className="profile-form">
                            <label>
                                Name:
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                // required
                                />
                            </label>
                            <label>
                                Age:
                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    min="18"
                                    max="120"
                                    required
                                />
                            </label>
                            <label>
                                Bio:
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    maxLength={250}
                                />
                            </label>
                            <label>
                                Gender:
                                <select name="gender" value={formData.gender} onChange={handleChange}>
                                    <option value="prefer_not_to_say">Please pick an option</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="non_binary">Non-binary</option>
                                    <option value="prefer_not_to_say">Prefer not to say</option>
                                </select>
                            </label>
                            <label>
                                City:
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                            <label>
                                State:
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                            <div className="button-group">
                                <button onClick={handleSave} className="btn btn-primary">
                                    Save
                                </button>
                                <button
                                    onClick={() => {
                                        setIsEditing(false);
                                        setFormData(profile);
                                    }}
                                    className="btn btn-secondary"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="profile-details">
                            <p>
                                <strong>Name:</strong> {profile.name}
                            </p>
                            <p>
                                <strong>Age:</strong> {profile.age}
                            </p>
                            <p>
                                <strong>Gender:</strong> {profile.gender}
                            </p>
                            <p>
                                <strong>Bio:</strong> {profile.bio}
                            </p>
                            <p>
                                <strong>City:</strong> {profile.city}
                            </p>
                            <p>
                                <strong>State:</strong> {profile.state}
                            </p>
                            {profile.exercise_interests && profile.exercise_interests.length > 0 && (
                                <p>
                                    <strong>Exercise Interests:</strong>{" "}
                                    {profile.exercise_interests.map((interest) => interest.name).join(", ")}
                                </p>
                            )}
                            {profile.gym_preferences && profile.gym_preferences.length > 0 && (
                                <p>
                                    <strong>Preferred Gyms:</strong>{" "}
                                    {profile.gym_preferences.map((gym) => gym.name).join(", ")}
                                </p>
                            )}
                            <button onClick={() => setIsEditing(true)} className="btn btn-primary">
                                Edit Profile
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
