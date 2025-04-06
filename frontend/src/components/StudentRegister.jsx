import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentLogin.css'; // Reuse login styling

function StudentRegister() {
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId, name, password }),
      });

      const data = await response.json();
      if (response.ok) {
        navigate('/');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Error registering user');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>🎓 Student Register</h2>
        <input
          type="text"
          placeholder="Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleRegister}>Register</button>

        {error && <p className="error-msg">{error}</p>}

        <p>
          Already have an account?{' '}
          <a href="/">Login here</a>
        </p>
      </div>
    </div>
  );
}

export default StudentRegister;
