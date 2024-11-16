import React, { useState } from 'react';
import './App.css';

const App: React.FC = () => {
  const [stocksFile, setStocksFile] = useState<File | null>(null);
  const [salesFile, setSalesFile] = useState<File | null>(null);
  const [responseMessage, setResponseMessage] = useState<string>("");

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
    <div>
      <h1>File Upload</h1>

      {/* Stocks File Upload */}
      <div>
        <h2>Upload Stocks Data</h2>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setStocksFile(e.target.files?.[0] || null)}
        />
        <button
          onClick={() =>
            uploadFile(
              stocksFile,
              "https://qvls5frwcc.execute-api.ap-south-1.amazonaws.com/V1/UploadLink_Anamay"
            )
          }
        >
          Upload Stocks File
        </button>
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
          onClick={() =>
            uploadFile(
              salesFile,
              "https://azjfhu323b.execute-api.ap-south-1.amazonaws.com/S1/UploadLinkAnamay_Sales"
            )
          }
        >
          Upload Sales File
        </button>
      </div>

      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default App;
