// src/pages/SpotterProfiles.js
import React, { useState, useEffect } from "react";
import SpotterCard from "../component/spotterCard";
import "../../styles/spotterProfiles.css";

const SpotterProfiles = () => {
    const [filters, setFilters] = useState({
        name: "",
        age: "",
        exerciseInterests: [],
        fitnessLevel: "",
        gender: "",
        gymMembership: "",
        preferredDays: [],
        preferredTime: "",
        preferredSpottingStyle: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    const handleMultiSelectChange = (e, field) => {
        const { options } = e.target;
        const selectedValues = Array.from(options)
            .filter((opt) => opt.selected)
            .map((opt) => opt.value);
        setFilters((prevFilters) => ({
            ...prevFilters,
            [field]: selectedValues,
        }));
    };

    const spotters = [
        // This would be populated with data from your backend
        { name: "Jane Doe", age: 30, exerciseInterests: ["Cardio"], fitnessLevel: "Advanced", gender: "Female", gymMembership: "Gold's Gym", preferredDays: ["Monday"], preferredTime: "Morning", preferredSpottingStyle: "Hands-on" },
        { name: "John Smith", age: 25, exerciseInterests: ["Strength"], fitnessLevel: "Beginner", gender: "Male", gymMembership: "Planet Fitness", preferredDays: ["Wednesday"], preferredTime: "Evening", preferredSpottingStyle: "Verbal" },
    ];

    const filteredSpotters = spotters.filter((spotter) => {
        return (
            (filters.name === "" || spotter.name.toLowerCase().includes(filters.name.toLowerCase())) &&
            (filters.age === "" || spotter.age.toString() === filters.age) &&
            (filters.exerciseInterests.length === 0 || filters.exerciseInterests.every(interest => spotter.exerciseInterests.includes(interest))) &&
            (filters.fitnessLevel === "" || spotter.fitnessLevel === filters.fitnessLevel) &&
            (filters.gender === "" || spotter.gender === filters.gender) &&
            (filters.gymMembership === "" || spotter.gymMembership.toLowerCase().includes(filters.gymMembership.toLowerCase())) &&
            (filters.preferredDays.length === 0 || filters.preferredDays.some(day => spotter.preferredDays.includes(day))) &&
            (filters.preferredTime === "" || spotter.preferredTime === filters.preferredTime) &&
            (filters.preferredSpottingStyle === "" || spotter.preferredSpottingStyle.toLowerCase().includes(filters.preferredSpottingStyle.toLowerCase()))
        );
    });

    return (
        <div className="spotter-profiles">
            <h1>Find Spotters Near You</h1>
            <div className="filters">
                <div className="filter-group">
                    <label>Name:</label>
                    <input type="text" name="name" value={filters.name} onChange={handleInputChange} />
                </div>

                <div className="filter-group">
                    <label>Age:</label>
                    <input type="number" name="age" value={filters.age} onChange={handleInputChange} />
                </div>

                <div className="filter-group">
                    <label>Exercise Interests:</label>
                    <select
                        multiple
                        value={filters.exerciseInterests}
                        onChange={(e) => handleMultiSelectChange(e, "exerciseInterests")}
                    >
                        <option value="Cardio">Cardio</option>
                        <option value="Strength">Strength</option>
                        <option value="Yoga">Yoga</option>
                        <option value="Pilates">Pilates</option>
                        <option value="CrossFit">CrossFit</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label>Fitness Level:</label>
                    <select
                        name="fitnessLevel"
                        value={filters.fitnessLevel}
                        onChange={handleInputChange}
                    >
                        <option value="">All Levels</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label>Gender:</label>
                    <select
                        name="gender"
                        value={filters.gender}
                        onChange={handleInputChange}
                    >
                        <option value="">Any</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label>Gym Membership:</label>
                    <input
                        type="text"
                        name="gymMembership"
                        value={filters.gymMembership}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="filter-group">
                    <label>Preferred Days:</label>
                    <select
                        multiple
                        value={filters.preferredDays}
                        onChange={(e) => handleMultiSelectChange(e, "preferredDays")}
                    >
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                        <option value="Sunday">Sunday</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label>Preferred Time:</label>
                    <select
                        name="preferredTime"
                        value={filters.preferredTime}
                        onChange={handleInputChange}
                    >
                        <option value="">Any Time</option>
                        <option value="Morning">Morning</option>
                        <option value="Early Afternoon">Early Afternoon</option>
                        <option value="Late Afternoon">Late Afternoon</option>
                        <option value="Evening">Evening</option>
                        <option value="Night">Night</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label>Preferred Spotting Style:</label>
                    <input
                        type="text"
                        name="preferredSpottingStyle"
                        value={filters.preferredSpottingStyle}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            <div className="profile-cards">
                {filteredSpotters.length > 0 ? (
                    filteredSpotters.map((spotter, index) => (
                        <SpotterCard key={index} spotter={spotter} />
                    ))
                ) : (
                    <p>No spotters found with the selected filters.</p>
                )}
            </div>
        </div>
    );
};

export default SpotterProfiles;
