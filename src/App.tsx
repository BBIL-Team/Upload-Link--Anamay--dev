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
      const statusClass = uploadStatus[dateKey] || 'red'; // Default to red if no upload status
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
      <table className="calendar-table">
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
    <main>
      <header>
        <h1>Dashboard</h1>
        <button onClick={signOut}>Sign out</button>
      </header>

      <div>
        <input type="file" onChange={(e) => setStocksFile(e.target.files?.[0] || null)} />
        <button onClick={() => validateFile(stocksFile) && uploadFile(stocksFile, 'STOCKS_API_URL')}>
          Upload Stocks File
        </button>

        <input type="file" onChange={(e) => setSalesFile(e.target.files?.[0] || null)} />
        <button onClick={() => validateFile(salesFile) && uploadFile(salesFile, 'SALES_API_URL')}>
          Upload Sales File
        </button>
      </div>

      {responseMessage && <p>{responseMessage}</p>}

      <div>
        <button onClick={prevMonth}>Previous</button>
        <button onClick={nextMonth}>Next</button>
        {renderCalendar(currentDate)}
      </div>
    </main>
  );
};

export default App;
