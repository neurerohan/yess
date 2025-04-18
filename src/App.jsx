import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import KalimatiPrices from './pages/KalimatiPrices';
import DateConverter from './pages/DateConverter';
import BlogList from './pages/BlogList';
import Blog from './pages/Blog';
import { HelmetProvider } from 'react-helmet-async';
import { debugSanityConnection, checkSpecificBlogPost } from './services/sanity';
import NotFoundPage from './pages/NotFoundPage';
import CalendarPage from './pages/Calendar/CalendarPage';
import InstallPwaPrompt from './components/InstallPwaPrompt';
import useNotificationPermission from './hooks/useNotificationPermission';
import CuteBatteryPrompt from './components/CuteBatteryPrompt';

// Component to handle redirection for the base /calendar route
const CalendarRedirect = () => {
  const navigate = useNavigate();
  const defaultYear = 2082; // Or dynamically determine the current BS year
  const defaultMonth = 'baishakh'; // Or dynamically determine the current BS month

  useEffect(() => {
    navigate(`/calendar/${defaultYear}/${defaultMonth}`, { replace: true });
  }, [navigate]);

  return null; // Render nothing while redirecting
};

// Simple debug component for Sanity diagnostics
const SanityDebug = () => {
  const [result, setResult] = React.useState("Running diagnostics...");
  const [specificSlug, setSpecificSlug] = React.useState("subscribe-to-gadget-getty");
  const [specificResult, setSpecificResult] = React.useState("");
  
  React.useEffect(() => {
    const runDiagnostics = async () => {
      try {
        const diagnosticResult = await debugSanityConnection();
        setResult(diagnosticResult);
      } catch (error) {
        setResult(`Error: ${error.message}`);
      }
    };
    
    runDiagnostics();
  }, []);
  
  const handleCheckSpecificPost = async () => {
    setSpecificResult("Checking...");
    try {
      const result = await checkSpecificBlogPost(specificSlug);
      setSpecificResult(result);
    } catch (error) {
      setSpecificResult(`Error: ${error.message}`);
    }
  };
  
  return (
    <div style={{padding: '20px', fontFamily: 'monospace'}}>
      <h1>Sanity Connection Debug</h1>
      <p>Check the browser console for complete diagnostic information.</p>
      <div style={{padding: '10px', background: '#f0f0f0', borderRadius: '4px', marginBottom: '20px'}}>
        {result}
      </div>
      
      <h2>Check Specific Blog Post</h2>
      <div style={{display: 'flex', marginBottom: '10px'}}>
        <input 
          type="text" 
          value={specificSlug} 
          onChange={(e) => setSpecificSlug(e.target.value)} 
          style={{
            padding: '8px', 
            borderRadius: '4px', 
            border: '1px solid #ccc',
            marginRight: '10px',
            flexGrow: 1
          }}
          placeholder="Enter blog post slug" 
        />
        <button 
          onClick={handleCheckSpecificPost}
          style={{
            padding: '8px 16px', 
            background: '#0070f3', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px'
          }}
        >
          Check
        </button>
      </div>
      {specificResult && (
        <div style={{padding: '10px', background: '#f0f0f0', borderRadius: '4px'}}>
          {specificResult}
        </div>
      )}
      
      <div style={{marginTop: '20px'}}>
        <button 
          onClick={() => window.location.reload()}
          style={{padding: '8px 16px', background: '#333', color: 'white', border: 'none', borderRadius: '4px'}}
        >
          Run Full Diagnostics Again
        </button>
      </div>
    </div>
  );
};

const App = () => {
  const { permissionStatus, requestPermission, canAskPermission } = useNotificationPermission();

  useEffect(() => {
    if (permissionStatus === 'default' && canAskPermission) {
      const timerId = setTimeout(() => {
        console.log('[App.jsx] Triggering notification permission request...');
        requestPermission();
      }, 15000);

      return () => clearTimeout(timerId);
    } else {
        console.log(`[App.jsx] Notification permission status: ${permissionStatus}. Can ask: ${canAskPermission}. Not requesting.`);
    }
  }, [permissionStatus, canAskPermission, requestPermission]);

  return (
    <HelmetProvider>
      <Router>
        <div className="App">
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/kalimati-tarkari-rate-today" element={<KalimatiPrices />} />
              <Route path="/nep-to-eng-date-converter" element={<DateConverter />} />
              <Route path="/blogs" element={<BlogList />} />
              <Route path="/blog/:slug" element={<Blog />} />
              <Route path="/debug-sanity" element={<SanityDebug />} />
              
              {/* Calendar Routes */}
              <Route path="/calendar" element={<CalendarRedirect />} />
              <Route path="/calendar/:year/:month" element={<CalendarPage />} />
              
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>
        <CuteBatteryPrompt />
        <InstallPwaPrompt />
      </Router>
    </HelmetProvider>
  );
};

export default App;