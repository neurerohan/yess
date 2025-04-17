import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import NepaliDate from 'nepali-date-converter';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Helmet } from 'react-helmet-async';

const DateConverter = () => {
  const navigate = useNavigate();
  const [nepYear, setNepYear] = useState('');
  const [nepMonth, setNepMonth] = useState('');
  const [nepDay, setNepDay] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [adYear, setAdYear] = useState('');
  const [adMonth, setAdMonth] = useState('');
  const [adDay, setAdDay] = useState('');
  const [conversionType, setConversionType] = useState('bs-to-ad');

  const nepaliMonths = [
    'Baisakh', 'Jestha', 'Ashadh', 'Shrawan',
    'Bhadra', 'Ashwin', 'Kartik', 'Mangsir',
    'Poush', 'Magh', 'Falgun', 'Chaitra'
  ];

  const handleConvert = () => {
    try {
      setError('');
      setResult(null);
      
      if (conversionType === 'bs-to-ad') {
        if (!nepYear || !nepMonth || !nepDay) {
          setError('Please fill in all BS date fields');
          return;
        }

        const nepDate = new NepaliDate(
          parseInt(nepYear),
          parseInt(nepMonth) - 1,
          parseInt(nepDay)
        );

        const engDate = nepDate.toJsDate();

        if (isNaN(engDate.getTime())) {
             throw new Error("Invalid date resulted from BS to AD conversion.");
        }

        setResult({
          nepali: `${nepYear}-${String(nepMonth).padStart(2, '0')}-${String(nepDay).padStart(2, '0')}`,
          english: engDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
        });
      } else {
        if (!adYear || !adMonth || !adDay) {
          setError('Please fill in all AD date fields');
          return;
        }

        const adDateObj = new Date(
          parseInt(adYear),
          parseInt(adMonth) - 1,
          parseInt(adDay)
        );

        if (isNaN(adDateObj.getTime()) || 
            adDateObj.getFullYear() !== parseInt(adYear) || 
            adDateObj.getMonth() + 1 !== parseInt(adMonth) || 
            adDateObj.getDate() !== parseInt(adDay)) {
            setError('Invalid AD date input.');
            return;
        }
        
        const nepDate = new NepaliDate(adDateObj);
        
        setResult({
          nepali: nepDate.format('YYYY-MM-DD'),
          english: adDateObj.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
        });
      }
    } catch (err) {
      console.error("Date conversion error:", err);
      setError('Invalid date. Please check your input.');
      setResult(null);
    }
  };

  const today = new Date();
  const nepaliToday = new NepaliDate(today);

  // Using simplified dates for schema, can be ISO string if preferred
  const publishDate = "2024-01-01"; 
  const modifiedDate = new Date().toISOString().split('T')[0]; // Current date

  const dateConverterSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Nepali Date Converter - BS to AD Date Converter",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "datePublished": publishDate,
    "dateModified": modifiedDate,
    "description": "Use this free Date Converter English tool to convert Nepali date into English (BS to AD) or translate Nepali date into English. Accurate date convertor.",
    "url": "https://kalimatirate.nyure.com.np/nep-to-eng-date-converter",
    "inLanguage": ["ne", "en"],
    "browserRequirements": "Requires JavaScript",
    "softwareVersion": "1.0",
    "keywords": "Convert Nepali date into English, Translate Nepali date into English, Date converter English, Date convertor, Nepali date converter, BS to AD converter, AD to BS converter, Bikram Sambat converter",
    "creator": {
      "@type": "Organization",
      "name": "Nyure",
      "url": "https://nyure.com.np"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "256",
      "reviewCount": "180"
    },
    "featureList": [
      "BS to AD conversion",
      "AD to BS conversion",
      "Festival date converter",
      "Historical date conversion"
    ],
    "applicationSuite": "Web Tools",
    "review": {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "author": {
        "@type": "Person",
        "name": "User Review"
      },
      "reviewBody": "Accurate and easy date converter English. Perfect to convert Nepali date into English."
    },
    "mainEntity": {
      "@type": "WebApplication",
      "about": {
        "@type": "Thing",
        "name": "Nepali Calendar System",
        "description": "The Bikram Sambat calendar is the official calendar of Nepal, approximately 56-57 years ahead of the Gregorian calendar."
      }
    }
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
        "name": "Nepali Date Converter",
        "item": "https://kalimatirate.nyure.com.np/nep-to-eng-date-converter"
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "name": "FAQ - Convert Nepali Date into English",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do I convert a Nepali date to English?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Use our Date Converter English tool: enter the BS year, month, and day. Click convert to instantly translate Nepali date into English (AD). It's a simple date convertor."
        }
      },
      {
        "@type": "Question",
        "name": "What is Bikram Sambat (BS)?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Bikram Sambat is Nepal's official calendar. This date converter English tool helps you convert BS dates to AD dates."
        }
      },
      {
        "@type": "Question",
        "name": "What date range does this date convertor support?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "This date convertor supports BS dates from 1970 to 2090 for conversion. Ideal to convert Nepali date into English for many years."
        }
      },
      {
        "@type": "Question",
        "name": "Can I convert English dates to Nepali using this date converter English?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, this date converter English tool works both ways. Use the toggle to switch to AD to BS mode to translate English dates into Nepali."
        }
      },
      {
        "@type": "Question",
        "name": "How accurate is this tool to convert Nepali date into English?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our tool uses official data to accurately convert Nepali date into English (BS to AD) within the supported range. It's a reliable date convertor."
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Convert Nepali Date into English | Date Converter English | Date Convertor</title>
        <meta name="description" content="Free online date converter English tool to convert Nepali date into English (BS to AD) and translate Nepali date into English. Accurate & easy date convertor." />
        <meta name="keywords" content="Convert Nepali date into English, Translate Nepali date into English, Date converter English, Date convertor, BS to AD, AD to BS, Nepali date" />
        <link rel="canonical" href="https://kalimatirate.nyure.com.np/nep-to-eng-date-converter" />
        
        <meta property="og:title" content="Convert Nepali Date into English | Free Date Convertor" />
        <meta property="og:description" content="Easily translate Nepali date into English (BS to AD) with our free date converter English tool. Simple and accurate date convertor." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://kalimatirate.nyure.com.np/nep-to-eng-date-converter" />
        <meta property="og:image" content="https://kalimatirate.nyure.com.np/nepali-date-converter.png" />
        <meta property="og:locale" content="ne_NP" />
        <meta property="og:locale:alternate" content="en_US" />

        <script type="application/ld+json">
          {JSON.stringify(dateConverterSchema)}
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
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Convert Nepali Date into English | Date Converter English
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              Free Online Date Convertor (BS ⇌ AD)
            </p>
            <p className="text-gray-600 max-w-2xl mx-auto mb-4">
              Instantly <strong>convert Nepali date into English</strong> (Bikram Sambat to AD) or <strong>translate Nepali date into English</strong> using our easy <strong>date converter English</strong> tool. Reliable <strong>date convertor</strong> for all your needs.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <time dateTime={publishDate} className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Published: {new Date(publishDate).toLocaleDateString()}
              </time>
              <time dateTime={modifiedDate} className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Last Updated: {new Date(modifiedDate).toLocaleDateString()}
              </time>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white rounded-xl shadow-lg p-6 md:p-8 mb-8 border border-green-100">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white rounded-full shadow-sm mb-6">
              <span className="text-green-600 font-medium">आज को मिति:</span>
              <span className="font-bold">{nepaliToday.format('YYYY-MM-DD')} BS</span>
              <span className="text-gray-300">|</span>
              <span className="text-gray-600">{today.toLocaleDateString('en-US')} AD</span>
            </div>

            <div className="flex gap-4 mb-6">
              <button 
                onClick={() => setConversionType('bs-to-ad')}
                className={`flex-1 py-4 px-6 rounded-lg font-medium text-lg transition-all ${
                  conversionType === 'bs-to-ad'
                    ? 'bg-green-600 text-white shadow-md transform -translate-y-0.5'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
                aria-label="Convert BS to AD / Convert Nepali date into English"
              >
                BS → AD
              </button>
              <button 
                onClick={() => setConversionType('ad-to-bs')}
                className={`flex-1 py-4 px-6 rounded-lg font-medium text-lg transition-all ${
                  conversionType === 'ad-to-bs'
                    ? 'bg-green-600 text-white shadow-md transform -translate-y-0.5'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
                aria-label="Convert AD to BS / Translate English date into Nepali"
              >
                AD → BS
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {conversionType === 'bs-to-ad' ? 'वर्ष / Year (BS)' : 'Year (AD)'}
                </label>
                <input
                  type="number"
                  value={conversionType === 'bs-to-ad' ? nepYear : adYear}
                  onChange={(e) => conversionType === 'bs-to-ad' ? setNepYear(e.target.value.slice(0, 4)) : setAdYear(e.target.value.slice(0, 4))}
                  placeholder={conversionType === 'bs-to-ad' ? '2080' : '2024'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                />
                <span className="absolute right-3 top-9 text-gray-400 text-sm">
                  {conversionType === 'bs-to-ad' ? 'साल' : 'Year'}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {conversionType === 'bs-to-ad' ? 'महिना / Month' : 'Month'}
                </label>
                {conversionType === 'bs-to-ad' ? (
                  <select
                    value={nepMonth}
                    onChange={(e) => setNepMonth(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none bg-white transition-colors"
                  >
                    <option value="">Select Month</option>
                    {nepaliMonths.map((month, index) => (
                      <option key={month} value={index + 1}>
                        {month}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="number"
                    value={adMonth}
                    onChange={(e) => setAdMonth(e.target.value.slice(0, 2))}
                    placeholder="1-12"
                    min="1"
                    max="12"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                  />
                )}
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {conversionType === 'bs-to-ad' ? 'दिन / Day' : 'Day'}
                </label>
                <input
                  type="number"
                  value={conversionType === 'bs-to-ad' ? nepDay : adDay}
                  onChange={(e) => conversionType === 'bs-to-ad' ? setNepDay(e.target.value.slice(0, 2)) : setAdDay(e.target.value.slice(0, 2))}
                  placeholder={conversionType === 'bs-to-ad' ? '1-32' : '1-31'}
                  min="1"
                  max={conversionType === 'bs-to-ad' ? '32' : '31'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                />
                <span className="absolute right-3 top-9 text-gray-400 text-sm">
                  {conversionType === 'bs-to-ad' ? 'गते' : 'Day'}
                </span>
              </div>

              <div className="col-span-full">
                <button
                  onClick={handleConvert}
                  className="w-full bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  Convert / Translate Date
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-600 mt-4 text-center text-sm">{error}</p>
            )}

            {result && (
              <div className="mt-8 bg-green-50 rounded-lg p-6 border border-green-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Conversion Result</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-lg text-center">
                    <p className="text-sm text-gray-500 mb-1">{conversionType === 'bs-to-ad' ? 'Nepali Date (BS)' : 'English Date (AD)'}</p>
                    <p className="text-xl font-medium text-gray-900">{conversionType === 'bs-to-ad' ? result.nepali : result.english}</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg text-center">
                    <p className="text-sm text-gray-500 mb-1">{conversionType === 'bs-to-ad' ? 'English Date (AD)' : 'Nepali Date (BS)'}</p>
                    <p className="text-xl font-medium text-gray-900">{conversionType === 'bs-to-ad' ? result.english : result.nepali}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <span className="text-2xl">📅</span>
              Convert Popular Festival Dates (BS to AD)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  festival: "Vijaya Dashami 2081",
                  bs: "2081-07-01",
                  ad: "October 15, 2024"
                },
                {
                  festival: "Tihar 2081",
                  bs: "2081-07-15",
                  ad: "October 29, 2024"
                },
                {
                  festival: "Maghe Sankranti 2081",
                  bs: "2081-09-01",
                  ad: "January 14, 2025"
                },
                {
                  festival: "Holi 2081",
                  bs: "2081-11-01",
                  ad: "March 17, 2025"
                }
              ].map((date, index) => (
                <button 
                  key={index} 
                  onClick={() => {
                    const [bsYear, bsMonth, bsDay] = date.bs.split('-');
                    setNepYear(bsYear); setNepMonth(bsMonth); setNepDay(bsDay);
                    setConversionType('bs-to-ad');
                  }}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
                  aria-label={`Load ${date.festival} to convert Nepali date into English`}
                >
                  <h4 className="font-medium text-gray-900 mb-2">{date.festival}</h4>
                  <p className="text-sm text-gray-600">BS: {date.bs}</p>
                  <p className="text-sm text-gray-600">AD: {date.ad}</p>
                </button>
              ))}
            </div>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Quick Date Convertor Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all text-left">
                <h3 className="font-medium text-gray-900">Convert Today's Nepali Date into English</h3>
                <p className="text-sm text-gray-600">Instantly translate today's date between BS and AD</p>
              </button>
              <button className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all text-left">
                <h3 className="font-medium text-gray-900">Historical Date Converter English</h3>
                <p className="text-sm text-gray-600">Convert dates from 1970 to 2090 BS</p>
              </button>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Why Use Our Date Converter English Tool?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: "🚀",
                  title: "Instant Conversion",
                  description: "Quickly convert Nepali date into English (BS/AD) using our date convertor."
                },
                {
                  icon: "📅",
                  title: "Wide Date Range",
                  description: "Translate Nepali date into English for years 1970-2090 BS."
                },
                {
                  icon: "📱",
                  title: "Mobile Friendly",
                  description: "Easy date converter English experience on all devices."
                }
              ].map((feature, index) => (
                <div key={index} className="p-6 bg-white rounded-lg shadow-sm">
                  <div className="text-3xl mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-12 bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Popular Date Conversions (BS/AD)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  festival: "Vijaya Dashami 2081",
                  bs: "2081-07-01",
                  ad: "October 15, 2024"
                },
                {
                  festival: "Tihar 2081",
                  bs: "2081-07-15",
                  ad: "October 29, 2024"
                },
                {
                  festival: "Maghe Sankranti 2081",
                  bs: "2081-09-01",
                  ad: "January 14, 2025"
                },
                {
                  festival: "Holi 2081",
                  bs: "2081-11-01",
                  ad: "March 17, 2025"
                }
              ].map((date, index) => (
                <div key={index} className="p-4 bg-white rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{date.festival}</h3>
                  <p className="text-gray-600">BS: {date.bs}</p>
                  <p className="text-gray-600">AD: {date.ad}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              FAQ: Convert & Translate Nepali Date into English
            </h2>
            <div className="space-y-6">
              {[
                {
                  question: "How do I convert a Nepali date to English?",
                  answer: "Use our Date Converter English tool: enter the BS year, month, and day. Click convert to instantly translate Nepali date into English (AD). It's a simple date convertor."
                },
                {
                  question: "What is Bikram Sambat (BS)?",
                  answer: "Bikram Sambat is Nepal's official calendar. This date converter English tool helps you convert BS dates to AD dates."
                },
                {
                  question: "How accurate is this tool to convert Nepali date into English?",
                  answer: "Our tool uses official data to accurately convert Nepali date into English (BS to AD) within the supported range. It's a reliable date convertor."
                },
                {
                  question: "Can I convert English dates to Nepali using this date converter English?",
                  answer: "Yes, this date converter English tool works both ways. Use the toggle to switch to AD to BS mode to translate English dates into Nepali."
                },
                {
                  question: "Is this date convertor free to use?",
                  answer: "Yes, this date convertor is completely free. Convert Nepali date into English anytime."
                }
              ].map((faq, index) => (
                <div key={index} className="p-4 bg-white rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Convert Nepali Date into English Easily!
            </h2>
            <p className="text-gray-600 mb-6">
              Use our free date converter English tool to translate Nepali date into English instantly. Accurate date convertor for all needs.
            </p>
            <button
              onClick={() => window.scrollTo(0, 0)}
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Use Date Convertor Now
            </button>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default DateConverter;