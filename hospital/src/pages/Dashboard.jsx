import React from 'react';

function logout() {
  sessionStorage.clear();
  window.location.reload();
}

function Dashboard() {
  return (
    <div>
      Dashboard

      <button onClick={() => logout()}>Log Out</button>
    </div>
  )
}

export default Dashboard
