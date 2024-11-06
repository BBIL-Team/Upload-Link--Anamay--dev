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
      const response = await fetch('https://hdzrw9q8r2.execute-api.ap-south-1.amazonaws.com/V1/UploadLink_Anamay', {
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
        <div
          style={{
            top: '0',
            display: 'flex',
            flexDirection: 'column',
            padding: '0',
            width: '90vw',
            margin: '0',
            boxSizing: 'border-box',
            backgroundColor: '#FFF',
            position: 'relative',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <header>
            <img
              src="https://www.bharatbiotech.com/images/bharat-biotech-logo.jpg"
              alt="Company Logo"
              className="logo"
            />
            <button style={{ marginLeft: 'auto' }} onClick={signOut}>
              Sign out
            </button>
          </header>
          <h1>BBIL - Data Upload Interface</h1>
          <form onSubmit={handleSubmit}>
            <label>
              <strong>Select a CSV file to upload:</strong>
            </label>
            <br />
            <br />
            <input type="file" name="file" accept=".csv" onChange={handleFileChange} />
            <br />
            <br />
            <button
              type="submit"
              style={{ backgroundColor: 'black', color: 'white', width: '150px', height: '40px' }}
            >
              Upload CSV File
            </button>
          </form>
        </div>
  );
};

export default App;
