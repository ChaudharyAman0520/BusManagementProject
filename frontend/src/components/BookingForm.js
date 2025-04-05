// src/components/BookingForm.js
import React, { useState } from 'react';
import { allocateSeat } from '../api/seatallocator';

function BookingForm({ onLoading }) {
  const [studentId, setStudentId] = useState('');
  const [busId, setBusId] = useState('');
  const [seat, setSeat] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!studentId || !busId || !seat) {
      setMessage('Please fill in all fields.');
      return;
    }

    setMessage(''); // Clear previous message
    onLoading(true); // Set loading state to true

    try {
      const result = await allocateSeat(studentId, busId, seat);
      setMessage(result.message);
    } catch (err) {
      setMessage('Failed to allocate seat.');
    } finally {
      onLoading(false); // Set loading state to false
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px', margin: 'auto' }}>
      <input
        placeholder="Student ID"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
        required
      />
      <input
        placeholder="Bus ID"
        value={busId}
        onChange={(e) => setBusId(e.target.value)}
        required
      />
      <input
        placeholder="Preferred Seat"
        value={seat}
        onChange={(e) => setSeat(e.target.value)}
        required
      />
      <button type="submit">Book Seat</button>
      {message && <p style={{ color: 'red' }}>{message}</p>}
    </form>
  );
}

export default BookingForm;