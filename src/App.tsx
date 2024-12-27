import React, { useState } from 'react';
import './App.css';
import { useAuthenticator } from '@aws-amplify/ui-react';

const App: React.FC = () => {
  const { signOut } = useAuthenticator();
  const [stocksFile, setStocksFile] = useState<File | null>(null);
  const [salesFile, setSalesFile] = useState<File | null>(null);
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [uploadStatus, setUploadStatus] = useState<{ [date: string]: string }>({});

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
    formData.append('file', file);

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setResponseMessage(data.message || "File uploaded successfully!");

        // Update upload status for the current date
        const today = new Date().toISOString().split('T')[0];
        setUploadStatus((prevStatus) => ({ ...prevStatus, [today]: 'green' }));
      } else {
        const errorText = await response.text();
        setResponseMessage(`Failed to upload file: ${errorText}`);
      }
    } catch (error) {
      console.error("Error:", error);
      setResponseMessage("An error occurred while uploading the file.");
    }
  };

  // Render calendar
  const renderCalendar = (date: Date) => {
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const daysArray = [];

    // Fill empty spaces before the start of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      daysArray.push(<td key={`empty-${i}`} className="empty"></td>);
    }

    // Fill days of the month with status colors
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
     // const statusClass = uploadStatus[dateKey] || 'red'; // Default to red if no upload status
      daysArray.push(
        <td key={day} className={`day ${statusClass}`}>
          {day}
        </td>
      );
    }

    const weeks = [];
    let week = [];
    for (let i = 0; i < daysArray.length; i++) {
      week.push(daysArray[i]);
      if (week.length === 7) {
        weeks.push(<tr key={`week-${weeks.length}`}>{week}</tr>);
        week = [];
      }
    }
    if (week.length > 0) {
      weeks.push(<tr key={`week-${weeks.length}`}>{week}</tr>);
    }

    return (
      <table className="calendar-table" style={{ padding: '10px', width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 50%' }}>
        <thead>
          <tr>
            <th>Sun</th>
            <th>Mon</th>
            <th>Tue</th>
            <th>Wed</th>
            <th>Thu</th>
            <th>Fri</th>
            <th>Sat</th>
          </tr>
        </thead>
        <tbody>{weeks}</tbody>
      </table>
    );
  };


  const nextMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  const prevMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));

  return (
   <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '90vw', backgroundColor: '#f8f8ff' }}>
      
      <header style={{ width: '100%' }}>
        <div style={{ width: '130px', height: '90px', overflow: 'hidden', borderRadius: '8px' }}>
          <img 
            style={{ padding: '10px', width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 50%' }} 
            src="https://media.licdn.com/dms/image/v2/C560BAQFim2B73E6nkA/company-logo_200_200/company-logo_200_200/0/1644228681907/anamaybiotech_logo?e=2147483647&v=beta&t=RnXx4q1rMdk6bI5vKLGU6_rtJuF0hh_1ycTPmWxgZDo" 
            alt="Company Logo" className="logo" 
          />
        </div>
        <button style={{ marginLeft: 'auto', marginRight: '20px' }} onClick={signOut}>Sign out</button>
      </header>

      <h1 style={{ padding: '10px', textAlign: 'center', width: '100vw' }}><u>Anamay - Dashboard Update interface</u></h1>

      {/* Stocks File Upload */}
      <div>
        <h2>&emsp;&emsp;Anamay Stocks</h2>
        <p style={{ padding: '10px', backgroundColor: '#e6e6e6', borderRadius: '8px',width: '50vw',height: '70px', float: 'left',verticalAlign:-'webkit-baseline-middle'}}>
          &emsp;&emsp;&emsp;&emsp;<input
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
        <p style={{ padding: '10px', backgroundColor: '#e6e6e6', borderRadius: '8px', width: '50vw',height: '70px',verticalAlign: '-webkit-baseline-middle' }}>
          &emsp;&emsp;&emsp;&emsp;<input
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
            Submit Sales File.
          </button>
        </p>
      </div>

      {responseMessage && <p>{responseMessage}</p>}

      {/* Calendar Component - Positioned at the top-right corner */}
      <div 
        style={{
          position: 'absolute',
          top: '40vh',  // Adjust based on your header height
          right: '10vw',
          width: '25vw',
          padding: '20px',
          backgroundColor: '#e6f7ff',
          borderRadius: '8px',
        }}
      >
        <h3 style={{ textAlign: 'center' }}>Calendar</h3>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <button onClick={prevMonth}>&lt; </button>
          <span style={{ margin: '0 10px' }}>
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={nextMonth}>&gt; </button>
        </div>
        {renderCalendar(currentDate)}
      </div>
    </main>
  );
};


export default App;
