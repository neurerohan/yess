// Placeholder for CalendarGrid component
import React, { useState } from 'react';
import NepaliDate from 'nepali-date-converter';
import EventModal from './EventModal';

// Import Tithi map if not already defined here (or move map to a constants file)
const tithiMap = {
  1: 'प्रतिपदा', 2: 'द्वितीया', 3: 'तृतीया', 4: 'चतुर्थी', 5: 'पञ्चमी',
  6: 'षष्ठी', 7: 'सप्तमी', 8: 'अष्टमी', 9: 'नवमी', 10: 'दशमी',
  11: 'एकादशी', 12: 'द्वादशी', 13: 'त्रयोदशी', 14: 'चतुर्दशी', 15: 'औंसी',
  30: 'पूर्णिमा' // Assuming 30 for Purnima based on your sample
};

// Updated AD Date formatter to return object
const formatADDateInfo = (adString) => {
  if (!adString) return { month: '', day: '' };
  try {
    const date = new Date(adString + 'T00:00:00');
    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }), // Format: Apr
      day: date.toLocaleDateString('en-US', { day: 'numeric' })   // Format: 14
    };
  } catch (e) {
    const parts = adString.split('-'); // Fallback MM-DD
    return { month: parts[1] || '', day: parts[2] || '' };
  }
};

// Helper to get today's BS date parts
const getTodayBS = () => {
  const today = new NepaliDate();
  return {
    year: today.getYear(),
    monthIndex: today.getMonth(), // 0-indexed
    day: today.getDate(),
  };
};

const CalendarGrid = ({ monthData, year, monthName }) => {
  if (!monthData || !Array.isArray(monthData) || monthData.length === 0) {
    console.warn(`[CalendarGrid] Received invalid or empty monthData prop for ${monthName} ${year}. Cannot render grid.`);
    return <p className="text-center text-gray-500 py-8">Calendar data is unavailable for this month.</p>;
  }

  const todayBS = getTodayBS();
  const currentMonthIndex = monthData[0]?.month_bs - 1; // Assuming month_bs is 1-indexed

  const daysOfWeekNP = ['आइत', 'सोम', 'मंगल', 'बुध', 'बिहि', 'शुक्र', 'शनि'];

  // Determine the day of the week for the 1st day of the month
  const firstDayData = monthData[0];
  // --- Assuming week_day: 1=Monday, 2=Tuesday, ..., 6=Saturday, 7=Sunday ---
  // This matches Thursday (Magh 1, 2082) being week_day: 4 in the JSON data.
  const firstDayOfMonthWeekday = firstDayData?.week_day;

  // Calculate empty cells for a grid starting visually on Sunday.
  // (week_day % 7) maps: Mon(1)->1, Tue(2)->2, ..., Sat(6)->6, Sun(7)->0
  const emptyCellsCount = firstDayOfMonthWeekday ? (firstDayOfMonthWeekday % 7) : 0;

  // Update logging
  console.log(`[CalendarGrid] First day data object:`, firstDayData);
  console.log(`[CalendarGrid] Extracted firstDayOfMonthWeekday (from week_day): ${firstDayOfMonthWeekday} (Assuming 1=Mon, 7=Sun)`);
  console.log(`[CalendarGrid] FINAL Calculated emptyCellsCount: ${emptyCellsCount}`);
  
  // State for managing the selected day for the modal
  const [selectedDayData, setSelectedDayData] = useState(null);

  const handleDayClick = (dayData) => {
    setSelectedDayData(dayData);
  };

  const handleCloseModal = () => {
    setSelectedDayData(null);
  };

  return (
    <>
    <div 
      className="bg-white shadow-md rounded-lg overflow-hidden mt-6 transition-opacity duration-300 ease-in-out"
      role="grid"
      aria-labelledby="calendar-grid-label"
    >
      {/* Days of Week Header (role="rowheader") */}
      <div role="row" className="grid grid-cols-7 gap-px bg-gray-200 text-center font-semibold text-sm">
        {daysOfWeekNP.map((day) => (
          <div key={day} role="columnheader" className="bg-gray-100 py-2 px-1">{day}</div>
        ))}
      </div>

      {/* Calendar Days Grid */}
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {/* Empty cells - Styled but visually empty */}
        {Array.from({ length: emptyCellsCount }).map((_, index) => (
          <div 
            key={`empty-${index}`} 
            className="bg-gray-50 p-1 h-28 md:h-32 lg:h-36" // Use a lighter background for empty cells
            aria-hidden="true" // Hide from screen readers
          >
             {/* No visible content */}
          </div> 
        ))}

        {/* Day cells (role="gridcell") */}
        {monthData.map((dayData, index) => {
          const isToday =
            todayBS.year === dayData.AD_date.bs_year &&
            todayBS.monthIndex === (dayData.AD_date.bs_month - 1) &&
            todayBS.day === dayData.AD_date.bs_day;

          // --- Holiday/Saturday Check ---
          // Assuming week_day: 1=Monday, ..., 6=Saturday, 7=Sunday
          const isSaturday = dayData.week_day === 6; // Corrected to check for 6
          const isHoliday = dayData.events?.some(event => event.jds?.gh === '1');
          const isWeekendOrHoliday = isSaturday || isHoliday;
          // --- End Holiday/Saturday Check ---

          const hasEvents = dayData.events && dayData.events.length > 0;
          const tithiNumber = dayData.AD_date?.tithi;
          const tithiName = tithiNumber !== undefined ? tithiMap[tithiNumber] : undefined;
          // Get AD date parts
          const adDateInfo = formatADDateInfo(dayData.ad);

          // --- Dynamically add text color class ---
          const dayNumberColorClass = isWeekendOrHoliday ? 'text-red-600' : (isToday ? 'text-blue-700 font-bold' : 'text-gray-700');
          const adDateColorClass = isWeekendOrHoliday ? 'text-red-500' : (isToday ? 'text-blue-600' : 'text-gray-400');
          const cellBgClass = isToday ? 'bg-blue-50 border-blue-300' : 'bg-white';
          // --- End Dynamic class ---

          return (
            <div
              key={`${dayData.year}-${dayData.month}-${dayData.day}`}
              className={`relative flex flex-col h-28 md:h-32 lg:h-36 p-1.5 border border-transparent ${cellBgClass} ${hasEvents ? 'font-semibold' : ''} hover:bg-gray-50 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:z-10 transition duration-150 ease-in-out group cursor-pointer`}
              onClick={() => handleDayClick(dayData)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleDayClick(dayData)}
              tabIndex={0}
              role="gridcell"
              aria-label={`${dayData.day}${tithiName ? `, Tithi ${tithiName}`: ''}${adDateInfo.month ? `, ${adDateInfo.month} ${adDateInfo.day}` : ''}${hasEvents ? `, ${dayData.events.length} events` : ', No events'}${isToday ? ', Today' : ''}`}
              aria-current={isToday ? "date" : undefined}
            >
              {/* AD Month/Day in Corner */}
              <div className={`absolute top-1 right-1.5 text-[10px] font-medium text-right leading-tight ${adDateColorClass}`}>
                  <span className="hidden sm:inline">{adDateInfo.month} </span>{adDateInfo.day}
              </div>

              {/* Main BS Day - Centered and Prominent */}
              <div className="flex-grow flex items-center justify-center w-full h-full">
                <span className={`text-2xl md:text-3xl lg:text-4xl ${dayNumberColorClass}`}>
                  {dayData.day}
                </span>
              </div>

              {/* Tithi Name Badge - Bottom */}
              <div className="text-center h-4 mb-1"> {/* Reserve space */}
                {tithiName && (
                    // Increased text size slightly on larger screens (text-xs)
                    <span className="text-[9px] sm:text-[10px] md:text-xs font-medium text-indigo-800 bg-indigo-100 px-1.5 py-0.5 rounded-full truncate" title={`तिथि: ${tithiName} (${tithiNumber})`}>
                      {tithiName}
                    </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>

    {/* Event Modal (conditionally rendered) */}
    {selectedDayData && (
      <EventModal dayData={selectedDayData} onClose={handleCloseModal} />
    )}
    </>
  );
};

export default CalendarGrid; 