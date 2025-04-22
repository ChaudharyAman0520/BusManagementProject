import React, { useState, useEffect } from 'react';

const BookSeat = () => {
  const [locations, setLocations] = useState([]);
  const [buses, setBuses] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedBus, setSelectedBus] = useState('');
  const [seats, setSeats] = useState([]);

  // Fetch locations on mount
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/locations');
        const data = await response.json();
        setLocations(data.locations || []);
      } catch (error) {
        alert('Error fetching locations: ' + error.message);
      }
    };
    fetchLocations();
  }, []);

  // Fetch buses when a location is selected
  useEffect(() => {
    const fetchBuses = async () => {
      if (!selectedLocation) return;
      try {
        const response = await fetch(`http://127.0.0.1:5000/buses/${selectedLocation}`);
        const data = await response.json();
        console.log('Fetched buses:', data.buses);
        setBuses(data.buses || []);
      } catch (error) {
        alert('Error fetching buses: ' + error.message);
      }
    };
    fetchBuses();
  }, [selectedLocation]);

  // Fetch seat layout for selected bus
  useEffect(() => {
    const fetchSeats = async () => {
      if (!selectedBus) return;
      try {
        const response = await fetch(`http://127.0.0.1:5000/seat-status/${selectedBus}`);
        const data = await response.json();
        setSeats(data.seats || []);
      } catch (error) {
        alert('Error fetching seats: ' + error.message);
      }
    };
    fetchSeats();
  }, [selectedBus]);

  const handleSeatClick = async (seatId) => {
    const studentId = 'student1';
    try {
      const response = await fetch('http://127.0.0.1:5000/allocate-seat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId, bus_id: selectedBus, seat_id: seatId }),
      });
      const data = await response.json();
      if (data.status === 'success') {
        alert(`Seat ${seatId} booked successfully!`);
        setSeats((prevSeats) =>
          prevSeats.map((seat) =>
            seat.seat_id === seatId ? { ...seat, status: 'filled' } : seat
          )
        );
      } else {
        alert('Failed to book seat.');
      }
    } catch (error) {
      alert('Error booking seat: ' + error.message);
    }
  };

  return (
    <div>
      <h2>Book a Seat</h2>

      {/* Location Dropdown */}
      <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
        <option value="">Select Location</option>
        {locations.map((location, idx) => (
          <option key={idx} value={location}>{location}</option>
        ))}
      </select>

      {/* Bus Dropdown */}
      {selectedLocation && (
        <select value={selectedBus} onChange={(e) => setSelectedBus(e.target.value)}>
          <option value="">Select Bus</option>
          {buses.map((bus, idx) => (
            <option key={idx} value={bus.bus_id}>{bus.bus_id}</option>
          ))}
        </select>
      )}

      {/* Seat Layout */}
      {selectedBus && (
        <div>
          <h3>Seat Layout</h3>
          {seats.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', maxWidth: '300px' }}>
              {seats.map((seat, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSeatClick(seat.seat_id)}
                  disabled={seat.status === 'filled'}
                  style={{
                    margin: '5px',
                    padding: '10px',
                    backgroundColor: seat.status === 'available' ? 'green' : 'red',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: seat.status === 'available' ? 'pointer' : 'not-allowed',
                  }}
                >
                  {seat.seat_id}
                </button>
              ))}
            </div>
          ) : (
            <p>No seats available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default BookSeat;
