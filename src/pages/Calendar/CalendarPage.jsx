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

const CalendarPage = () => {
  const { year: yearParam, month: monthParam } = useParams();
  const navigate = useNavigate();

  // State for the year data, loading, and errors
  const [yearData, setYearData] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Initially false as data load is sync
  const [error, setError] = useState(null);

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
          <p className="text-sm sm:text-base text-gray-600">
            Viewing the month of <span className="font-semibold">{capitalize(currentBSMonthName || '')} {currentBSYear}</span>. Use the controls below to navigate.
          </p>
        </div>

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