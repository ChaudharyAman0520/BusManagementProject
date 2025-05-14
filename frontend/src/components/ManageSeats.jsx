import React, { useEffect, useState } from 'react';
import { Box, Container, Paper, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

function ManageSeats() {
  const [seats, setSeats] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/admin/seats')
      .then((res) => res.json())
      .then((data) => setSeats(data.seats || []));
  }, []);

  const handleRemoveSeat = async (seatId) => {
    const confirm = window.confirm('Are you sure you want to remove this seat?');
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:5000/admin/remove-seat/${seatId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to remove seat: ' + res.statusText);
      }

      const data = await res.json();
      if (data.status === 'success') {
        alert('Seat removed!');
        setSeats((prev) => prev.filter((seat) => seat.seat_id !== seatId));
      } else {
        alert('Failed to remove seat.');
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div style={{
      backgroundColor: '#ADD8E6',  // Light blue background color
      minHeight: '100vh',  // Ensure the background covers full viewport height
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
          backgroundColor: 'rgba(255, 255, 255, 0.7)', // Light transparent background for content
        }}>
          <Typography variant="h4" gutterBottom align="center">Manage Seats</Typography>

          <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.7)' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Seat ID</TableCell>
                  <TableCell>Bus ID</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {seats.map((seat) => (
                  <TableRow key={seat.seat_id}>
                    <TableCell>{seat.seat_id}</TableCell>
                    <TableCell>{seat.bus_id}</TableCell>
                    <TableCell>{seat.location}</TableCell>
                    <TableCell>{seat.status}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleRemoveSeat(seat.seat_id)}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </div>
  );
}

export default ManageSeats;
