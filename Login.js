import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../index.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // ✅ Redirect if user is already logged in
    useEffect(() => {
        const storedUser = sessionStorage.getItem("userId");
        if (storedUser) {
            navigate('/search'); // Redirect to search page if already logged in
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage(""); // Clear previous errors

        if (!username || !password) {
            setErrorMessage("⚠️ Please enter both username and password.");
            return;
        }

        setLoading(true); // Show loading state

        const postData = { username, password };
        console.log("📡 Sending login data:", postData);

        try {
            const API_BASE_URL = "https://globe-gives-grants-nor.trycloudflare.com";

            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log("✅ Server Response:", data);

            if (data.response === "yes") {
                // ✅ Store user details in session storage
                sessionStorage.setItem("userId", data.user.id);
                sessionStorage.setItem("userName", data.user.name);
                sessionStorage.setItem("username", data.user.username);

                console.log("✅ User logged in:", data.user);

                navigate('/search'); // Redirect to search page
            } else {
                setErrorMessage(data.message || "⚠️ Invalid username or password.");
            }
        } catch (error) {
            console.error("❌ Error in POST request:", error);
            setErrorMessage("⚠️ Server error! Please try again later.");
        } finally {
            setLoading(false); // Hide loading state
        }
    };

    return (
        <div className="auth-container">
            <h2>Login</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <form onSubmit={handleLogin}>
                <input 
                    type="text" 
                    placeholder="Username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
                <button type="submit" className="btn" disabled={loading}>
                    {loading ? "🔄 Logging in..." : "Login"}
                </button>
                <Link to="/signup" className="btn">Signup</Link>
            </form>
        </div>
    );
};

export default Login;
