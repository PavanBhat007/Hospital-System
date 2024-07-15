import React, { useState } from 'react';

function Prescription() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [response, setResponse] = useState(null);
    const [uploadedFileName, setUploadedFileName] = useState('');
    const [imagePreview, setImagePreview] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        setUploadedFileName(file.name); // Set file name for display

        // Create a preview for image files
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!selectedFile) {
            console.error('No file selected');
            return;
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/prescription`);
            setResponse(res.data);
        } catch (error) {
            console.error('Error uploading the file', error);
        }
    };

    return (
        <div className='wrapper prescription'>
            <h2>Upload <span className='green-text-header'>Prescription</span> Image</h2>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} />
                <button type="submit">Upload</button>
            </form>
            {imagePreview && (
                <div>
                    <h3>Image Preview:</h3>
                    <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%' }} />
                </div>
            )}
            {uploadedFileName && (
                <p>Selected file: {uploadedFileName}</p>
            )}
            {response && (
                <div>
                    <h3>Response:</h3>
                    <pre>{JSON.stringify(response, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}

export default Prescription;
