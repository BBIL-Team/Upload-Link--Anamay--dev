import React, { useState } from "react";

const App = () => {
  // State to manage file inputs and responses for both stocks and sales files
  const [stocksFile, setStocksFile] = useState<File | null>(null);
  const [salesFile, setSalesFile] = useState<File | null>(null);
  const [stocksResponse, setStocksResponse] = useState<string>("");
  const [salesResponse, setSalesResponse] = useState<string>("");

  // Handle file selection for stocks
  const handleStocksFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setStocksFile(event.target.files[0]);
    }
  };

  // Handle file selection for sales
  const handleSalesFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSalesFile(event.target.files[0]);
    }
  };

  // Upload the stocks data file
  const uploadStocksFile = async () => {
    if (!stocksFile) {
      setStocksResponse("No stocks file selected.");
      return;
    }

   const response = await fetch(" https://qvls5frwcc.execute-api.ap-south-1.amazonaws.com/V1/UploadLink_Anamay", {
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
  // Upload the sales data file
  const uploadSalesFile = async () => {
    if (!salesFile) {
      setSalesResponse("No sales file selected.");
      return;
    }

    try {
      const response = await fetch(" https://azjfhu323b.execute-api.ap-south-1.amazonaws.com/S1/UploadLinkAnamay_Sales", {
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
    <div>
      <h1>File Upload</h1>

      {/* Stocks File Upload */}
      <div>
        <h2>Upload Stocks Data</h2>
        <input type="file" accept=".csv" onChange={handleStocksFileChange} />
        <button onClick={uploadStocksFile}>Upload Stocks File</button>
        {stocksResponse && <p>{stocksResponse}</p>}
      </div>

      <hr />

      {/* Sales File Upload */}
      <div>
        <h2>Upload Sales Data</h2>
        <input type="file" accept=".csv" onChange={handleSalesFileChange} />
        <button onClick={uploadSalesFile}>Upload Sales File</button>
        {salesResponse && <p>{salesResponse}</p>}
      </div>
    </div>
  );
};

export default App;
