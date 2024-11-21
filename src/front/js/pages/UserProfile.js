import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext.js";
import "../../styles/userProfile.css";
import userIcon from "../../img/user_icon.png"

const exerciseCategories = [
    { label: "Strength Training", value: "STRENGTH" },
    { label: "Cardio", value: "CARDIO" },
    { label: "Crossfit", value: "CROSSFIT" },
    { label: "Functional Training", value: "FUNCTIONAL" },
    { label: "Powerlifting", value: "POWERLIFTING" },
    { label: "Bodybuilding", value: "BODYBUILDING" },
    { label: "HIIT", value: "HIIT" },
    { label: "Yoga", value: "YOGA" },
    { label: "Calisthenics", value: "CALISTHENICS" },
];

const daysOfWeek = [
    { label: "Monday", value: "MONDAY" },
    { label: "Tuesday", value: "TUESDAY" },
    { label: "Wednesday", value: "WEDNESDAY" },
    { label: "Thursday", value: "THURSDAY" },
    { label: "Friday", value: "FRIDAY" },
    { label: "Saturday", value: "SATURDAY" },
    { label: "Sunday", value: "SUNDAY" },
];

const timeOfDay = [
    { label: "Early Morning (5:00 AM - 8:00 AM)", value: "EARLY_MORNING" },
    { label: "Morning (8:00 AM - 11:00 AM)", value: "MORNING" },
    { label: "Midday (11:00 AM - 2:00 PM)", value: "MIDDAY" },
    { label: "Afternoon (2:00 PM - 5:00 PM)", value: "AFTERNOON" },
    { label: "Evening (5:00 PM - 8:00 PM)", value: "EVENING" },
    { label: "Night (8:00 PM - 11:00 PM)", value: "NIGHT" },
];


const UserProfile = () => {
    const { store, actions } = useContext(Context);
    const [profile, setProfile] = useState({
        name: "",
        age: "",
        bio: "",
        gender: "",
        email: "",
        city: "",
        state: "",
        exercise_interests: [],
        workout_schedules: [],
        profile_image: null,
    });
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(profile);
    const [error, setError] = useState(null);
    const [selectedDays, setSelectedDays] = useState([]);
    const [selectedTimes, setSelectedTimes] = useState([]);
    const [selectedInterests, setSelectedInterests] = useState([]);


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
                setSelectedDays((data.user?.workout_schedules || []).map((item) => item.day_of_week));
                setSelectedTimes((data.user?.workout_schedules || []).map((item) => item.time_slot));
                // setSelectedInterests((data.user?.exercise_interests || []).map((interest) => interest.name));
                setSelectedInterests((data.user?.exercise_interests || []).map((interest) => {
                    // Remove everything after the first space and convert to uppercase
                    const categoryName = interest.name.split(' ')[0].toUpperCase();
                    return categoryName;
                }));
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

    const handleCheckboxChange = (type, value) => {
        if (type === "days") {
            setSelectedDays((prev) =>
                prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
            );
        } else if (type === "times") {
            setSelectedTimes((prev) =>
                prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
            );
        } else if (type === "interests") {
            setSelectedInterests((prev) =>
                prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
            );
        }
    };

    // const handleSave = async () => {
    //     try {
    //         const token = await store.token;
    //         const response = await fetch(`${process.env.BACKEND_URL}/api/edit-profile`, {
    //             method: "PUT",
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify({
    //                 name: formData.name,
    //                 bio: formData.bio,
    //                 age: parseInt(formData.age),
    //                 gender: formData.gender,
    //                 city: formData.city,
    //                 state: formData.state,
    //             }),
    //         });

    //         const data = await response.json();
    //         if (response.ok && data.user) {
    //             setProfile(data.user);
    //             setIsEditing(false);
    //             setError(null);
    //         } else {
    //             const errorData = await response.json();
    //             setError(errorData.error);
    //         }
    //     } catch (error) {
    //         setError("Error updating profile");
    //         console.error("Error updating profile:", error);
    //     }
    // };
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
                    ...formData,
                    workout_schedules: selectedDays.flatMap((day) =>
                        selectedTimes.map((time) => ({ day_of_week: day, time_slot: time }))
                    ),
                    exercise_interests: selectedInterests,
                }),
            });

            const data = await response.json();
            if (response.ok && data.user) {
                setProfile(data.user);
                setIsEditing(false);
                setError(null);
            } else {
                setError(data.error || "Failed to update profile");
            }
        } catch (error) {
            setError("Error updating profile");
            console.error("Error updating profile:", error);
        }
    };

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

                            {/* Exercise Interests */}
                            <div className="section">
                                <h3>Exercise Interests</h3>
                                <div className="checkbox-group">
                                    {exerciseCategories.map((category) => (
                                        <div className="checkbox-item" key={category.value}>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedInterests.includes(category.value)}
                                                    onChange={() => handleCheckboxChange("interests", category.value)}
                                                />
                                                {category.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Workout Schedule */}
                            <div className="section">
                                <h3>Workout Schedule</h3>
                                <h4>Days of the Week</h4>
                                <div className="checkbox-group">
                                    {daysOfWeek.map((day) => (
                                        <div className="checkbox-item" key={day.value}>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedDays.includes(day.value)}
                                                    onChange={() => handleCheckboxChange("days", day.value)}
                                                />
                                                {day.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>

                                <h4>Time of Day</h4>
                                <div className="checkbox-group">
                                    {timeOfDay.map((time) => (
                                        <div className="checkbox-item" key={time.value}>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedTimes.includes(time.value)}
                                                    onChange={() => handleCheckboxChange("times", time.value)}
                                                />
                                                {time.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

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
                            {/* In the non-editing view, after the basic info */}
                            <p><strong>Exercise Interests:</strong></p>
                            <ul>
                                {(profile.exercise_interests || []).map((interest) => (
                                    <li key={interest.id}>{interest.name}</li>
                                ))}
                            </ul>
                            <p><strong>Workout Schedule:</strong></p>
                            <ul>
                                {selectedDays.map((day, index) => (
                                    <li key={index}>
                                        {day}: {selectedTimes.join(", ")}
                                    </li>
                                ))}
                            </ul>
                            {/* {profile.exercise_interests && profile.exercise_interests.length > 0 && (
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
                            )} */}
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
