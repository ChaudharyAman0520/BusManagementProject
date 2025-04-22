import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const { studentId } = useParams();

  // Handle logout
  const handleLogout = () => {
    // Clear user session/token
    localStorage.removeItem('authToken');  // or sessionStorage.removeItem('authToken');
    
    // Redirect to login page and prevent going back
    navigate('/login', { replace: true });
  };

  return (
    <div className="container">
      <h2>Welcome, Student {studentId}!</h2>
      {/* Book a Seat button with dynamic busId */}
      <button onClick={() => navigate(`/seat-layout/${studentId}/B1`)}>Book a Seat</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;
