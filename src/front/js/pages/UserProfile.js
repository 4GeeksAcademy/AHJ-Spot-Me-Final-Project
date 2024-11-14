// src/pages/UserProfile.js
import React, { useState } from "react";
import "../../styles/userProfile.css";

const UserProfile = () => {
    const [profile, setProfile] = useState({
        name: "John Doe",
        age: 28,
        bio: "Fitness enthusiast looking for a workout buddy.",
        fitnessLevel: "Intermediate",
        preferredDays: ["Monday", "Wednesday", "Friday"],
        preferredTime: "Evening",
        gender: "Male",
    });

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(profile);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === "checkbox") {
            if (checked) {
                setFormData({ ...formData, preferredDays: [...formData.preferredDays, value] });
            } else {
                setFormData({
                    ...formData,
                    preferredDays: formData.preferredDays.filter(day => day !== value),
                });
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSave = () => {
        setProfile(formData);
        setIsEditing(false);
    };

    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const fitnessLevels = ["Beginner", "Intermediate", "Advanced"];

    return (
        <div className="user-profile">
            <h2>Your Profile</h2>
            {isEditing ? (
                <div className="profile-form">
                    <label>
                        Name:
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Age:
                        <input
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            min="1"
                        />
                    </label>
                    <label>
                        Bio:
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Fitness Level:
                        <select name="fitnessLevel" value={formData.fitnessLevel} onChange={handleChange}>
                            {fitnessLevels.map(level => (
                                <option key={level} value={level}>{level}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Preferred Days:
                        <div className="checkbox-group">
                            {daysOfWeek.map(day => (
                                <label key={day} className="checkbox-item">
                                    <input
                                        type="checkbox"
                                        name="preferredDays"
                                        value={day}
                                        checked={formData.preferredDays.includes(day)}
                                        onChange={handleChange}
                                    />
                                    {day}
                                </label>
                            ))}
                        </div>
                    </label>
                    <label>
                        Preferred Time:
                        <input
                            type="text"
                            name="preferredTime"
                            value={formData.preferredTime}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Gender:
                        <select name="gender" value={formData.gender} onChange={handleChange}>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </label>
                    <div className="button-group">
                        <button onClick={handleSave} className="btn btn-primary">Save</button>
                        <button onClick={() => setIsEditing(false)} className="btn btn-secondary">Cancel</button>
                    </div>
                </div>
            ) : (
                <div>
                    <p><strong>Name:</strong> {profile.name}</p>
                    <p><strong>Age:</strong> {profile.age}</p>
                    <p><strong>Bio:</strong> {profile.bio}</p>
                    <p><strong>Fitness Level:</strong> {profile.fitnessLevel}</p>
                    <p><strong>Preferred Days:</strong> {profile.preferredDays.join(", ")}</p>
                    <p><strong>Preferred Time:</strong> {profile.preferredTime}</p>
                    <p><strong>Gender:</strong> {profile.gender}</p>
                    <button onClick={() => setIsEditing(true)} className="btn btn-primary">Edit Profile</button>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
