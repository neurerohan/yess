import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import NepaliDate from 'nepali-date-converter';

const Home = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // --- Define Schema Data --- 
  // (Moved schema definitions here for clarity, will be used in Helmet)
  const pageTitle = 'Nepali Calendar 2082 | Mero Patro & Hamro Patro | Nepali Date Today | Kalimati Rate';
  const pageDescription = 'View the official Nepali Calendar 2082 (विक्रम सम्वत्). Find the Nepali date today using our detailed nepali calendar nepali calendar. Use Mero Patro & Hamro Patro style features to check the Nepal calendar date today and events.';
  const canonicalUrl = 'https://kalimatirate.nyure.com.np/';
  const keywords = 'Nepali calendar, nepali date today, mero patro, hamro patro, nepal calendar date today, nepali calendar nepali calendar, 2082, Bikram Sambat, BS calendar, Nepali Patro, Nepal calendar, tithi, events, festivals, holidays Nepal, BS to AD, विक्रम सम्वत् पात्रो, Kalimati Rate';
  const publishDate = '2024-03-21'; // Fixed publish date
  const modifiedDate = new Date().toISOString().split('T')[0]; // Current date for modified
  const ogImageUrl = 'https://kalimatirate.nyure.com.np/nepali-calendar-mero-patro-hamro-patro.png'; // Example OG image

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is the Nepali Calendar (विक्रम सम्वत्)?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The Nepali Calendar (Bikram Sambat) is Nepal's official calendar. Our site provides the complete 'nepali calendar nepali calendar', allowing you to find the current 'nepali date today' and check any 'Nepal calendar date today' or future/past dates."
        }
      },
      {
        "@type": "Question",
        "name": "How can I find the Nepali date today?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The 'nepali date today' is clearly shown on our homepage. For more detail, explore the full 'nepali calendar', which functions like a digital 'Mero Patro', to see the date and events."
        }
      },
      {
        "@type": "Question",
        "name": "Is this like Hamro Patro or Mero Patro?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, our 'nepali calendar' is designed to be a comprehensive alternative to 'Hamro Patro' and 'Mero Patro'. It offers a detailed 'nepali calendar nepali calendar' view, showing the 'nepal calendar date today', tithis, and important events."
        }
      },
      {
        "@type": "Question",
        "name": "How to use the Nepali Calendar nepali calendar feature?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Visit the main 'Nepali Calendar' page. Select the year and month to view the detailed 'nepali calendar nepali calendar'. It's intuitive, much like using 'Mero Patro' or 'Hamro Patro' to find the 'nepali date today'."
        }
      },
      {
        "@type": "Question",
        "name": "Where can I check the Nepal calendar date today?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The 'nepal calendar date today' is displayed on the homepage and is the central focus of our 'Nepali Calendar' section. Our 'Hamro Patro' style interface ensures you always see the correct Bikram Sambat 'nepali date today'."
        }
      },
      {
        "@type": "Question",
        "name": "What events are shown in the Nepali Calendar?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our 'nepali calendar' includes public holidays, major festivals, tithis, and significant cultural events, similar to 'Hamro Patro' and 'Mero Patro'. These are linked to the specific 'nepali date today' within the 'nepali calendar nepali calendar'."
        }
      },
      {
        "@type": "Question",
        "name": "How accurate is the Mero Patro style calendar here?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our 'Mero Patro' style 'nepali calendar' uses verified data to ensure high accuracy for all Bikram Sambat dates, including the current 'nepal calendar date today' and events listed in the 'nepali calendar nepali calendar'."
        }
      },
      {
        "@type": "Question",
        "name": "Can I convert the Nepali Date Today to English?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, use our BS to AD converter. It allows easy conversion of the 'nepali date today' or any date selected from the 'nepali calendar' (our 'Hamro Patro' alternative) to the English date."
        }
      },
      {
        "@type": "Question",
        "name": "Is the Hamro Patro feature free to use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, all features, including the full 'nepali calendar', checking the 'nepali date today', and our 'Hamro Patro' / 'Mero Patro' style interface for the 'nepal calendar date today', are free."
        }
      },
      {
        "@type": "Question",
        "name": "How often is the Nepali Calendar updated?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The core data for the 'nepali calendar nepali calendar' is updated for future years well in advance. We ensure the 'nepali date today' and current events are always accurate, like a reliable 'Mero Patro'."
        }
      }
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": canonicalUrl,
    "name": pageTitle, // Use the defined page title
    "description": pageDescription, // Use the defined page description
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${canonicalUrl}search?q={search_term_string}`, // Make sure search URL is correct
      "query-input": "required name=search_term_string"
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "KalimatiRate - Nyure",
    "url": canonicalUrl,
    "logo": `${canonicalUrl}logo.png`, // Assuming logo is at root
    "sameAs": [
      "https://www.facebook.com/QuikNepal",
      "https://twitter.com/QuikNepal",
      "https://www.tiktok.com/@quiknepal"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+977-9746265996",
      "contactType": "customer service",
      "email": "mail@nyure.com.np",
      "areaServed": "NP",
      "availableLanguage": ["en", "ne"]
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Kalimati",
      "addressLocality": "Kathmandu",
      "addressCountry": "Nepal"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [{
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": canonicalUrl
    }]
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // --- Date/Time Formatting Helpers (Using Library) ---
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '-');
  };

  // CORRECTED: Use nepali-date-converter library for accurate BS date
  const getNepaliDate = () => {
    // Ensure the library is available. If not, add `import NepaliDate from 'nepali-date-converter';` at the top.
    try {
      const today = new NepaliDate(); // Create a NepaliDate object for today
      const nepDay = today.getDate();
      const nepMonthIndex = today.getMonth(); // 0-indexed
      const nepYear = today.getYear();
      
      const nepaliMonths = [
        'बैशाख', 'जेठ', 'असार', 'श्रावण', 'भदौ', 'असोज',
        'कार्तिक', 'मंसिर', 'पुष', 'माघ', 'फागुन', 'चैत'
      ];
      
      // Check if the index is valid before accessing the array
      if (nepMonthIndex >= 0 && nepMonthIndex < nepaliMonths.length) {
           return `${nepDay} ${nepaliMonths[nepMonthIndex]} ${nepYear}`;
      } else {
          console.error('Invalid month index from nepali-date-converter');
          return 'मिति लोड गर्न सकिएन'; // Error message
      }
    } catch (error) {
        console.error('Error using nepali-date-converter:', error);
        return 'मिति लोड गर्न सकिएन'; // Error message
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Here you can implement the search logic
    // For now, we'll just check if the search matches our routes
    const query = searchQuery.toLowerCase();
    if (query.includes('rate') || query.includes('kalimati') || query.includes('price')) {
      navigate('/kalimati-tarkari-rate-today');
    } else if (query.includes('date') || query.includes('convert')) {
      navigate('/nep-to-eng-date-converter');
    }
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-[#fdfbf6]">
      {/* --- Add Helmet for SEO --- */}
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={keywords} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={ogImageUrl} /> 
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="ne_NP" /> 
        {/* Add other relevant OG tags */}

        {/* Schema Markup */} 
        <script type="application/ld+json">
          {JSON.stringify(websiteSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
        {/* Add other relevant schemas if needed, carefully considered */}
      </Helmet>
      {/* --- End Helmet --- */}

      <Header />

      {/* Date, Time, and Weather Display */}
      <div className="px-6 mt-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl p-6 relative border border-green-100 shadow-sm">
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            </div>
            <div className="text-center mb-4">
              <div className="text-gray-800 text-xl font-medium inline-flex items-center gap-3">
                <span className="text-gray-900">{getNepaliDate()}</span>
                <span className="text-gray-400">/</span>
                <span className="text-gray-600">{formatDate(currentTime)}</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">Kathmandu, Nepal</div>
            </div>
            <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
              <div className="bg-green-50 rounded-xl p-4 border border-green-100 h-20 flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-gray-600 text-xs">Current Time</div>
                  <div className="text-gray-800 text-2xl font-bold">{formatTime(currentTime)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="max-w-7xl mx-auto px-6 mt-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Our Core Features</h2>
        
        {/* Restructured: Calendar card above, others below */}
        <div className="mx-auto">
          {/* Nepali Calendar Card - Top Row (Centered) */}
          <div className="mb-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 shadow-lg flex flex-col items-center text-center transform hover:scale-[1.01] transition-transform duration-300 ease-out">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-md border border-green-100">
                {/* Calendar Icon */}
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2zM16 11h.01M12 11h.01M8 11h.01M16 15h.01M12 15h.01M8 15h.01"/>
                </svg>
              </div>
              <h3 className="text-gray-900 text-2xl font-semibold mb-3">Nepali Calendar</h3>
              <p className="text-gray-700 text-base mb-6">Explore the full <strong>Nepali Calendar</strong> (विक्रम सम्वत्). Check the <strong>Nepali date today</strong>, events, and holidays with our <strong>Mero Patro / Hamro Patro</strong> style interface. Find the <strong>Nepal calendar date today</strong> easily.</p>
              <Link
                // Link to the base Nepali calendar route (similar to Mero Patro / Hamro Patro)
                to="/calendar"
                className="mt-auto bg-green-600 text-white font-semibold text-base px-8 py-3 rounded-xl shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 ease-out transform hover:scale-105 w-auto block"
              >
                View Calendar
              </Link>
            </div>
          </div>

          {/* Other Services - Bottom Row (Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Kalimati Rates Card */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-md hover:shadow-lg flex flex-col items-center text-center transition-all duration-300 ease-out transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-5 shadow-sm border border-green-200">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-gray-900 text-xl font-semibold mb-2">Kalimati Rates Today</h3>
              <p className="text-gray-600 text-sm mb-6 flex-grow">Get real-time vegetable market prices from Kalimati Bazar. Updated daily for your convenience.</p>
              <button 
                onClick={() => navigate('/kalimati-tarkari-rate-today')}
                className="mt-auto bg-green-600 text-white font-medium text-sm px-6 py-2.5 rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 transition-colors duration-300 w-full"
              >
                Check Prices
              </button>
            </div>

            {/* Date Converter Card */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-md hover:shadow-lg flex flex-col items-center text-center transition-all duration-300 ease-out transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-5 shadow-sm border border-green-200">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-gray-900 text-xl font-semibold mb-2">Date Converter</h3>
              <p className="text-gray-600 text-sm mb-6 flex-grow">Convert dates between BS (Bikram Sambat) and AD (Anno Domini) calendars instantly.</p>
              <button 
                onClick={() => navigate('/nep-to-eng-date-converter')}
                className="mt-auto bg-green-600 text-white font-medium text-sm px-6 py-2.5 rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 transition-colors duration-300 w-full"
              >
                Convert Date
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 mt-12 mb-12">
        <div className="mx-auto">
          <div className="bg-white rounded-xl p-8 border border-green-100 shadow-sm">
            {/* Main Heading - H1 tag with proper structure */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight mb-3 text-center">
              <span className="block mb-2">Nepali Calendar {new Date().getFullYear() + 56}</span>
              <span className="block text-2xl">Mero Patro & Hamro Patro Alternative</span>
              <span className="block text-lg text-green-600 mt-2">Check Nepali Date Today</span>
            </h1>

            {/* Descriptive Text */}
            <p className="text-gray-600 text-lg mb-8 text-center">
              View the official <strong>Nepali Calendar</strong> (Bikram Sambat). Find the current <strong>Nepali date today</strong>, see upcoming events with our <strong>Mero Patro</strong> and <strong>Hamro Patro</strong> style interface. Easily check the <strong>Nepal calendar date today</strong>. Your complete <strong>nepali calendar nepali calendar</strong> resource for daily use.
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-8">
              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <div className="font-medium text-gray-800">Nepali Date Today</div>
                <div className="text-sm text-gray-600">Instantly see today's BS date</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <div className="font-medium text-gray-800">Full Nepali Calendar</div>
                <div className="text-sm text-gray-600">Browse months like Mero Patro</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <div className="font-medium text-gray-800">Events & Holidays</div>
                <div className="text-sm text-gray-600">Similar to Hamro Patro</div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <button
                onClick={() => navigate('/calendar')}
                className="bg-green-600 text-white font-medium text-base px-6 py-3 rounded-xl shadow-md hover:bg-green-700 transition-colors"
              >
                View Nepali Calendar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Market Highlights Section */}
      <div className="max-w-7xl mx-auto px-6 mt-16">
        <div className="mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center" id="market-highlights">
            आजको तरकारी मुल्य | Today's Market Highlights
          </h2>
          
          {/* Essential Vegetables Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 border border-green-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Most Searched Items at Kalimati Tarkari Bazar
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">●</span>
                    <span className="text-gray-800">आलु (Potato)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Min-Max:</span>
                    <span className="font-medium text-gray-800">₨40-60/kg</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">●</span>
                    <span className="text-gray-800">प्याज (Onion)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Min-Max:</span>
                    <span className="font-medium text-gray-800">₨80-90/kg</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">●</span>
                    <span className="text-gray-800">टमाटर (Tomato)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Min-Max:</span>
                    <span className="font-medium text-gray-800">₨45-55/kg</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-3">Find these prices alongside the <strong className="text-gray-700">Nepali date today</strong> and plan with our <strong className="text-gray-700">Nepali calendar</strong>.</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-green-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Today's Best Value at Kalimati
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">●</span>
                    <span className="text-gray-800">काउली (Cauliflower)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-green-600 font-medium">↓20%</span>
                    <span className="font-medium text-gray-800">₨35/kg</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">●</span>
                    <span className="text-gray-800">बन्दा (Cabbage)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-green-600 font-medium">↓15%</span>
                    <span className="font-medium text-gray-800">₨30/kg</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">●</span>
                    <span className="text-gray-800">मूला (Radish)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-green-600 font-medium">↓25%</span>
                    <span className="font-medium text-gray-800">₨25/kg</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-3">Use our <strong className="text-gray-700">Mero Patro / Hamro Patro</strong> style calendar to check the <strong className="text-gray-700">Nepal calendar date today</strong> for best shopping days.</p>
            </div>
          </div>

          {/* Market Status and Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div id="market-status" className="bg-white rounded-xl p-6 border border-green-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Market Status & Calendar Info</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 font-medium">कलिमाटी तरकारी बजार Open</span>
                </div>
                <p className="text-gray-600 text-sm">Operating Hours: 5:00 AM - 7:00 PM</p>
                <p className="text-gray-600 text-sm">Best visiting hours: 6:00 AM - 9:00 AM</p>
                <p className="text-gray-600 text-sm">Current crowd level: Moderate</p>
                <p className="text-sm text-gray-500 mt-3">View the <strong>nepali calendar nepali calendar</strong> to see if events on the <strong>Nepali date today</strong> might affect market activity. Our <strong>Hamro Patro</strong> feature helps planning.</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-green-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Shopping Tips with Mero Patro</h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">●</span>
                  <p className="text-gray-600 text-sm">Check rates and use our <strong className="text-gray-700">Mero Patro</strong> style calendar for the <strong className="text-gray-700">Nepal calendar date today</strong> before visiting.</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">●</span>
                  <p className="text-gray-600 text-sm">Compare prices; use the <strong className="text-gray-700">Nepali calendar</strong> (like <strong className="text-gray-700">Hamro Patro</strong>) to check holidays affecting deals/hours for the <strong className="text-gray-700">nepali date today</strong>.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div id="faq" className="max-w-7xl mx-auto px-6 mt-16 mb-12">
        <div className="mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
            FAQs: Nepali Calendar | Mero Patro | Hamro Patro | Nepali Date Today
          </h2>
          
          <div className="space-y-6">
            {/* FAQ 1 */}
            <div className="bg-white rounded-xl p-6 border border-green-100 shadow-sm">
              <div className="flex gap-3">
                <span className="text-green-600 font-bold">1️⃣</span>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">What is the Nepali Calendar?</h3>
                  <p className="text-gray-600">The <strong>Nepali Calendar</strong> (Bikram Sambat) is Nepal's official calendar. Use our platform to find the current <strong>Nepali date today</strong> and explore the full <strong>nepali calendar nepali calendar</strong>. It's essential for knowing the <strong>Nepal calendar date today</strong>.</p>
                </div>
              </div>
            </div>

            {/* FAQ 2 */}
            <div className="bg-white rounded-xl p-6 border border-green-100 shadow-sm">
              <div className="flex gap-3">
                <span className="text-green-600 font-bold">2️⃣</span>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">How is this different from Hamro Patro or Mero Patro?</h3>
                  <p className="text-gray-600">Our site offers a similar experience to <strong>Hamro Patro</strong> and <strong>Mero Patro</strong>, providing a detailed <strong>Nepali Calendar</strong>, the current <strong>Nepali date today</strong>, and event info for the <strong>nepal calendar date today</strong>. We also integrate Kalimati rates.</p>
                </div>
              </div>
            </div>

            {/* FAQ 3 */}
            <div className="bg-white rounded-xl p-6 border border-green-100 shadow-sm">
              <div className="flex gap-3">
                <span className="text-green-600 font-bold">3️⃣</span>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">How do I find the Nepal calendar date today?</h3>
                  <p className="text-gray-600">The <strong>Nepal calendar date today</strong> is clearly displayed on our homepage and within the main <strong>Nepali Calendar</strong> view (our <strong>Mero Patro</strong> / <strong>Hamro Patro</strong> alternative). It's updated daily to show the correct <strong>Nepali date today</strong>.</p>
                </div>
              </div>
            </div>

            {/* FAQ 4 */}
            <div className="bg-white rounded-xl p-6 border border-green-100 shadow-sm">
              <div className="flex gap-3">
                <span className="text-green-600 font-bold">4️⃣</span>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">What information does the Nepali Calendar include?</h3>
                  <p className="text-gray-600">Our <strong>Nepali Calendar</strong> shows the <strong>Nepali date today</strong>, tithis, public holidays, festivals for the <strong>nepal calendar date today</strong>, and other events, similar to <strong>Mero Patro</strong> and <strong>Hamro Patro</strong>. Explore the full <strong>nepali calendar nepali calendar</strong> for details.</p>
                </div>
              </div>
            </div>

            {/* FAQ 5 */}
            <div className="bg-white rounded-xl p-6 border border-green-100 shadow-sm">
              <div className="flex gap-3">
                <span className="text-green-600 font-bold">5️⃣</span>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">Is the Nepali Calendar nepali calendar feature easy to navigate?</h3>
                  <p className="text-gray-600">Yes, our <strong>nepali calendar nepali calendar</strong> interface is user-friendly. Quickly navigate months/years like in <strong>Hamro Patro</strong> to find any <strong>Nepal calendar date today</strong> or view the complete <strong>Nepali calendar</strong>.</p>
                </div>
              </div>
            </div>

            {/* FAQ 6 */}
            <div className="bg-white rounded-xl p-6 border border-green-100 shadow-sm">
              <div className="flex gap-3">
                <span className="text-green-600 font-bold">6️⃣</span>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">Can I see future dates in the Nepali Calendar?</h3>
                  <p className="text-gray-600">Yes, navigate the <strong>Nepali Calendar</strong> (our <strong>Mero Patro</strong> alternative) to view future months/years. Check events and see the corresponding <strong>Nepali date today</strong> equivalent for future <strong>Nepal calendar date today</strong> entries.</p>
                </div>
              </div>
            </div>

            {/* FAQ 7 */}
            <div className="bg-white rounded-xl p-6 border border-green-100 shadow-sm">
              <div className="flex gap-3">
                <span className="text-green-600 font-bold">7️⃣</span>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">Do you offer a Mero Patro mobile app?</h3>
                  <p className="text-gray-600">Currently, we offer this web platform with <strong>Mero Patro</strong> and <strong>Hamro Patro</strong> style features. Access the full <strong>Nepali Calendar</strong>, check the <strong>Nepali date today</strong>, and see the <strong>nepal calendar date today</strong> details from any browser.</p>
                </div>
              </div>
            </div>

            {/* FAQ 8 */}
            <div className="bg-white rounded-xl p-6 border border-green-100 shadow-sm">
              <div className="flex gap-3">
                <span className="text-green-600 font-bold">8️⃣</span>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">How is the Nepali date today determined?</h3>
                  <p className="text-gray-600">The <strong>Nepali date today</strong> follows the Bikram Sambat (BS) system. Our <strong>Nepali Calendar</strong> accurately reflects the official <strong>Nepal calendar date today</strong> based on this system.</p>
                </div>
              </div>
            </div>

            {/* FAQ 9 */}
            <div className="bg-white rounded-xl p-6 border border-green-100 shadow-sm">
              <div className="flex gap-3">
                <span className="text-green-600 font-bold">9️⃣</span>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">Can I print the Nepali Calendar?</h3>
                  <p className="text-gray-600">Use your browser's print function to print the current view of the <strong>Nepali Calendar</strong> month (like a <strong>Mero Patro</strong> page), including the <strong>Nepal calendar date today</strong> details shown in the <strong>nepali calendar nepali calendar</strong>.</p>
                </div>
              </div>
            </div>

            {/* FAQ 10 */}
            <div className="bg-white rounded-xl p-6 border border-green-100 shadow-sm">
              <div className="flex gap-3">
                <span className="text-green-600 font-bold">🔟</span>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">Where does the data for the Hamro Patro style calendar come from?</h3>
                  <p className="text-gray-600">Our <strong>Hamro Patro</strong> style <strong>Nepali Calendar</strong> data comes from reliable public sources and calculations, ensuring accuracy for the <strong>nepali calendar nepali calendar</strong>, the <strong>Nepali date today</strong>, and the general <strong>Nepal calendar date today</strong> information.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home; 