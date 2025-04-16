import React from 'react';

// Helper to capitalize month names
const capitalize = (s) => s && s[0].toUpperCase() + s.slice(1);

// Helper to format AD date
const formatADDate = (adString) => {
  if (!adString) return 'N/A';
  try {
    const date = new Date(adString + 'T00:00:00');
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch (e) {
    return adString;
  }
};

const MonthlyEventsList = ({ monthData, monthName, year }) => {
  if (!monthData || !Array.isArray(monthData) || monthData.length === 0) {
    return null; // Don't render if no month data
  }

  // Aggregate all events for the month with their dates
  const allMonthEvents = monthData.reduce((acc, day) => {
    if (day.events && day.events.length > 0) {
      const validEvents = day.events.filter(event => event && event.jtl);
      if (validEvents.length > 0) {
        acc.push({
          bs_day: day.day, // BS day number string
          ad_date: day.ad, // AD date string
          events: validEvents
        });
      }
    }
    return acc;
  }, []);

  const capitalizedMonthName = capitalize(monthName || ''); // Capitalize once

  if (allMonthEvents.length === 0) {
    return (
      <div className="mt-12 py-8">
         <h3 className="text-lg font-semibold text-gray-700 mb-3 text-center">
           Events in {capitalizedMonthName} {year}
         </h3>
        <p className="text-gray-500 italic text-center text-sm">No major events or festivals found for this month.</p>
      </div>
    );
  }

  return (
    <div className="mt-12 py-8">
      <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6 text-center">
        Major Events & Festivals - {capitalizedMonthName} {year}
      </h3>
      <div className="max-w-3xl mx-auto space-y-6">
        {allMonthEvents.map((dayWithEvents) => (
          // Card for each day with events
          <div key={dayWithEvents.bs_day} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 border-b border-gray-200">
              {/* Date Info Header */}
              <div className="flex-shrink-0 w-12 h-12 flex flex-col items-center justify-center bg-indigo-100 rounded-md border border-indigo-200">
                <span className="text-xl font-bold text-indigo-700 block leading-tight">{dayWithEvents.bs_day}</span>
                <span className="text-[10px] text-indigo-500 block uppercase tracking-wide">{formatADDate(dayWithEvents.ad_date).split(', ')[0]}</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-700">
                {capitalizedMonthName} {dayWithEvents.bs_day}
              </h4>
            </div>
            {/* Event List */}
            <ul className="divide-y divide-gray-100 p-4">
              {dayWithEvents.events.map((event, idx) => (
                <li key={event.id || idx} className="py-2 flex justify-between items-center">
                  <div>
                    <p className="text-gray-800 text-sm font-medium">{event.jtl}</p>
                    {event.jds?.en && event.jds.en !== event.jtl && (
                       <p className="text-gray-500 text-xs font-normal">({event.jds.en})</p>
                    )}
                  </div>
                  {event.jds?.gh === '1' && 
                    <span className="ml-4 flex-shrink-0 text-[10px] bg-green-600 text-white font-bold px-2 py-0.5 rounded-full">HOLIDAY</span> 
                  }
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthlyEventsList; 