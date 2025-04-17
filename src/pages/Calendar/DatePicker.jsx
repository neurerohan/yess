import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { NEPALI_MONTHS } from '../../utils/api'; // Import month names

// Helper to capitalize month names for display
const capitalize = (s) => s && s[0].toUpperCase() + s.slice(1);

const DatePicker = ({ initialYear, initialMonth }) => {
  const navigate = useNavigate();

  // Determine initial state or defaults
  const currentNepaliDate = new NepaliDate();
  const defaultYear = initialYear || currentNepaliDate.getYear();
  const defaultMonthIndex = initialMonth ? NEPALI_MONTHS.indexOf(initialMonth.toLowerCase()) : currentNepaliDate.getMonth();

  const [selectedYear, setSelectedYear] = useState(defaultYear);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(defaultMonthIndex); // 0-indexed

  // Generate year options (adjust range as needed based on data availability)
  const startYear = 2070;
  const endYear = 2090;
  const yearOptions = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);

  const handleYearChange = (event) => {
    setSelectedYear(parseInt(event.target.value));
  };

  const handleMonthChange = (event) => {
    setSelectedMonthIndex(parseInt(event.target.value));
  };

  const handleGoToDate = useCallback(() => {
    const selectedMonthName = NEPALI_MONTHS[selectedMonthIndex];
    if (selectedYear && selectedMonthName) {
      navigate(`/calendar/${selectedYear}/${selectedMonthName}`);
    }
  }, [selectedYear, selectedMonthIndex, navigate]);

  return (
    <div className="mt-8 p-4 bg-gray-100 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-700 mb-3">Go to Date</h3>
      <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-stretch md:items-end">
        <div className="flex-grow">
          <label htmlFor="bsYearSelect" className="block text-sm font-medium text-gray-600 mb-1">
            Year (BS)
          </label>
          <select
            id="bsYearSelect"
            value={selectedYear}
            onChange={handleYearChange}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md shadow-sm"
          >
            {yearOptions.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div className="flex-grow">
          <label htmlFor="bsMonthSelect" className="block text-sm font-medium text-gray-600 mb-1">
            Month
          </label>
          <select
            id="bsMonthSelect"
            value={selectedMonthIndex}
            onChange={handleMonthChange}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md shadow-sm"
          >
            {NEPALI_MONTHS.map((month, index) => (
              <option key={month} value={index}>
                {capitalize(month)}
              </option>
            ))}
          </select>
        </div>

        <div className="md:self-end">
          <button
            onClick={handleGoToDate}
            className="w-full md:w-auto inline-flex justify-center items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Go
          </button>
        </div>
      </div>
    </div>
  );
};

// Import NepaliDate locally if needed for default values and not already global
// Ensure NepaliDate is available (e.g., imported from 'nepali-date-converter')
import NepaliDate from 'nepali-date-converter';

export default DatePicker; 