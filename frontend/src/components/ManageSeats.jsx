import React, { useEffect, useState } from 'react';
import {
  Container, Paper, Typography, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';

function ManageBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/admin/bookings')  // Fetch current bookings, adjust backend endpoint if needed
      .then((res) => res.json())
      .then((data) => setBookings(data.bookings || []));
  }, []);

  const handleRemoveBooking = async (seatId, busId, location, studentId) => {
    const confirm = window.confirm('Are you sure you want to remove this booking?');
    if (!confirm) return;

    try {
      // Adjust endpoint as per your backend route
      const res = await fetch(`http://localhost:5000/admin/remove-booking/${seatId}/${busId}/${location}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to remove booking: ' + res.statusText);
      }

      const data = await res.json();
      if (data.status === 'success') {
        alert('Booking removed!');
        // Remove booking from state to update UI
        setBookings((prev) =>
          prev.filter(
            (booking) =>
              !(
                booking.seat_id === seatId &&
                booking.bus_id === busId &&
                booking.location === location &&
                booking.student_id === studentId
              )
          )
        );
      } else {
        alert('Failed to remove booking: ' + data.message);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#ADD8E6',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="lg">
        <Paper
          sx={{
            padding: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
          }}
        >
          <Typography variant="h4" gutterBottom align="center">
            Manage Bookings
          </Typography>

          <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.7)' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Booking ID</TableCell>
                  <TableCell>Student ID</TableCell>
                  <TableCell>Seat ID</TableCell>
                  <TableCell>Bus ID</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow
                    key={`${booking.booking_id}`}
                  >
                    <TableCell>{booking.booking_id}</TableCell>
                    <TableCell>{booking.student_id}</TableCell>
                    <TableCell>{booking.seat_id}</TableCell>
                    <TableCell>{booking.bus_id}</TableCell>
                    <TableCell>{booking.location}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() =>
                          handleRemoveBooking(
                            booking.seat_id,
                            booking.bus_id,
                            booking.location,
                            booking.student_id
                          )
                        }
                      >
                        Remove Booking
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {bookings.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No bookings found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </div>
  );
}

export default ManageBookings;
