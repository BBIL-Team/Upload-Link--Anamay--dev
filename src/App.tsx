import React, { useState } from 'react';
import './App.css';
import { useAuthenticator } from '@aws-amplify/ui-react';

const App: React.FC = () => {
  const { signOut } = useAuthenticator();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string>('');

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

    const reader = new FileReader();
    reader.onloadend = async () => {
      const csvData = reader.result?.toString();

      if (csvData) {
        // No validation on frontend, just send the CSV data to Lambda

        setStatus('Uploading...');
        setError('');

        try {
          const response = await fetch('https://qvls5frwcc.execute-api.ap-south-1.amazonaws.com/V1/UploadLink_Anamay', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ body: csvData }),
          });

          if (response.ok) {
            setStatus('File uploaded successfully!');
            alert("File uploaded successfully!");
          } else {
            setStatus('Failed to upload file.');
            setError('Failed to upload file to the server.');
          }
        } catch (err) {
          setStatus('Error occurred while uploading.');
          setError('An error occurred while uploading the file.');
        }
      } else {
        setStatus('Error reading file.');
        setError('Failed to read the file.');
      }
    };

    reader.readAsText(file);  // Read the file as plain text
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

      {status && <p style={{ color: status === 'File uploaded successfully!' ? 'green' : 'red' }}>{status}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default App;
