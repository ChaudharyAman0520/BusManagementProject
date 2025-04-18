// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard'; // Import Dashboard component
import BookSeat from './components/Bookseat'; // You will need to create this component
import CheckSeatStatus from './components/Checkseatstatus'; // You will need to create this component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/book-seat" element={<BookSeat />} />
        <Route path="/check-seat-status" element={<CheckSeatStatus />} />
        <Route path="/" element={<Login />} /> {/* Default route to Login */}
      </Routes>
    </Router>
  );
}

export default App;
