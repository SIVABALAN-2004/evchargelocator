import React, { useEffect, useState } from 'react';
import "../styles/payment.css";

const Payment = () => {
  const [timeSlot, setTimeSlot] = useState("Not selected");
  const [stationName, setStationName] = useState("Not selected");

  useEffect(() => {
    setTimeSlot(sessionStorage.getItem('reservationTime') || "Not selected");
    setStationName(sessionStorage.getItem('stationName') || "Not selected");
  }, []);

  const confirmPayment = () => {
    alert("Payment successful! Your charging station has been reserved.");
  };

  return (
    <div className="container">
      <h2>Payment</h2>
      <p><strong>EV Station:</strong> {stationName}</p>
      <p><strong>Time Slot:</strong> {timeSlot}</p>

      <label>Card Number:</label>
      <input type="text" placeholder="1234 5678 9101 1121" />
      <label>Expiry Date:</label>
      <input type="month" />
      <label>CVV:</label>
      <input type="text" placeholder="123" />
      
      <button onClick={confirmPayment}>Pay Now</button>
    </div>
  );
};

export default Payment;
