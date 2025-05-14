import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Paper, Typography, Container } from '@mui/material';

function Login() {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student_id: studentId, password }),
    });

    const data = await response.json();
    if (data.status === 'success') {
      setMessage('Login successful!');
      
      // Store student ID in localStorage
      localStorage.setItem('studentId', studentId);
      
      setTimeout(() => navigate(`/dashboard/${studentId}`), 1500);
    } else {
      setMessage(data.message || 'Login failed.');
    }
  } catch (error) {
    setMessage('An error occurred. Please try again.');
  }
};

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
      <Container component="main" maxWidth="xs">
        <Paper elevation={4} style={{ padding: '20px', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
          <Typography variant="h4" align="center" gutterBottom>
            Student Login
          </Typography>

          <form onSubmit={handleLogin}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Student ID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              style={{ marginTop: '20px' }}
            >
              Login
            </Button>
          </form>

          {message && <Typography variant="body2" color="error" align="center" style={{ marginTop: '10px' }}>{message}</Typography>}

          <Typography variant="body2" align="center" style={{ marginTop: '10px' }}>
            Don’t have an account? <Link to="/register">Register here</Link>
          </Typography>

          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <p>Not a student? <Link to="/admin-login">Login as Admin</Link></p>
          </div>
        </Paper>
      </Container>
    </div>
  );
}

export default Login;
