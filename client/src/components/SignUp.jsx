import React, { useState } from 'react';
import axios from 'axios';

const SignUp = ({ account }) => {
  const [role, setRole] = useState('patient');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [password, setPassword] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [availability, setAvailability] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/signup', {
        address: account,
        password,
        role,
        name,
        age,
        gender,
        bloodGroup,
        specialty,
        availability
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Role:</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
        </select>
      </div>
      <div>
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label>Age:</label>
        <input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
      </div>
      <div>
        <label>Gender:</label>
        <input type="text" value={gender} onChange={(e) => setGender(e.target.value)} />
      </div>
      {role === 'patient' && (
        <div>
          <label>Blood Group:</label>
          <input type="text" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} />
        </div>
      )}
      {role === 'doctor' && (
        <>
          <div>
            <label>Specialty:</label>
            <input type="text" value={specialty} onChange={(e) => setSpecialty(e.target.value)} />
          </div>
          <div>
            <label>Availability:</label>
            <input type="text" value={availability} onChange={(e) => setAvailability(e.target.value)} />
          </div>
        </>
      )}
      <div>
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default SignUp;
