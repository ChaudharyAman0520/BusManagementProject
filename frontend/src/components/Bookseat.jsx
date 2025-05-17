import React, { useState, useEffect } from 'react';
import {
  Select, MenuItem, Button, Typography,
  FormControl, InputLabel, Grid, Box
} from '@mui/material';

const BookSeat = () => {
  const [locations, setLocations] = useState([]);
  const [buses, setBuses] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedBus, setSelectedBus] = useState('');
  const [seats, setSeats] = useState([]);
  const [allocatedSeat, setAllocatedSeat] = useState(null);
  const [studentId, setStudentId] = useState('');

  // Load allocated seat and student ID from localStorage on mount
  useEffect(() => {
    const storedSeat = localStorage.getItem('allocatedSeat');
    if (storedSeat) {
      setAllocatedSeat(storedSeat);
    }
    const storedStudentId = localStorage.getItem('studentId');
    if (storedStudentId) {
      setStudentId(storedStudentId);
    } else {
      console.error('Student ID not found!');
    }
  }, []);

  // Fetch locations from backend on mount
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch('http://127.0.0.1:5000/locations');
        const data = await res.json();
        setLocations(data.locations || []);
      } catch (err) {
        alert('Failed to fetch locations: ' + err.message);
      }
    };
    fetchLocations();
  }, []);

  // Fetch buses when location changes
  useEffect(() => {
    if (!selectedLocation) return;

    const fetchBuses = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:5000/buses/${selectedLocation}`);
        const data = await res.json();
        setBuses(data.buses || []);
      } catch (err) {
        alert('Failed to fetch buses: ' + err.message);
      }
    };

    fetchBuses();

    // Reset buses, seats, and allocated seat on location change
    setSelectedBus('');
    setSeats([]);
    setAllocatedSeat(null);
    localStorage.removeItem('allocatedSeat');
  }, [selectedLocation]);

  // Fetch seats when bus changes and poll every 15 seconds
  useEffect(() => {
    if (!selectedBus) return;

    let isMounted = true;

    const fetchSeats = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:5000/seat-status/${selectedBus}`);
        const data = await res.json();
        if (!isMounted) return;

        const seatsData = data.seats || [];
        setSeats(seatsData);

        // Verify allocated seat still booked
        if (allocatedSeat) {
          const seatStillBooked = seatsData.some(
            (seat) => seat.seat_id === allocatedSeat && seat.status === 'mySeat'
          );
          if (!seatStillBooked) {
            setAllocatedSeat(null);
            localStorage.removeItem('allocatedSeat');
            //alert('Your allocated seat has been released or removed by admin.');
          }
        }
      } catch (err) {
        alert('Failed to fetch seats: ' + err.message);
      }
    };

    fetchSeats();
    const interval = setInterval(fetchSeats, 15000); // every 15 seconds

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [selectedBus, allocatedSeat]);

  // Handle booking: call backend, update allocated seat & seats UI
  const handleSeatBooking = async () => {
    if (!studentId) {
      alert('Student ID is required!');
      return;
    }
    if (!selectedLocation || !selectedBus) {
      alert('Please select location and bus first!');
      return;
    }

    try {
      const res = await fetch('http://127.0.0.1:5000/allocate-seat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId,
          location: selectedLocation,
          bus_id: selectedBus,
        }),
      });
      const data = await res.json();

      if (data.status === 'success') {
        alert('Seat booked successfully!');
        setAllocatedSeat(data.seat_id);
        localStorage.setItem('allocatedSeat', data.seat_id);

        setSeats((prevSeats) =>
          prevSeats.map((seat) =>
            seat.seat_id === data.seat_id ? { ...seat, status: 'mySeat' } : seat
          )
        );
      } else {
        alert('Seat booking failed: ' + (data.message || 'Unknown error'));
      }
    } catch (err) {
      alert('Error booking seat: ' + err.message);
    }
  };

  // Seat color helper
  const getSeatColor = (status, seatId) => {
    if (seatId === allocatedSeat) return '#1976d2'; // blue MUI primary
    switch (status) {
      case 'filled':
        return '#d32f2f'; // red
      case 'available':
        return '#388e3c'; // green
      case 'mySeat':
        return '#1976d2'; // blue
      default:
        return 'gray';
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Book a Seat
      </Typography>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Select Location</InputLabel>
        <Select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          label="Select Location"
        >
          <MenuItem value="">
            <em>-- Select --</em>
          </MenuItem>
          {locations.map((loc, idx) => (
            <MenuItem key={idx} value={loc}>
              {loc}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedLocation && (
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Select Bus</InputLabel>
          <Select
            value={selectedBus}
            onChange={(e) => setSelectedBus(e.target.value)}
            label="Select Bus"
          >
            <MenuItem value="">
              <em>-- Select --</em>
            </MenuItem>
            {buses.map((bus, idx) => (
              <MenuItem
                key={idx}
                value={bus.bus_id}
                sx={{
                  backgroundColor: bus.status === 'filled' ? '#d32f2f' : undefined,
                  color: bus.status === 'filled' ? 'white' : undefined,
                }}
              >
                {bus.bus_id}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {selectedBus && (
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Seat Layout
          </Typography>

          <Button
            variant="contained"
            onClick={handleSeatBooking}
            sx={{ mb: 2 }}
            disabled={!!allocatedSeat} // disable if seat already allocated
          >
            {allocatedSeat ? `Seat ${allocatedSeat} Booked` : 'Book Seat'}
          </Button>

          {seats.length > 0 ? (
            <Grid container spacing={2}>
              {seats.map((seat, idx) => (
                <Grid item key={idx}>
                  <Button
                    variant="contained"
                    disabled={seat.status === 'filled' || seat.status === 'mySeat'}
                    sx={{
                      backgroundColor: getSeatColor(seat.status, seat.seat_id),
                      color: 'white',
                      minWidth: 50,
                      minHeight: 50,
                      cursor: 'default',
                      '&:disabled': {
                        backgroundColor: seat.status === 'filled' ? 'gray' : '#1976d2',
                        cursor: 'default',
                      },
                    }}
                  >
                    {seat.seat_id}
                  </Button>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography>No seats available.</Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default BookSeat;
