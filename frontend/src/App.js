import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './App.css';
import BookSeat from './components/Bookseat';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/:studentId" element={<Dashboard />} />
        <Route path="/seat-layout/:busId/:studentId" element={<BookSeat />} />
      </Routes>
    </Router>
  );
}

export default App;
