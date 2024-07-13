import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Donation = ({ user_id }) => {
  const [bloodType, setBloodType] = useState('');
  const [organDonation, setOrganDonation] = useState(false);
  const [organs, setOrgans] = useState('');

  const handleDonationSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/donors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id, bloodType, organDonation, organs }),
      });
      if (response.ok) {
        alert('Donation form submitted successfully');
      } else {
        alert('Failed to submit donation form');
        window.location.reload();
      }
    } catch (error) {
      alert('Error submitting donation form:', error);
      window.location.reload();
    }
  };

  return (
    <div>
      <h2>Organ and Blood Donation</h2>
      <form onSubmit={handleDonationSubmit}>
        <label>Blood Type:</label>
        <input type="text" value={bloodType} onChange={(e) => setBloodType(e.target.value)} />

        <label>Organ Donor:</label>
        <input type="checkbox" checked={organDonation} onChange={(e) => setOrganDonation(e.target.checked)} />

        {organDonation && (
          <>
            <label>Organs to Donate:</label>
            <input type="text" value={organs} onChange={(e) => setOrgans(e.target.value)} />
          </>
        )}

        <button type="submit">Submit Donation Form</button>
      </form>
    </div>
  );
};

Donation.propTypes = {
  user_id: PropTypes.number.isRequired,
};

export default Donation;
