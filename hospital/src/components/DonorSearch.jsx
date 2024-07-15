import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const DonorSearch = ({ user_id }) => {
  const [donors, setDonors] = useState([]);
  const [filterOrgans, setFilterOrgans] = useState('');
  
  
  const debounce = (func, delay) => {
    let timer;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(context, args), delay);
    };
  };

  
  const debouncedSetFilterOrgans = debounce((value) => {
    setFilterOrgans(value);
  }, 300);

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const url = filterOrgans 
            ? `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/filter-by-organs?organs=${encodeURIComponent(filterOrgans)}` 
            : `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/donors`;
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setDonors(data);
        } else {
          throw new Error('Failed to fetch donors');
        }
      } catch (error) {
        console.error('Error fetching donors:', error);
      }
    };

    fetchDonors();
  }, [filterOrgans]);

  return (
    <div className='donor-search'>
      <h2 className='green-text'>Find Other Donors</h2>
      <label>Filter by Organs:
        <input type="text" value={filterOrgans} onChange={(e) => debouncedSetFilterOrgans(e.target.value)} />
      </label>
      <ul>
        {donors.map((donor) => (
          <li key={donor.id}>
            <p><strong>Donor</strong>: {donor.username}</p>
            <p><strong>Donor's email</strong>: {donor.email}</p>
            <p><strong>Blood Type</strong>: {donor.bloodType}, </p>
            <p><strong>Organs</strong>: {donor.organDonation ? `${donor.organs}` : 'Not willing'} </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

DonorSearch.propTypes = {
  user_id: PropTypes.number.isRequired,
};

export default DonorSearch;
