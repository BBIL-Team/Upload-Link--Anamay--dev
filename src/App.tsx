import React, { useState } from 'react';
import './App.css';

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);

  // Handle file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  // Upload file function
 const uploadFile = async () => {
  if (!file) {
    alert("Please select a CSV file to upload.");
    return;
  }

  const formData = new FormData();
  formData.append('file', file); // Append the file to FormData with key 'file'

  try {
    const response = await fetch("https://qvls5frwcc.execute-api.ap-south-1.amazonaws.com/V1/UploadLink_Anamay", {
      method: "POST",
      body: formData, // Send FormData containing the file
      headers: {
        // Do not set Content-Type, FormData will automatically set it
      }
    });

    if (response.ok) {
      const data = await response.json();
      alert(data.message || "File uploaded successfully!");
    } else {
      alert("Failed to upload file.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while uploading the file.");
  }
};

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>BBIL Production Department - Data Upload Interface</h1>
      <label><strong>Select a CSV file to upload:</strong></label>
      <br />
      <input
        type="file"
        id="fileInput"
        accept=".csv"
        onChange={handleFileChange}
      />
      <br />
      <br />
      <button
        onClick={uploadFile}
        style={{ backgroundColor: 'black', color: 'white', width: '150px', height: '40px' }}
      >
        Upload CSV File
      </button>
    </div>
  );
};

export default App;
