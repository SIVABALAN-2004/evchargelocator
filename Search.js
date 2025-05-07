import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';
import LocationFetcher from './LocationFetcher';

const Search = () => {
    const [stations, setStations] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [nearestStations, setNearestStations] = useState([]);
    const [range, setRange] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const navigate = useNavigate();

    // ✅ Redirect to login if user is not logged in
    useEffect(() => {
        const userId = sessionStorage.getItem("userId");
        if (!userId) {
            navigate('/login'); // Redirect if no user is logged in
        }
    }, [navigate]);

    // ✅ Fetch all charging stations (Optional but kept)
    useEffect(() => {
        fetch('https://globe-gives-grants-nor.trycloudflare.com')
            .then(response => response.json())
            .then(json => setStations(json))
            .catch(() => setError("⚠️ Failed to fetch stations."));
    }, []);

    // ✅ Handle location fetched
    const handleLocationFetched = (location) => {
        setUserLocation(location);
    };

    // ✅ Fetch nearest stations within user-defined range
    const fetchNearestStations = async () => {
        if (!userLocation) {
            setError("⚠️ Please allow location access first.");
            return;
        }
        if (!range || isNaN(range) || range <= 0) {
            setError("⚠️ Please enter a valid range in kilometers.");
            return;
        }

        setLoading(true);
        setError('');

        try {
            const API_BASE_URL = "https://globe-gives-grants-nor.trycloudflare.com";

            const response = await fetch(`${API_BASE_URL}/nearest-stations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    latitude: userLocation.lat,
                    longitude: userLocation.long,
                    range: parseFloat(range)
                })
            });

            if (!response.ok) throw new Error("Error fetching stations.");
            
            const data = await response.json();
            setNearestStations(data);
        } catch (error) {
            setError("⚠️ Failed to fetch nearest stations.");
        } finally {
            setLoading(false);
        }
    };

    // ✅ Handle user choice for Reservation or Google Maps
    const handleStationClick = (stationId, stationName) => {
        const userChoice = window.confirm(
            `Do you want to reserve ${stationName}? Click 'OK' for Reservation or 'Cancel' for Google Maps.`
        );
        if (userChoice) {
            navigate(`/reserve/${stationId}`); // ✅ Go to Reservation page
        } else {
            fetchStationCoordinates(stationId);
        }
    };

    // ✅ Fetch station coordinates for Google Maps Navigation
    const fetchStationCoordinates = async (stationId) => {
        try {
            const response = await fetch(`https://globe-gives-grants-nor.trycloudflare.com/station/${stationId}`);
            if (!response.ok) throw new Error("Station not found.");

            const data = await response.json();

            if (userLocation && data.latitude && data.longitude) {
                const mapsUrl = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.long}/${data.latitude},${data.longitude}`;
                window.open(mapsUrl, '_blank');
            } else {
                setError("⚠️ Unable to fetch station coordinates.");
            }
        } catch (error) {
            setError("⚠️ Failed to get station coordinates.");
        }
    };

    return (
        <div>
            <LocationFetcher onLocationFetched={handleLocationFetched} />

            {/* ✅ Ask user for range input */}
            <label>Enter your range (km):</label>
            <input 
                type="number" 
                value={range} 
                onChange={(e) => setRange(e.target.value)} 
                placeholder="Enter range in km"
            />

            <button onClick={fetchNearestStations} disabled={loading}>
                {loading ? "🔄 Finding..." : "Find Nearest Stations"}
            </button>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {loading && <p>🔄 Loading nearest stations...</p>}

            <ul>
                {nearestStations.length > 0 ? (
                    nearestStations.map(station => (
                        <li key={station.id} onClick={() => handleStationClick(station.id, station.name)}>
                            <strong>{station.name}</strong> - {station.location} - 🚗 {station.cars} Cars
                        </li>
                    ))
                ) : (
                    !loading && <p>No stations found in this range.</p>
                )}
            </ul>
        </div>
    );
};

export default Search;
