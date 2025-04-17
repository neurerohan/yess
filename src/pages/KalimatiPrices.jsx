import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVegetables } from '../hooks/useVegetables';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Helmet } from 'react-helmet-async';
// Remove Recharts import temporarily
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const KalimatiPrices = () => {
  const navigate = useNavigate();
  const {
    vegetables,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    filter,
    setFilter,
    summary,
    refresh
  } = useVegetables();
  
  const [viewMode, setViewMode] = useState('table'); // Add this state for toggle
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const carouselImages = [
    {
      src: "/market-image.jpg",
      alt: "Kalimati Market Overview - Kalimati Tarkari Rate Today",
      caption: "Kalimati Fresh Vegetable Market - Daily Kalimati Tarkari Price"
    },
    {
      src: "/market-entrance.jpg",
      alt: "Kalimati Tarkari Bazar Entrance - Kalimati Tarkari Bazar Price Today",
      caption: "Welcome to Kalimati Bazar - Check Kalimati Tarkari Rate Today"
    },
    {
      src: "/market-aerial.jpg",
      alt: "Aerial View of Kalimati Market - Find Kalimati Tarkari Price",
      caption: "Bird's Eye View of Kalimati Market"
    },
    {
      src: "/kalimati-tarkari-rate-today.png",
      alt: "Kalimati Tarkari Rate Today - Price List",
      caption: "Daily Kalimati Tarkari Bazar Rate Today Updates"
    }
  ];

  // Auto-slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => 
        prev === carouselImages.length - 1 ? 0 : prev + 1
      );
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => 
      prev === carouselImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => 
      prev === 0 ? carouselImages.length - 1 : prev - 1
    );
  };

  // Add dates for SEO
  const publishDate = "2024-01-01"; // Initial publish date
  const modifiedDate = new Date().toISOString().split('T')[0]; // Today's date

  // Helper function for formatted date
  const getFormattedDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // --- START Schema Markup with Enhanced Keywords ---
  const marketPricesSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "name": "Kalimati Tarkari Rate Today - Daily Kalimati Tarkari Price List",
    "description": "Daily updated kalimati tarkari price list from Kalimati market, Nepal. Check the official kalimati tarkari rate today and kalimati tarkari bazar price today.",
    "url": "https://kalimatirate.nyure.com.np/kalimati-tarkari-rate-today",
    "keywords": ["kalimati", "kalimati tarkari rate today", "kalimati tarkari bazar price today", "kalimati tarkari bazar rate today", "kalimati tarkari price", "vegetable prices", "kalimati market", "nepal wholesale market", "fresh vegetables", "daily vegetable prices"],
    "isAccessibleForFree": true,
    "dateModified": modifiedDate,
    "datePublished": publishDate,
    "creator": {
      "@type": "Organization",
      "name": "Nyure",
      "url": "https://nyure.com.np"
    },
    "temporalCoverage": `Provides the ${new Date().getFullYear()} kalimati tarkari rate today`,
    "spatialCoverage": {
      "@type": "Place",
      "name": "Kalimati Fruits and Vegetable Market (Kalimati Tarkari Bazar)",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Kalimati",
        "addressRegion": "Kathmandu",
        "addressCountry": "NP"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "27.6995",
        "longitude": "85.2888"
      }
    },
    "provider": {
      "@type": "Organization",
      "name": "Kalimati Fruits and Vegetable Market Development Board",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+977-9746265996",
        "contactType": "customer service for Kalimati Tarkari Price"
      }
    },
    "offers": {
      "@type": "AggregateOffer",
      "name": "Kalimati Tarkari Bazar Rate Today Offers",
      "lowPrice": summary?.minPrice || 0,
      "highPrice": summary?.maxPrice || 0,
      "priceCurrency": "NPR",
      "offerCount": vegetables.length,
      "description": `Range of kalimati tarkari price available at Kalimati.`
    },
    "about": {
      "@type": "LocalBusiness",
      "name": "Kalimati Vegetable Market",
      "openingHours": [
        "Mo-Su 04:00-21:00"
      ],
      "priceRange": "₨₨-₨₨₨",
      "description": "Primary source for Kalimati Tarkari Bazar Price Today in Kathmandu."
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is the latest Kalimati Tarkari rate today?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The latest kalimati tarkari rate today is updated daily. Today's average kalimati tarkari price range is Rs. ${summary?.minPrice || 0} to Rs. ${summary?.maxPrice || 0}. Check the full kalimati tarkari bazar price today list here.`
        }
      },
      {
        "@type": "Question",
        "name": "Why do Kalimati Tarkari prices change daily in Kalimati Bazar?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Kalimati tarkari price changes daily due to weather, fuel costs, supply/demand, and policies affecting the kalimati market. This impacts the kalimati tarkari bazar rate today."
        }
      },
      {
        "@type": "Question",
        "name": "Where can I check the daily Kalimati vegetable price list?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can check the updated Kalimati Tarkari Rate Today on this page. We provide the official kalimati tarkari bazar price today directly from the kalimati vegetable market."
        }
      },
      {
        "@type": "Question",
        "name": "Which vegetables have the cheapest Kalimati Tarkari Price today?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Seasonal vegetables usually have the cheapest kalimati tarkari price. Check today's updated kalimati tarkari bazar rate today list to find the current best prices at kalimati."
        }
      },
      {
        "@type": "Question",
        "name": "Why is the Kalimati Tarkari Bazar Rate Today increasing?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The kalimati tarkari bazar rate today can increase due to weather, fuel price hikes, supply issues, demand, and policies. These factors influence the overall kalimati tarkari price."
        }
      },
      {
        "@type": "Question",
        "name": "Are Kalimati Bazar prices the same across Nepal?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No, the kalimati tarkari bazar price today is a wholesale reference for Kathmandu. Retail kalimati tarkari price in other cities may vary due to transport and local factors."
        }
      },
      {
        "@type": "Question",
        "name": "What is the best time to buy vegetables at Kalimati market?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Early morning is best for fresh vegetables and potentially better kalimati tarkari price deals before the main kalimati tarkari bazar rate today fluctuates."
        }
      },
      {
        "@type": "Question",
        "name": "Does Kalimati Tarkari Bazar have an online price list for today?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, this website provides the updated Kalimati Tarkari Rate Today online. Get the official kalimati tarkari bazar price today list here daily."
        }
      },
      {
        "@type": "Question",
        "name": "Why are seasonal vegetables cheaper in the Kalimati Tarkari Bazar Rate Today?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Seasonal vegetables are locally abundant, reducing transport/storage costs, leading to a lower kalimati tarkari price in the kalimati tarkari bazar rate today."
        }
      },
      {
        "@type": "Question",
        "name": "How do transportation costs affect the Kalimati Tarkari Price?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Increased fuel prices raise transport costs, directly impacting the kalimati tarkari price reflected in the kalimati tarkari bazar rate today at the kalimati market."
        }
      }
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://kalimatirate.nyure.com.np"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Kalimati Tarkari Rate Today",
        "item": "https://kalimatirate.nyure.com.np/kalimati-tarkari-rate-today" // Current page
      }
    ]
  };
  // --- END Schema Markup with Enhanced Keywords ---

  return (
    <>
      {/* --- START Helmet with Enhanced Keywords --- */}
      <Helmet>
        <title>आजको कालिमाटी तरकारी रेट | Kalimati Tarkari Rate Today [2024] - Kalimati Tarkari Price</title>
        <meta name="description" content="Check today's Kalimati Tarkari rate today for fresh vegetables in Nepal. Get daily updates on Kalimati Tarkari Bazar Price Today. View the latest Kalimati Tarkari Price list from Kalimati market, Kathmandu." />
        <meta name="keywords" content="kalimati, kalimati tarkari rate today, kalimati tarkari bazar price today, kalimati tarkari bazar rate today, kalimati tarkari price, vegetable prices, Kalimati market, Nepal wholesale market, fresh vegetables, daily vegetable prices" />
        <script type="application/ld+json">
          {JSON.stringify(marketPricesSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>
      {/* --- END Helmet with Enhanced Keywords --- */}

      <div className="min-h-screen bg-[#fdfbf6]">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb Navigation */}
          <nav className="mb-4 text-sm" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <button onClick={() => navigate('/')} className="text-green-600 hover:text-green-700">
                  Home
                </button>
              </li>
              <li className="text-gray-500">/</li>
              <li className="text-gray-700" aria-current="page">
                Kalimati Tarkari Rate Today
              </li>
            </ol>
          </nav>

          {/* --- START SEO Enhanced Header with Keywords --- */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              कालिमाटी तरकारी रेट टुडे | Kalimati Tarkari Rate Today
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              Kalimati Tarkari Bazar Price Today - Nepal
            </p>
            <p className="text-gray-600 max-w-2xl mx-auto mb-4">
              Daily updates on the official <strong>Kalimati Tarkari Rate Today</strong> from Nepal's largest wholesale market in <strong>Kalimati</strong>, Kathmandu.
              Check today's wholesale and retail <strong>kalimati tarkari price</strong>, view the complete <strong>Kalimati Tarkari Bazar Rate Today</strong> list updated every morning.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <time dateTime={publishDate} className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Published: {publishDate}
              </time>
              <time dateTime={modifiedDate} className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Kalimati Tarkari Rate Today Updated: {getFormattedDate()}
              </time>
            </div>
          </div>
          {/* --- END SEO Enhanced Header with Keywords --- */}

          {/* Dynamic Content Area: Price Summary, Table/Card View */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Search and Filters - Rendered Always */}
            <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* View Toggle Buttons */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-4 py-2 rounded-md ${
                    viewMode === 'table'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  aria-pressed={viewMode === 'table'}
                >
                  Table View (Kalimati Rates)
                </button>
                <button
                  onClick={() => setViewMode('card')}
                  className={`px-4 py-2 rounded-md ${
                    viewMode === 'card'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  aria-pressed={viewMode === 'card'}
                >
                  Card View (Kalimati Prices)
                </button>
              </div>
              
              {/* Search and Price Filter Buttons */}
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Search Kalimati Tarkari Price..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  aria-label="Search Kalimati Tarkari Price"
                />
                <div className="flex gap-1">
                  {['all', 'min', 'max', 'avg'].map((filterType) => (
                    <button
                      key={filterType}
                      onClick={() => setFilter(filterType)}
                      className={`px-3 py-2 rounded-md text-sm ${
                        filter === filterType
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      aria-pressed={filter === filterType}
                    >
                      {filterType === 'all' ? 'All Kalimati Prices' : `${filterType.charAt(0).toUpperCase() + filterType.slice(1)} Price`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Conditional Rendering for Loading, Error, or Data */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500 mx-auto"></div>
                  <h2 className="mt-4 text-xl font-semibold text-gray-700">Loading Kalimati Tarkari Rate Today...</h2>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center px-4 py-20">
                <div className="text-center max-w-md w-full">
                  <div className="bg-red-100 p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold text-red-700 mb-2">Error Fetching Kalimati Tarkari Price</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                      onClick={refresh}
                      className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
                    >
                      Retry Loading Kalimati Rates
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* --- START Table View with Enhanced Keywords --- */}
                {viewMode === 'table' && (
                  <div id="price-table-section" className="mb-8 overflow-x-auto"> {/* Added ID for scroll target */}
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Kalimati Tarkari Bazar Rate Today - Price List
                    </h2>
                    <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-sm border-collapse">
                      <thead className="bg-green-50">
                        <tr>
                          <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-r border-gray-200">तरकारी (Kalimati Tarkari)</th>
                          <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-r border-gray-200">एकाइ</th>
                          <th scope="col" className="px-4 py-3 text-center text-sm font-semibold text-gray-900 border-r border-gray-200">न्यूनतम (Min Price)</th>
                          <th scope="col" className="px-4 py-3 text-center text-sm font-semibold text-gray-900 border-r border-gray-200">अधिकतम (Max Price)</th>
                          <th scope="col" className="px-4 py-3 text-center text-sm font-semibold text-gray-900">औसत (Avg Kalimati Price)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {vegetables.length > 0 ? (
                          vegetables.map((vegetable) => (
                            <tr key={vegetable.id} className="hover:bg-green-50 transition-colors">
                              <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200">{vegetable.name_nepali}</td>
                              <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-200">{vegetable.unit}</td>
                              <td className="px-4 py-3 text-sm text-center text-green-600 font-medium border-r border-gray-200">
                                रु. {vegetable.min_price}
                              </td>
                              <td className="px-4 py-3 text-sm text-center text-red-600 font-medium border-r border-gray-200">
                                रु. {vegetable.max_price}
                              </td>
                              <td className="px-4 py-3 text-sm text-center text-blue-600 font-medium">
                                रु. {vegetable.avg_price}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="text-center py-12 px-4">
                              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                No Kalimati Tarkari Price Found
                              </h3>
                              <p className="text-gray-600">
                                Try adjusting your search for Kalimati Tarkari Rate Today.
                              </p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
                {/* --- END Table View with Enhanced Keywords --- */}

                {/* --- START Card View with Enhanced Keywords --- */}
                {viewMode === 'card' && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Kalimati Tarkari Price Cards - Today
                    </h2>
                    {vegetables.length > 0 ? (
                       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {vegetables.map((vegetable) => (
                          <div
                            key={vegetable.id}
                            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                          >
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {vegetable.name_nepali} (Kalimati Tarkari)
                            </h3>
                            <p className="text-gray-600 mb-4">Unit: {vegetable.unit}</p>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-green-600">Min Price:</span>
                                <span className="font-medium">Rs. {vegetable.min_price}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-red-600">Max Price:</span>
                                <span className="font-medium">Rs. {vegetable.max_price}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-blue-600">Avg Kalimati Price:</span>
                                <span className="font-medium">Rs. {vegetable.avg_price}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                          No Kalimati Tarkari Price Data Found
                        </h3>
                        <p className="text-gray-600">
                          Please check back later for the Kalimati Tarkari Bazar Rate Today.
                        </p>
                      </div>
                    )}
                  </div>
                )}
                {/* --- END Card View with Enhanced Keywords --- */}
              </>
            )}
          </div>

          {/* Static Content Sections - Rendered Always */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

            {/* --- START Market Overview with Keywords --- */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Today's Kalimati Market Overview - Kalimati Tarkari Rate Today
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Kalimati Market Hours</h3>
                  <ul className="space-y-1 text-gray-600">
                    <li>Wholesale Market: 4:00 AM - 9:00 AM</li>
                    <li>Retail Market: 9:00 AM - 8:00 PM</li>
                    <li>Best Deals on Kalimati Tarkari Price: Early morning</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Kalimati Tarkari Bazar Rate Today Highlights</h3>
                  <ul className="space-y-1 text-gray-600">
                    <li>Market Status: Open (Kalimati)</li>
                    <li>Kalimati Tarkari Price Trend: {loading ? 'Loading...' : (summary?.avgPrice > 0 ? 'Stable' : 'N/A')}</li>
                    <li>Last Kalimati Rate Update: {loading ? 'Loading...' : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</li>
                  </ul>
                </div>
              </div>
            </div>
            {/* --- END Market Overview with Keywords --- */}

            {/* Image Carousel */}
            <section className="mb-12" aria-labelledby="gallery-heading">
              <h2 id="gallery-heading" className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Kalimati Tarkari Bazar Gallery
              </h2>
              <div className="relative overflow-hidden rounded-xl">
                <div className="aspect-w-16 aspect-h-9 relative">
                  {carouselImages.map((image, index) => (
                    <div
                      key={index}
                      className={`absolute w-full h-full transition-all duration-500 ease-in-out transform ${
                        index === currentSlide 
                          ? 'translate-x-0 opacity-100' 
                          : 'translate-x-full opacity-0'
                      }`}
                    >
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                        <h3 className="text-white text-xl font-semibold">
                          {image.caption}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Navigation Buttons */}
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all"
                  aria-label="Previous Kalimati image"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all"
                   aria-label="Next Kalimati image"
               >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Slide Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {carouselImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentSlide ? 'bg-white w-4' : 'bg-white/50'
                      }`}
                      aria-label={`Go to Kalimati gallery slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* --- START Why Prices Change Section with Keywords --- */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Why Does the Kalimati Tarkari Rate Today Change?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {[
                  {
                    icon: "🌧️",
                    title: "Weather",
                    description: "Affects crops & kalimati tarkari price"
                  },
                  {
                    icon: "🌱",
                    title: "Seasonality",
                    description: "Impacts kalimati tarkari bazar rate today"
                  },
                  {
                    icon: "⛽",
                    title: "Fuel Costs",
                    description: "Influences transport & final kalimati price"
                  },
                  {
                    icon: "📜",
                    title: "Policies",
                    description: "Taxes/subsidies change kalimati tarkari rate"
                  },
                  {
                    icon: "📊",
                    title: "Supply/Demand",
                    description: "Key driver for kalimati tarkari bazar price today"
                  }
                ].map((factor, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all">
                    <div className="text-4xl mb-4">{factor.icon}</div>
                    <h3 className="font-semibold text-gray-900 mb-2">{factor.title}</h3>
                    <p className="text-gray-600 text-sm">{factor.description}</p>
                  </div>
                ))}
              </div>
            </section>
            {/* --- END Why Prices Change Section with Keywords --- */}

            {/* --- START Popular Vegetables Section with Keywords --- */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Popular Vegetables & Kalimati Tarkari Price
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[ // Note: Prices/changes here are static examples
                  {
                    name: "टमाटर (Tomato)",
                    image: "/tomato.jpg",
                    price: 50,
                    change: -5,
                    unit: "केजी"
                  },
                  {
                    name: "काउली (Cauliflower)",
                    image: "/cauliflower.jpg",
                    price: 60,
                    change: 10,
                    unit: "केजी"
                  },
                  {
                    name: "आलु (Potato)",
                    image: "/potato.jpg",
                    price: 45,
                    change: -2,
                    unit: "केजी"
                  },
                  {
                    name: "प्याज (Onion)",
                    image: "/onion.jpg",
                    price: 75,
                    change: 15,
                    unit: "केजी"
                  },
                  // Add more examples if needed
                ].map((veg, index) => (
                  <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={veg.image} 
                        alt={`${veg.name} - Kalimati Tarkari Price`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{veg.name}</h3>
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold">
                          रु. {veg.price}/{veg.unit}
                        </span>
                        {/* Price change indicator - Example */}
                        <span className={`px-2 py-1 rounded text-sm ${
                          veg.change < 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {veg.change > 0 ? '↑' : '↓'} {Math.abs(veg.change)}%
                        </span>
                      </div>
                       <p className="text-xs text-gray-500 mt-1">Example Kalimati Tarkari Price</p>
                    </div>
                  </div>
                ))}
              </div>
               <p className="text-center text-sm text-gray-600 mt-4">Note: Prices shown are illustrative. Check the main table/cards for the official <strong>Kalimati Tarkari Rate Today</strong>.</p>
            </section>
            {/* --- END Popular Vegetables Section with Keywords --- */}


            {/* Comment out the Price Trends Section temporarily */}
            {/*
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Kalimati Tarkari Price Trends Analysis
              </h2>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                // ... chart code ...
              </div>
            </section>
            */}

            {/* --- START Enhanced Filter Section with Keywords --- */}
            <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
               <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter Kalimati Tarkari Price List</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="price-range-filter" className="block text-sm font-medium text-gray-700 mb-2">
                    Kalimati Price Range
                  </label>
                  <select id="price-range-filter" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option>All Prices</option>
                    <option>रु. 0 - रु. 50</option>
                    <option>रु. 50 - रु. 100</option>
                    <option>रु. 100+</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="sort-by-filter" className="block text-sm font-medium text-gray-700 mb-2">
                    Sort Kalimati Rates By
                  </label>
                  <select id="sort-by-filter" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Name (A-Z)</option>
                    {/* Add more relevant sort options */}
                  </select>
                </div>
                <div>
                  <label htmlFor="origin-filter" className="block text-sm font-medium text-gray-700 mb-2">
                    Origin (Kalimati Source)
                  </label>
                  <select id="origin-filter" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option>All</option>
                    <option>Local (Nepal)</option>
                    <option>Imported</option>
                  </select>
                </div>
                {/* Consider adding category filter if applicable */}
              </div>
            </div>
            {/* --- END Enhanced Filter Section with Keywords --- */}

            {/* --- START Market Information Section with Keywords --- */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                About Kalimati Tarkari Bazar & Price Today
              </h2>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      About Kalimati Market (Kalimati)
                    </h3>
                    <p className="text-gray-600">
                      <strong>Kalimati</strong> Fruits and Vegetable Market is Nepal's largest wholesale hub,
                      supplying fresh produce. Located in <strong>Kalimati</strong>, Kathmandu, it's the primary source for the official <strong>Kalimati Tarkari Bazar Price Today</strong> reference for vegetables across Nepal. Get the daily <strong>kalimati tarkari price</strong> here.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      Market Timings for Kalimati Tarkari Rate Today
                    </h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Wholesale Market (Best Kalimati Tarkari Price): 4 AM - 9 AM</li>
                      <li>• Retail Market (Check Kalimati Tarkari Rate Today): 9 AM - 8 PM</li>
                      <li>• Visit early for the freshest produce at Kalimati.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
            {/* --- END Market Information Section with Keywords --- */}

            {/* --- START Added Content Section from Home.jsx (Keep Original) --- */}
            {/* This section seems relevant to Kalimati prices, keeping it */}
            <section className="my-12 px-6" aria-labelledby="kalimati-highlights-heading">
              <div className="max-w-3xl mx-auto">
                {/* Content Copied from Home Hero/Highlights */}
                <div className="bg-white rounded-xl p-8 border border-green-100 shadow-sm mb-12">
                  <h2 id="kalimati-highlights-heading" className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight mb-3 text-center">
                    <span className="block mb-2">आजको कलिमाटी तरकारी रेट</span>
                    <span className="block text-2xl">Kalimati Tarkari Rate Today [{new Date().getFullYear()}]</span> {/* Use current year */}
                    <span className="block text-lg text-green-600 mt-2">Daily Updates</span>
                  </h2>
                  <p className="text-gray-600 text-lg mb-8 text-center">
                    दैनिक अपडेट गरिएको तरकारी बजारको मूल्य | Get real-time <strong>kalimati tarkari price</strong> from
                    <strong className="text-green-600"> Kalimati Tarkari Bazar</strong>, Nepal's largest wholesale market. Find the latest <strong>kalimati tarkari bazar rate today</strong> list here.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-8">
                    <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                      <div className="font-medium text-gray-800">आजको तरकारी मुल्य</div>
                      <div className="text-sm text-gray-600">Daily Kalimati Price Updates</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                      <div className="font-medium text-gray-800">Wholesale Rates</div>
                      <div className="text-sm text-gray-600">Direct from Kalimati</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                      <div className="font-medium text-gray-800">Live Updates</div>
                      <div className="text-sm text-gray-600">Real-time Kalimati Tarkari Rate Today</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <button
                      onClick={() => document.getElementById('price-table-section')?.scrollIntoView({ behavior: 'smooth' })}
                      className="bg-green-600 text-white font-medium text-base px-6 py-3 rounded-xl shadow-md hover:bg-green-700 transition-colors"
                    >
                      Check Kalimati Tarkari Rate Today List
                    </button>
                  </div>
                </div>

                {/* Market Highlights Section - Reverted */}
                <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  आजको तरकारी मुल्य | Today's Market Highlights at Kalimati
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="bg-white rounded-xl p-6 border border-green-100 shadow-sm">
                    <h4 className="text-lg font-bold text-gray-800 mb-4">
                      Most Searched Kalimati Tarkari
                    </h4>
                    <div className="space-y-3">
                      {/* Static examples */}
                      <div className="flex items-center justify-between"> /* ... potato ... */ </div>
                      <div className="flex items-center justify-between"> /* ... onion ... */ </div>
                      <div className="flex items-center justify-between"> /* ... tomato ... */ </div>
                    </div>
                     <p className="text-xs text-gray-500 mt-2">Check actual <strong>Kalimati Tarkari Price</strong> in the list above.</p>
                  </div>
                  <div className="bg-white rounded-xl p-6 border border-green-100 shadow-sm">
                    <h4 className="text-lg font-bold text-gray-800 mb-4">
                      Today's Best Value - Kalimati Tarkari Rate Today
                    </h4>
                    <div className="space-y-3">
                      {/* Static examples */}
                      <div className="flex items-center justify-between"> /* ... cauliflower ... */ </div>
                      <div className="flex items-center justify-between"> /* ... cabbage ... */ </div>
                      <div className="flex items-center justify-between"> /* ... radish ... */ </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Based on recent <strong>Kalimati Tarkari Bazar Rate Today</strong> trends.</p>
                  </div>
                </div>

                {/* Market Status and Tips - Reverted */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div id="market-status-kalimati" className="bg-white rounded-xl p-6 border border-green-100 shadow-sm">
                    <h4 className="text-lg font-bold text-gray-800 mb-4">Kalimati Market Status</h4>
                    {/* ... status content ... */}
                  </div>
                  <div className="bg-white rounded-xl p-6 border border-green-100 shadow-sm">
                    <h4 className="text-lg font-bold text-gray-800 mb-4">Shopping Tips for Kalimati Tarkari Price</h4>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">●</span>
                        <p className="text-gray-600 text-sm">Check <strong>Kalimati tarkari rate today</strong> before visiting <strong>Kalimati</strong>.</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">●</span>
                        <p className="text-gray-600 text-sm">Best deals on <strong>kalimati tarkari price</strong> during early morning hours.</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">●</span>
                        <p className="text-gray-600 text-sm">Compare <strong>kalimati tarkari bazar price today</strong> from multiple vendors.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {/* --- END Added Content Section from Home.jsx --- */}


            {/* --- START FAQ Section with Keywords --- */}
            <section className="mt-16 mb-12" aria-labelledby="faq-heading">
              <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
                <h2 id="faq-heading" className="text-2xl font-bold text-gray-900 mb-8 text-center">
                  Kalimati Tarkari Rate Today - FAQs
                </h2>
                
                <div className="space-y-4">
                  {[ // Using updated FAQ content from schema
                    {
                      question: "What is the latest Kalimati Tarkari rate today?",
                      answer: `The latest kalimati tarkari rate today is updated daily. Today's average kalimati tarkari price range is Rs. ${summary?.minPrice || 0} to Rs. ${summary?.maxPrice || 0}. Check the full kalimati tarkari bazar price today list here.`
                    },
                    {
                      question: "Why do Kalimati Tarkari prices change daily in Kalimati Bazar?",
                      answer: "Kalimati tarkari price changes daily due to weather, fuel costs, supply/demand, and policies affecting the kalimati market. This impacts the kalimati tarkari bazar rate today."
                    },
                    {
                      question: "Where can I check the daily Kalimati vegetable price list?",
                      answer: "You can check the updated Kalimati Tarkari Rate Today on this page. We provide the official kalimati tarkari bazar price today directly from the kalimati vegetable market."
                    },
                     {
                      question: "Which vegetables have the cheapest Kalimati Tarkari Price today?",
                      answer: "Seasonal vegetables usually have the cheapest kalimati tarkari price. Check today's updated kalimati tarkari bazar rate today list to find the current best prices at kalimati."
                    },
                    {
                      question: "Why is the Kalimati Tarkari Bazar Rate Today increasing?",
                      answer: "The kalimati tarkari bazar rate today can increase due to weather, fuel price hikes, supply issues, demand, and policies. These factors influence the overall kalimati tarkari price."
                    },
                     {
                      question: "Are Kalimati Bazar prices the same across Nepal?",
                      answer: "No, the kalimati tarkari bazar price today is a wholesale reference for Kathmandu. Retail kalimati tarkari price in other cities may vary due to transport and local factors."
                    },
                    {
                       question: "What is the best time to buy vegetables at Kalimati market?",
                       answer: "Early morning is best for fresh vegetables and potentially better kalimati tarkari price deals before the main kalimati tarkari bazar rate today fluctuates."
                     },
                     {
                       question: "Does Kalimati Tarkari Bazar have an online price list for today?",
                       answer: "Yes, this website provides the updated Kalimati Tarkari Rate Today online. Get the official kalimati tarkari bazar price today list here daily."
                     },
                     {
                       question: "Why are seasonal vegetables cheaper in the Kalimati Tarkari Bazar Rate Today?",
                       answer: "Seasonal vegetables are locally abundant, reducing transport/storage costs, leading to a lower kalimati tarkari price in the kalimati tarkari bazar rate today."
                     },
                     {
                       question: "How do transportation costs affect the Kalimati Tarkari Price?",
                       answer: "Increased fuel prices raise transport costs, directly impacting the kalimati tarkari price reflected in the kalimati tarkari bazar rate today at the kalimati market."
                     }
                  ].map((faq, index) => (
                    <details
                      key={index}
                      className="group bg-gray-50 rounded-lg"
                    >
                      <summary className="flex justify-between items-center cursor-pointer p-4 text-gray-900 font-medium">
                        <span>{faq.question}</span>
                        <span className="transition group-open:rotate-180">
                          <svg
                            className="w-5 h-5 text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </span>
                      </summary>
                      <div className="px-4 pb-4 text-gray-600">
                        {faq.answer}
                      </div>
                    </details>
                  ))}
                </div>

                {/* FAQ CTA */}
                <div className="mt-8 text-center">
                  <p className="text-gray-600 mb-4">More questions about Kalimati Tarkari Rate Today?</p>
                  <a
                    href="mailto:mail@nyure.com.np"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
                  >
                    Contact Us Now
                  </a>
                </div>
              </div>
            </section>
            {/* --- END FAQ Section with Keywords --- */}

            {/* --- START New SEO Section with Keywords --- */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Understanding Kalimati Tarkari Price & Rates
              </h2>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <p className="text-gray-600">
                  The <strong>Kalimati Vegetable Market</strong> (often searched as <strong>Kalimati</strong>) is a vital hub for fresh produce in Kathmandu, Nepal. Knowing the <strong>Kalimati Tarkari Rate Today</strong> is crucial for buyers. This page provides the official <strong>Kalimati Tarkari Bazar Price Today</strong>, ensuring you have the latest information.
                </p>
                <p className="text-gray-600 mt-4">
                  Whether you're looking for the latest <strong>kalimati tarkari price</strong> or tracking the trends using the <strong>Kalimati Tarkari Bazar Rate Today</strong>, our platform offers comprehensive insights. Stay informed about daily <strong>kalimati tarkari price</strong> updates and make smarter purchasing decisions at <strong>Kalimati</strong>.
                </p>
              </div>
            </section>
            {/* --- END New SEO Section with Keywords --- */}

            {/* Additional Information Section */}
            <section className="mt-8 text-sm text-gray-500">
              <h2 className="sr-only">Additional Information about Kalimati Tarkari Price</h2>
              <div className="prose prose-sm max-w-none">
                <p>
                  Source for Kalimati Tarkari Rate Today: Kalimati Fruits and Vegetable Market Development Board<br />
                  Location: Kalimati, Kathmandu, Nepal<br />
                  Contact for Kalimati Tarkari Price Info: +977-9746265996<br />
                  Updates: Daily Kalimati Tarkari Bazar Rate Today (including weekends/holidays)
                </p>
              </div>
            </section>
          </div> {/* End of Static Content Sections Wrapper */}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default KalimatiPrices;