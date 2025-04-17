// Placeholder for CalendarPage component
import React, { useState, useEffect, useMemo, useCallback, Suspense, lazy } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import NepaliDate from 'nepali-date-converter'; // Needed to determine current BS date

import { getStaticCalendarData, getMonthData, getNextMonth, getPreviousMonth, NEPALI_MONTHS } from '../../utils/api';
import CalendarNavigation from './CalendarNavigation';
import Header from '../../components/Header'; // Assuming Header path
import Footer from '../../components/Footer'; // Assuming Footer path

// Lazy load components (Comment explaining lazy loading)
const CalendarGrid = lazy(() => import('./CalendarGrid'));
const DatePicker = lazy(() => import('./DatePicker'));
const MonthlyEventsList = lazy(() => import('./MonthlyEventsList')); // Lazy load events list
const FAQSection = lazy(() => import('./FAQSection')); // Lazy load FAQ
const PageLinksSection = lazy(() => import('./PageLinksSection')); // Lazy load Links
const ContentSection = lazy(() => import('./ContentSection')); // Import ContentSection

// Helper to capitalize month names for display
const capitalize = (s) => s && s[0].toUpperCase() + s.slice(1);

// --- START: Added Helper Functions from Home.jsx ---
const formatDate = (date) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\//g, '-');
};

const nepaliMonths = [
  'बैशाख', 'जेठ', 'असार', 'श्रावण', 'भदौ', 'असोज',
  'कार्तिक', 'मंसिर', 'पुष', 'माघ', 'फागुन', 'चैत'
];

const getNepaliDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  // This is a simple approximation. You might want to use a proper Nepali date converter library
  // Adding 56 years, 8 months and 17 days (approximate difference)
  const nepYear = year + 56;
  let nepMonth = month + 8;
  let nepDay = day + 17;

  // Crude adjustment for month/day overflow - needs a proper library for accuracy
  if (nepDay > 30) { // Assuming 30 days max for simplicity, NOT ACCURATE
      nepDay -= 30;
      nepMonth += 1;
  }
  if (nepMonth > 12) {
      nepMonth -= 12;
      // Note: This simple logic doesn't adjust the year correctly if month wraps around.
  }

  return `${nepDay} ${nepaliMonths[nepMonth - 1] || '?'} ${nepYear}`; // Added fallback for month index
};


const formatTime = (date) => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};
// --- END: Added Helper Functions from Home.jsx ---

const CalendarPage = () => {
  const { year: yearParam, month: monthParam } = useParams();
  const navigate = useNavigate();

  // State for the year data, loading, and errors
  const [yearData, setYearData] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Initially false as data load is sync
  const [error, setError] = useState(null);

  // --- START: Added State from Home.jsx ---
  const [currentTime, setCurrentTime] = useState(new Date());
  const [temperature, setTemperature] = useState('--');
  // --- END: Added State from Home.jsx ---

  const currentBSYear = parseInt(yearParam);
  const currentBSMonthName = monthParam?.toLowerCase();

  // Load data when year/month params change
  useEffect(() => {
    // Define async function inside useEffect
    const loadData = async () => {
      console.log(`[CalendarPage useEffect] Params changed. Year: ${yearParam}, Month: ${monthParam}`);
      setError(null);
      setYearData(null);
      setIsLoading(true); 

      if (!currentBSYear || !NEPALI_MONTHS.includes(currentBSMonthName)) {
        console.warn('[CalendarPage useEffect] Invalid year or month params, redirecting...');
        const today = new NepaliDate();
        navigate(`/calendar/${today.getYear()}/${NEPALI_MONTHS[today.getMonth()]}`, { replace: true });
        setIsLoading(false);
        return; 
      }

      try {
        // Await the async data fetch
        const data = await getStaticCalendarData(currentBSYear);
        console.log(`[CalendarPage useEffect] Setting yearData state. Keys: ${Object.keys(data || {}).length > 0 ? Object.keys(data).join(', ') : 'Empty Object'}`);
        setYearData(data);
      } catch (err) {
        console.error("[CalendarPage useEffect] Failed to get static calendar data:", err);
        setError(err.message || 'Could not load calendar data.');
        setYearData(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadData(); // Call the async function

  }, [currentBSYear, currentBSMonthName, navigate, yearParam, monthParam]); 

  // --- START: Added useEffect from Home.jsx ---
  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Fetch weather data
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=27.15&longitude=85.9&current=temperature_2m&timezone=auto'
        );
        // Basic check for response status
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
         // Basic check for expected data structure
        if (data && data.current && typeof data.current.temperature_2m !== 'undefined') {
           setTemperature(Math.round(data.current.temperature_2m));
        } else {
           console.warn('Unexpected weather API response structure:', data);
           setTemperature('--'); // Fallback if structure is wrong
        }
      } catch (error) {
        console.error('Error fetching weather:', error);
        setTemperature('--'); // Fallback on error
      }
    };

    fetchWeather();
    // Fetch weather every 30 minutes
    const weatherTimer = setInterval(fetchWeather, 1800000); // 30 minutes

    // Cleanup timers
    return () => {
      clearInterval(timer);
      clearInterval(weatherTimer);
    };
  }, []); // Empty dependency array means this runs once on mount and cleans up on unmount
  // --- END: Added useEffect from Home.jsx ---

  // --- Direct check of yearData state before useMemo ---
  console.log(`[CalendarPage Render] Checking yearData STATE. Available: ${!!yearData}. Keys: ${yearData ? Object.keys(yearData).join(', ') : 'null'}`);
  // --- End Direct Check ---

  // Memoize the specific month data extraction
  const monthData = useMemo(() => {
    console.log(`[CalendarPage useMemo] Calculating monthData. yearData available: ${!!yearData}, currentBSMonthName: ${currentBSMonthName}`);
    if (!yearData || !currentBSMonthName) {
        console.log('[CalendarPage useMemo] Skipping getMonthData because yearData or monthName is missing.');
        return null;
    }
    // Log keys again right before the call inside useMemo
    console.log('[CalendarPage useMemo] yearData keys before calling getMonthData:', Object.keys(yearData)); 
    try {
      // Pass the state variable directly
      return getMonthData(yearData, currentBSMonthName);
    } catch (e) {
       console.error("[CalendarPage useMemo] Error calling getMonthData:", e);
       setError(e.message);
       return null;
    }
  }, [yearData, currentBSMonthName]); // Dependencies are correct

  // Navigation handlers (Prev/Next/Direct)
  const handlePrevMonth = useCallback(() => {
    const { year: prevYear, month: prevMonth } = getPreviousMonth(currentBSYear, currentBSMonthName);
    // Basic validation: Prevent navigating to unsupported years if known
    if (prevYear < 2070) { // Example lower bound
        alert("Data for years before 2070 BS is not available.");
        return;
    }
    navigate(`/calendar/${prevYear}/${prevMonth}`);
  }, [currentBSYear, currentBSMonthName, navigate]);

  const handleNextMonth = useCallback(() => {
    const { year: nextYear, month: nextMonth } = getNextMonth(currentBSYear, currentBSMonthName);
     // Basic validation: Prevent navigating to unsupported years if known
    if (nextYear > 2090) { // Example upper bound from miti.bikram.io
        alert("Data for years after 2090 BS is not available.");
        return;
    }
    navigate(`/calendar/${nextYear}/${nextMonth}`);
  }, [currentBSYear, currentBSMonthName, navigate]);

  // Handler for direct navigation via dropdowns
  const handleNavigateTo = useCallback((newYear, newMonthName) => {
    navigate(`/calendar/${newYear}/${newMonthName.toLowerCase()}`);
  }, [navigate]);

  // Generate year options for dropdown
  const startYearNav = 2070;
  const endYearNav = 2090;
  const yearOptionsNav = Array.from({ length: endYearNav - startYearNav + 1 }, (_, i) => startYearNav + i);

  // SEO Content - Enhanced description
  const pageTitle = `Nepali Calendar ${currentBSYear} - ${capitalize(currentBSMonthName || '')} | विक्रम सम्वत् पात्रो | Kalimati Rate`;
  const pageDescription = `View the detailed Nepali calendar (विक्रम सम्वत् पात्रो) for ${capitalize(currentBSMonthName || '')} ${currentBSYear}. Includes daily tithi, festivals, public holidays, official events, and cultural celebrations in Nepal. Easily convert BS to AD dates and navigate through months and years.`;
  const canonicalUrl = `https://kalimatirate.nyure.com.np/calendar/${currentBSYear}/${currentBSMonthName}`;
  const keywords = `Nepali calendar, ${currentBSYear}, ${capitalize(currentBSMonthName || '')}, Bikram Sambat, BS calendar, Nepali Patro, Nepal calendar, tithi, events, festivals, holidays Nepal, BS to AD`;

  // Schema.org Markup - Enhanced description
  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": pageTitle,
    "description": pageDescription,
    "url": canonicalUrl,
    "keywords": keywords,
    "datePublished": "2024-01-01", // Replace with actual publish date if known, else keep a fixed date
    "dateModified": new Date().toISOString(), // Add current date/time as dateModified
    "isPartOf": {
      "@type": "WebSite",
      "url": "https://kalimatirate.nyure.com.np",
      "name": "Kalimati Rate - Nyure"
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://kalimatirate.nyure.com.np" },
          { "@type": "ListItem", "position": 2, "name": "Nepali Calendar", "item": `https://kalimatirate.nyure.com.np/calendar` }, // Link to base calendar
          { "@type": "ListItem", "position": 3, "name": `${capitalize(currentBSMonthName || '')} ${currentBSYear}`, "item": canonicalUrl } // Current page
      ]
    },
    "mainEntity": {
        "@type": "Dataset",
        "name": `Nepali Calendar Data ${currentBSYear}`,
        "description": `Bikram Sambat calendar data for year ${currentBSYear}, including AD conversions, tithis, holidays, and events sourced from public records.`,
        "keywords": ["Nepali Calendar Data", "Bikram Sambat Data", "Nepal Calendar JSON"],
        "creator": {
            "@type": "Organization",
            "name": "(Source like miti.bikram.io or relevant authority)",
            "url": "(URL of the source if known)"
        }
    }
  };

  // Define FAQ data here to use in both component and schema
  const faqItems = [
    { q: "What is the Nepali Calendar (Bikram Sambat)?", a: "The Bikram Sambat (BS) is the official solar calendar of Nepal..." },
    { q: "How do I read this calendar?", a: "Each box represents a day... Click any day to see detailed events." },
    { q: "What is a 'Tithi'?", a: "A Tithi represents a lunar day..." },
    { q: "How accurate is the event information?", a: "The event and festival information..." },
    { q: "Can I convert dates between BS and AD?", a: "Yes! This website also features..." }
    // Ensure these match the content in FAQSection.jsx
  ];

  // Generate FAQPage schema from faqItems
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(item => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a
      }
    }))
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={keywords} />
        <link rel="canonical" href={canonicalUrl} />
        {/* Add OpenGraph and Twitter card tags */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        {/* <meta property="og:image" content="URL_TO_RELEVANT_IMAGE" /> */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        {/* <meta name="twitter:image" content="URL_TO_RELEVANT_IMAGE" /> */}

        {/* Add Schema.org */}
        <script type="application/ld+json">
          {JSON.stringify(pageSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>

      <Header />
      <main className="container mx-auto px-2 sm:px-4 py-8">
        {/* Introductory Content - Made Dynamic */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            Nepali Calendar {currentBSYear} (विक्रम सम्वत् पात्रो)
          </h1>
        </div>

        {/* --- START: Added Date/Time/Weather Display from Home.jsx --- */}
        <div className="px-2 sm:px-4 mt-6 mb-8"> {/* Adjusted margins */}
          <div className="max-w-3xl mx-auto">
            {/* RESTORED the outer white container */}
            <div className="bg-white rounded-xl p-6 relative border border-green-100 shadow-sm">
              {/* Main info row: Date/Location */}
              <div className="text-center mb-6"> {/* Increased bottom margin */}
                <div className="text-gray-800 text-xl font-medium inline-flex items-center gap-3 flex-wrap justify-center">
                  <span className="text-gray-900">{getNepaliDate()}</span>
                  <span className="text-gray-400 hidden sm:inline">/</span>
                  <span className="text-gray-600">{formatDate(currentTime)}</span>
                </div>
                <div className="text-sm text-gray-500 mt-1">Kathmandu, Nepal</div>
              </div>
              
              {/* Time and Temperature Grid - Always 2 columns, square aspect ratio */}
              <div className="grid grid-cols-2 gap-4 max-w-xs sm:max-w-sm mx-auto"> {/* Centered smaller grid */}
                {/* Current Time Box */}
                <div className="bg-white rounded-xl p-4 border border-green-100 shadow-sm aspect-square flex flex-col items-center justify-center text-center"> {/* Added aspect-square, flex-col, justify-center, text-center */}
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mb-2"> {/* Centered icon, reduced bottom margin */}
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-gray-600 text-xs mb-1">Current Time</div> {/* Added bottom margin */}
                    <div className="text-gray-800 text-xl sm:text-2xl font-bold">{formatTime(currentTime)}</div> {/* Responsive text size */}
                  </div>
                </div>
                {/* Temperature Box */}
                <div className="bg-white rounded-xl p-4 border border-green-100 shadow-sm aspect-square flex flex-col items-center justify-center text-center"> {/* Added aspect-square, flex-col, justify-center, text-center */}
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mb-2"> {/* Centered icon, reduced bottom margin */}
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-gray-600 text-xs mb-1">Temperature</div> {/* Added bottom margin */}
                    <div className="text-gray-800 text-xl sm:text-2xl font-bold">{temperature}°C</div> {/* Responsive text size */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* --- END: Added Date/Time/Weather Display from Home.jsx --- */}

        {/* Navigation Component */}
        <CalendarNavigation
          currentYear={currentBSYear}
          currentMonth={capitalize(currentBSMonthName || '')}
          yearOptions={yearOptionsNav}
          monthOptions={NEPALI_MONTHS}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onNavigateTo={handleNavigateTo}
        />

        {/* Loading and Error States with ARIA live region for screen readers */}
        <div aria-live="polite">
          {isLoading && <p className="text-center text-gray-600 py-10">Processing calendar...</p>}
          {error && <p className="text-center text-red-600 py-10">Error: {error}</p>}
        </div>

        {/* Main Calendar Section - Suspense for lazy loaded components */}
        <Suspense fallback={<div className="text-center text-gray-500 py-10">Loading Calendar Components...</div>}>
          {!isLoading && !error && (
            <>
              {/* Calendar Grid */}
              {monthData ? (
                <CalendarGrid 
                  monthData={monthData} 
                  year={currentBSYear} 
                  monthName={currentBSMonthName} 
                />
              ) : (
                 <p className="text-center text-orange-600 py-10">Calendar data loaded, but specific month data ('{capitalize(currentBSMonthName || '')}') could not be extracted.</p>
              )}

              {/* Date Picker */}
              <DatePicker 
                initialYear={currentBSYear} 
                initialMonth={currentBSMonthName} 
              />

              {/* Monthly Events List */}
              {monthData && (
                 <MonthlyEventsList 
                   monthData={monthData} 
                   monthName={currentBSMonthName} 
                   year={currentBSYear} 
                 />
              )}

              {/* Content Section - Made Dynamic */}
              <ContentSection title={`About ${capitalize(currentBSMonthName || '')} ${currentBSYear}`}>
                <p>
                  This section provides details for the month of {capitalize(currentBSMonthName || '')} in the Bikram Sambat year {currentBSYear}. 
                  Explore daily details including tithis, festivals, and important events occurring in Nepal during this period. 
                  The Bikram Sambat calendar holds significant cultural importance.
                </p>
              </ContentSection>

              {/* FAQ Section - Pass faqItems if needed, or ensure internal data matches */}
              <FAQSection />
            </>
          )}
        </Suspense>

        {/* Page Links Section (outside the loading state maybe?) */}
        <PageLinksSection />

      </main>
      <Footer />
    </>
  );
};

export default CalendarPage; 