import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Placeholder logic for admin login
    if (username === 'admin' && password === 'admin123') {
      navigate('/admin-dashboard');
    } else {
      setMessage('Invalid credentials, please try again.');
    }
  };

  return (
    <div className="container">
      <h2>Admin Login</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default AdminLogin;
