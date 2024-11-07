import React, { useState } from 'react';
import './App.css';
import { useAuthenticator } from '@aws-amplify/ui-react';

const App: React.FC = () => {
  const { signOut } = useAuthenticator();
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!file) {
      alert("Please select a CSV file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://qvls5frwcc.execute-api.ap-south-1.amazonaws.com/V1/UploadLink_Anamay', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert("File uploaded successfully!");
      } else {
        alert("Failed to upload file.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("An error occurred while uploading the file.");
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>BBIL Production Department - Data Upload Interface</h1>
      <form onSubmit={handleSubmit}>
        <label>Select a CSV file to upload:</label>
        <br />
        <input type="file" name="file" accept=".csv" onChange={handleFileChange} />
        <br />
        <br />
        <input
          type="submit"
          value="Upload CSV File"
          style={{ backgroundColor: 'black', color: 'white', width: '150px', height: '40px' }}
        />
      </form>
    </div>
  );
};

export default App;
