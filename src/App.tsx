import React, { useState } from "react";
import './App.css';

const App = () => {
  // State to manage file inputs and responses for both stocks and sales files
  const [stocksFile, setStocksFile] = useState<File | null>(null);
  const [salesFile, setSalesFile] = useState<File | null>(null);
  const [responseMessage, setResponseMessage] = useState<string>("");

  // Generic file upload function
  const uploadFile = async (file: File | null, apiUrl: string) => {
    if (!file) {
      setResponseMessage("No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

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
