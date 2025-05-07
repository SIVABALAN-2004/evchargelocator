import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

const Home = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // ✅ Ensure user is NOT automatically redirected to search
        sessionStorage.removeItem("userId");
        sessionStorage.removeItem("userName");
        sessionStorage.removeItem("username");
    }, []);

    const handleGetStarted = () => {
        navigate('/login'); // ✅ Always go to Login page
    };

    return (
        <div className="home-container">
            <h1>Welcome to EV Charging Station Spotter</h1>
            <button className="btn" onClick={handleGetStarted}>Get Started</button>
        </div>
    );
};

export default Home;
