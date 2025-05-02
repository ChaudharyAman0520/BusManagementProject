import React, { useEffect, useState } from 'react';

function ManageSeats() {
  const [seats, setSeats] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/admin/seats')
      .then((res) => res.json())
      .then((data) => setSeats(data.seats || []));
  }, []);

  const handleRemoveSeat = async (seatId) => {
    const confirm = window.confirm('Are you sure you want to remove this seat?');
    if (!confirm) return;
  
    try {
      const res = await fetch(`http://localhost:5000/admin/remove-seat/${seatId}`, {
        method: 'DELETE',
      });
  
      if (!res.ok) {
        throw new Error('Failed to remove seat: ' + res.statusText);
      }
  
      const data = await res.json();
      if (data.status === 'success') {
        alert('Seat removed!');
        setSeats((prev) => prev.filter((seat) => seat.seat_id !== seatId));
      } else {
        alert('Failed to remove seat.');
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };
  

  return (
    <div className="container">
      <h2>Manage Seats</h2>
      <table className="styled-table">
        <thead>
          <tr>
            <th>Seat ID</th>
            <th>Bus ID</th>
            <th>Location</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {seats.map((seat) => (
            <tr key={seat.seat_id}>
              <td>{seat.seat_id}</td>
              <td>{seat.bus_id}</td>
              <td>{seat.location}</td>
              <td>{seat.status}</td>
              <td>
                <button onClick={() => handleRemoveSeat(seat.seat_id)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageSeats;
