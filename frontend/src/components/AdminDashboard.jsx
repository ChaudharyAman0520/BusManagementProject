import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/admin/stats');
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Failed to load statistics.');
      }
    };

    const fetchBuses = async () => {
      try {
        const response = await fetch('http://localhost:5000/admin/buses');
        const data = await response.json();
        setBuses(data.buses || []);
      } catch (err) {
        console.error('Error fetching buses:', err);
        setError('Failed to load bus data.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    fetchBuses();
  }, []);

  if (loading) {
    return <div className="container"><p>Loading dashboard...</p></div>;
  }

  if (error) {
    return <div className="container"><p style={{ color: 'red' }}>{error}</p></div>;
  }

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>

      <div className="dashboard-section">
        <h3>Statistics</h3>
        <p>Total Buses: {stats?.total_buses || 0}</p>
        <p>Total Bookings: {stats?.total_bookings || 0}</p>
        <p>Total Students: {stats?.total_students || 0}</p>
      </div>

      <div className="dashboard-section">
        <h3>Manage Buses</h3>
        <ul>
          {buses.map((bus) => (
            <li key={bus.bus_id}>
              {bus.bus_id} - {bus.location} &nbsp;
              <Link to={`/admin/manage-bus/${bus.bus_id}`}>Manage</Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="dashboard-section">
        <h3>View Bookings</h3>
        <Link to="/admin/bookings">View All Bookings</Link>
      </div>

      <div className="dashboard-section">
        <h3>Manage Seats</h3>
        <Link to="/admin/seats">Manage Seat Allocations</Link>
      </div>
    </div>
  );
}

export default AdminDashboard;
