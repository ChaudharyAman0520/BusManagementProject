import React from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  const goToSeatAllocator = () => navigate('/seatallocator');
  const goToSeatStatus = () => navigate('/check-status');

  return (
    <div style={styles.container}>
      <h2>Student Dashboard</h2>
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={goToSeatAllocator}>
          🎫 Allocate Seat
        </button>
        <button style={styles.button} onClick={goToSeatStatus}>
          📋 Check Seat Status
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '20px', textAlign: 'center' },
  buttonContainer: { marginTop: '20px' },
  button: {
    margin: '10px',
    padding: '15px 30px',
    fontSize: '16px',
    cursor: 'pointer',
    borderRadius: '6px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none'
  }
};

export default Dashboard;
