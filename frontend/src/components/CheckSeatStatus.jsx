import React, { useState } from 'react';
import './CheckSeatStatus.css';


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
    <div className="page-container">
      <div className="form-box">
        <h2>🚌 Check Seat Status</h2>
        <input
          type="text"
          placeholder="Enter Bus ID"
          value={busId}
          onChange={(e) => setBusId(e.target.value)}
        />
        <button onClick={handleCheckStatus}>Check</button>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {seatInfo && (
          <div className="result-container">
            <h4>Filled Seats for Bus {busId}</h4>
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

export default CheckSeatStatus;
