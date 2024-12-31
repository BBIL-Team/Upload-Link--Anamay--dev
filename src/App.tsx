import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./App.css";

const App: React.FC = () => {
  const [stocksFile, setStocksFile] = useState<File | null>(null);
  const [salesFile, setSalesFile] = useState<File | null>(null);
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [markedDate, setMarkedDate] = useState<Date | null>(null);

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
    formData.append("file", file);

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setResponseMessage(data.message || "File uploaded successfully!");
        setMarkedDate(new Date()); // Mark the current day as successful
      } else {
        const errorText = await response.text();
        setResponseMessage(`Failed to upload file: ${errorText}`);
      }
    } catch (error) {
      console.error("Error:", error);
      setResponseMessage("An error occurred while uploading the file.");
    }
  };

  // Check if a date is marked
  const isDateMarked = (date: Date): boolean => {
    return !!markedDate && date.toDateString() === new Date().toDateString();
  };

  // Define the tileClassName function for the Calendar component
  const tileClassName = ({ date }: { date: Date }) => {
    if (isDateMarked(date)) {
      return "success-day"; // Add a custom class for marked dates
    }
    return null;
  };

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        width: "90vw",
        backgroundColor: "#f8f8ff",
      }}
    >
      <header style={{ width: "100%" }}>
        <div
          style={{
            width: "130px",
            height: "90px",
            overflow: "hidden",
            borderRadius: "8px",
          }}
        >
          <img
            style={{
              padding: "10px",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "50% 50%",
            }}
            src="https://media.licdn.com/dms/image/v2/C560BAQFim2B73E6nkA/company-logo_200_200/company-logo_200_200/0/1644228681907/anamaybiotech_logo?e=2147483647&v=beta&t=RnXx4q1rMdk6bI5vKLGU6_rtJuF0hh_1ycTPmWxgZDo"
            alt="Company Logo"
            className="logo"
          />
        </div>
      </header>

      <h1 style={{ padding: "10px", textAlign: "center", width: "100vw" }}>
        <u>Anamay - Dashboard Update Interface</u>
      </h1>

      {/* Stocks File Upload */}
      <div>
        <h2>&emsp;&emsp;Anamay Stocks</h2>
        <p
          style={{
            padding: "10px",
            backgroundColor: "#e6e6e6",
            borderRadius: "8px",
            width: "50vw",
            height: "70px",
          }}
        >
          &emsp;&emsp;&emsp;&emsp;
          <input
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
            Submit Stocks File
          </button>
        </p>
      </div>

      <hr />

      {/* Sales File Upload */}
      <div>
        <h2>&emsp;&emsp;Anamay Sales</h2>
        <p
          style={{
            padding: "10px",
            backgroundColor: "#e6e6e6",
            borderRadius: "8px",
            width: "50vw",
            height: "70px",
          }}
        >
          &emsp;&emsp;&emsp;&emsp;
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
            Submit Sales File
          </button>
        </p>
      </div>

      {responseMessage && <p>{responseMessage}</p>}

      <div className="calendar-section">
        <h2>Upload Calendar</h2>
        <Calendar tileClassName={tileClassName} />
      </div>
    </main>
  );
};

export default App;
