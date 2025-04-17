import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';

// Mapping from Tithi number to Nepali Name
const tithiMap = {
  1: 'प्रतिपदा', 2: 'द्वितीया', 3: 'तृतीया', 4: 'चतुर्थी', 5: 'पञ्चमी',
  6: 'षष्ठी', 7: 'सप्तमी', 8: 'अष्टमी', 9: 'नवमी', 10: 'दशमी',
  11: 'एकादशी', 12: 'द्वादशी', 13: 'त्रयोदशी', 14: 'चतुर्दशी', 15: 'औंसी',
  30: 'पूर्णिमा' // From your data sample
};

// Helper to format AD date
const formatADDate = (adString) => {
  if (!adString) return 'N/A';
  try {
    // Add time component to avoid potential timezone interpretation issues
    const date = new Date(adString + 'T00:00:00'); 
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch (e) {
    console.error("Error formatting AD date:", adString, e);
    return adString; // Fallback to original string
  }
};

const EventModal = ({ dayData, onClose }) => {
  if (!dayData) return null;

  // CORRECTED: Access properties based on the actual dayData structure
  const { day, ad, events, AD_date } = dayData;
  const tithiNumber = AD_date?.tithi;
  const tithiName = tithiNumber !== undefined ? tithiMap[tithiNumber] : undefined;
  const adDateFormatted = formatADDate(ad);
  const bsDateDisplay = `${day}`; // Just the BS day number

  // Filter out potential null/empty event objects if any exist in data
  const validEvents = events?.filter(event => event && event.jtl) || [];

  return (
    // Backdrop
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 backdrop-blur-sm"
      onClick={onClose} // Close on backdrop click
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-modal-title"
    >
      {/* Modal Content */}
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-lg relative overflow-hidden border border-gray-300"
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside content
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
          <h2 id="event-modal-title" className="text-lg sm:text-xl font-semibold text-gray-800">
            {/* CORRECTED Title */}
            BS Day {bsDateDisplay} / {adDateFormatted}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 rounded-md p-1"
            aria-label="Close modal"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* CORRECTED Tithi display */}
          {tithiName && (
            <p className="text-green-700 font-medium bg-green-50 px-3 py-1 rounded-full inline-block text-sm">
              तिथि: {tithiName} ({tithiNumber})
            </p>
          )}
          {/* Fallback if mapping missing but number exists */}
          {!tithiName && tithiNumber !== undefined && (
             <p className="text-gray-600 font-medium bg-gray-100 px-3 py-1 rounded-full inline-block text-sm">
              Tithi: {tithiNumber}
            </p>
          )}

          <h3 className="text-base font-semibold text-gray-700 border-t pt-3 mt-3">Events:</h3>
          {/* CORRECTED Event mapping */}
          {validEvents.length > 0 ? (
            <ul className="list-disc list-inside space-y-2 pl-1">
              {validEvents.map((event, idx) => (
                <li key={event.id || idx} className="text-gray-700 text-sm sm:text-base">
                  {/* Use event.jtl for Nepali name */}
                  {event.jtl} 
                  {/* Check if it's a holiday using event.jds.gh */}
                  {event.jds?.gh === '1' ? 
                    <span className="ml-1 text-xs bg-green-100 text-green-800 font-medium px-1.5 py-0.5 rounded-full">Holiday</span> 
                    : ''}
                  {/* Show English name (event.jds.en) if available and different */}
                  {event.jds?.en && event.jds.en !== event.jtl && (
                     <span className="text-gray-500 text-xs block"> ({event.jds.en})</span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic text-sm sm:text-base">No events listed for this day.</p>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 text-right">
           <button 
            onClick={onClose}
            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal; 