// src/pages/ManageSeats.jsx
import React, { useState, useEffect } from 'react';

function ManageSeats() {
  const [seats, setSeats] = useState([]);

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await fetch('http://localhost:5000/admin/seats');
        const data = await response.json();
        setSeats(data.seats || []);
      } catch (err) {
        console.error('Error fetching seats:', err);
      }
    };
    fetchSeats();
  }, []);

  return (
    <div>
      <h2>Manage Seat Allocations</h2>
      <ul>
        {seats.map((seat) => (
          <li key={seat.seat_id}>
            Bus {seat.bus_id} - Seat {seat.seat_id} - {seat.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageSeats;
