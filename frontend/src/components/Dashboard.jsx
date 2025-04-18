// src/Dashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleBookSeat = () => {
    navigate('/book-seat'); // Navigate to book seat page
  };

  const handleCheckSeatStatus = () => {
    navigate('/check-seat-status'); // Navigate to check seat status page
  };

  const handleLogout = () => {
    // Clear any user session data if necessary (e.g., localStorage or context)
    navigate('/login'); // Navigate back to login page
  };

  return (
    <div className="dashboard">
      <h2>Welcome to the Dashboard</h2>
      <div className="options">
        <button onClick={handleBookSeat}>Book Seat</button>
        <button onClick={handleCheckSeatStatus}>Check Seat Status</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Dashboard;
