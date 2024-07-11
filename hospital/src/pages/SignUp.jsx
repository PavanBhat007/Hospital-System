import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

async function signupUser(credentials) {
  return fetch('http://localhost:5000/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
    .then(data => data.json());
}

export default function SignUp({ setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    const response = await signupUser({
      username,
      password
    });

    const token = response?.token
    const message = response?.message;

    console.log(response);

    if (token === 'SIGNUP-SUCCESS') {
      setToken({ "username": username, "status": "authenticated" });
      navigate('/');
    } else {
      alert(message);
    }
  }

  return (
    <div className='signup-wrapper'>
      <h2>Sign Up</h2>
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
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

SignUp.propTypes = {
  setToken: PropTypes.func.isRequired,
}
