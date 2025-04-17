import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowTopRightOnSquareIcon, CalendarDaysIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline'; // Using outline icons

const linkData = [
  {
    title: "BS to AD Date Converter",
    description: "Easily convert dates between Bikram Sambat (BS) and Gregorian (AD) calendars.",
    href: "/nep-to-eng-date-converter",
    icon: CalendarDaysIcon
  },
  {
    title: "Kalimati Vegetable Prices",
    description: "Check the latest daily wholesale prices for vegetables and fruits from Kalimati Market.",
    href: "/kalimati-tarkari-rate-today",
    icon: CurrencyDollarIcon 
  },
  // Add more links as needed
];

const PageLinksSection = () => {
  return (
    <div className="mt-12 py-8 bg-gray-100">
      <div className="container mx-auto px-4">
        <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6 text-center">
          Explore Other Tools
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {linkData.map((link, index) => (
            <Link 
              key={index} 
              to={link.href}
              className="block bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg hover:border-green-300 transition duration-200 ease-in-out group"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <link.icon className="h-8 w-8 text-green-600 group-hover:text-green-700" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 group-hover:text-green-700">{link.title}</h4>
                  <p className="mt-1 text-sm text-gray-600">{link.description}</p>
                </div>
                <div className="flex-shrink-0 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowTopRightOnSquareIcon className="h-5 w-5 text-green-500" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PageLinksSection; 