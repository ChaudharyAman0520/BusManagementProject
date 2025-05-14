import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Paper, Typography, TextField, Button, Grid } from '@mui/material';

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
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h6">Loading dashboard...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="body2" color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <div style={{
      backgroundImage: 'url(https://plus.unsplash.com/premium_photo-1661963542752-9a8a1d72fb28?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Container maxWidth="lg">
        <Paper sx={{
          padding: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: 3,
          backgroundColor: 'rgba(255, 255, 255, 0.5)', // Lighter semi-transparent background
        }}>
          <Typography variant="h4" gutterBottom align="center">Admin Dashboard</Typography>

          <Grid container spacing={3} sx={{ width: '100%' }}>
            {/* Statistics Section */}
            <Grid item xs={12} sm={6} md={4}>
              <Paper sx={{
                padding: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.7)', // Lighter white background
                color: 'black'
              }}>
                <Typography variant="h6">Statistics</Typography>
                <Typography>Total Buses: {stats?.total_buses || 0}</Typography>
                <Typography>Total Bookings: {stats?.total_bookings || 0}</Typography>
                <Typography>Total Students: {stats?.total_students || 0}</Typography>
              </Paper>
            </Grid>

            {/* Manage Buses Section */}
            <Grid item xs={12} sm={6} md={4}>
              <Paper sx={{
                padding: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.7)', // Lighter white background
                color: 'black'
              }}>
                <Typography variant="h6">Manage Buses</Typography>
                <TextField
                  label="Bus ID"
                  variant="outlined"
                  fullWidth
                  value={newBusId}
                  onChange={(e) => setNewBusId(e.target.value)}
                  sx={{ marginBottom: 2 }}
                />
                <TextField
                  label="Location"
                  variant="outlined"
                  fullWidth
                  value={newBusLocation}
                  onChange={(e) => setNewBusLocation(e.target.value)}
                  sx={{ marginBottom: 2 }}
                />
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#1565c0' } }}
                  onClick={handleAddBus}
                >
                  Add Bus
                </Button>
                {message && <Typography variant="body2" sx={{ color: '#f44336', marginTop: 2 }}>{message}</Typography>}
              </Paper>
            </Grid>

            {/* Bus List Section */}
            <Grid item xs={12} sm={12} md={4}>
              <Paper sx={{
                padding: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.7)', // Lighter white background
                color: 'black'
              }}>
                <Typography variant="h6">Current Buses</Typography>
                <ul>
                  {buses.map((bus) => (
                    <li key={bus.bus_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography>{bus.bus_id} - {bus.location}</Typography>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleRemoveBus(bus.bus_id)}
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              </Paper>
            </Grid>

            {/* Links */}
            <Grid item xs={12}>
              <Paper sx={{
                padding: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.7)', // Lighter white background
                color: 'black'
              }}>
                <Typography variant="h6">Manage System</Typography>
                <Link to="/admin/bookings" style={{ color: '#1976d2' }}>View All Bookings</Link><br />
                <Link to="/admin/seats" style={{ color: '#1976d2' }}>Manage Seat Allocations</Link>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </div>
  );
}

export default AdminDashboard;
