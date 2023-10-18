import React from 'react';
import { useSelector } from 'react-redux';

function Dashboard() {
  const user = useSelector((state) => state.user.user);
  console.log("indashboard:", user);

  return (
    <div>
      <h2>Welcome to the Dashboard, {user ? user.email : 'User'}!</h2>
      {/* Display user information, or a generic message if user is not available */}
    </div>
  );
}

export default Dashboard;

