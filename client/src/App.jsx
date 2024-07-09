import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MetaMaskLogin from './components/MetaMaskLogin';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Profile from './components/Profile';

const App = () => {
  const [account, setAccount] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogin = (account) => {
    setAccount(account);
  };

  const handleToken = (token) => {
    setToken(token);
  };


  return (
    <Router>
      <div>
        <h1>Hospital Management System</h1>
        <MetaMaskLogin onLogin={handleLogin} />
        <Routes>
          <Route path="/signup" element={<SignUp account={account} />} />
          <Route path="/login" element={<Login onLogin={handleToken} />} />
          <Route path="/profile" element={<Profile token={token} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
