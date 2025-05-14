import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container, Paper, Box } from '@mui/material';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Placeholder logic for admin login
    if (username === 'admin' && password === 'admin123') {
      navigate('/admin-dashboard');
    } else {
      setMessage('Invalid credentials, please try again.');
    }
  };

  return (
  <Box
    sx={{
      backgroundImage: 'url(https://plus.unsplash.com/premium_photo-1661963542752-9a8a1d72fb28?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Container component="main" maxWidth="xs">
      <Paper elevation={4} sx={{ padding: 4, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Admin Login
        </Typography>

        {message && (
          <Typography variant="body2" color="error" align="center" sx={{ marginBottom: 2 }}>
            {message}
          </Typography>
        )}

        <form onSubmit={handleLogin}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            sx={{ marginBottom: 2 }}
          />

          <TextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{ marginBottom: 2 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
          >
            Login
          </Button>
        </form>
      </Paper>
    </Container>
  </Box>
);
}

export default AdminLogin;
