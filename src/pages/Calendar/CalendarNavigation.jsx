// Placeholder for CalendarNavigation component
import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'; // Assuming you have heroicons installed

// Helper to capitalize month names for display
const capitalize = (s) => s && s[0].toUpperCase() + s.slice(1);

const CalendarNavigation = ({ 
  currentYear, 
  currentMonth, 
  yearOptions, 
  monthOptions, 
  onPrevMonth, 
  onNextMonth, 
  onNavigateTo 
}) => {
  // Local state for dropdowns to allow selection before triggering navigation
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonthName, setSelectedMonthName] = useState(currentMonth);

  // Update local state if props change (e.g., navigating via prev/next)
  useEffect(() => {
    setSelectedYear(currentYear);
    setSelectedMonthName(currentMonth);
  }, [currentYear, currentMonth]);

  const handleYearChange = (e) => {
    const newYear = parseInt(e.target.value);
    setSelectedYear(newYear);
    onNavigateTo(newYear, selectedMonthName); // Navigate immediately on year change
  };

  const handleMonthChange = (e) => {
    const newMonth = e.target.value; // Month name (capitalized)
    setSelectedMonthName(newMonth);
    onNavigateTo(selectedYear, newMonth); // Navigate immediately on month change
  };

  const handleGo = () => {
    // Implementation of handleGo function
  };

  return (
    <div className="flex flex-wrap justify-between items-center p-4 bg-gray-50 rounded-t-lg border-b border-gray-200 gap-4">
      {/* Prev Button */}
      <button 
        onClick={onPrevMonth}
        className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition ease-in-out duration-150 order-1"
        aria-label="Previous Month"
      >
        <ChevronLeftIcon className="h-5 w-5" />
        <span className="hidden sm:inline ml-1">Previous</span>
      </button>

      {/* Month and Year Selectors */}
      <div className="flex items-center gap-2 order-3 sm:order-2 flex-grow justify-center">
        {/* Month Select */}
        <select
          value={selectedMonthName} // Control component with state
          onChange={handleMonthChange}
          className="py-2 pl-3 pr-8 border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm sm:text-base rounded-md shadow-sm"
          aria-label="Select Month"
        >
          {monthOptions.map((month) => (
            <option key={month} value={capitalize(month)}>
              {capitalize(month)}
            </option>
          ))}
        </select>

        {/* Year Select */}
        <select
          value={selectedYear} // Control component with state
          onChange={handleYearChange}
          className="py-2 pl-3 pr-8 border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm sm:text-base rounded-md shadow-sm"
          aria-label="Select Year"
        >
          {yearOptions.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* Next Button */}
      <button 
        onClick={onNextMonth}
        className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition ease-in-out duration-150 order-2 sm:order-3"
        aria-label="Next Month"
      >
         <span className="hidden sm:inline mr-1">Next</span>
        <ChevronRightIcon className="h-5 w-5" />
      </button>

      <div className="flex items-center gap-2 order-4 sm:order-4">
        <button
          onClick={handleGo}
          className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 ease-in-out"
          disabled={!selectedYear || !selectedMonthName}
        >
          Go
        </button>
      </div>
    </div>
  );
};

export default CalendarNavigation; 