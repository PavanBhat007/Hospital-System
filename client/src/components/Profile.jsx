import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = ({ token }) => {
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/patient/profile', {
          headers: { Authorization: token }
        });
        setProfile(response.data);
        setRole(response.data.role);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile();
  }, [token]);

  if (!profile) return <div>Loading...</div>;

  return (
    <div>
      <h1>{role.charAt(0).toUpperCase() + role.slice(1)} Profile</h1>
      <p>Name: {profile.name}</p>
      <p>Age: {profile.age}</p>
      <p>Gender: {profile.gender}</p>
      {role === 'patient' && <p>Blood Group: {profile.bloodGroup}</p>}
      {role === 'doctor' && (
        <>
          <p>Specialty: {profile.specialty}</p>
          <p>Availability: {profile.availability}</p>
        </>
      )}
    </div>
  );
};

export default Profile;
