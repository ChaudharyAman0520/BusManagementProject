import React, { useState } from 'react';
import './CheckSeatStatus.css';

function CheckSeatStatus() {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState('');
  const [seatInfo, setSeatInfo] = useState(null);
  const [error, setError] = useState('');

  const handleLocationChange = async (e) => {
    const location = e.target.value;
    setSelectedLocation(location);
    setSelectedBus('');
    setSeatInfo(null);

    try {
      const response = await fetch(`http://127.0.0.1:5000/buses/${location}`);
      const data = await response.json();
      if (response.ok) {
        setBuses(data.buses || []);
        setError('');
      } else {
        setBuses([]);
        setError(data.message || 'Failed to fetch buses');
      }
    } catch (err) {
      setBuses([]);
      setError('Error fetching buses');
    }
  };

  const handleBusChange = (e) => {
    setSelectedBus(e.target.value);
    setSeatInfo(null);
  };

  const handleCheckStatus = async () => {
    if (!selectedBus) {
      setError('Please select a bus');
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:5000/seat-status/${selectedBus}`);
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

  const renderSeatGrid = () => {
    const rows = ['1', '2', '3', '4', '5'];
    const cols = ['A', 'B', 'C', 'D'];
    const filled = seatInfo?.filled_seats || [];

    return (
      <div className="seat-grid">
        {rows.map((row) =>
          cols.map((col) => {
            const seatId = `${row}${col}`;
            const isFilled = filled.includes(seatId);
            return (
              <div
                key={seatId}
                className={`seat ${isFilled ? 'filled' : 'empty'}`}
              >
                {seatId}
              </div>
            );
          })
        )}
      </div>
    );
  };

  return (
    <div className="page-container">
      <div className="form-box">
        <h2>🚌 Check Seat Status</h2>

        <select value={selectedLocation} onChange={handleLocationChange}>
          <option value="">Select Location</option>
          <option value="Dehradun">Dehradun</option>
          <option value="Rishikesh">Rishikesh</option>
          <option value="Mussoorie">Mussoorie</option>
          <option value="Haridwar">Haridwar</option>
        </select>

        {buses.length > 0 && (
          <select value={selectedBus} onChange={handleBusChange}>
            <option value="">Select Bus</option>
            {buses.map((bus) => (
              <option key={bus} value={bus}>
                {bus}
              </option>
            ))}
          </select>
        )}

        <button onClick={handleCheckStatus}>Check Seat Status</button>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {seatInfo && (
          <div className="result-container">
            <h4>Filled Seats for Bus {selectedBus}</h4>
            {renderSeatGrid()}

            {/* Seat Legend */}
            <div className="seat-legend">
              <div className="legend-item">
                <div className="seat filled"></div>
                <span>Filled</span>
              </div>
              <div className="legend-item">
                <div className="seat empty"></div>
                <span>Empty</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CheckSeatStatus;
