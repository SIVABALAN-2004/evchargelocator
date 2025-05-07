const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = 3002;

// ✅ Connect to MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '96969696',
    database: 'evlocator'
});

// ✅ Handle MySQL connection errors
db.connect((err) => {
    if (err) {
        console.error("❌ Database connection failed:", err.message);
        return;
    }
    console.log("✅ Connected to MySQL database!");
});

app.use(express.json());
app.use(cors());

// ✅ Haversine Formula
function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const toRad = (angle) => angle * (Math.PI / 180);
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// 🚀 Signup
app.post('/signup', (req, res) => {
    const { name, phone, city, username, password } = req.body;

    if (!name || !phone || !city || !username || !password) {
        return res.status(400).json({ error: "⚠️ All fields are required." });
    }

    const sql = 'INSERT INTO userdata (name, phone, city, username, password) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [name, phone, city, username, password], (err, result) => {
        if (err) {
            console.error("❌ Signup Error:", err.message);
            return res.status(500).json({ error: "❌ Database error: " + err.message });
        }
        res.json({ message: '✅ User registered successfully!', userId: result.insertId });
    });
});

// 🚀 Login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "⚠️ Username and password are required." });
    }

    const sql = "SELECT id, name, username FROM userdata WHERE username = ? AND password = ?";
    db.query(sql, [username, password], (err, results) => {
        if (err) {
            console.error("❌ Login Error:", err.message);
            return res.status(500).json({ error: "❌ Database error: " + err.message });
        }

        if (results.length > 0) {
            res.json({ response: "yes", user: results[0] });
        } else {
            res.json({ response: "no", message: "⚠️ Invalid username or password." });
        }
    });
});

// 🚀 Get All Charging Stations
app.get('/stations', (req, res) => {
    const sql = "SELECT * FROM charging_stations";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("❌ Error fetching stations:", err.message);
            return res.status(500).json({ error: "❌ Database error: " + err.message });
        }
        res.json(results);
    });
});

// 🚀 Find Nearest Charging Stations
app.post('/nearest-stations', (req, res) => {
    const { latitude, longitude, range } = req.body;

    if (!latitude || !longitude || !range) {
        return res.status(400).json({ error: "⚠️ Latitude, Longitude, and Range are required." });
    }

    const sql = "SELECT * FROM charging_stations";
    db.query(sql, (err, stations) => {
        if (err) {
            console.error("❌ Error fetching nearest stations:", err.message);
            return res.status(500).json({ error: "❌ Database error: " + err.message });
        }

        let filteredStations = stations
            .map(station => ({
                id: station.id,
                name: station.name,
                location: station.location,
                latitude: station.latitude,
                longitude: station.longitude,
                cars: station.cars,
                distance: haversine(latitude, longitude, station.latitude, station.longitude)
            }))
            .filter(station => station.distance <= range)
            .sort((a, b) => a.cars - b.cars);

        res.json(filteredStations.slice(0, 5));
    });
});

// 🚀 Fetch Station Details
app.get('/station/:id', (req, res) => {
    const stationId = req.params.id;

    if (!stationId) {
        return res.status(400).json({ error: "⚠️ Station ID is required." });
    }

    const sql = 'SELECT * FROM charging_stations WHERE id = ?';
    db.query(sql, [stationId], (err, result) => {
        if (err) {
            console.error("❌ Error fetching station:", err.message);
            return res.status(500).json({ error: "❌ Database error: " + err.message });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: "⚠️ Station not found." });
        }
        res.json(result[0]);
    });
});

// 🚀 ✅ Modified: Save User Location
app.post('/location', (req, res) => {
    const { userId, userName, lat, long } = req.body;

    if (!userId || !userName || !lat || !long) {
        return res.status(400).json({ error: "⚠️ User ID, User Name, Latitude, and Longitude are required." });
    }

    console.log(`📍 Received Location: ${userName} (ID: ${userId}) at [${lat}, ${long}]`);

    const sql = `
        INSERT INTO user_locations (id, latitude, longitude) 
        VALUES (?, ?, ?) 
        ON DUPLICATE KEY UPDATE latitude = VALUES(latitude), longitude = VALUES(longitude)
    `;
    db.query(sql, [userId, lat, long], (err, result) => {
        if (err) {
            console.error("❌ Error saving location:", err.message);
            return res.status(500).json({ error: "❌ Database error: " + err.message });
        }
        res.json({ message: "✅ Location updated successfully!" });
    });
});

// 🚀 Save Reservation
app.post('/reserve', (req, res) => {
    const { userId, userName, stationId, stationName, timeSlot } = req.body;

    if (!userId || !userName || !stationId || !stationName || !timeSlot) {
        return res.status(400).json({ error: "⚠️ All fields are required." });
    }

    const sql = `
        INSERT INTO reservations (user_id, user_name, station_id, station_name, time_slot) 
        VALUES (?, ?, ?, ?, ?)
    `;
    db.query(sql, [userId, userName, stationId, stationName, timeSlot], (err, result) => {
        if (err) {
            console.error("❌ Error saving reservation:", err.message);
            return res.status(500).json({ error: "❌ Database error: " + err.message });
        }
        res.json({ message: "✅ Reservation successful!", reservationId: result.insertId });
    });
});

// 🚀 Start the Server
app.listen(port, () => {
    console.log(`✅ Server running on http://localhost:${port}`);
});
