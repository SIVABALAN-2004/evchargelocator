import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../index.css';

const Reservation = () => {
    const { stationId } = useParams();
    const navigate = useNavigate();
    
    // ✅ Get user ID and name from sessionStorage
    const userId = sessionStorage.getItem("userId");
    const userName = sessionStorage.getItem("userName");

    const [station, setStation] = useState(null);
    const [timeSlot, setTimeSlot] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // ✅ Fetch station details from backend
    const API_BASE_URL = "https://globe-gives-grants-nor.trycloudflare.com";

    useEffect(() => {
        fetch(`${API_BASE_URL}/station/${stationId}`)
            .then(response => response.json())
            .then(data => {
                setStation(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching station details:", error);
                setError("⚠️ Failed to fetch station details.");
                setLoading(false);
            });
    }, [stationId]);


    const handleReservation = async () => {
        if (!userId || !userName) {
            alert("⚠️ User not logged in! Please log in first.");
            navigate("/login");
            return;
        }

        if (!timeSlot) {
            alert("⚠️ Please select a time slot.");
            return;
        }

        try {
            const response = await fetch('https://globe-gives-grants-nor.trycloudflare.com/reserve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    userName,
                    stationId,
                    stationName: station?.name,
                    timeSlot
                })
            });

            if (!response.ok) {
                throw new Error("⚠️ Failed to save reservation.");
            }

            // ✅ Save reservation details in sessionStorage
            sessionStorage.setItem('reservationTime', timeSlot);
            sessionStorage.setItem('stationName', station?.name);

            // ✅ Navigate to Payment page
            navigate('/payment');

        } catch (error) {
            console.error("Error making reservation:", error);
            alert("⚠️ Could not complete reservation. Try again later.");
        }
    };

    return (
        <div className="reservation-container">
            {loading ? (
                <p>⏳ Loading station details...</p>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : (
                <>
                    <h2>Reserve {station?.name}</h2>
                    <label>Select a Time Slot:</label>
                    <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)}>
                        <option value="">-- Choose a Time Slot --</option>
                        <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                        <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
                        <option value="12:00 PM - 01:00 PM">12:00 PM - 01:00 PM</option>
                        <option value="01:00 PM - 02:00 PM">01:00 PM - 02:00 PM</option>
                    </select>
                    <button className="btn" onClick={handleReservation}>Confirm Reservation</button>
                </>
            )}
        </div>
    );
};

export default Reservation;
