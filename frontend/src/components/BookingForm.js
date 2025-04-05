// src/components/BookingForm.js
import React, { useState } from 'react';
import { allocateSeat } from '../api/seatallocator';

function BookingForm() {
  const [studentId, setStudentId] = useState('');
  const [busId, setBusId] = useState('');
  const [seat, setSeat] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await allocateSeat(studentId, busId, seat);
      setMessage(result.message);
    } catch (err) {
      setMessage('Failed to allocate seat.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Student ID" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
      <input placeholder="Bus ID" value={busId} onChange={(e) => setBusId(e.target.value)} />
      <input placeholder="Preferred Seat" value={seat} onChange={(e) => setSeat(e.target.value)} />
      <button type="submit">Book Seat</button>
      <p>{message}</p>
    </form>
  );
}

export default BookingForm;
