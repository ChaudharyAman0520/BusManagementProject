import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './App.css'; // Make sure global styles like `.seat`, `.seat-row`, etc. are here

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

      <div className="bus-seats">
        {seats.length > 0 &&
          [...Array(Math.ceil(seats.length / 4))].map((_, rowIndex) => {
            const start = rowIndex * 4;
            const rowSeats = seats.slice(start, start + 4);
            return (
              <div className="seat-row" key={rowIndex}>
                <div className="seat-block">
                  {rowSeats.slice(0, 2).map((seat) => (
                    <div
                      key={seat.seat_id}
                      className={`seat ${seat.status} ${selectedSeat === seat.seat_id ? 'selected' : ''}`}
                      onClick={() => seat.status !== 'booked' && setSelectedSeat(seat.seat_id)}
                    >
                      {seat.seat_id}
                    </div>
                  ))}
                </div>
                <div style={{ width: '40px' }} /> {/* Aisle */}
                <div className="seat-block">
                  {rowSeats.slice(2, 4).map((seat) => (
                    <div
                      key={seat.seat_id}
                      className={`seat ${seat.status} ${selectedSeat === seat.seat_id ? 'selected' : ''}`}
                      onClick={() => seat.status !== 'booked' && setSelectedSeat(seat.seat_id)}
                    >
                      {seat.seat_id}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
      </div>

      <button onClick={handleBookSeat} className="book-button">Book Selected Seat</button>
    </div>
  );
}

export default SeatLayout;
