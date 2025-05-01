// src/pages/Bookings.jsx
import React, { useState, useEffect } from 'react';

function Bookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('http://localhost:5000/admin/bookings');
        const data = await response.json();
        setBookings(data.bookings || []);
      } catch (err) {
        console.error('Error fetching bookings:', err);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div>
      <h2>View All Bookings</h2>
      <ul>
        {bookings.map((booking) => (
          <li key={booking.booking_id}>
            {booking.student_id} - Bus {booking.bus_id} - Seat {booking.seat_id}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Bookings;
