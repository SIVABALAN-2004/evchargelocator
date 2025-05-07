import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '', phone: '', city: '', username: '', password: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        const postData = {
            name: formData.name,
            phone: formData.phone,
            city: formData.city,
            username: formData.username,
            password: formData.password
        };

        console.log("Sending data:", postData);

        try {
            const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

            const response = await fetch(`${API_BASE_URL}/signup`, { // Change URL if needed
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Response:", data);

            // Navigate to login after successful signup
            navigate('/login');

        } catch (error) {
            console.error("Error in POST request:", error);
        }
    };

    return (
        <div className="auth-container">
            <h2>Sign Up</h2>
            <form onSubmit={handleSignup}>
                <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
                <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
                <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
                <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                <button type="submit" className="btn">Sign Up</button>
            </form>
        </div>
    );
};

export default Signup;
