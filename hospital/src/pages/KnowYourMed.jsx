import React, { useState } from 'react';

function KnowYourMed() {
    const [medData, setMedData] = useState(null);

    async function getMedData(medicine) {
        try {
            const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/know-your-med?med=${medicine}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching medication data:', error);
            return null;
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const medicine = e.target.elements.medInput.value;
        const medData = await getMedData(medicine);
        setMedData(medData);
    };

    return (
        <div className='wrapper kym'>
            <h2 class="green-text-header">Know Your Med</h2>
            <form onSubmit={handleSubmit}>
                <label> 
                    <input type="text" name="medInput" placeholder="Enter medicine name" />
                    <button className='btn btn-submit' type="submit">Search</button>
                </label>
            </form>
            {medData ? (
                <div class="med-details">
                    <h2>{medData.Name}</h2>
                    <p><strong>Description</strong>: {medData.Description}</p>
                    <p><strong>Usage</strong>: {medData.Usage ? medData.Usage : "No data available. Check the description."}</p>
                    <p><strong>Side Effects</strong>: {medData.SideEffects ? medData.SideEffects : "No data available. Check the description."}</p>
                    <p><strong>Alternatives</strong>: {medData.Alternatives}</p>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default KnowYourMed;
