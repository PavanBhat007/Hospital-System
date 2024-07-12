import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

async function signupUser(userdata) {
  return fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userdata)
  })
    .then(data => data.json());
}

export default function SignUp({ setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [role, setRole] = useState("user");
  const [specialty, setSpecialty] = useState("");
  const [showSpecialty, setShowSpecialty] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (role === 'Doctor') {
      setShowSpecialty(true);
    } else {
      setShowSpecialty(false);
    }
  }, [role]);

  const handleSubmit = async e => {
    e.preventDefault();
    const userData = {
      username,
      password,
      email,
      dob,
      gender,
      role,
    };

    if (role === 'Doctor') {
      userData.specialty = specialty;
    } else {
      userData.specialty = "";
    }

    const response = await signupUser(userData);

    const token = response?.token;
    const message = response?.message;

    console.log(response);

    if (token === 'SIGNUP-SUCCESS') {
      navigate('/login');
    } else {
      alert(message);
    }
  }

  return (
    <div className='wrapper'>
      <h2><span className='green-text'>Register</span> a new account</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <p>Name</p>
          <input type="text" onChange={e => setUsername(e.target.value)} />
        </label>
        <label>
          <p>Email</p>
          <input type="email" onChange={e => setEmail(e.target.value)} />
        </label>
        <label>
          <p>Password</p>
          <input type="password" onChange={e => setPassword(e.target.value)} />
        </label>
        <label>
          <p>Date of birth</p>
          <input type="date" onChange={e => setDob(e.target.value)} />
        </label>
        <label>
          <p>Gender</p>
          <div className='flex-container'>
            <div className='radio-input'>
              <input type="radio" name="gender" value="Male" id="male" onChange={e => setGender(e.target.value)} />
              <label htmlFor="male">Male</label>
            </div>
            <div className='radio-input'>
              <input type="radio" name="gender" value="Female" id="female" onChange={e => setGender(e.target.value)} />
              <label htmlFor="female">Female</label>
            </div>
          </div>
        </label>
        <label>
          <p>Role</p>
          <div className='flex-container'>
            <div className='radio-input'>
              <input type="radio" name="role" value="User" id="user" onChange={e => setRole(e.target.value)} />
              <label htmlFor="user">User</label>
            </div>
            <div className='radio-input'>
              <input type="radio" name="role" value="Doctor" id="doctor" onChange={e => setRole(e.target.value)} />
              <label htmlFor="doctor">Doctor</label>
            </div>
          </div>
        </label>
        {showSpecialty && (
          <label id="specialty">
            <p>Specialty</p>
            <input type="text" onChange={e => setSpecialty(e.target.value)} />
          </label>
        )}
        <div>
          <button className='btn btn-submit' type="submit">Register</button>
        </div>
      </form>
      <p className="info">
        Already have an account? 
        <Link to="/login">
          <span className='info-link'>Log In &#8599;</span>
        </Link>
      </p>
    </div>
  );
}

SignUp.propTypes = {
  setToken: PropTypes.func.isRequired,
}
