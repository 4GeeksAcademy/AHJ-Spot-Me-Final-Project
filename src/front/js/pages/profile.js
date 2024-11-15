import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";

export const Profile = () => {
    const { store, actions } = useContext(Context);
    const [profile, setProfile] = useState({
        age: "",
        bio: "",
        gender: "",
        name: "",
        email: "",
        // profile_picture: ""

    });

    // Fetch profile information on component mount
    useEffect(() => {
        actions.getProfile().then((data) => {
            if (data && data.profile_complete) {
                setProfile({
                    age: data.age,
                    bio: data.bio,
                    gender: data.gender,
                    name: data.name,
                    email: data.email
                    // profile_picture: data.profile_picture
                });
            }
        });
    }, []);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // Submit updated profile data
    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await actions.updateProfile(profile);
        if (success) {
            alert("Profile updated successfully!");
        } else {
            alert("Failed to update profile.");
        }
    };

    return (
        <div className="container mt-5">
            <h2>Update Profile</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" value={profile.email} onChange={handleChange} className="form-control" disabled />
                </div>
                <div className="form-group">
                    <label>Name</label>
                    <input type="text" name="name" value={profile.name} onChange={handleChange} className="form-control" />
                </div>
                <div className="form-group">
                    <label>Age</label>
                    <input type="number" name="age" value={profile.age} onChange={handleChange} className="form-control" />
                </div>
                <div className="form-group">
                    <label>Gender</label>
                    <select name="gender" value={profile.gender} onChange={handleChange} className="form-control">
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Bio</label>
                    <textarea name="bio" value={profile.bio} onChange={handleChange} className="form-control" />
                </div>
                {/* <div className="form-group">
                    <label>Profile Picture URL</label>
                    <input type="text" name="profile_picture" value={profile.profile_picture} onChange={handleChange} className="form-control" />
                </div> */}
                <button type="submit" className="btn btn-primary mt-3">Save Changes</button>
            </form>
        </div>
    );
};
