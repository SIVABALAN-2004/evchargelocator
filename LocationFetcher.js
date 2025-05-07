import React, { useState } from 'react';

const LocationFetcher = ({ onLocationFetched }) => {
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const getLocation = () => {
        if (!navigator.geolocation) {
            setError("❌ Geolocation is not supported by this browser.");
            return;
        }

        // ✅ Check if user is logged in
        const userId = sessionStorage.getItem("userId");
        const userName = sessionStorage.getItem("userName");

        if (!userId || !userName) {
            setError("⚠️ User not logged in! Please log in first.");
            return;
        }

        setLoading(true);
        setError('');
        setSuccessMessage('');

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const long = position.coords.longitude;

                setLatitude(lat);
                setLongitude(long);

                // ✅ Pass location to parent component if provided
                if (onLocationFetched) {
                    onLocationFetched({ lat, long });
                }

                // ✅ Prepare POST request data
                const postData = { userId, userName, lat, long };

                console.log("📡 Sending location data to server:", postData);

                try {
                    const API_BASE_URL = "https://globe-gives-grants-nor.trycloudflare.com";


                    const response = await fetch(`${API_BASE_URL}/location`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(postData)
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }

                    const data = await response.json();
                    console.log("✅ Server Response:", data);
                    setSuccessMessage("✅ Location saved successfully!");
                } catch (error) {
                    console.error("❌ Error in POST request:", error.message);
                    setError("⚠️ Failed to send location data. Please try again.");
                } finally {
                    setLoading(false);
                }
            },
            (error) => {
                let errorMsg = "⚠️ Unable to retrieve location.";
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMsg = "❌ Location permission denied. Please allow access.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMsg = "⚠️ Location unavailable. Try again later.";
                        break;
                    case error.TIMEOUT:
                        errorMsg = "⚠️ Location request timed out. Retry.";
                        break;
                    default:
                        errorMsg = "❌ Unknown error fetching location.";
                }
                console.error("❌ Geolocation Error:", error.message);
                setError(errorMsg);
                setLoading(false);
            }
        );
    };

    return (
        <div>
            <button className="btn" onClick={getLocation} disabled={loading}>
                {loading ? "📍 Getting Location..." : "📍 Get Location"}
            </button>

            {latitude !== null && longitude !== null && (
                <p>📍 Your Location: <strong>{latitude}, {longitude}</strong></p>
            )}

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        </div>
    );
};

export default LocationFetcher;
