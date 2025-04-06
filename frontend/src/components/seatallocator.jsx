// src/components/SeatAllocator.jsx
import React, { useState } from 'react';
import { allocateSeat } from '../api/seatallocator';

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
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>🎫 Seat Allocation</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Student ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Bus ID"
            value={busId}
            onChange={(e) => setBusId(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Preferred Seat"
            value={preferredSeat}
            onChange={(e) => setPreferredSeat(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Allocate
          </button>
        </form>
        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(to right, #6a11cb, #2575fc)',
  },
  card: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  title: {
    marginBottom: '1.5rem',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '12px',
    margin: '10px 0',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  button: {
    width: '100%',
    padding: '12px',
    borderRadius: '6px',
    backgroundColor: '#007bff',
    color: '#fff',
    fontSize: '16px',
    border: 'none',
    cursor: 'pointer',
    marginTop: '10px',
  },
  message: {
    marginTop: '1rem',
    color: '#28a745',
    fontWeight: 'bold',
  },
};

export default SeatAllocator;
