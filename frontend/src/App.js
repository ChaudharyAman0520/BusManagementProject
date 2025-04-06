// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BookingForm from './components/BookingForm';
import StudentLogin from './components/StudentLogin';
import StudentRegister from './components/StudentRegister';
import Dashboard from './components/Dashboard';
import SeatAllocator from './components/seatallocator';
import CheckSeatStatus from './components/CheckSeatStatus';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StudentLogin />} />
        <Route path="/register" element={<StudentRegister />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/booking" element={<BookingForm />} />
        <Route path="/seatallocator" element={<SeatAllocator />} />
        <Route path="/check-status" element={<CheckSeatStatus />} />

      </Routes>
    </Router>
  );
}

export default App;
