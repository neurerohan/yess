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
      alt: "Kalimati Market Overview",
      caption: "Kalimati Fresh Vegetable Market"
    },
    {
      src: "/market-entrance.jpg",
      alt: "Kalimati Market Entrance",
      caption: "Welcome to Kalimati Bazar"
    },
    {
      src: "/market-aerial.jpg",
      alt: "Aerial View of Market",
      caption: "Bird's Eye View of Kalimati Market"
    },
    {
      src: "/kalimati-tarkari-rate-today.png",
      alt: "Today's Vegetable Rates",
      caption: "Daily Price Updates"
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

  const marketPricesSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "name": "Kalimati Vegetable Price List",
    "description": "Daily updated vegetable prices from Kalimati Market, Nepal's largest wholesale vegetable market",
    "url": "https://kalimatirate.nyure.com.np/kalimati-tarkari-rate-today",
    "keywords": ["vegetable prices", "kalimati market", "nepal wholesale market", "fresh vegetables", "daily vegetable prices", "Kalimati Tarkari rate today"],
    "isAccessibleForFree": true,
    "dateModified": modifiedDate,
    "datePublished": publishDate,
    "creator": {
      "@type": "Organization",
      "name": "Nyure",
      "url": "https://nyure.com.np"
    },
    "temporalCoverage": new Date().getFullYear().toString(),
    "spatialCoverage": {
      "@type": "Place",
      "name": "Kalimati Fruits and Vegetable Market",
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
        "contactType": "customer service"
      }
    },
    "offers": {
      "@type": "AggregateOffer",
      "lowPrice": summary?.minPrice || 0,
      "highPrice": summary?.maxPrice || 0,
      "priceCurrency": "NPR",
      "offerCount": vegetables.length
    },
    "about": {
      "@type": "LocalBusiness",
      "name": "Kalimati Vegetable Market",
      "openingHours": [
        "Mo-Su 04:00-21:00"
      ],
      "priceRange": "₨₨-₨₨₨"
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
          "text": `The latest vegetable rates at Kalimati Market are updated daily. Today's average price range is Rs. ${summary?.minPrice || 0} to Rs. ${summary?.maxPrice || 0}.`
        }
      },
      {
        "@type": "Question",
        "name": "Why do vegetable prices change daily in Kalimati Bazar?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Vegetable prices in Kalimati Bazar change daily due to weather conditions, fuel costs, demand & supply variations, and government policies."
        }
      },
      {
        "@type": "Question",
        "name": "Where can I check the daily Kalimati vegetable price list?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can check the updated Kalimati Tarkari Rate Today on this page, updated daily with official data from the Kalimati vegetable market."
        }
      },
      {
        "@type": "Question",
        "name": "Which vegetables are the cheapest today in Kalimati Bazar?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Seasonal vegetables like spinach, radish, and cabbage are usually the most affordable. Check today's updated rates to find the best prices."
        }
      },
      {
        "@type": "Question",
        "name": "Why do vegetable prices increase in Nepal?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Prices can increase due to weather changes, fuel price hikes, supply shortages, market demand, and government policies affecting imports and local farming."
        }
      },
      {
        "@type": "Question",
        "name": "Are Kalimati Bazar prices the same across Nepal?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No, Kalimati is a wholesale vegetable market in Kathmandu, and prices may vary in other cities due to transport costs and local supply-demand conditions."
        }
      },
      {
        "@type": "Question",
        "name": "What is the best time to buy vegetables in Kalimati Market?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The best time to buy fresh and cheaper vegetables in Kalimati Bazar is early in the morning before prices fluctuate."
        }
      },
      {
        "@type": "Question",
        "name": "Does Kalimati Tarkari Bazar have an online price list?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, you can check the updated Kalimati Tarkari Rate Today on our website for daily updates on vegetable prices in Nepal."
        }
      },
      {
        "@type": "Question",
        "name": "Why are seasonal vegetables cheaper than off-season vegetables?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Seasonal vegetables are locally grown and abundant, reducing transportation and storage costs. Off-season vegetables are often imported, making them more expensive."
        }
      },
      {
        "@type": "Question",
        "name": "How do transportation costs affect vegetable prices in Nepal?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "When fuel prices rise, transportation costs increase, which directly impacts vegetable prices in Kalimati Bazar and across Nepal."
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
        "item": "https://kalimatirate.nyure.com.np/kalimati-tarkari-rate-today"
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>आजको कालिमाटी तरकारी रेट | Kalimati Tarkari Rate Today [2024]</title>
        <meta name="description" content="Check today's Kalimati Tarkari rate for fresh vegetables in Nepal. Get daily updates on wholesale and retail prices from Kalimati Market, Kathmandu." />
        <meta name="keywords" content="Kalimati Tarkari rate today, vegetable prices, Kalimati market, Nepal wholesale market, fresh vegetables, daily vegetable prices" />
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

          {/* SEO Enhanced Header with Dates */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              कालिमाटी तरकारी रेट टुडे | Kalimati Tarkari Rate Today
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              Today's Vegetable Price in Nepal - Kalimati Bazar
            </p>
            <p className="text-gray-600 max-w-2xl mx-auto mb-4">
              Daily updates on fresh vegetable rates from Nepal's largest wholesale market in Kalimati, Kathmandu. 
              Check today's wholesale and retail तरकारी prices, updated every morning for the best deals.
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
                Last Updated: {getFormattedDate()}
              </time>
            </div>
          </div>

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
                  Table View
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
                  Card View
                </button>
              </div>
              
              {/* Search and Price Filter Buttons */}
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Search vegetables..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  aria-label="Search vegetables"
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
                      {filterType === 'all' ? 'All' : `${filterType.charAt(0).toUpperCase() + filterType.slice(1)} Price`}
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
                  <h2 className="mt-4 text-xl font-semibold text-gray-700">Loading prices...</h2>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center px-4 py-20">
                <div className="text-center max-w-md w-full">
                  <div className="bg-red-100 p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold text-red-700 mb-2">Error Fetching Prices</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                      onClick={refresh}
                      className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Price Summary */}
                {summary && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-green-50 p-6 rounded-lg shadow-sm">
                      <h3 className="text-green-800 font-semibold mb-2">Minimum Price</h3>
                      <p className="text-2xl font-bold text-green-600">
                        Rs. {summary.minPrice.toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-red-50 p-6 rounded-lg shadow-sm">
                      <h3 className="text-red-800 font-semibold mb-2">Maximum Price</h3>
                      <p className="text-2xl font-bold text-red-600">
                        Rs. {summary.maxPrice.toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
                      <h3 className="text-blue-800 font-semibold mb-2">Average Price</h3>
                      <p className="text-2xl font-bold text-blue-600">
                        Rs. {summary.avgPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Table View */}
                {viewMode === 'table' && (
                  <div className="mb-8 overflow-x-auto">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Kalimati Bazar Tarkari Rate List
                    </h2>
                    <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-sm border-collapse">
                      <thead className="bg-green-50">
                        <tr>
                          <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-r border-gray-200">तरकारी</th>
                          <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-r border-gray-200">एकाइ</th>
                          <th scope="col" className="px-4 py-3 text-center text-sm font-semibold text-gray-900 border-r border-gray-200">न्यूनतम</th>
                          <th scope="col" className="px-4 py-3 text-center text-sm font-semibold text-gray-900 border-r border-gray-200">अधिकतम</th>
                          <th scope="col" className="px-4 py-3 text-center text-sm font-semibold text-gray-900">औसत</th>
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
                                No vegetables found
                              </h3>
                              <p className="text-gray-600">
                                Try adjusting your search or filters.
                              </p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Card View */}
                {viewMode === 'card' && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Kalimati Bazar Tarkari Cards
                    </h2>
                    {vegetables.length > 0 ? (
                       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {vegetables.map((vegetable) => (
                          <div
                            key={vegetable.id}
                            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                          >
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {vegetable.name_nepali}
                            </h3>
                            <p className="text-gray-600 mb-4">Unit: {vegetable.unit}</p>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-green-600">Min:</span>
                                <span className="font-medium">Rs. {vegetable.min_price}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-red-600">Max:</span>
                                <span className="font-medium">Rs. {vegetable.max_price}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-blue-600">Avg:</span>
                                <span className="font-medium">Rs. {vegetable.avg_price}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                          No vegetables found
                        </h3>
                        <p className="text-gray-600">
                          Try adjusting your search or filters.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Static Content Sections - Rendered Always */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

            {/* Market Overview */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Today's Market Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Market Hours</h3>
                  <ul className="space-y-1 text-gray-600">
                    <li>Wholesale Market: 4:00 AM - 9:00 AM</li>
                    <li>Retail Market: 9:00 AM - 8:00 PM</li>
                    <li>Best Deals: Early morning (4:00 AM - 7:00 AM)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Today's Highlights</h3>
                  <ul className="space-y-1 text-gray-600">
                    <li>Market Status: Open</li>
                    {/* Adjust Price Trend to handle loading state */}
                    <li>Price Trend: {loading ? 'Loading...' : (summary?.avgPrice > 0 ? 'Stable' : 'N/A')}</li>
                    <li>Last Updated: {loading ? 'Loading...' : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Image Carousel */}
            <section className="mb-12" aria-labelledby="gallery-heading">
              <h2 id="gallery-heading" className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Kalimati Market Gallery
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
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all"
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
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Why Do Vegetable Prices Change Section */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Why Do Vegetable Prices Change Daily?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {[
                  {
                    icon: "🌧️",
                    title: "Weather Changes",
                    description: "Monsoons, droughts, and landslides affect crop production"
                  },
                  {
                    icon: "🌱",
                    title: "Seasonal Variations",
                    description: "In-season vegetables cost less than off-season imports"
                  },
                  {
                    icon: "⛽",
                    title: "Fuel Prices",
                    description: "Transportation costs directly impact vegetable prices"
                  },
                  {
                    icon: "📜",
                    title: "Government Policies",
                    description: "Taxes and subsidies influence market rates"
                  },
                  {
                    icon: "📊",
                    title: "Supply & Demand",
                    description: "Market demand affects daily price fluctuations"
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

            {/* Popular Vegetables Section */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Most Popular Vegetables
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    name: "टमाटर",
                    image: "/tomato.jpg",
                    price: 50,
                    change: -5,
                    unit: "केजी"
                  },
                  {
                    name: "काउली",
                    image: "/cauliflower.jpg",
                    price: 60,
                    change: 10,
                    unit: "केजी"
                  },
                  {
                    name: "आलु",
                    image: "/potato.jpg",
                    price: 45,
                    change: -2,
                    unit: "केजी"
                  },
                  {
                    name: "प्याज",
                    image: "/onion.jpg",
                    price: 75,
                    change: 15,
                    unit: "केजी"
                  },
                  {
                    name: "गाजर",
                    image: "/carrot.jpg",
                    price: 40,
                    change: -8,
                    unit: "केजी"
                  },
                  {
                    name: "केराउ",
                    image: "/peas.jpg",
                    price: 120,
                    change: 5,
                    unit: "केजी"
                  },
                  {
                    name: "पालुंगो",
                    image: "/spinach.jpg",
                    price: 30,
                    change: -12,
                    unit: "केजी"
                  },
                  {
                    name: "बन्दा",
                    image: "/cabbage.jpg",
                    price: 35,
                    change: -3,
                    unit: "केजी"
                  }
                ].map((veg, index) => (
                  <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={veg.image} 
                        alt={veg.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{veg.name}</h3>
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold">
                          रु. {veg.price}/{veg.unit}
                        </span>
                        <span className={`px-2 py-1 rounded text-sm ${
                          veg.change < 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {veg.change > 0 ? '↑' : '↓'} {Math.abs(veg.change)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Comment out the Price Trends Section temporarily */}
            {/*
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Price Trends Analysis
              </h2>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                // ... chart code ...
              </div>
            </section>
            */}

            {/* Enhanced Filter Section */}
            <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option>All Prices</option>
                    <option>रु. 0 - रु. 50</option>
                    <option>रु. 50 - रु. 100</option>
                    <option>रु. 100+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Most Popular</option>
                    <option>New Arrivals</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Origin
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option>All</option>
                    <option>Local</option>
                    <option>Imported</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Market Information Section - New SEO Section */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Kalimati Vegetable Market Information
              </h2>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      About Kalimati Market
                    </h3>
                    <p className="text-gray-600">
                      Kalimati Fruits and Vegetable Market is Nepal's largest wholesale market, 
                      supplying fresh produce to the Kathmandu Valley. Located in Kalimati, 
                      Kathmandu, it serves as the primary price reference for vegetables across Nepal.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      Market Timings
                    </h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Wholesale Market: 4 AM - 9 AM</li>
                      <li>• Retail Market: 9 AM - 8 PM</li>
                      <li>• Best Time to Visit: Early morning for freshest produce</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* --- START: Added Content Section from Home.jsx --- */}
            <section className="my-12 px-6" aria-labelledby="kalimati-highlights-heading">
              <div className="max-w-3xl mx-auto">
                {/* Content Copied from Home Hero/Highlights */}
                <div className="bg-white rounded-xl p-8 border border-green-100 shadow-sm mb-12">
                  <h2 id="kalimati-highlights-heading" className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight mb-3 text-center">
                    <span className="block mb-2">आजको कलिमाटी तरकारी रेट</span>
                    <span className="block text-2xl">Kalimati Tarkari Rate Today [{new Date().getFullYear() + 1}]</span> {/* Dynamic Year */}
                    <span className="block text-lg text-green-600 mt-2">Daily Updates</span>
                  </h2>
                  <p className="text-gray-600 text-lg mb-8 text-center">
                    दैनिक अपडेट गरिएको तरकारी बजारको मूल्य | Get real-time vegetable prices from
                    <span className="text-green-600"> Kalimati Tarkari Bazar</span>, Nepal's largest wholesale market. Check the Nepali date today and calendar too!
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-8">
                    <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                      <div className="font-medium text-gray-800">आजको तरकारी मुल्य</div>
                      <div className="text-sm text-gray-600">Daily price updates</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                      <div className="font-medium text-gray-800">Wholesale Rates</div>
                      <div className="text-sm text-gray-600">Direct from Kalimati</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                      <div className="font-medium text-gray-800">Live Updates</div>
                      <div className="text-sm text-gray-600">Real-time prices</div>
                    </div>
                  </div>
                  <div className="text-center">
                    {/* This button might need adjustment based on KalimatiPrices context, maybe scroll to table? */}
                    <button
                      onClick={() => document.getElementById('price-table-section')?.scrollIntoView({ behavior: 'smooth' })} // Example scroll behavior
                      className="bg-green-600 text-white font-medium text-base px-6 py-3 rounded-xl shadow-md hover:bg-green-700 transition-colors"
                    >
                      Check Kalimati Tarkari Rate Today
                    </button>
                  </div>
                </div>

                {/* Market Highlights Section */}
                <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  आजको तरकारी मुल्य | Today's Market Highlights
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="bg-white rounded-xl p-6 border border-green-100 shadow-sm">
                    <h4 className="text-lg font-bold text-gray-800 mb-4">
                      Most Searched Items at Kalimati Tarkari Bazar
                    </h4>
                    <div className="space-y-3">
                      {/* Example items - Replace with dynamic data if available */}
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
                  </div>
                  <div className="bg-white rounded-xl p-6 border border-green-100 shadow-sm">
                    <h4 className="text-lg font-bold text-gray-800 mb-4">
                      Today's Best Value at Kalimati
                    </h4>
                    <div className="space-y-3">
                      {/* Example items - Replace with dynamic data if available */}
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
                  </div>
                </div>

                {/* Market Status and Tips */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div id="market-status-kalimati" className="bg-white rounded-xl p-6 border border-green-100 shadow-sm"> {/* Added ID */}
                    <h4 className="text-lg font-bold text-gray-800 mb-4">Kalimati Market Status</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-green-600 font-medium">कलिमाटी तरकारी बजार Open</span>
                      </div>
                      <p className="text-gray-600 text-sm">Operating Hours: 5:00 AM - 7:00 PM</p>
                      <p className="text-gray-600 text-sm">Best visiting hours: 6:00 AM - 9:00 AM</p>
                      <p className="text-gray-600 text-sm">Current crowd level: Moderate</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-6 border border-green-100 shadow-sm">
                    <h4 className="text-lg font-bold text-gray-800 mb-4">Shopping Tips</h4>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">●</span>
                        <p className="text-gray-600 text-sm">Check Kalimati tarkari rate before visiting</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">●</span>
                        <p className="text-gray-600 text-sm">Best deals during early morning hours</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">●</span>
                        <p className="text-gray-600 text-sm">Compare prices from multiple vendors</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {/* --- END: Added Content Section from Home.jsx --- */}

            {/* FAQ Section */}
            <section className="mt-16 mb-12" aria-labelledby="faq-heading">
              <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
                <h2 id="faq-heading" className="text-2xl font-bold text-gray-900 mb-8 text-center">
                  Frequently Asked Questions (FAQs)
                </h2>
                
                <div className="space-y-4">
                  {[
                    {
                      question: "What is the latest Kalimati Tarkari rate today?",
                      answer: "The latest Kalimati Tarkari Rate Today is updated daily based on official market prices. Check today's rates for fresh vegetables from the Kalimati Bazar."
                    },
                    {
                      question: "Why do vegetable prices change daily in Kalimati Bazar?",
                      answer: "Vegetable prices in Kalimati Bazar change daily due to weather conditions, fuel costs, demand & supply variations, and government policies."
                    },
                    {
                      question: "Where can I check the daily Kalimati vegetable price list?",
                      answer: "You can check the updated Kalimati Tarkari Rate Today on this page, updated daily with official data from the Kalimati vegetable market."
                    },
                    {
                      question: "Which vegetables are the cheapest today in Kalimati Bazar?",
                      answer: "Seasonal vegetables like spinach, radish, and cabbage are usually the most affordable. Check today's updated rates to find the best prices."
                    },
                    {
                      question: "Why do vegetable prices increase in Nepal?",
                      answer: "Prices can increase due to weather changes, fuel price hikes, supply shortages, market demand, and government policies affecting imports and local farming."
                    },
                    {
                      question: "Are Kalimati Bazar prices the same across Nepal?",
                      answer: "No, Kalimati is a wholesale vegetable market in Kathmandu, and prices may vary in other cities due to transport costs and local supply-demand conditions."
                    },
                    {
                      question: "What is the best time to buy vegetables in Kalimati Market?",
                      answer: "The best time to buy fresh and cheaper vegetables in Kalimati Bazar is early in the morning before prices fluctuate."
                    },
                    {
                      question: "Does Kalimati Tarkari Bazar have an online price list?",
                      answer: "Yes, you can check the updated Kalimati Tarkari Rate Today on our website for daily updates on vegetable prices in Nepal."
                    },
                    {
                      question: "Why are seasonal vegetables cheaper than off-season vegetables?",
                      answer: "Seasonal vegetables are locally grown and abundant, reducing transportation and storage costs. Off-season vegetables are often imported, making them more expensive."
                    },
                    {
                      question: "How do transportation costs affect vegetable prices in Nepal?",
                      answer: "When fuel prices rise, transportation costs increase, which directly impacts vegetable prices in Kalimati Bazar and across Nepal."
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
                  <p className="text-gray-600 mb-4">Still have questions?</p>
                  <a
                    href="mailto:mail@nyure.com.np"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
                  >
                    Contact Us Now
                  </a>
                </div>
              </div>
            </section>

            {/* New SEO Section */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Kalimati Vegetable Market Insights
              </h2>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <p className="text-gray-600">
                  The Kalimati Vegetable Market is a vital hub for fresh produce in Kathmandu, Nepal. Known for its daily updates on vegetable prices, the market provides essential information for both wholesale and retail buyers. By checking the Kalimati Tarkari rate today, you can ensure you are getting the best deals on fresh vegetables.
                </p>
                <p className="text-gray-600 mt-4">
                  Whether you are looking for the latest vegetable prices or trying to understand the trends in the Kalimati market, our platform offers comprehensive insights. Stay informed about the daily vegetable prices and make smarter purchasing decisions.
                </p>
              </div>
            </section>

            {/* Additional Information Section */}
            <section className="mt-8 text-sm text-gray-500">
              <h2 className="sr-only">Additional Information</h2>
              <div className="prose prose-sm max-w-none">
                <p>
                  Source: Kalimati Fruits and Vegetable Market Development Board<br />
                  Location: Kalimati, Kathmandu, Nepal<br />
                  Contact: +977-9746265996<br />
                  Updates: Daily (including weekends and holidays)
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