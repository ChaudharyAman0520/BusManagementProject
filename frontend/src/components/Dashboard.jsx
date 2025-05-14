import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Typography, Container, Paper, Box } from '@mui/material';

function Dashboard() {
  const navigate = useNavigate();
  const { studentId } = useParams();

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken'); // or sessionStorage.removeItem('authToken');
    navigate('/login', { replace: true });
  };

  return (
    <Box
      sx={{
        background: 'linear-gradient(to bottom, #80d0ff, #a0e1ff)',  // Light blue gradient background
        minHeight: '100vh',
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          sx={{
            padding: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: '#e3f2fd',  // Soft light blue for the button container
            boxShadow: 3,  // Optional: Add some shadow to make it stand out
            borderRadius: 2,  // Rounded corners for the container
          }}
        >
          <Typography variant="h4" gutterBottom>
            Welcome, Student {studentId}!
          </Typography>

          {/* Book a Seat button */}
          <Button
            variant="contained"
            color="primary"
            sx={{ marginBottom: 2 }}
            onClick={() => navigate(`/seat-layout/${studentId}`)}
          >
            Book a Seat
          </Button>

          {/* Logout Button */}
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}

export default Dashboard;
