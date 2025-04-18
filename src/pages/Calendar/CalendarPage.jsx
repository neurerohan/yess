// Placeholder for CalendarPage component
import React, { useState, useEffect, useMemo, useCallback, Suspense, lazy } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import NepaliDate from 'nepali-date-converter'; // Needed to determine current BS date

import { getStaticCalendarData, getMonthData, getNextMonth, getPreviousMonth, NEPALI_MONTHS } from '../../utils/api';
import CalendarNavigation from './CalendarNavigation';

// Lazy load components (Comment explaining lazy loading)
const CalendarGrid = lazy(() => import('./CalendarGrid'));
const DatePicker = lazy(() => import('./DatePicker'));
const MonthlyEventsList = lazy(() => import('./MonthlyEventsList')); // Lazy load events list
const FAQSection = lazy(() => import('./FAQSection')); // Lazy load FAQ
const PageLinksSection = lazy(() => import('./PageLinksSection')); // Lazy load Links
const ContentSection = lazy(() => import('./ContentSection')); // Import ContentSection

// Helper to capitalize month names for display
const capitalize = (s) => s && s[0].toUpperCase() + s.slice(1);

// --- START: Re-added Helper Functions ---
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
  const today = new NepaliDate(); // Use NepaliDate library for accuracy
  return `${today.getDay()} ${nepaliMonths[today.getMonth()]} ${today.getYear()}`;
  // Note: The previous simple approximation logic was highly inaccurate.
  // This now uses the imported NepaliDate library.
};


const formatTime = (date) => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};
// --- END: Re-added Helper Functions ---

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

  // SEO Content - Enhanced description with new keywords
  const pageTitle = `Nepali Calendar ${currentBSYear} ${capitalize(currentBSMonthName || '')} | ${currentBSYear} Nepali Date Today | Mero Patro Hamro Patro ${currentBSYear} | Kalimati Rate`;
  const pageDescription = `View the official Nepali calendar (विक्रम सम्वत् पात्रो) for ${capitalize(currentBSMonthName || '')} ${currentBSYear}. Find the Nepali date today, including daily tithi, festivals, public holidays, and official events using our comprehensive mero patro / hamro patro style calendar. Easily check the Nepal calendar date today and convert BS to AD dates. Stay updated with the ${currentBSYear} nepali calendar nepali calendar.`;
  const canonicalUrl = `https://kalimatirate.nyure.com.np/calendar/${currentBSYear}/${currentBSMonthName}`;
  // Added more keywords
  const keywords = `Nepali calendar, nepali date today, mero patro, hamro patro, nepal calendar date today, nepali calendar nepali calendar, ${currentBSYear}, ${capitalize(currentBSMonthName || '')}, Bikram Sambat, BS calendar, Nepali Patro, Nepal calendar, tithi, events, festivals, holidays Nepal, BS to AD, विक्रम सम्वत् पात्रो`;

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
          { "@type": "ListItem", "position": 3, "name": `Nepali Calendar ${capitalize(currentBSMonthName || '')} ${currentBSYear}`, "item": canonicalUrl } // Current page, more descriptive
      ]
    },
    "mainEntity": {
        "@type": "Dataset",
        "name": `Nepali Calendar Data ${currentBSYear} - Mero Patro/Hamro Patro Alternative`,
        "description": `Bikram Sambat ${currentBSYear} nepali calendar data, including AD conversions, tithis, holidays, and events. Check the nepali date today easily.`,
        "keywords": ["Nepali Calendar Data", "Bikram Sambat Data", "Nepal Calendar JSON", "nepali date today", "mero patro", "hamro patro", "nepali calendar nepali calendar"],
        "creator": {
            "@type": "Organization",
            "name": "Nepali Calendar - KalimatiRate",
            "url": "https://kalimatirate.nyure.com.np"
        }
    }
  };

  // Define FAQ data here to use in both component and schema
  const faqItems = [
    { q: "What is the Nepali Calendar (Bikram Sambat)?", a: "The Bikram Sambat (BS) is the official solar calendar of Nepal, often referred to as the Nepali Patro. This page shows the current nepali date today based on this system." },
    { q: "How do I read this Nepali Calendar?", a: "Each box represents a day in the Bikram Sambat calendar. Click any day to see detailed events and tithi information, similar to hamro patro or mero patro applications. It helps you find the nepal calendar date today easily." },
    { q: "What is a 'Tithi' in the Nepali Patro?", a: "A Tithi represents a lunar day in the traditional Nepali calendar (nepali calendar nepali calendar), which is crucial for determining festivals and auspicious times." },
    { q: "How accurate is the event information on this Mero Patro style calendar?", a: "The event and festival information for the nepali calendar ${currentBSYear} is based on official government sources and widely accepted practices in Nepal." },
    { q: "Can I convert dates between BS (Nepali Date) and AD?", a: "Yes! Our integrated tool allows easy conversion between the Bikram Sambat date (nepali date today) and the Gregorian (AD) calendar." }
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

      <main className="container mx-auto px-2 sm:px-4 py-8">
        {/* Introductory Content - Made Dynamic with keywords */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            Nepali Calendar {currentBSYear} - {capitalize(currentBSMonthName || '')} (विक्रम सम्वत् पात्रो)
          </h1>
          <p className="text-gray-600 text-sm">Your reliable source for the {currentBSYear} mero patro / hamro patro, showing the Nepali date today.</p>
        </div>

        {/* --- START: Reworked Date/Time/Weather Display --- */}
        <div className="px-2 sm:px-4 mt-4 mb-6">
          {/* Removed max-w-4xl to match main container width */}
          <div className="mx-auto">
            {/* Outer white container */}
            {/* Increased padding from p-4 to p-6 */}
            <div className="bg-white rounded-xl p-6 relative border border-green-100 shadow-sm">
              {/* Flex container for Desktop: Date/Location on Left, Time/Temp on Right */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">

                {/* Date/Location Info (Left Side on Desktop) */}
                <div className="text-center sm:text-left mb-4 sm:mb-0">
                  <div className="text-gray-800 text-lg font-medium inline-flex items-center gap-2 flex-wrap justify-center sm:justify-start">
                    <span className="text-gray-900">{getNepaliDate()}</span> {/* Assumes getNepaliDate exists */}
                    <span className="text-gray-400 hidden sm:inline">/</span>
                    <span className="text-gray-600">{formatDate(currentTime)}</span> {/* Assumes formatDate exists */}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Kathmandu, Nepal</div>
                </div>

                {/* Time and Temperature Grid (Right Side on Desktop) */}
                <div className="grid grid-cols-2 gap-3 max-w-[240px] sm:max-w-[280px] mx-auto sm:mx-0"> {/* Removed mx-auto for desktop */}
                  {/* Current Time Box */}
                  <div className="bg-white rounded-lg p-3 border border-green-100 shadow-sm aspect-square flex flex-col items-center justify-center text-center">
                    <div className="w-8 h-8 bg-green-50 rounded-md flex items-center justify-center mb-1.5">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-gray-600 text-[10px] mb-0.5">Current Time</div>
                      <div className="text-gray-800 text-lg sm:text-xl font-bold">{formatTime(currentTime)}</div> {/* Assumes formatTime exists */}
                    </div>
                  </div>
                  {/* Temperature Box */}
                  <div className="bg-white rounded-lg p-3 border border-green-100 shadow-sm aspect-square flex flex-col items-center justify-center text-center">
                    <div className="w-8 h-8 bg-green-50 rounded-md flex items-center justify-center mb-1.5">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-gray-600 text-[10px] mb-0.5">Temperature</div>
                      <div className="text-gray-800 text-lg sm:text-xl font-bold">{temperature}°C</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* --- END: Reworked Date/Time/Weather Display --- */}

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
                   // Add keywords context if possible, e.g., title prop
                   title={`Events in ${capitalize(currentBSMonthName || '')} ${currentBSYear} - Nepali Calendar`}
                 />
              )}

              {/* Content Section - Made Dynamic with keywords */}
              <ContentSection title={`About ${capitalize(currentBSMonthName || '')} ${currentBSYear} Nepali Calendar (Mero Patro/Hamro Patro)`}>
                <p>
                  This section provides details for the month of {capitalize(currentBSMonthName || '')} in the Bikram Sambat year {currentBSYear}.
                  Explore the official Nepali calendar (nepali calendar nepali calendar), including daily details like tithis, festivals, and important events occurring in Nepal. Find the 'nepali date today' and understand its significance.
                  The Bikram Sambat calendar, often accessed via tools like 'mero patro' or 'hamro patro', holds significant cultural importance. Check the 'nepal calendar date today' for accurate scheduling.
                </p>
              </ContentSection>

              {/* --- START: New SEO Description Section --- */}
              <section className="my-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Understanding the Nepali Calendar {currentBSYear}</h2>
                <p className="text-gray-600 mb-4">
                  The <strong>Nepali calendar</strong>, or Bikram Sambat (BS), is the official calendar of Nepal. This page features the <strong>{currentBSYear} nepali calendar nepali calendar</strong> for the month of {capitalize(currentBSMonthName || '')}. Whether you're looking for the <strong>nepali date today</strong>, planning for festivals, or seeking information similar to <strong>hamro patro</strong> or <strong>mero patro</strong>, our calendar provides comprehensive details.
                </p>
                <p className="text-gray-600">
                  Easily find the <strong>nepal calendar date today</strong>, view upcoming holidays, and understand cultural events. Our goal is to be your primary resource for the official <strong>Nepali Patro</strong> online.
                </p>
              </section>
              {/* --- END: New SEO Description Section --- */}

              {/* FAQ Section - Pass faqItems if needed, or ensure internal data matches */}
              <FAQSection /* Pass faqItems={faqItems} if FAQSection accepts props */ />
            </>
          )}
        </Suspense>

        {/* Page Links Section (outside the loading state maybe?) */}
        <PageLinksSection />

      </main>
    </>
  );
};

export default CalendarPage; 