import React, { useState } from 'react';
import './App.css';
import { useAuthenticator } from '@aws-amplify/ui-react';

const App: React.FC = () => {
  const { signOut } = useAuthenticator();
  const [stocksFile, setStocksFile] = useState<File | null>(null);
  const [salesFile, setSalesFile] = useState<File | null>(null);
  const [responseMessage, setResponseMessage] = useState<string>("");

  // Validate file type
  const validateFile = (file: File | null): boolean => {
    if (file && file.name.endsWith(".csv")) {
      return true;
    }
    alert("Please upload a valid CSV file.");
    return false;
  };

  // Upload file function
  const uploadFile = async (file: File | null, apiUrl: string) => {
    if (!file) {
      alert("Please select a CSV file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file); // Append the file to FormData with key 'file'

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setResponseMessage(data.message || "File uploaded successfully!");
      } else {
        const errorText = await response.text();
        setResponseMessage(`Failed to upload file: ${errorText}`);
      }
    } catch (error) {
      console.error("Error:", error);
      setResponseMessage("An error occurred while uploading the file.");
    }
  };

  return (
    <main style={{ display: 'flex', justifyContent: 'center', width: '90vw', backgroundColor: '#f8f8ff' }}> 
    <div>
      <header style={{ width: '100%' }}>
                <img src="https://media.licdn.com/dms/image/v2/C560BAQFim2B73E6nkA/company-logo_200_200/company-logo_200_200/0/1644228681907/anamaybiotech_logo?e=2147483647&v=beta&t=RnXx4q1rMdk6bI5vKLGU6_rtJuF0hh_1ycTPmWxgZDo" alt="Company Logo" className="logo" />
                <button style={{ marginLeft: 'auto' }} onClick={signOut}>Sign out</button>
            </header>
      <h1>File Upload</h1>

      {/* Stocks File Upload */}
      <div>
        <h2>Upload Stocks Data</h2>
        <p>&emsp;&emsp;<input
          type="file"
          accept=".csv"
          onChange={(e) => setStocksFile(e.target.files?.[0] || null)}
        />
        <button
          onClick={() => {
            if (validateFile(stocksFile)) {
              uploadFile(
                stocksFile,
                "https://qvls5frwcc.execute-api.ap-south-1.amazonaws.com/V1/UploadLink_Anamay"
              );
            }
          }}
        >
          Upload Stocks File
        </button></p>
      </div>

      <hr />

      {/* Sales File Upload */}
      <div>
        <h2>Upload Sales Data</h2>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setSalesFile(e.target.files?.[0] || null)}
        />
        <button
          onClick={() => {
            if (validateFile(salesFile)) {
              uploadFile(
                salesFile,
                "https://azjfhu323b.execute-api.ap-south-1.amazonaws.com/S1/UploadLinkAnamay_Sales"
              );
            }
          }}
        >
          Upload Sales File
        </button>
      </div>

      {responseMessage && <p>{responseMessage}</p>}
    </div>
      </main>
  );
};

export default App;
