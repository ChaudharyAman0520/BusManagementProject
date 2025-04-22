import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId, name, password }),
      });

      const data = await response.json();
      if (data.status === 'success') {
        setMessage('Registration successful!');
        setTimeout(() => navigate('/login'), 1500);  // Redirect to login after 1.5 sec
      } else {
        setMessage(data.message || 'Registration failed.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Register;
