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
    "name": "Kalimati Tarkari Rate Today - Daily Price List",
    "description": "Daily updated vegetable prices from Kalimati Tarkari Bazar, Nepal's largest wholesale market. Provides the official Kalimati Tarkari Bazar Rate Today.",
    "url": "https://kalimatirate.nyure.com.np/kalimati-tarkari-rate-today",
    "keywords": ["kalimati", "kalimati tarkari rate today", "kalimati tarkari bazar price today", "kalimati tarkari bazar rate today", "kalimati tarkari price", "vegetable prices", "Kalimati market", "nepal wholesale market"],
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
          "text": `The latest Kalimati Tarkari Rate Today is updated daily. Today's average Kalimati Tarkari Price range is Rs. ${summary?.minPrice || 0} to Rs. ${summary?.maxPrice || 0}. Find the full list on this page.`
        }
      },
      {
        "@type": "Question",
        "name": "Why do vegetable prices change daily in Kalimati Bazar?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The Kalimati Tarkari Bazar Price Today changes daily due to factors like weather, fuel costs, supply/demand, and policies affecting the Kalimati market."
        }
      },
      {
        "@type": "Question",
        "name": "Where can I check the daily Kalimati vegetable price list?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "This page provides the updated Kalimati Tarkari Rate Today list, with official data reflecting the Kalimati Tarkari Bazar Price Today."
        }
      },
      {
        "@type": "Question",
        "name": "Which vegetables are the cheapest today in Kalimati Bazar?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Seasonal vegetables often have the lowest Kalimati Tarkari Price. Check the full Kalimati Tarkari Bazar Rate Today list for current affordable options."
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
        <meta name="description" content="Check the official Kalimati Tarkari Rate Today for fresh vegetables in Nepal. Get daily updates on Kalimati Tarkari Bazar Price Today from the Kalimati market." />
        <meta name="keywords" content="kalimati, kalimati tarkari rate today, kalimati tarkari bazar price today, kalimati tarkari bazar rate today, kalimati tarkari price, vegetable prices, Kalimati market" />
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
                Kalimati Tarkari Rate Today (Kalimati Prices)
              </li>
            </ol>
          </nav>

          {/* SEO Enhanced Header with Dates */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              कालिमाटी तरकारी रेट टुडे | Kalimati Tarkari Rate Today
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              Kalimati Tarkari Bazar Price Today - Nepal
            </p>
            <p className="text-gray-600 max-w-2xl mx-auto mb-4">
              Daily updates on the official <strong>kalimati tarkari bazar rate today</strong> from Nepal's largest wholesale market in <strong>Kalimati</strong>, Kathmandu.
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
                Kalimati Rate Last Updated: {getFormattedDate()}
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
                  View Kalimati Rates (Table)
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
                  View Kalimati Prices (Card)
                </button>
              </div>
              
              {/* Search and Price Filter Buttons */}
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Search Kalimati tarkari..."
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
                      {filterType === 'all' ? 'All Prices' : `${filterType.charAt(0).toUpperCase() + filterType.slice(1)} Price`}
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
                    <h2 className="text-xl font-semibold text-red-700 mb-2">Error Fetching Kalimati Prices</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                      onClick={refresh}
                      className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
                    >
                      Retry Loading Kalimati Data
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Table View */}
                {viewMode === 'table' && (
                  <div className="mb-8 overflow-x-auto">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Kalimati Tarkari Bazar Rate Today - Official List
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
                                No Kalimati Tarkari data found
                              </h3>
                              <p className="text-gray-600">
                                Try adjusting search for Kalimati Tarkari Price.
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
                      Kalimati Tarkari Price Cards (Today)
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
                          No Kalimati Price Data
                        </h3>
                        <p className="text-gray-600">
                          Check back for updated Kalimati Tarkari Rate Today.
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
                Today's Kalimati Market Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Market Hours</h3>
                  <ul className="space-y-1 text-gray-600">
                    <li>Wholesale Market: 4:00 AM - 9:00 AM</li>
                    <li>Retail Market: 9:00 AM - 8:00 PM</li>
                    <li>Best Deals on Kalimati Tarkari Price: Early morning</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Today's Highlights</h3>
                  <ul className="space-y-1 text-gray-600">
                    <li>Market Status: Open (Kalimati)</li>
                    <li>Kalimati Tarkari Price Trend: {loading ? 'Loading...' : (summary?.avgPrice > 0 ? 'Stable' : 'N/A')}</li>
                    <li>Kalimati Tarkari Bazar Rate Today Last Updated: {loading ? 'Loading...' : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</li>
                  </ul>
                </div>
              </div>
            </div>

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
                Why Does the Kalimati Tarkari Rate Today Change?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {[
                  {
                    icon: "🌧️",
                    title: "Weather",
                    description: "Affects crop yield & Kalimati Tarkari Price"
                  },
                  {
                    icon: "🌱",
                    title: "Seasonality",
                    description: "Impacts Kalimati Tarkari Bazar Rate Today"
                  },
                  {
                    icon: "⛽",
                    title: "Fuel Costs",
                    description: "Influences Kalimati Tarkari Price via transport"
                  },
                  {
                    icon: "📜",
                    title: "Policies",
                    description: "Taxes/subsidies affect Kalimati rates"
                  },
                  {
                    icon: "📊",
                    title: "Supply/Demand",
                    description: "Major factor for Kalimati Bazar Price Today"
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
                Popular Vegetables at Kalimati
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
              <p className="text-center text-sm text-gray-600 mt-4">Note: Prices are illustrative. Check the table/cards for the official <strong>Kalimati Tarkari Rate Today</strong>.</p>
            </section>

            {/* Enhanced Filter Section */}
            <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter Kalimati Tarkari Price List</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="price-range-filter" className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Kalimati Price
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
                    Sort Kalimati Tarkari Rate By
                  </label>
                  <select id="sort-by-filter" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Most Popular</option>
                    <option>New Arrivals</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="origin-filter" className="block text-sm font-medium text-gray-700 mb-2">
                    Origin
                  </label>
                  <select id="origin-filter" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
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
                Kalimati Tarkari Bazar Information
              </h2>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      About Kalimati Market
                    </h3>
                    <p className="text-gray-600">
                      <strong>Kalimati</strong> Fruits and Vegetable Market is Nepal's main wholesale market, located in <strong>Kalimati</strong>, Kathmandu. It sets the benchmark <strong>kalimati tarkari bazar price today</strong>.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      Market Timings & Kalimati Rates
                    </h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Wholesale (Best <strong>Kalimati Tarkari Price</strong>): 4 AM - 9 AM</li>
                      <li>• Retail (Check <strong>Kalimati Tarkari Rate Today</strong>): 9 AM - 8 PM</li>
                      <li>• Visit <strong>Kalimati</strong> early for fresh deals.</li>
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
                    <span className="block text-2xl">Kalimati Tarkari Rate Today [{new Date().getFullYear()}]</span>
                    <span className="block text-lg text-green-600 mt-2">Daily Updates</span>
                  </h2>
                  <p className="text-gray-600 text-lg mb-8 text-center">
                    दैनिक अपडेट गरिएको तरकारी बजारको मूल्य | Get the real-time <strong>kalimati tarkari price</strong> from
                    <strong className="text-green-600"> Kalimati Tarkari Bazar</strong>, Nepal's largest wholesale market. Find the latest <strong>kalimati tarkari bazar rate today</strong> list.
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
                      Today's Best Value - Kalimati Tarkari Rate Today
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

                {/* Market Status and Tips - Reverted */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div id="market-status-kalimati" className="bg-white rounded-xl p-6 border border-green-100 shadow-sm">
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
            {/* --- END: Added Content Section from Home.jsx --- */}

            {/* FAQ Section */}
            <section className="mt-16 mb-12" aria-labelledby="faq-heading">
              <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
                <h2 id="faq-heading" className="text-2xl font-bold text-gray-900 mb-8 text-center">
                  Kalimati Tarkari Rate Today - FAQs
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
                  <p className="text-gray-600 mb-4">More questions about the Kalimati Tarkari Rate Today?</p>
                  <a
                    href="mailto:mail@nyure.com.np"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
                  >
                    Contact Us Now
                  </a>
                </div>
              </div>
            </section>

            {/* New SEO Section - Added keywords */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Understanding Kalimati Tarkari Price & Rates
              </h2>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <p className="text-gray-600">
                  The <strong>Kalimati Vegetable Market</strong> (often searched as <strong>Kalimati</strong>) is a vital hub. Knowing the <strong>Kalimati Tarkari Rate Today</strong> is crucial. This page provides the official <strong>Kalimati Tarkari Bazar Price Today</strong> list.
                </p>
                <p className="text-gray-600 mt-4">
                  Whether you need the latest <strong>kalimati tarkari price</strong> or track the <strong>Kalimati Tarkari Bazar Rate Today</strong>, our platform offers insights. Stay informed about daily <strong>kalimati tarkari price</strong> updates from <strong>Kalimati</strong>.
                </p>
              </div>
            </section>

            {/* Additional Information Section */}
            <section className="mt-8 text-sm text-gray-500">
              <h2 className="sr-only">Additional Information about Kalimati Tarkari Price</h2>
              <div className="prose prose-sm max-w-none">
                <p>
                  Source for Kalimati Tarkari Rate Today: Kalimati Fruits and Vegetable Market Development Board<br />
                  Location: Kalimati, Kathmandu, Nepal<br />
                  Contact for Kalimati Tarkari Price Info: +977-9746265996<br />
                  Updates: Daily Kalimati Tarkari Bazar Rate Today (incl. weekends/holidays)
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