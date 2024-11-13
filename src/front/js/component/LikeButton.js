// src/front/js/components/LikeButton.js
import React, { useState, useContext } from 'react';
import { Context } from '../store/appContext';

const LikeButton = ({ likedId, likeType }) => {
    const { actions } = useContext(Context);
    const [liked, setLiked] = useState(actions.hasLiked(likedId, likeType));

    const handleToggleLike = async () => {
        await actions.toggleLike(likedId, likeType);
        setLiked(actions.hasLiked(likedId, likeType));  // Update like state
    };

    return (
        <button onClick={handleToggleLike} className={`like-button ${liked ? 'liked' : ''}`}>
            {liked ? 'Unlike' : 'Like'}
        </button>
    );
};

export default LikeButton;
