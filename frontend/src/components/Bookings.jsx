import React, { useEffect, useState } from 'react';
import { Container, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box } from '@mui/material';

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  
  useEffect(() => {
    fetch('http://localhost:5000/admin/bookings')
      .then(res => res.json())
      .then(data => setBookings(data.bookings || []))
      .catch(err => console.error('Failed to fetch bookings:', err));
  }, []);

  return (
    <Box sx={{ backgroundColor: 'primary.light', minHeight: '100vh', display: 'flex', justifyContent: 'center', padding: 3 }}>
      <Container maxWidth="lg">
        <Paper sx={{ padding: 3, boxShadow: 3 }}>
          <Typography variant="h4" gutterBottom>
            All Bookings
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Booking ID</TableCell>
                  <TableCell>Student ID</TableCell>
                  <TableCell>Bus ID</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Seat ID</TableCell>
                  <TableCell>Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.map((b) => (
                  <TableRow hover key={b.booking_id} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' } }}>
                    <TableCell>{b.booking_id}</TableCell>
                    <TableCell>{b.student_id}</TableCell>
                    <TableCell>{b.bus_id}</TableCell>
                    <TableCell>{b.location}</TableCell>
                    <TableCell>{b.seat_id}</TableCell>
                    <TableCell>{new Date(b.booking_time).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </Box>
  );
}

export default AdminBookings;
