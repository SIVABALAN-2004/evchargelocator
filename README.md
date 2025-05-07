### 🔋 **Project Title**: EV Charging Station Spotter

### 📝 **Project Description**:

**EV Charging Station Spotter** is a full-stack web application that enables electric vehicle (EV) users to find nearby charging stations based on their real-time geographic location and travel range. The system integrates geolocation, distance computation using the Haversine formula, machine learning-based predictions, and live availability tracking to provide users with optimal charging choices.

The application consists of:

* A **user-facing frontend** for registration, station search, and booking.
* A **backend** for managing data and communication with a **machine learning server** that predicts station availability.
* A **Cloudflare Tunnel** for secure, remote access to the backend without public IP exposure.

### ⚙️ **Key Features**:

* 🌍 **Real-Time Location-Based Search** using latitude/longitude and the Haversine formula.
* 🔴🟢 **Charging Station Status Prediction** using camera input and ML, stored in a SQL database.
* 🗺️ **Google Maps Navigation**: Users can get routes to selected charging stations.
* 📲 **Reservation System**: Users can reserve a charging slot in advance.
* 🔐 **User Authentication**: Secure login/signup using SQL.
* 🛰️ **Secure Public Access** via **Cloudflare Tunnel**, replacing the need for Ngrok.

### 🧰 **Technology Stack**:

* **Frontend**: React.js, CSS
* **Backend**: Node.js, Express.js
* **Database**: SQL (MySQL/PostgreSQL)
* **ML Server**: Python-based prediction model
* **APIs**: Google Maps, Geolocation
* **Tunneling Tool**: **Cloudflare Tunnel** for exposing localhost securely



```
EV-CHARGING-STATION-SPOTTER/
│
├── .dist/
│
├── backend/
│   ├── node_modules/
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
│
├── database/
│   └── schema.sql
│
├── frontend/
│   ├── node_modules/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── Home.js
│       │   ├── LocationFetcher.js
│       │   ├── Login.js
│       │   ├── Payment.js
│       │   ├── Reservation.js
│       │   ├── Search.js
│       │   ├── Signup.js
│       │   ├── Station.js
│       │   └── StationList.js
│       │
│       ├── styles/
│       │   └── payment.css
│       │
│       ├── App.css
│       ├── App.js
│       ├── App.test.js
│       ├── index.css
│       ├── index.js
│       ├── logo.svg
│       ├── reportWebVitals.js
│       └── setupTests.js
│
├── .env
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
├── cloudflared.exe
└── config.yml
```



