import React, { useState, useEffect } from 'react';

function GeoLocation() {
    const [location, setLocation] = useState({ latitude: null, longitude: null });
    const [error, setError] = useState(null);

    // Function to get the user's location
    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, showError);
        } else {
            setError("Geolocation is not supported by this browser.");
        }
    };

    // Success callback
    const showPosition = (position) => {
        setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    };

    // Error callback
    const showError = (error) => {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                setError("User denied the request for Geolocation.");
                break;
            case error.POSITION_UNAVAILABLE:
                setError("Location information is unavailable.");
                break;
            case error.TIMEOUT:
                setError("The request to get user location timed out.");
                break;
            case error.UNKNOWN_ERROR:
                setError("An unknown error occurred.");
                break;
            default:
                setError("An unknown error occurred.");
        }
    };

    // Use useEffect to get location on component mount
    useEffect(() => {
        getLocation();
    }, []);

    return (
        <div>
            <h1>GeoLocation</h1>
            {error ? (
                <p>Error: {error}</p>
            ) : (
                <p>
                    {location.latitude && location.longitude
                        ? `Latitude: ${location.latitude}, Longitude: ${location.longitude}`
                        : "Getting location..."}
                </p>
            )}
        </div>
    );
}

export default GeoLocation;