// src/pages/Favorites.js
import React, { useEffect, useContext } from 'react';
import { Context } from '../store/appContext';
import "../../styles/favorites.css";
import PropTypes from 'prop-types';
import userIcon from "../../img/user_icon.png"

const Favorites = () => {
    const { store, actions } = useContext(Context);

    useEffect(() => {
        actions.getLikedUsers();
    }, []);

    const getAvatarUrl = (gender) => {
        switch (gender) {
            case "male":
                return "https://avatar.iran.liara.run/public/boy";
            case "female":
                return "https://avatar.iran.liara.run/public/girl";
            default:
                return userIcon;
        }
    };

    const handleRemoveFavorite = async(userId) => {
    
        if (window.confirm("Are you sure you want to remove this person from your favorites?")) {
            const success= await actions.removeFavorite(userId);
            if (success) {
                console.log("successfully removed favorite");
                actions.getLikedUsers();
            } else {
                console.error("failed to remove favorite")
            }
        }
    }

    return (
        <div className="favorites">
            <h1>Your Favorites</h1>
            {store.likedUsers?.length > 0 ? (
                <div className="favorites-list">
                    {store.likedUsers.map((user) => (
                        <div key={user.id} className="favorite-card">
                            <div 
                                className="remove-favorite"
                                onClick={()=> handleRemoveFavorite(user.id)}
                            >
                                <i className="fa-solid fa-x"></i>
                            </div>
                            <img
                                src={user.profileImage || getAvatarUrl(user.gender)}
                                alt={`${user.name}'s avatar`}
                                className="favorite-image"
                            />
                            <div className="card-body">
                                <h3>{user.name}</h3>
                                <p><b>Gender: </b>{user.gender}</p>
                                <p><b>City: </b>{user.city}</p>
                                <p><b>State: </b>{user.state}</p>
                                {user.bio && <p><b>Bio: </b>{user.bio}</p>}
                                <div className="match-status">
                                    {user.has_liked_back ? (
                                        <span className="match-badge">It's a Match! 🎉</span>
                                    ) : (
                                        <span className="pending-badge">Pending...</span>
                                    )}
                                </div>

                                {/* <button onClick={() => onViewProfile(user.id)} className="btn btn-view-profile">
                                    View Profile
                                </button> */}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>You haven't favorited anyone yet.</p>
            )}
        </div>
    );
};

// Favorites.propTypes = {
//     favorites: PropTypes.array.isRequired,
//     onViewProfile: PropTypes.func.isRequired,
// };

export default Favorites;
