import React from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentProfile.css';

function StudentProfile() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('studentId'); // Clear session
    navigate('/'); // ✅ Back to login
  };

  return (
    <div className="profile-container">
      <div className="profile-box">
        <h2>👋 Welcome, Student!</h2>
        <p>Select an option from below:</p>

        <div className="button-group">
          <button onClick={() => handleNavigation('/seat-allocator')}>
            🪑 Allocate Seat
          </button>
          <button onClick={() => handleNavigation('/check-seat-status')}>
            📋 Check Seat Status
          </button>
          <button onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;
