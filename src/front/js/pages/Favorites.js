// src/pages/Favorites.js
import React from 'react';
import "../../styles/favorites.css";
import PropTypes from 'prop-types';

const Favorites = ({ favorites, onViewProfile }) => {
    return (
        <div className="favorites">
            <h1>Your Favorites</h1>
            {favorites.length > 0 ? (
                <div className="favorites-list">
                    {favorites.map((spotter) => (
                        <div key={spotter.id} className="favorite-card">
                            <img src={spotter.profileImage} alt={`${spotter.name}'s avatar`} className="favorite-image" />
                            <div className="card-body">
                                <h3>{spotter.name}</h3>
                                <p>Fitness Level: {spotter.fitnessLevel}</p>
                                <button onClick={() => onViewProfile(spotter.id)} className="btn btn-view-profile">
                                    View Profile
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>You have no favorites yet.</p>
            )}
        </div>
    );
};

Favorites.propTypes = {
    favorites: PropTypes.array.isRequired,
    onViewProfile: PropTypes.func.isRequired,
};

export default Favorites;
