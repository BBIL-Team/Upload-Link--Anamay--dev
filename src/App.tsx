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

  // Helper function to encode the file to Base64
  const encodeFileToBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);  // This encodes the file as base64
      reader.onloadend = () => {
        resolve(reader.result as string);  // Exclude the "data:..." prefix
      };
      reader.onerror = reject;
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!file) {
      alert("Please select a CSV file to upload.");
      return;
    }

    try {
      // Convert the file to base64
      const base64File = await encodeFileToBase64(file);
      const base64Data = base64File.split(',')[1]; // Remove the prefix "data:;base64,"

      // Send the base64 string directly to the API
      const response = await fetch('https://qvls5frwcc.execute-api.ap-south-1.amazonaws.com/V1/UploadLink_Anamay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',  // Use JSON because we're sending the base64 string as part of a JSON payload
        },
        body: JSON.stringify({ body: base64Data }),  // Send base64-encoded file data
      });

      if (response.ok) {
        alert("File uploaded successfully!");
      } else {
        const errorData = await response.json();
        console.error("Error response from server:", errorData);
        alert(`Failed to upload file. Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("An error occurred while uploading the file.");
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <button style={{ marginLeft: 'auto' }} onClick={signOut}>Sign out</button>
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
