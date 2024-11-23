import React, { useState } from 'react';
import './ReviewDorm.css';

const ReviewDorm = ({ dorm }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    // Generate a preview URL for the selected file
    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Here you would typically handle the file upload to a server
    // For this example, we will just log the file to the console
    if (selectedFile) {
      console.log('File to upload:', selectedFile);

      // Clear the file input and preview after submission
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  return (
    <div className="review-dorm-container">
      <h1>Share your Dorm Pics and Videos</h1>
      <p>Don't have a pic? <a href="/rate">Rate</a></p>
      
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="fileInput">Upload a picture:</label>
          <input 
            type="file" 
            id="fileInput" 
            accept="image/*" 
            onChange={handleFileChange} 
          />
        </div>
        
        {previewUrl && (
          <div>
            <h3>Preview:</h3>
            <img src={previewUrl} alt="Selected file" />
          </div>
        )}

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ReviewDorm;