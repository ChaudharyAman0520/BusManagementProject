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
  const [studentId, setStudentId] = useState(''); // Add student ID state

  // Load the allocated seat from localStorage
  useEffect(() => {
    const storedSeat = localStorage.getItem('allocatedSeat');
    if (storedSeat) {
      setAllocatedSeat(storedSeat);
    }

    // Load the student ID from localStorage or another source
    const storedStudentId = localStorage.getItem('studentId');
    if (storedStudentId) {
      setStudentId(storedStudentId);
    } else {
      // Optionally, handle the case if the student ID is not found
      console.error('Student ID not found!');
    }
  }, []);

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
  }, [selectedLocation]);

  useEffect(() => {
    if (!selectedBus) return;
    const fetchSeats = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:5000/seat-status/${selectedBus}`);
        const data = await res.json();
        setSeats(data.seats || []);
      } catch (err) {
        alert('Failed to fetch seats: ' + err.message);
      }
    };
    fetchSeats();
  }, [selectedBus]);

  const handleSeatBooking = async () => {
    if (!studentId) {
      alert('Student ID is required!');
      return;
    }

    try {
      const res = await fetch('http://127.0.0.1:5000/allocate-seat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId,  // Use student ID here
          location: selectedLocation,
          bus_id: selectedBus,
        }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        alert('Seat booked successfully!');
        setAllocatedSeat(data.seat_id);  // Store the allocated seat in state
        localStorage.setItem('allocatedSeat', data.seat_id);  // Save the allocated seat in localStorage
        setSeats(prev =>
          prev.map(seat =>
            seat.seat_id === data.seat_id ? { ...seat, status: 'mySeat' } : seat
          )
        );
      } else {
        alert('Seat booking failed.');
      }
    } catch (err) {
      alert('Error booking seat: ' + err.message);
    }
  };

  const getSeatColor = (status, seatId) => {
    if (seatId === allocatedSeat) return 'blue';  // Return blue for the user's seat
    switch (status) {
      case 'filled': return 'red';  // Filled seats should be green
      case 'available': return 'green'; // Available seats should be red
      default: return 'red';   // Default to light gray for other statuses
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
          onChange={(e) => {
            setSelectedLocation(e.target.value);
            setSelectedBus('');
            setSeats([]);
            setAllocatedSeat(null); // Reset the allocated seat when location changes
          }}
          label="Select Location"
        >
          <MenuItem value=""><em>-- Select --</em></MenuItem>
          {locations.map((loc, idx) => (
            <MenuItem key={idx} value={loc}>{loc}</MenuItem>
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
            <MenuItem value=""><em>-- Select --</em></MenuItem>
            {buses.map((bus, idx) => (
              <MenuItem
                key={idx}
                value={bus.bus_id}
                sx={{
                  backgroundColor: bus.status === 'filled' ? 'red' : undefined,
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
          >
            Book Seat
          </Button>

          {seats.length > 0 ? (
            <Grid container spacing={2}>
              {seats.map((seat, idx) => (
                <Grid item key={idx}>
                  <Button
                    variant="contained"
                    disabled={seat.status === 'filled'}
                    sx={{
                      backgroundColor: getSeatColor(seat.status, seat.seat_id),
                      color: 'white',
                      minWidth: 50,
                      minHeight: 50,
                      '&:disabled': {
                        backgroundColor: 'gray',
                        cursor: 'not-allowed',
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
