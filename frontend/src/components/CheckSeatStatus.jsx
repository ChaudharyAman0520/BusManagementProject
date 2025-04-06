// src/components/CheckSeatStatus.jsx
import React, { useState } from 'react';

function CheckSeatStatus() {
  const [busId, setBusId] = useState('');
  const [seatInfo, setSeatInfo] = useState(null);
  const [error, setError] = useState('');

  const handleCheckStatus = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/seat-status/${busId}`);
      const data = await response.json();
      if (response.ok) {
        setSeatInfo(data);
        setError('');
      } else {
        setSeatInfo(null);
        setError(data.message || 'Failed to fetch seat status');
      }
    } catch (err) {
      setSeatInfo(null);
      setError('Error fetching seat status');
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>🚌 Check Seat Status</h2>
        <input
          type="text"
          placeholder="Enter Bus ID"
          value={busId}
          onChange={(e) => setBusId(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleCheckStatus} style={styles.button}>
          Check
        </button>

        {error && <p style={styles.error}>{error}</p>}

        {seatInfo && (
          <div style={styles.results}>
            <h3>Filled Seats for Bus {busId}</h3>
            <ul>
              {seatInfo.filled_seats.map((seat, index) => (
                <li key={index}>Seat {seat}</li>
              ))}
            </ul>
          </div>
        )}
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
  error: {
    color: 'red',
    marginTop: '1rem',
    fontWeight: 'bold',
  },
  results: {
    marginTop: '1.5rem',
    textAlign: 'left',
  },
};

export default CheckSeatStatus;
