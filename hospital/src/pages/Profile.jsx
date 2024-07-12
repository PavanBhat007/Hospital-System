import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export default function Profile({ user_id, role }) {
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);

  const getProfile = async (user_id) => {
    const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/profile?user_id=${user_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    setProfile(data);
  };

  const getAppointments = async (user_id) => {
    const response = await fetch(
      `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/appointments?user_id=${user_id}&role=${role}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    const data = await response.json();
    setAppointments(data);
  };

  useEffect(() => {
    getProfile(user_id);
    getAppointments(user_id);
  }, [user_id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className='profile-wrapper'>
      {profile ? (
        <div className='profile'>
          <h2 className='page-header'><span className="green-text-header">{profile.username}</span>'s Profile</h2>
          <div className='profile-card'>
            <div className='profile-details'>
              <div className='flex-wrapper'><p>Email: </p><p>{profile.email}</p></div>
              <div className='flex-wrapper'><p>Date of Birth: </p><p>{new Date(profile.dob).toLocaleDateString()}</p></div>
              <div className='flex-wrapper'><p>Gender: </p><p>{profile.gender}</p></div>
              <div className='flex-wrapper'><p>Account Created: </p><p>{new Date(profile.createdAt).toLocaleDateString()}</p></div>
              {profile.role === 'doctor' && (
                <div className='flex-wrapper'><p>Specialty: </p><p>{profile.specialty}</p></div>
              )}
            </div>
            <div className='appointments'>
              <h3>Appointments</h3>
              {appointments.length > 0 ? (
                <ul>
                  {appointments.map(appointment => (
                    <li key={appointment.id}>
                        <p>{appointment.id}</p>
                        <p className='name'>
                          {profile.role === "user" ?
                            `Dr. ${appointment.doctor_name}` :
                            `${appointment.patient_name}`
                          }
                        </p>
                        <div className='appointment-date'>
                          <p>{formatDate(appointment.appointment_date)}</p>
                          <p>{formatTime(appointment.appointment_date)}</p>
                        </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No appointments found.</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
}

Profile.propTypes = {
  user_id: PropTypes.number.isRequired,
  role: PropTypes.string.isRequired,
};
