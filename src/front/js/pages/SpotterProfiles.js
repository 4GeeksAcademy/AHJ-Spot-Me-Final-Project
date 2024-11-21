import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import SpotterCard from "../component/spotterCard";
import "../../styles/spotterProfiles.css";

// Matching exercise categories with UserProfile
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

const SpotterProfiles = () => {
    const { store, actions } = useContext(Context);

    const [filters, setFilters] = useState({
        name: "",
        age: "",
        city: "",
        state: "",
        gender: "",
        exerciseInterests: "Any Interest",
        preferredDay: "Any Day",
        preferredTime: "",
    });

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await actions.getAllUsers(); 
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching users:", error);
                setIsLoading(false);
            }
        };

        fetchData();
    }, [actions]);

    if (isLoading) {
        return <p>Loading spotters...</p>;
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    const filteredSpotters = (store.users || []).filter((spotter) => {
        return (
            (filters.name === "" || spotter.name?.toLowerCase().includes(filters.name.toLowerCase())) &&
            (filters.age === "" || spotter.age?.toString() === filters.age) &&
            (filters.city === "" || spotter.city?.toLowerCase().includes(filters.city.toLowerCase())) &&
            (filters.state === "" || spotter.state?.toLowerCase().includes(filters.state.toLowerCase())) &&
            (filters.gender === "" || spotter.gender?.toLowerCase() === filters.gender.toLowerCase()) &&
            (filters.exerciseInterests === "Any Interest" ||
                spotter.exercise_interests?.some(
                    (interest) => interest.name === filters.exerciseInterests
                )) &&
            (filters.preferredDay === "Any Day" ||
                spotter.workout_schedules?.some((schedule) => schedule.day_of_week === filters.preferredDay)) &&
            (filters.preferredTime === "" ||
                spotter.workout_schedules?.some((schedule) => schedule.time_slot === filters.preferredTime))
        );
    });

    return (
        <div className="spotter-profiles">
            <h1>Find Spotters Near You</h1>
            <div className="filters">
                <div className="filter-group">
                    <label><b>Name:</b></label>
                    <input type="text" name="name" value={filters.name} onChange={handleInputChange} />
                </div>

                <div className="filter-group">
                    <label><b>Age:</b></label>
                    <input type="number" name="age" value={filters.age} onChange={handleInputChange} />
                </div>

                <div className="filter-group">
                    <label><b>City:</b></label>
                    <input type="text" name="city" value={filters.city} onChange={handleInputChange} />
                </div>

                <div className="filter-group">
                    <label><b>State:</b></label>
                    <input type="text" name="state" value={filters.state} onChange={handleInputChange} />
                </div>

                <div className="filter-group">
                    <label><b>Gender:</b></label>
                    <select name="gender" value={filters.gender} onChange={handleInputChange}>
                        <option value="">Any</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label><b>Exercise Interests:</b></label>
                    <select name="exerciseInterests" value={filters.exerciseInterests} onChange={handleInputChange}>
                        <option value="Any Interest">Any Interest</option>
                        {exerciseCategories.map((category) => (
                            <option key={category.value} value={category.value}>
                                {category.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label><b>Preferred Days:</b></label>
                    <select name="preferredDay" value={filters.preferredDay} onChange={handleInputChange}>
                        <option value="Any Day">Any Day</option>
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
                    <label><b>Preferred Time:</b></label>
                    <select name="preferredTime" value={filters.preferredTime} onChange={handleInputChange}>
                        <option value="">Any Time</option>
                        <option value="Morning">Morning</option>
                        <option value="Afternoon">Afternoon</option>
                        <option value="Evening">Evening</option>
                        <option value="Night">Night</option>
                    </select>
                </div>
            </div>

            <div className="profile-cards">
                {filteredSpotters.length > 0 ? (
                    filteredSpotters.map((spotter, index) => (
                        <SpotterCard
                            key={index}
                            spotter={{
                                id: spotter.id,
                                name: spotter.name || "Anonymous",
                                age: spotter.age || "N/A",
                                gender: spotter.gender || "Unknown",
                                city: spotter.city || "",
                                state: spotter.state || "",
                                fitnessLevel: spotter.fitness_level || "Not Specified",
                                exerciseInterests: spotter.exercise_interests || [],
                                workoutSchedules: spotter.workout_schedules || [],
                                profileImage: spotter.profile_image || null,
                            }}
                        />
                    ))
                ) : (
                    <p>No spotters found with the selected filters.</p>
                )}
            </div>
        </div>
    );
};

export default SpotterProfiles;
