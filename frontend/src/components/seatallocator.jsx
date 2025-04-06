import React, { useState } from 'react';
import { allocateSeat } from '../api/seatallocator';
import './SeatAllocator.css';


function SeatAllocator() {
  const [studentId, setStudentId] = useState('');
  const [busId, setBusId] = useState('');
  const [preferredSeat, setPreferredSeat] = useState('');
  const [message, setMessage] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await allocateSeat(studentId, busId, preferredSeat);
    setMessage(result.message || 'Failed');
  };

  return (
    <div className="page-container">
      <div className="form-box">
        <h2>🎫 Seat Allocation</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Student ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Bus ID"
            value={busId}
            onChange={(e) => setBusId(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Preferred Seat"
            value={preferredSeat}
            onChange={(e) => setPreferredSeat(e.target.value)}
            required
          />
          <button type="submit">Allocate</button>
        </form>
        <div className="result-container">
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
}

export default SeatAllocator;
