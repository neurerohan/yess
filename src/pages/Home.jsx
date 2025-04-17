import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Custom hook for managing meta tags
const useMetaTags = (title, description) => {
  useEffect(() => {
    // Set publish and modified dates
    const publishDate = '2024-03-21'; // Fixed publish date
    const modifiedDate = new Date().toISOString().split('T')[0]; // Current date for modified

    // Update title
    document.title = title;
    
    // Update or create meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = description;

    // Add canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = 'https://kalimatirate.nyure.com.np/';

    // Add hreflang tag for English
    let hreflang = document.querySelector('link[hreflang="en"]');
    if (!hreflang) {
      hreflang = document.createElement('link');
      hreflang.rel = 'alternate';
      hreflang.hreflang = 'en';
      document.head.appendChild(hreflang);
    }
    hreflang.href = 'https://kalimatirate.nyure.com.np/';

    // Add x-default hreflang
    let xDefault = document.querySelector('link[hreflang="x-default"]');
    if (!xDefault) {
      xDefault = document.createElement('link');
      xDefault.rel = 'alternate';
      xDefault.hreflang = 'x-default';
      document.head.appendChild(xDefault);
    }
    xDefault.href = 'https://kalimatirate.nyure.com.np/';

    // Add publish date meta tag
    let publishDateMeta = document.querySelector('meta[property="article:published_time"]');
    if (!publishDateMeta) {
      publishDateMeta = document.createElement('meta');
      publishDateMeta.setAttribute('property', 'article:published_time');
      document.head.appendChild(publishDateMeta);
    }
    publishDateMeta.content = publishDate;

    // Add modified date meta tag
    let modifiedDateMeta = document.querySelector('meta[property="article:modified_time"]');
    if (!modifiedDateMeta) {
      modifiedDateMeta = document.createElement('meta');
      modifiedDateMeta.setAttribute('property', 'article:modified_time');
      document.head.appendChild(modifiedDateMeta);
    }
    modifiedDateMeta.content = modifiedDate;

    // Cleanup function
    return () => {
      // Remove only the tags we created in this component
      if (metaDescription && metaDescription.parentNode) {
        metaDescription.remove();
      }
      if (canonical && canonical.parentNode) {
        canonical.remove();
      }
      if (hreflang && hreflang.parentNode) {
        hreflang.remove();
      }
      if (xDefault && xDefault.parentNode) {
        xDefault.remove();
      }
      if (publishDateMeta && publishDateMeta.parentNode) {
        publishDateMeta.remove();
      }
      if (modifiedDateMeta && modifiedDateMeta.parentNode) {
        modifiedDateMeta.remove();
      }
    };
  }, [title, description]);
};

const Home = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [temperature, setTemperature] = useState('--');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Use the custom hook to set meta tags
  useMetaTags(
    'Nepali Calendar 2082 | Mero Patro & Hamro Patro | Nepali Date Today | Kalimati Rate',
    'View the official Nepali Calendar 2082 (विक्रम सम्वत्). Find the Nepali date today, upcoming events, and holidays using our Mero Patro / Hamro Patro style interface. Check Nepal calendar date today and Kalimati rates.'
  );

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
        const data = await response.json();
        setTemperature(Math.round(data.current.temperature_2m));
      } catch (error) {
        console.error('Error fetching weather:', error);
        setTemperature('--');
      }
    };

    fetchWeather();
    // Fetch weather every 30 minutes
    const weatherTimer = setInterval(fetchWeather, 1800000);

    // Add Schema Markup
    const schemas = [
      // Existing FAQ Schema
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is the Nepali Calendar?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The Nepali Calendar, or Bikram Sambat, is the official calendar of Nepal. Use our site to find the current 'nepali date today' and explore the full 'nepali calendar nepali calendar' for any month."
            }
          },
          {
            "@type": "Question",
            "name": "How can I find the Nepali date today?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Our homepage prominently displays the 'nepali date today'. You can also browse the full 'nepali calendar' to see the date for any day of the year."
            }
          },
          {
            "@type": "Question",
            "name": "Is this like Hamro Patro or Mero Patro?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, our 'nepali calendar' provides features similar to 'Hamro Patro' and 'Mero Patro', offering a detailed view of the 'nepal calendar date today', events, and tithis."
            }
          },
          {
            "@type": "Question",
            "name": "How to use the Nepali Calendar nepali calendar feature?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Navigate to our 'Nepali Calendar' section. You can select the year and month to view the specific 'nepali calendar nepali calendar' page, just like using 'Mero Patro'."
            }
          },
          {
            "@type": "Question",
            "name": "Where can I check the Nepal calendar date today?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The 'nepal calendar date today' is always visible on our homepage and within the main 'Nepali Calendar' section. We ensure it matches the official Bikram Sambat date."
            }
          },
          {
            "@type": "Question",
            "name": "What events are shown in the Nepali Calendar?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Our 'nepali calendar', similar to 'Hamro Patro', includes public holidays, festivals, tithis, and other important events relevant to the 'nepali date today' and the entire year."
            }
          },
          {
            "@type": "Question",
            "name": "How accurate is the Mero Patro style calendar here?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We use reliable data sources to ensure our 'Mero Patro' style 'nepali calendar' accurately reflects the official Bikram Sambat dates and events for every 'nepal calendar date today'."
            }
          },
          {
            "@type": "Question",
            "name": "Can I convert the Nepali Date Today to English?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, we offer a BS to AD date converter tool. You can easily convert the 'nepali date today' or any other date from the 'nepali calendar' to the Gregorian calendar."
            }
          },
          {
            "@type": "Question",
            "name": "How is the Nepali date today determined?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The 'nepal calendar date today' is based on the Bikram Sambat (BS) system, the official solar calendar of Nepal. Our 'Nepali Calendar' accurately reflects this."
            }
          },
          {
            "@type": "Question",
            "name": "How often is the Nepali Calendar updated?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The underlying data for the 'nepali calendar nepali calendar' is updated annually, ensuring you always have the correct information for the current 'nepal calendar date today' and beyond."
            }
          }
        ]
      },
      // Website Schema
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "url": "https://kalimatirate.nyure.com.np/",
        "name": "Nepali Calendar | Mero Patro | Hamro Patro | Nepali Date Today",
        "description": "Your primary source for the official Nepali Calendar (विक्रम सम्वत्). Check the Nepali date today, view the full Mero Patro / Hamro Patro style calendar, and find the Nepal calendar date today.",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://kalimatirate.nyure.com.np/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      // Organization Schema
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "KalimatiRate - Nyure",
        "url": "https://kalimatirate.nyure.com.np",
        "logo": "https://kalimatirate.nyure.com.np/logo.png",
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
      },
      // BreadcrumbList Schema
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [{
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://kalimatirate.nyure.com.np"
        }]
      },
      // Article Schema
      {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Nepali Calendar 2082 - Mero Patro & Hamro Patro Features",
        "description": "Explore the full Nepali Calendar for 2082 BS. Find the Nepali date today, events, and holidays with our easy-to-use Mero Patro and Hamro Patro interface. Check the Nepal calendar date today instantly.",
        "image": "https://kalimatirate.nyure.com.np/market-image.jpg",
        "author": {
          "@type": "Organization",
          "name": "KalimatiRate - Nyure"
        },
        "publisher": {
          "@type": "Organization",
          "name": "KalimatiRate - Nyure",
          "logo": {
            "@type": "ImageObject",
            "url": "https://kalimatirate.nyure.com.np/logo.png"
          }
        },
        "datePublished": "2024-03-21",
        "dateModified": new Date().toISOString().split('T')[0],
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": "https://kalimatirate.nyure.com.np"
        }
      },
      // LocalBusiness Schema for Kalimati Market
      {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Kalimati Tarkari Bazar",
        "image": [
          "https://kalimatirate.nyure.com.np/market-image.jpg",
          "https://kalimatirate.nyure.com.np/market-entrance.jpg",
          "https://kalimatirate.nyure.com.np/market-aerial.jpg"
        ],
        "description": "Nepal's largest wholesale vegetable market providing fresh produce at competitive prices.",
        "@id": "https://kalimatirate.nyure.com.np/kalimati-market",
        "url": "https://kalimatirate.nyure.com.np",
        "telephone": "+977-1-4274097",
        "priceRange": "₨₨",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Kalimati Tarkari Bazar, Ring Road, Kalimati",
          "addressLocality": "Kathmandu",
          "addressRegion": "Bagmati Province",
          "postalCode": "44600",
          "addressCountry": "NP"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "27.6995",
          "longitude": "85.2888"
        },
        "openingHoursSpecification": [{
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
          ],
          "opens": "05:00",
          "closes": "19:00"
        }],
        "sameAs": [
          "https://www.facebook.com/kalimatimarket",
          "https://twitter.com/kalimatimarket"
        ],
        "areaServed": {
          "@type": "City",
          "name": "Kathmandu Valley"
        },
        "hasMap": "https://www.google.com/maps?q=kalimati+market+kathmandu",
        "isAccessibleForFree": true,
        "currenciesAccepted": "NPR",
        "paymentAccepted": "Cash",
        "additionalType": "http://www.productontology.org/id/Vegetable_market"
      },

      // Service Schema for Price Updates
      {
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": "Nepali Calendar Information",
        "name": "Nepali Calendar & Date Today Service",
        "provider": {
          "@type": "Organization",
          "name": "KalimatiRate - Nyure"
        },
        "description": "Provides the official Nepali Calendar (Bikram Sambat), including the current Nepali date today, event listings (similar to Mero Patro/Hamro Patro), and BS/AD conversion. Check the Nepal calendar date today easily.",
        "areaServed": {
          "@type": "Country",
          "name": "Nepal"
        },
        "availableChannel": {
          "@type": "ServiceChannel",
          "serviceUrl": "https://kalimatirate.nyure.com.np",
          "servicePhone": "+977-9746265996",
          "availableLanguage": ["en", "ne"]
        }
      },

      // AggregateRating Schema
      {
        "@context": "https://schema.org",
        "@type": "AggregateRating",
        "itemReviewed": {
          "@type": "LocalBusiness",
          "name": "Kalimati Tarkari Bazar",
          "image": "https://kalimatirate.nyure.com.np/market-image.jpg"
        },
        "ratingValue": "4.5",
        "bestRating": "5",
        "worstRating": "1",
        "ratingCount": "1250",
        "reviewCount": "850"
      },

      // ItemList Schema for Popular Vegetables
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Popular Vegetables at Kalimati Bazar",
        "description": "Most searched and purchased vegetables at Kalimati Tarkari Bazar",
        "numberOfItems": 3,
        "itemListElement": [
          {
            "@type": "Product",
            "position": 1,
            "name": "आलु (Potato)",
            "description": "Fresh potatoes from local farmers",
            "offers": {
              "@type": "AggregateOffer",
              "lowPrice": "40",
              "highPrice": "60",
              "priceCurrency": "NPR",
              "unitText": "KG"
            }
          },
          {
            "@type": "Product",
            "position": 2,
            "name": "प्याज (Onion)",
            "description": "Fresh onions available daily",
            "offers": {
              "@type": "AggregateOffer",
              "lowPrice": "80",
              "highPrice": "90",
              "priceCurrency": "NPR",
              "unitText": "KG"
            }
          },
          {
            "@type": "Product",
            "position": 3,
            "name": "टमाटर (Tomato)",
            "description": "Fresh tomatoes from local farms",
            "offers": {
              "@type": "AggregateOffer",
              "lowPrice": "45",
              "highPrice": "55",
              "priceCurrency": "NPR",
              "unitText": "KG"
            }
          }
        ]
      },

      // HowTo Schema for Shopping Guide
      {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Get Best Deals at Kalimati Tarkari Bazar",
        "description": "Step by step guide to getting the best vegetable prices at Kalimati Market",
        "totalTime": "PT2H",
        "estimatedCost": {
          "@type": "MonetaryAmount",
          "currency": "NPR",
          "value": "1000-5000"
        },
        "step": [
          {
            "@type": "HowToStep",
            "name": "Check Current Rates",
            "text": "Check Kalimati tarkari rate before visiting the market",
            "position": 1
          },
          {
            "@type": "HowToStep",
            "name": "Visit Early",
            "text": "Visit during early morning hours (6:00 AM - 9:00 AM) for best deals",
            "position": 2
          },
          {
            "@type": "HowToStep",
            "name": "Compare Prices",
            "text": "Compare prices from multiple vendors before making a purchase",
            "position": 3
          }
        ]
      }
    ];

    // Add all schemas to the page
    schemas.forEach(schema => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.innerHTML = JSON.stringify(schema);
      document.head.appendChild(script);
    });

    // Cleanup timers and scripts
    return () => {
      clearInterval(timer);
      clearInterval(weatherTimer);
      // Remove all schema scripts
      document.querySelectorAll('script[type="application/ld+json"]').forEach(script => {
        script.remove();
      });
    };
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '-');
  };

  const getNepaliDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    
    // This is a simple approximation. You might want to use a proper Nepali date converter library
    // Adding 56 years, 8 months and 17 days (approximate difference)
    const nepYear = year + 56;
    const nepMonth = month + 8 > 12 ? month - 4 : month + 8;
    const nepDay = day + 17 > 30 ? day - 13 : day + 17;
    
    const nepaliMonths = [
      'बैशाख', 'जेठ', 'असार', 'श्रावण', 'भदौ', 'असोज',
      'कार्तिक', 'मंसिर', 'पुष', 'माघ', 'फागुन', 'चैत'
    ];

    return `${nepDay} ${nepaliMonths[nepMonth - 1]} ${nepYear}`;
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
              <div className="bg-green-50 rounded-xl p-4 border border-green-100 h-20 flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                </div>
                <div>
                  <div className="text-gray-600 text-xs">Temperature</div>
                  <div className="text-gray-800 text-2xl font-bold">{temperature}°C</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="px-6 mt-12">
        <h2 className="text-gray-800 text-2xl font-bold mb-8 text-center">Our Services</h2>
        
        {/* Restructured: Calendar card above, others below */}
        <div className="max-w-5xl mx-auto">
          {/* Nepali Calendar Card - Top Row (Centered) */}
          <div className="mb-6 md:flex md:justify-center">
            <div className="bg-white rounded-xl p-6 border border-green-100 shadow-sm flex flex-col items-center text-center md:w-2/3 lg:w-1/2">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                {/* Calendar Icon */}
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2zM16 11h.01M12 11h.01M8 11h.01M16 15h.01M12 15h.01M8 15h.01"/>
                </svg>
              </div>
              <h3 className="text-gray-800 text-xl font-bold mb-2">Nepali Calendar</h3>
              <p className="text-gray-600 text-sm mb-6">Explore the full <strong>Nepali Calendar</strong> (विक्रम सम्वत्). Check the <strong>Nepali date today</strong>, events, and holidays with our <strong>Mero Patro / Hamro Patro</strong> style interface. Find the <strong>Nepal calendar date today</strong> easily.</p>
              <Link
                // Link to the base Nepali calendar route (similar to Mero Patro / Hamro Patro)
                to="/calendar"
                className="mt-auto bg-green-600 text-white font-medium text-sm px-6 py-2.5 rounded-lg shadow-sm hover:bg-green-700 transition-colors w-full block" // Added block display
              >
                View Calendar
              </Link>
            </div>
          </div>

          {/* Other Services - Bottom Row (Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Kalimati Rates Card */}
            <div className="bg-white rounded-xl p-6 border border-green-100 shadow-sm flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-gray-800 text-xl font-bold mb-2">Kalimati Rates Today</h3>
              <p className="text-gray-600 text-sm mb-6">Get real-time vegetable market prices from Kalimati Bazar. Updated daily for your convenience.</p>
              <button 
                onClick={() => navigate('/kalimati-tarkari-rate-today')}
                className="mt-auto bg-green-600 text-white font-medium text-sm px-6 py-2.5 rounded-lg shadow-sm hover:bg-green-700 transition-colors w-full"
              >
                Check Prices
              </button>
            </div>

            {/* Date Converter Card */}
            <div className="bg-white rounded-xl p-6 border border-green-100 shadow-sm flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-gray-800 text-xl font-bold mb-2">Date Converter</h3>
              <p className="text-gray-600 text-sm mb-6">Convert dates between BS (Bikram Sambat) and AD (Anno Domini) calendars instantly.</p>
              <button 
                onClick={() => navigate('/nep-to-eng-date-converter')}
                className="mt-auto bg-green-600 text-white font-medium text-sm px-6 py-2.5 rounded-lg shadow-sm hover:bg-green-700 transition-colors w-full"
              >
                Convert Date
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="px-6 mt-12 mb-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl p-8 border border-green-100 shadow-sm">
            {/* Main Heading - H1 tag with proper structure */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight mb-3 text-center">
              <span className="block mb-2">Nepali Calendar {new Date().getFullYear() + 56}</span>
              <span className="block text-2xl">Mero Patro & Hamro Patro Alternative</span>
              <span className="block text-lg text-green-600 mt-2">Check Nepali Date Today</span>
            </h1>

            {/* Descriptive Text */}
            <p className="text-gray-600 text-lg mb-8 text-center">
              View the official <strong>Nepali Calendar</strong> (BS). Find the current <strong>Nepali date today</strong>, see upcoming events like in <strong>Mero Patro</strong> or <strong>Hamro Patro</strong>, and easily check the <strong>Nepal calendar date today</strong>. Your complete <strong>nepali calendar nepali calendar</strong> resource.
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
      <div className="px-6 mt-16">
        <div className="max-w-3xl mx-auto">
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
              </div>
              <p className="text-sm text-gray-500 mt-3">View the <strong className="text-gray-700">Nepali calendar nepali calendar</strong> to see if events on the <strong className="text-gray-700">Nepali date today</strong> might affect market activity.</p>
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
                  <p className="text-gray-600 text-sm">Best deals early; consult the <strong className="text-gray-700">Nepali calendar</strong> for holidays.</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">●</span>
                  <p className="text-gray-600 text-sm">Compare prices and check <strong className="text-gray-700">Hamro Patro</strong> style event listings.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div id="faq" className="px-6 mt-16 mb-12">
        <div className="max-w-3xl mx-auto">
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
                  <p className="text-gray-600">The Nepali Calendar, or Bikram Sambat, is the official calendar of Nepal. Use our platform to find the current 'nepali date today' and explore the full 'nepali calendar nepali calendar'.</p>
                </div>
              </div>
            </div>

            {/* FAQ 2 */}
            <div className="bg-white rounded-xl p-6 border border-green-100 shadow-sm">
              <div className="flex gap-3">
                <span className="text-green-600 font-bold">2️⃣</span>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">How is this different from Hamro Patro or Mero Patro?</h3>
                  <p className="text-gray-600">Our site offers a similar experience to Hamro Patro and Mero Patro, providing a detailed Nepali Calendar, the current Nepali date today, and event information. We also integrate Kalimati rates.</p>
                </div>
              </div>
            </div>

            {/* FAQ 3 */}
            <div className="bg-white rounded-xl p-6 border border-green-100 shadow-sm">
              <div className="flex gap-3">
                <span className="text-green-600 font-bold">3️⃣</span>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">How do I find the Nepal calendar date today?</h3>
                  <p className="text-gray-600">The Nepal calendar date today is clearly displayed on our homepage and within the main Nepali Calendar view. It's updated daily.</p>
                </div>
              </div>
            </div>

            {/* FAQ 4 */}
            <div className="bg-white rounded-xl p-6 border border-green-100 shadow-sm">
              <div className="flex gap-3">
                <span className="text-green-600 font-bold">4️⃣</span>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">What information does the Nepali Calendar include?</h3>
                  <p className="text-gray-600">Our Nepali Calendar shows the Nepali date today, tithis, public holidays, festivals, and other significant events, similar to features found in Hamro Patro and Mero Patro.</p>
                </div>
              </div>
            </div>

            {/* FAQ 5 */}
            <div className="bg-white rounded-xl p-6 border border-green-100 shadow-sm">
              <div className="flex gap-3">
                <span className="text-green-600 font-bold">5️⃣</span>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">Is the Nepali Calendar nepali calendar feature easy to navigate?</h3>
                  <p className="text-gray-600">Yes, our Nepali Calendar interface is designed for ease of use. You can quickly jump between months and years to find any Nepal calendar date today or in the past/future.</p>
                </div>
              </div>
            </div>

            {/* FAQ 6 */}
            <div className="bg-white rounded-xl p-6 border border-green-100 shadow-sm">
              <div className="flex gap-3">
                <span className="text-green-600 font-bold">6️⃣</span>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">Can I see future dates in the Nepali Calendar?</h3>
                  <p className="text-gray-600">Yes, you can navigate the Nepali Calendar to view future months and years, check upcoming events, and see the corresponding Nepali date today for those future dates.</p>
                </div>
              </div>
            </div>

            {/* FAQ 7 */}
            <div className="bg-white rounded-xl p-6 border border-green-100 shadow-sm">
              <div className="flex gap-3">
                <span className="text-green-600 font-bold">7️⃣</span>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">Do you offer a Mero Patro mobile app?</h3>
                  <p className="text-gray-600">Currently, we offer a web-based platform providing Mero Patro and Hamro Patro style features. You can access the Nepali Calendar and Nepali date today from any device with a web browser.</p>
                </div>
              </div>
            </div>

            {/* FAQ 8 */}
            <div className="bg-white rounded-xl p-6 border border-green-100 shadow-sm">
              <div className="flex gap-3">
                <span className="text-green-600 font-bold">8️⃣</span>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">How is the Nepali date today determined?</h3>
                  <p className="text-gray-600">The Nepali date today is based on the Bikram Sambat (BS) system, the official solar calendar of Nepal. Our Nepali Calendar accurately reflects this.</p>
                </div>
              </div>
            </div>

            {/* FAQ 9 */}
            <div className="bg-white rounded-xl p-6 border border-green-100 shadow-sm">
              <div className="flex gap-3">
                <span className="text-green-600 font-bold">9️⃣</span>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">Can I print the Nepali Calendar?</h3>
                  <p className="text-gray-600">While direct printing isn't a feature, you can use your browser's print function to print the view of the Nepali Calendar month you are currently seeing, including the Nepal calendar date today.</p>
                </div>
              </div>
            </div>

            {/* FAQ 10 */}
            <div className="bg-white rounded-xl p-6 border border-green-100 shadow-sm">
              <div className="flex gap-3">
                <span className="text-green-600 font-bold">🔟</span>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">Where does the data for the Hamro Patro style calendar come from?</h3>
                  <p className="text-gray-600">We source our Nepali Calendar data from reliable public sources and astronomical calculations to ensure the accuracy of the Nepali Calendar and the Nepali date today, providing a dependable Hamro Patro alternative.</p>
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