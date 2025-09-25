import React from 'react';
import './App.css';
import { useAuthenticator } from '@aws-amplify/ui-react';

// Custom type for user object
interface CustomUser {
  username?: string;
  userId?: string;
  attributes?: {
    [key: string]: string | undefined;
    email?: string;
    'custom:email'?: string;
    preferred_username?: string;
    email_verified?: string;
    sub?: string;
    identities?: string;
  };
  signInUserSession?: {
    idToken?: {
      payload?: {
        [key: string]: string | undefined;
        email?: string;
        'custom:email'?: string;
        sub?: string;
      };
    };
  };
  signInDetails?: {
    loginId?: string;
    authFlowType?: string;
  };
}

const MainDashboard: React.FC = () => {
  const { signOut } = useAuthenticator();
  const [stocksFile, setStocksFile] = React.useState<File | null>(null);
  const [salesFile, setSalesFile] = React.useState<File | null>(null);
  const [superStockistFile, setSuperStockistFile] = React.useState<File | null>(null);
  const [responseMessage, setResponseMessage] = React.useState<string>("");
  const [currentDate, setCurrentDate] = React.useState<Date>(new Date());
  const [currentYear, setCurrentYear] = React.useState<number>(new Date().getFullYear());
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = React.useState<{ [key: string]: string }>({});
  const [yearlyUploadStatus, setYearlyUploadStatus] = React.useState<{ [key: string]: string }>({});
  
  React.useEffect(() => {
    fetchUploadStatus();
  }, [currentDate]);

  React.useEffect(() => {
    fetchYearlyUploadStatus();
  }, [currentYear]);

  const fetchUploadStatus = async () => {
    try {
      const response = await fetch("https://9a9fn3wa2l.execute-api.ap-south-1.amazonaws.com/D1/deepshikatest");
      if (response.ok) {
        const data = await response.json();
        console.log("API Response:", data);
        setUploadStatus(data);
      } else {
        console.error("Failed to fetch upload status, status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching upload status:", error);
    }
  };

 const fetchYearlyUploadStatus = async () => {
    try {
      const response = await fetch("https://evxnr8qxgh.execute-api.ap-south-1.amazonaws.com/T1/Anamay_SuperStockist_Stocks_Tracker");
      if (response.ok) {
        const data = await response.json();
        console.log("Yearly API Response:", data);
        setYearlyUploadStatus(data);
      } else {
        console.error("Failed to fetch yearly upload status, status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching yearly upload status:", error);
    }
  };

  const getDateColor = (date: string): string => {
    if (uploadStatus[date]) return uploadStatus[date];
    const today = new Date();
    const givenDate = new Date(date);
    const marchFirst = new Date(2025, 2, 1);
    if (givenDate >= marchFirst && givenDate <= today) {
      return "#ffff66"; // Yellow
    }
    return "white";
  };

// Modified function to get color for a month based only on Lambda response
  const getMonthColor = (year: number, month: number): string => {
    const monthString = `${year}-${(month + 1).toString().padStart(2, '0')}`;
    return yearlyUploadStatus[monthString] || "white";
  };
  
  const validateFile = (file: File | null): boolean => {
    if (file && file.name.endsWith(".csv")) {
      return true;
    }
    alert("Please upload a valid CSV file.");
    return false;
  };

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
      } else {
        const errorText = await response.text();
        setResponseMessage(`Failed to upload file: ${errorText}`);
      }
    } catch (error) {
      console.error("Error:", error);
      setResponseMessage("An error occurred while uploading the file.");
    }

    setIsModalOpen(true);
  };

  const renderCalendar = (date: Date) => {
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const daysArray = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      daysArray.push(<td key={`empty-${i}`} className="empty"></td>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const isSunday = new Date(date.getFullYear(), date.getMonth(), day).getDay() === 0;
      const color = isSunday && uploadStatus[dateString] === "#ffffff" ? "white" : getDateColor(dateString);
      const tooltipText = color === "#9fff80" ? "Stocks and Sales file uploaded" : 
                         color === "#FFD700" ? "Sales data not updated" : dateString;

      daysArray.push(
        <td key={day} className="day" style={{ backgroundColor: color, textAlign: 'center' }}>
          <div className="tooltip-wrapper">
            {day}
            <span className="tooltip">{tooltipText}</span>
          </div>
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
      <table className="calendar-table" style={{ padding: '10px', width: '100%', height: '100%' }}>
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

  const renderYearlyCalendar = () => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

   const monthRows = [];
    for (let i = 0; i < months.length; i += 4) {
      const rowMonths = months.slice(i, i + 4).map((month, index) => {
        const monthIndex = i + index;
        const color = getMonthColor(currentYear, monthIndex);
        return (
          <div
            key={month}
            style={{
              margin: '10px',
              width: '100px',
              textAlign: 'center',
              backgroundColor: color
            }}
          >
            {month}
          </div>
        );
      });
      monthRows.push(
        <div key={`row-${i / 4}`} style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
          {rowMonths}
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {monthRows}
      </div>
    );
  };

  const nextMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  const prevMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  const nextYear = () => setCurrentYear(currentYear + 1);
  const prevYear = () => setCurrentYear(currentYear - 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', backgroundColor: '#f8f8ff' , paddingTop: '470px' }}>
        <header style={{ width: '100%' }}>
          <div style={{ width: '130px', height: '90px', overflow: 'hidden', borderRadius: '8px' }}>
            <img
              style={{ padding: '10px', width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 50%' }}
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTK5T2rnUSui6IcY0VrqFZLQMwrrcgabyuKrQ&s"
              alt="Company Logo"
              className="logo"
            />
          </div>
          <button style={{ marginLeft: 'auto', marginRight: '20px' }} onClick={signOut}>
            Sign out
          </button>
        </header>

        <h1 style={{ textAlign: 'center', width: '100vw' }}>
          <u>Anamay - Dashboard Update Interface</u>
        </h1>

        {/* Stocks, Sales, and Monthly Calendar Box */}
        <div style={{
          width: '90vw',
          padding: '20px',
          backgroundColor: '#f0f0f0',
          borderRadius: '8px',
          marginBottom: '20px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}>
          <div style={{ width: '50%' }}>
            <h2>Anamay Stocks</h2>
            <div style={{ padding: '10px', backgroundColor: '#e6e6e6', borderRadius: '8px', marginBottom: '20px' }}>
              <input type="file" accept=".csv" onChange={(e) => setStocksFile(e.target.files?.[0] || null)} />
              <button onClick={() => {
                if (validateFile(stocksFile)) {
                  uploadFile(stocksFile, "https://ty1d56bgkb.execute-api.ap-south-1.amazonaws.com/S1/Anamay_Stocks_UploadLink_Dev");
                }
              }}>
                Submit Stocks File
              </button>
            </div>

            <h2>Anamay Sales</h2>
            <div style={{ padding: '10px', backgroundColor: '#e6e6e6', borderRadius: '8px' }}>
              <input type="file" accept=".csv" onChange={(e) => setSalesFile(e.target.files?.[0] || null)} />
              <button onClick={() => {
                if (validateFile(salesFile)) {
                  uploadFile(salesFile, "https://yu8yamaj62.execute-api.ap-south-1.amazonaws.com/S1/Anamay_Sales_UploadLink_Dev");
                }
              }}>
                Submit Sales File
              </button>
            </div>
          </div>

          <div style={{ width: '40%', padding: '0px',backgroundColor:'rgb(230,247,255)' }}>
            <h3 style={{ textAlign: 'center' }}>Calendar (Daily Tracker)</h3>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <button onClick={prevMonth}>&lt;</button>
              <span style={{ margin: '0 10px' }}>
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </span>
              <button onClick={nextMonth}>&gt;</button>
            </div>
            {renderCalendar(currentDate)}
          </div>
        </div>

        {/* SuperStockist and Yearly Calendar Box */}
        <div style={{
          width: '90vw',
          padding: '20px',
          backgroundColor: '#f0f0f0',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}>
          <div style={{ width: '50%',paddingTop:'70px' }}>
            <h2>SuperStockist Stock Positions</h2>
            <div style={{ padding: '10px', backgroundColor: '#e6e6e6', borderRadius: '8px' }}>
              <input type="file" accept=".csv" onChange={(e) => setSuperStockistFile(e.target.files?.[0] || null)} />
              <button onClick={() => {
                if (validateFile(superStockistFile)) {
                  uploadFile(superStockistFile, "https://gmj1qijcmi.execute-api.ap-south-1.amazonaws.com/S1/Anamay_SuperStockist_StockPositions_UploadLink_Dev");
                }
              }}>
                Submit SuperStockist File
              </button>
            </div>
          </div>

          <div style={{ width: '40%', padding: '0px',backgroundColor: 'rgb(230,247,255)' }}>
            <h3 style={{ textAlign: 'center' }}>Calendar (Yearly Tracker)</h3>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <button onClick={prevYear}>&lt;</button>
              <span style={{ margin: '0 10px' }}>{currentYear}</span>
              <button onClick={nextYear}>&gt;</button>
            </div>
            {renderYearlyCalendar()}
          </div>
        </div>

        {responseMessage && <p>{responseMessage}</p>}

        {/* Modal */}
        {isModalOpen && (
          <div style={modalStyles.overlay}>
            <div style={modalStyles.modal}>
              <h2>Upload Status</h2>
              <p>{responseMessage}</p>
              <div style={modalStyles.buttonContainer}>
                <button style={modalStyles.button} onClick={() => setIsModalOpen(false)}>OK</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const AnushaDashboard: React.FC = () => {
  const { signOut } = useAuthenticator();
  const [PrimarysalesFile, setPrimarysalesFile] = React.useState<File | null>(null);
  const [SecondarysalesFile, setSecondarysalesFile] = React.useState<File | null>(null);
  const [responseMessage, setResponseMessage] = React.useState<string>("");
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [currentYear, setCurrentYear] = React.useState<number>(new Date().getFullYear());
  const [yearlyUploadStatus, setYearlyUploadStatus] = React.useState<{ [key: string]: string }>({});

  React.useEffect(() => {
    fetchYearlyUploadStatus();
  }, [currentYear]);

  const fetchYearlyUploadStatus = async () => {
    try {
      const response = await fetch("https://anusha-yearly-tracker.execute-api.ap-south-1.amazonaws.com/T1/Anusha_Yearly_Tracker");
      if (response.ok) {
        const data = await response.json();
        console.log("Yearly API Response:", data);
        setYearlyUploadStatus(data);
      } else {
        console.error("Failed to fetch yearly upload status, status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching yearly upload status:", error);
    }
  };

  const getMonthColor = (year: number, month: number): string => {
    const monthString = `${year}-${(month + 1).toString().padStart(2, '0')}`;
    return yearlyUploadStatus[monthString] || "white";
  };

  const validateFile = (file: File | null): boolean => {
    if (file && file.name.endsWith(".csv")) {
      return true;
    }
    alert("Please upload a valid CSV file.");
    return false;
  };

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
      } else {
        const errorText = await response.text();
        setResponseMessage(`Failed to upload file: ${errorText}`);
      }
    } catch (error) {
      console.error("Error:", error);
      setResponseMessage("An error occurred while uploading the file.");
    }

    setIsModalOpen(true);
  };

  const renderYearlyCalendar = () => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const monthRows = [];
    for (let i = 0; i < months.length; i += 4) {
      const rowMonths = months.slice(i, i + 4).map((month, index) => {
        const monthIndex = i + index;
        const color = getMonthColor(currentYear, monthIndex);
        return (
          <div
            key={month}
            style={{
              margin: '10px',
              width: '100px',
              textAlign: 'center',
              backgroundColor: color
            }}
          >
            {month}
          </div>
        );
      });
      monthRows.push(
        <div key={`row-${i / 4}`} style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
          {rowMonths}
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {monthRows}
      </div>
    );
  };

  const nextYear = () => setCurrentYear(currentYear + 1);
  const prevYear = () => setCurrentYear(currentYear - 1);

  return (
      <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '90vw', backgroundColor: '#f8f8ff'}}>
        <header style={{ width: '100%' }}>
          <div style={{ width: '130px', height: '90px', overflow: 'hidden', borderRadius: '8px' }}>
            <img
              style={{ padding: '10px', width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 50%' }}
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTK5T2rnUSui6IcY0VrqFZLQMwrrcgabyuKrQ&s"
              alt="Company Logo"
              className="logo"
            />
          </div>
          <button style={{ marginLeft: 'auto', marginRight: '20px' }} onClick={signOut}>
            Sign out
          </button>
        </header>
        
        <h1 style={{ padding: '10px', textAlign: 'center', width: '100vw' }}>
          <u>Anamay - Dashboard Update Interface</u>
        </h1>
        
        <div style={{
          width: '90vw',
          padding: '20px',
          backgroundColor: '#f0f0f0',
          borderRadius: '8px',
          marginBottom: '20px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}>
          <div style={{ width: '50%' }}>
            <h2>Primary Sales</h2>
            <div style={{ padding: '10px', backgroundColor: '#e6e6e6', borderRadius: '8px', marginBottom: '20px' }}>
              <input type="file" accept=".csv" onChange={(e) => setPrimarysalesFile(e.target.files?.[0] || null)} />
              <button onClick={() => {
                if (validateFile(PrimarysalesFile)) {
                  uploadFile(PrimarysalesFile, "https://0pas2hqfnd.execute-api.ap-south-1.amazonaws.com/S1/Anamay-PrimarySales-Dev");
                }
              }}>
                Submit File
              </button>
            </div>

            <h2>Secondary Sales</h2>
            <div style={{ padding: '10px', backgroundColor: '#e6e6e6', borderRadius: '8px' }}>
              <input type="file" accept=".csv" onChange={(e) => setSecondarysalesFile(e.target.files?.[0] || null)} />
              <button onClick={() => {
                if (validateFile(SecondarysalesFile)) {
                  uploadFile(SecondarysalesFile, "https://l1fsts93ol.execute-api.ap-south-1.amazonaws.com/B1/Anamay-SecondarySales-Dev");
                }
              }}>
                Submit File
              </button>
            </div>
          </div>

          <div style={{ width: '40%', padding: '0px', backgroundColor: 'rgb(230,247,255)' }}>
            <h3 style={{ textAlign: 'center' }}>Calendar (Yearly Tracker)</h3>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <button onClick={prevYear}>&lt;</button>
              <span style={{ margin: '0 10px' }}>{currentYear}</span>
              <button onClick={nextYear}>&gt;</button>
            </div>
            {renderYearlyCalendar()}
          </div>
        </div>

        {responseMessage && <p>{responseMessage}</p>}

        {/* Modal */}
        {isModalOpen && (
          <div style={modalStyles.overlay}>
            <div style={modalStyles.modal}>
              <h2>Upload Status</h2>
              <p>{responseMessage}</p>
              <div style={modalStyles.buttonContainer}>
                <button style={modalStyles.button} onClick={() => setIsModalOpen(false)}>OK</button>
              </div>
            </div>
          </div>
        )}
      </main>
  );
};

const Unauthorized: React.FC<{ email: string; userDebug: string }> = ({ email, userDebug }) => {
  const { signOut } = useAuthenticator();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#f8f8ff' }}>
        <header style={{ width: '100%', display: 'flex', alignItems: 'center', padding: '10px' }}>
          <div style={{ width: '130px', height: '90px', overflow: 'hidden', borderRadius: '8px' }}>
            <img
              style={{ padding: '10px', width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 50%' }}
              src="https://media.licdn.com/dms/image/v2/C560BAQFim2B73E6nkA/company-logo_200_200/company-logo_200_200/0/1644228681907/anamaybiotech_logo?e=2147483647&v=beta&t=RnXx4q1rMdk6bI5vKLGU6_rtJuF0hh_1ycTPmWxgZDo"
              alt="Company Logo"
              className="logo"
            />
          </div>
          <button style={{ marginLeft: 'auto', marginRight: '20px' }} onClick={signOut}>
            Sign out
          </button>
        </header>
        <h1 style={{ padding: '10px', textAlign: 'center', width: '100%' }}>
          <u>Unauthorized Access</u>
        </h1>
        <p style={{ textAlign: 'center', color: '#ff0000' }}>
          You do not have permission to access this dashboard. Please contact the administrator.
        </p>
        <p style={{ textAlign: 'center', color: '#000000' }}>
          Detected email: {email || 'No email detected'}
        </p>
        <p style={{ textAlign: 'center', color: '#000000', fontSize: '12px', maxWidth: '80vw', wordBreak: 'break-all' }}>
          Debug info (share with support): {userDebug}
        </p>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  const { user } = useAuthenticator((context) => [context.user]);
  const typedUser = user as CustomUser;

  // Extract email from all possible fields
  const attributes = typedUser?.attributes || {};
  const payload = typedUser?.signInUserSession?.idToken?.payload || {};
  const signInDetails = typedUser?.signInDetails || {};
  const possibleEmailFields = [
    signInDetails.loginId,
    attributes.email,
    attributes['custom:email'],
    attributes.preferred_username,
    attributes.email_verified,
    attributes.sub,
    payload.email,
    payload['custom:email'],
    payload.sub,
    typedUser?.username,
  ];
  let possibleEmail = '';
  for (const field of possibleEmailFields) {
    if (field && typeof field === 'string' && field.includes('@')) {
      possibleEmail = field;
      break;
    }
  }
  // Check identities for federated login
  if (attributes.identities) {
    try {
      const identities = JSON.parse(attributes.identities);
      if (Array.isArray(identities) && identities[0]?.userId?.includes('@')) {
        possibleEmail = identities[0].userId;
      }
    } catch (e) {
      console.error("Error parsing identities:", e);
    }
  }
  const email = possibleEmail.toLowerCase();

  // Debug logs
  console.log("User object:", JSON.stringify(typedUser, null, 2));
  console.log("Possible email fields:", possibleEmailFields);
  console.log("Extracted email:", email);

  const renderDashboard = () => {
    switch (email) {
      case 'deepshika5686@bharatbiotech.com':
      case 'manika5170@bharatbiotech.com':
        return <MainDashboard />;
      case 'anusha5931@bharatbiotech.com':
        return <AnushaDashboard />;
      default:
        return <Unauthorized email={email} userDebug={JSON.stringify(typedUser, null, 2)} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {renderDashboard()}
      {/* Common Footer */}
      <footer style={{
        width: '100%',
        height: '3vh',
        backgroundColor: '#483d8b',
        textAlign: 'center',
        fontSize: '14px',
        color: '#FFFFFF',
      }}>
        Thank You
      </footer>
      <footer style={{
        width: '100%',
        backgroundColor: '#CBC3E3',
        textAlign: 'left',
        fontSize: '14px',
        color: '#FFFFFF',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          gap: '80px',
          flexWrap: 'wrap'
        }}>
          <a href="https://ap-south-1.quicksight.aws.amazon.com/sn/dashboards/61e1a019-4de1-4e09-bdde-61c3a0ca77bc" target="_blank" rel="noopener noreferrer" style={{ color: '#000000' }}>
            <b>Dashboard Link</b>
          </a>
          <a href="https://example.com" target="_blank" rel="noopener noreferrer" style={{ color: '#000000' }}>
            <b>Report a Problem</b>
          </a>
          <a href="https://example.com" target="_blank" rel="noopener noreferrer" style={{ color: '#000000' }}>
            <b>Call Business Analytics Dept</b>
          </a>
          <a href="https://example.com" target="_blank" rel="noopener noreferrer" style={{ color: '#000000' }}>
            <b>Request for a Call Back</b>
          </a>
        </div>
      </footer>
    </div>
  );
};

// Modal Styles (used by MainDashboard and AnushaDashboard)
const modalStyles = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    textAlign: 'center' as const,
    width: '300px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
  buttonContainer: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'space-around',
  },
  button: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#007BFF',
    color: '#fff',
    cursor: 'pointer',
  },
};

export default App;





















