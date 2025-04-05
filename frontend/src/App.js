// src/App.js
import React, { useState } from 'react';
import BookingForm from './components/BookingForm';
import './App.css'; // Import your CSS file for styling

function App() {
  const [loading, setLoading] = useState(false);

  const handleLoading = (isLoading) => {
    setLoading(isLoading);
  };

  return (
    <div className="App">
      <h1>Bus Seat Allocation System</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <BookingForm onLoading={handleLoading} />
      )}
    </div>
  );
}

export default App;