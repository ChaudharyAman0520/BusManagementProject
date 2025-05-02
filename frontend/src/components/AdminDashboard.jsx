import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [buses, setBuses] = useState([]);
  const [newBusId, setNewBusId] = useState('');
  const [newBusLocation, setNewBusLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

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

  const handleAddBus = async () => {
    if (!newBusId || !newBusLocation) {
      setMessage('Please provide both bus ID and location.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/admin/add-bus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bus_id: newBusId, location: newBusLocation }),
      });

      const data = await res.json();
      if (data.status === 'success') {
        setMessage('Bus added successfully!');
        setNewBusId('');
        setNewBusLocation('');
        setBuses([...buses, { bus_id: newBusId, location: newBusLocation }]);
      } else {
        setMessage('Failed to add bus.');
      }
    } catch (err) {
      setMessage('Error adding bus.');
    }
  };

  const handleRemoveBus = async (busId) => {
    const confirm = window.confirm(`Are you sure you want to remove bus ${busId}?`);
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:5000/admin/remove-bus/${busId}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (data.status === 'success') {
        setMessage('Bus removed successfully!');
        setBuses(buses.filter(bus => bus.bus_id !== busId));
      } else {
        setMessage('Failed to remove bus.');
      }
    } catch (err) {
      setMessage('Error removing bus.');
    }
  };

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

        <div>
          <h4>Add New Bus</h4>
          <input
            type="text"
            placeholder="Bus ID"
            value={newBusId}
            onChange={(e) => setNewBusId(e.target.value)}
          />
          <input
            type="text"
            placeholder="Location"
            value={newBusLocation}
            onChange={(e) => setNewBusLocation(e.target.value)}
          />
          <button onClick={handleAddBus}>Add Bus</button>
        </div>

        <div>{message && <p>{message}</p>}</div>

        <ul>
          {buses.map((bus) => (
            <li key={bus.bus_id}>
              {bus.bus_id} - {bus.location} &nbsp;
              <button onClick={() => handleRemoveBus(bus.bus_id)}>Remove</button>
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
