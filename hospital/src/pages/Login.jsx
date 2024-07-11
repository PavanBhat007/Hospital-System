import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

async function loginUser(credentials) {
  return fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
    .then(data => data.json());
}

export default function Login({ setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    let response = await loginUser({
      username,
      password
    });

    const token = response?.token
    const message = response?.message;

    console.log(response);
    if (token === 'LOGIN-SUCCESS') {
      setToken({ "username": username, "status": "authenticated" });
      navigate('/');
    } else {
      alert(message);
    }
  }

  return (
    <div className='wrapper'>
      <h2><span className='green-text'>Log-in</span> to continue ... </h2>
      <form onSubmit={handleSubmit}>
        <label>
          <p>Username</p>
          <input type="text" onChange={e => setUsername(e.target.value)} />
        </label>
        <label>
          <p>Password</p>
          <input type="password" onChange={e => setPassword(e.target.value)} />
        </label>
        <div>
          <button className="btn btn-submit" type="submit">Log In</button>
        </div>
      </form>
      <p className="info">
        Don't have an account? 
        <Link to="/signup">
          <span className='info-link'>Register here &#8599;</span>
        </Link>
      </p>
    </div>
  );
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
}
