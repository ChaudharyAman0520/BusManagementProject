import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentLogin from './components/StudentLogin';
import StudentRegister from './components/StudentRegister';
import SeatAllocator from './components/seatallocator';
import CheckSeatStatus from './components/CheckSeatStatus';
import StudentProfile from './components/StudentProfile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StudentLogin />} />
        <Route path="/register" element={<StudentRegister />} />
        <Route path="/student-profile" element={<StudentProfile />} />
        <Route path="/seat-allocator" element={<SeatAllocator />} />
        <Route path="/check-seat-status" element={<CheckSeatStatus />} />
      </Routes>
    </Router>
  );
}

export default App;
