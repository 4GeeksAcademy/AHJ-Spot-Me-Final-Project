// src/pages/Profile2.js
import React, { useEffect, useState } from 'react';
import './profile2.css';

const Profile2 = () => {
    const [matches, setMatches] = useState([]);
    const [error, setError] = useState(null);
    const fetchMatches = async () => {
        try {
            const token = localStorage.getItem('token'); // Assuming JWT is stored in localStorage
            const response = await fetch(process.env.BACKEND_URL + '/api/matches', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch matches');
            }

            const data = await response.json();
            setMatches(data);
        } catch (error) {
            console.error('Error fetching matches:', error);
            setError('Could not load matches. Please try again later.');
        }
    };
    useEffect(() => {


        fetchMatches();
    }, []);

    return (
        <div>
            <h1>Your Matches</h1>
            {error && <p className="error">{error}</p>}
            <div className="card-grid">
                {matches.length > 0 ? (
                    matches.map(match => (
                        <div className="card" key={match.id}>
                            <h3>User ID 1: {match.user1_id}</h3>
                            <h3>User ID 2: {match.user2_id}</h3>
                            <p>Match Accepted: {match.is_accepted ? 'Yes' : 'No'}</p>
                            <p>Last Interaction: {match.last_interaction ? new Date(match.last_interaction).toLocaleDateString() : 'N/A'}</p>
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
