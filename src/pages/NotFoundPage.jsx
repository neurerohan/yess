import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { HomeIcon, ArrowUturnLeftIcon, CalendarIcon } from '@heroicons/react/24/outline';

import Header from '../components/Header'; // Adjust path if needed
import Footer from '../components/Footer'; // Adjust path if needed

const NotFoundPage = () => {
  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | Kalimati Rate</title>
        <meta name="description" content="The page you requested could not be found. Please check the URL or return to the homepage." />
        {/* Prevent indexing of 404 page */}
        <meta name="robots" content="noindex" /> 
      </Helmet>

      <Header />

      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center px-4 py-16 bg-gray-50">
        {/* Adjust min-h based on actual Header/Footer height */} 
        <div className="max-w-md">
          <h1 className="text-6xl md:text-9xl font-bold text-indigo-600 mb-4">404</h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            Oops! The page you are looking for seems to have gone missing. 
            It might have been moved, deleted, or maybe the URL was typed incorrectly.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition ease-in-out duration-150"
            >
              <HomeIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Go Back Home
            </Link>
            <Link
              to="/calendar" // Link to calendar as a key feature
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition ease-in-out duration-150"
            >
              <CalendarIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              View Calendar
            </Link>
             {/* Optionally add a button to go back */}
             {/* <button
              onClick={() => window.history.back()}
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition ease-in-out duration-150"
             >
              <ArrowUturnLeftIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Go Back
            </button> */} 
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default NotFoundPage; 