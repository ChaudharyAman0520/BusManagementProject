import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './Dashboard.css'; // Create this next

const DashboardLayout = () => {
  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <h2>🚍 Dashboard</h2>
        <ul>
          <li><Link to="/dashboard/allocate">Allocate Seat</Link></li>
          <li><Link to="/dashboard/check">Check Seat Status</Link></li>
          <li><Link to="/">Logout</Link></li>
        </ul>
      </aside>
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
