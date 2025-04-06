import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentLogin.css';

function StudentLogin() {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!studentId || !password) {
      setError('Please enter both Student ID and Password');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId, password })
      });

      const data = await response.json();
      if (response.ok) {
        navigate('/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  const goToRegister = () => navigate('/register');

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>🎓 Student Login</h2>
        <input
          type="text"
          placeholder="Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
        {error && <p className="error-msg">{error}</p>}

        <div className="register-link">
          Don't have an account?{' '}
          <a href="/register" style={{ color: '#007bff', textDecoration: 'none' }}>
    Register here
         </a>
        </div>
      </div>
    </div>
  );
}

export default StudentLogin;
