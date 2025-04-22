import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function SeatLayout() {
  const navigate = useNavigate();
  const { busId, studentId } = useParams();
  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchSeatLayout = async () => {
      const response = await fetch(`http://localhost:5000/seat-layout/${busId}`);
      const data = await response.json();
      if (data.status === 'success') {
        setSeats(data.seats);
      } else {
        setMessage('Unable to fetch seat layout.');
      }
    };
    fetchSeatLayout();
  }, [busId]);

  const handleBookSeat = async () => {
    if (!selectedSeat) {
      setMessage('Please select a seat.');
      return;
    }

    const response = await fetch('http://localhost:5000/allocate-seat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_id: studentId,
        bus_id: busId,
        seat_id: selectedSeat,
      }),
    });

    const data = await response.json();
    if (data.status === 'success') {
      setMessage(`Seat ${selectedSeat} booked successfully!`);
      setTimeout(() => navigate(`/dashboard/${studentId}`), 1500);
    } else {
      setMessage(data.message || 'Booking failed.');
    }
  };

  return (
    <div className="container">
      <h2>Seat Layout for Bus {busId}</h2>
      {message && <p>{message}</p>}
      <div className="seats">
        {seats.map((seat) => (
          <div
            key={seat.seat_id}
            className={`seat ${seat.status} ${selectedSeat === seat.seat_id ? 'selected' : ''}`}
            onClick={() => setSelectedSeat(seat.seat_id)}
          >
            {seat.seat_id}
          </div>
        ))}
      </div>
      <button onClick={handleBookSeat}>Book Selected Seat</button>
    </div>
  );
}

export default SeatLayout;
