import React, { useState } from 'react';
import PropTypes from 'prop-types';
import DonorSearch from '../components/DonorSearch';

const Donation = ({ user_id }) => {
  const [bloodType, setBloodType] = useState('');
  const [organDonation, setOrganDonation] = useState(false);
  const [organs, setOrgans] = useState('');

  const handleDonationSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/new-donor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id, bloodType, organDonation, organs }),
      });
      if (response.ok) {
        alert('Donation form submitted successfully');
        console.log(response.json());
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
    <div className='wrapper donate'>
      <h2 className='green-text-header'>Organ and Blood Donation</h2>
      <form onSubmit={handleDonationSubmit}>
        <label>Blood Type:
          <input type="text" value={bloodType} onChange={(e) => setBloodType(e.target.value)} />
        </label>
        <label>Organ Donor (click on the green box):
          <input type="checkbox" id="chkbox" checked={organDonation} onChange={(e) => setOrganDonation(e.target.checked)} />
          <span class="custom-checkbox"></span>
        </label>
        {organDonation && (
          <>
            <label>Organs to Donate:
              <input type="text" value={organs} onChange={(e) => setOrgans(e.target.value)} />
            </label>
          </>
        )}

        <button className='btn btn-submit' type="submit">Pledge Donation</button>
      </form>
      <DonorSearch user_id={user_id} />
    </div>
  );
};

Donation.propTypes = {
  user_id: PropTypes.number.isRequired,
};

export default Donation;
