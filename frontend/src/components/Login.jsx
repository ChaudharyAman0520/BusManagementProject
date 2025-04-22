import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // ✅ include Link

function Login() {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId, password }),
      });

      const data = await response.json();
      if (data.status === 'success') {
        setMessage('Login successful!');
        setTimeout(() => navigate(`/dashboard/${studentId}`), 1500);
      } else {
        setMessage(data.message || 'Login failed.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>

      {message && <p>{message}</p>}

      <p>
        Don’t have an account? <Link to="/register">Register here</Link>
      </p> {/* ✅ Add this line */}
    </div>
  );
}

export default Login;
