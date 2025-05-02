import React, { useEffect, useState } from 'react';

function AdminBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/admin/bookings')
      .then(res => res.json())
      .then(data => setBookings(data.bookings || []))
      .catch(err => console.error('Failed to fetch bookings:', err));
  }, []);

  return (
    <div className="container">
      <h2>All Bookings</h2>
      <table className="styled-table">
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Student ID</th>
            <th>Bus ID</th>
            <th>Location</th>
            <th>Seat ID</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.booking_id}>
              <td>{b.booking_id}</td>
              <td>{b.student_id}</td>
              <td>{b.bus_id}</td>
              <td>{b.location}</td>
              <td>{b.seat_id}</td>
              <td>{new Date(b.booking_time).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminBookings;
