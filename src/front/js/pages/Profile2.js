// src/pages/Profile2.js
import "../../styles/profile2.css";
import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";



const Profile2 = () => {
    const { store, actions } = useContext(Context)

    useEffect(() => {
        actions.getMatches();
    }, []);

    // const [matches, setMatches] = useState([]);
    // const [error, setError] = useState(null);
    // const fetchMatches = async () => {
    //     try {
    //         const token = localStorage.getItem('token'); // Assuming JWT is stored in localStorage
    //         const response = await fetch(process.env.BACKEND_URL + '/api/matches', {
    //             method: 'GET',
    //             headers: {
    //                 'Authorization': `Bearer ${token}`
    //             }
    //         });

    //         if (!response.ok) {
    //             throw new Error('Failed to fetch matches');
    //         }

    //         const data = await response.json();
    //         setMatches(data);
    //     } catch (error) {
    //         console.error('Error fetching matches:', error);
    //         setError('Could not load matches. Please try again later.');
    //     }
    // };
    // useEffect(() => {


    //     fetchMatches();
    // }, []);

    return (
        <div>
            <h1>Your Matches</h1>
            <div className="card-grid">
                {store.matches.length > 0 ? (
                    matches.map(match => (
                        <div className="card" key={match.id}>
                            <img
                                src={match.matched_user.profile_image || getAvatarUrl(match.matched_user.gender)}
                                alt={`${match.matched_user.name}'s avatar`}
                                className="match-image"
                            />

                            <h3>{match.matched_user.name}</h3>
                            <p>City: {match.matched_user.city}</p>
                            <p>State: {match.matched_user.state}</p>
                            <p>Matched On: {new Date(match.created_at).toLocaleDateString()}</p>
                        </div>
                    ))
                ) : (
                    <p>No matches found.</p>
                )}
            </div>
        </div>
    );
};

export default Profile2;
