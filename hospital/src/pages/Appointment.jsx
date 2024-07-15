import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Calendar from "../components/Calendar";
import GMeet from '../components/GMeet';

async function fetchDoctors() {
  const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/doctors`);
  const data = await response.json();
  return data;
}

async function bookAppointment(appointment) {
  const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/appointment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(appointment)
  });
  const data = await response.json();
  return data;
}

export default function Appointment({ user_id }) {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');

  useEffect(() => {
    fetchDoctors().then(data => setDoctors(data));
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    const response = await bookAppointment({
      user_id,
      doctor_id: selectedDoctor,
      appointment_date: appointmentDate
    });

    if (response.message === "Appointment created successfully") {
      alert("Appointment booked successfully!");
    } else {
      alert("Failed to book appointment.");
    }
  }

  return (
    <div>
      <div className='appointment-wrapper'>
        <h2>Book an <span className='green-text-header'>Appointment</span></h2>
        <form onSubmit={handleSubmit}>
          <label>
            <p>Select Doctor</p>
            <select onChange={e => setSelectedDoctor(e.target.value)} value={selectedDoctor}>
              <option value="" disabled>Select Doctor</option>
              {doctors.map(doctor => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.username} -- {doctor.specialty}
                </option>
              ))}
            </select>
          </label>
          <label>
            <p>Appointment Date</p>
            <input type="datetime-local" onChange={e => setAppointmentDate(e.target.value)} />
          </label>
          <div>
            <button className='btn btn-submit' type="submit">Book Appointment</button>
          </div>
        </form>
      </div>
    </div>
  );
}

Appointment.propTypes = {
  user_id: PropTypes.number.isRequired,
}
