import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import BookSeat from './components/Bookseat';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
//import ManageBuses from './components/ManageBuses';
import Bookings from './components/Bookings';  // Import Bookings
import ManageSeats from './components/ManageSeats';  // Import ManageSeats
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Student Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/:studentId" element={<Dashboard />} />
        <Route path="/seat-layout/:busId/:studentId" element={<BookSeat />} />

        {/* Admin Routes */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin/bookings" element={<Bookings />} />  {/* Add Bookings Route */}
        <Route path="/admin/seats" element={<ManageSeats />} />  {/* Add ManageSeats Route */}
      </Routes>
    </Router>
  );
}

export default App;
