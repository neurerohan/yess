// import axios from 'axios';

// Remove API_BASE_URL if not used
// const API_BASE_URL = 'https://miti.bikram.io/data';

// Keep the initial log for reference, but it won't show keys until a file is loaded
// console.log('[api.js] Script loaded');

// Cache for loaded year data
const calendarDataCache = new Map();

/**
 * Dynamically imports and provides calendar data for a specific BS year 
 * from a corresponding static JSON file in `src/data/`.
 * @param {number | string} year - The BS year (e.g., 2081, 2082, 2083).
 * @returns {Promise<object>} A promise that resolves with the calendar data object.
 * @throws {Error} If the file for the requested year is not found or data is invalid.
 */
export const getStaticCalendarData = async (year) => {
  const yearKey = String(year);
  if (!yearKey) {
    throw new Error('Year parameter is required for calendar data.');
  }

  // Check cache first
  if (calendarDataCache.has(yearKey)) {
    console.log(`[getStaticCalendarData] Cache hit for year ${yearKey}`);
    return calendarDataCache.get(yearKey);
  }

  console.log(`[getStaticCalendarData] Cache miss for year ${yearKey}. Attempting dynamic import...`);
  
  try {
    // Dynamic import - path is relative to this file (src/utils/)
    const module = await import(`../data/${yearKey}-calendar.json`);
    const dataToUse = module.default; // Default export from JSON import

    console.log(`[getStaticCalendarData] Successfully imported data for year ${yearKey}. Keys:`, Object.keys(dataToUse || {}));

    // Basic validation
    if (typeof dataToUse !== 'object' || dataToUse === null) {
       console.error(`[getStaticCalendarData] Imported data for ${yearKey} is not an object:`, dataToUse);
       throw new Error(`Invalid data format in imported ${yearKey}-calendar.json.`);
    }

    // Store in cache
    calendarDataCache.set(yearKey, dataToUse);
    return dataToUse;

  } catch (error) {
    console.error(`[getStaticCalendarData] Failed to import or process data for year ${yearKey}:`, error);
    // Check if it's a module not found error
    if (error.message.includes('Cannot find module') || error.message.includes('Failed to fetch dynamically imported module')) {
        throw new Error(`Static calendar data file not found for year ${yearKey}. Please ensure 'src/data/${yearKey}-calendar.json' exists.`);
    } else {
        // Re-throw other errors (e.g., JSON parsing error if file is invalid)
        throw new Error(`Could not load or process calendar data for ${yearKey}: ${error.message}`);
    }
  }
};

// Standard Nepali months (lowercase for consistent mapping)
export const NEPALI_MONTHS = [
    'baishakh', 'jestha', 'ashadh', 'shrawan',
    'bhadra', 'ashwin', 'kartik', 'mangsir',
    'poush', 'magh', 'falgun', 'chaitra'
];

// Mapping from lowercase month name to the numeric string key used in the JSON data
// CORRECTED: Keys for months 1-9 require a leading zero based on console logs.
const monthNameToNumberKeyMapping = {
  baishakh: "01",
  jestha:   "02",
  ashadh:   "03",
  shrawan:  "04",
  bhadra:   "05",
  ashwin:   "06", // Corrected from "aswin" typo if present, ensure name matches NEPALI_MONTHS
  kartik:   "07",
  mangsir:  "08",
  poush:    "09",
  magh:     "10",
  falgun:   "11",
  chaitra:  "12",
};

/**
 * Gets the data for a specific month from the already fetched year data.
 * Uses the monthNameToNumberKeyMapping to find the correct data key.
 * @param {object} yearData - The fetched data object for the entire year.
 * @param {string} monthName - The lowercase Nepali month name (e.g., 'baishakh').
 * @returns {object | null} The data for the specific month, or null if not found/invalid.
 */
export const getMonthData = (yearData, monthName) => {
  if (!yearData || typeof yearData !== 'object') {
    console.error('[getMonthData] Invalid yearData provided');
    return null;
  }
  const normalizedMonthName = monthName?.toLowerCase();
  if (!normalizedMonthName) {
    console.error('[getMonthData] Month name is required');
    return null;
  }

  // Use the mapping to find the numeric string key
  const monthKey = monthNameToNumberKeyMapping[normalizedMonthName];
  console.log(`[getMonthData] Looking for month: '${normalizedMonthName}', Mapped key: '${monthKey}' (type: ${typeof monthKey})`);

  if (!monthKey) {
    console.error(`[getMonthData] Mapping not found for month name: '${normalizedMonthName}'`);
    throw new Error(`Invalid month name provided: ${monthName}`);
  }

  console.log('[getMonthData] Available keys in yearData:', Object.keys(yearData));
  
  // --- Explicitly check value and type before the if condition ---
  const valueFound = yearData[monthKey];
  console.log(`[getMonthData] Value found for key '${monthKey}':`, valueFound === undefined ? 'undefined' : valueFound === null ? 'null' : 'exists');
  console.log(`[getMonthData] Type of value found for key '${monthKey}':`, typeof valueFound);
  // --- End Explicit Check ---
  
  console.log(`[getMonthData] Checking condition: (!yearData[monthKey]) which is (!valueFound)`);

  // The check causing the issue
  if (!valueFound) { 
      const yearInData = Object.values(yearData)[0]?.days?.[0]?.year_bs || '(year unknown)';
      console.warn(`[getMonthData] WARN: Value for month key '${monthKey}' (mapped from '${normalizedMonthName}') is falsy (e.g., undefined, null) in yearData for year ${yearInData}. Returning null.`);
      return null; 
  }
  
  console.log(`[getMonthData] Found valid data for key '${monthKey}'.`);
  return valueFound; // Return the value we checked
};

export const getNextMonth = (year, month) => {
    const currentMonthIndex = NEPALI_MONTHS.indexOf(month.toLowerCase());
    if (currentMonthIndex === -1) return { year, month }; // Invalid month

    if (currentMonthIndex === 11) { // Chaitra (last month)
        return { year: parseInt(year) + 1, month: NEPALI_MONTHS[0] }; // Next year, Baisakh
    } else {
        return { year: parseInt(year), month: NEPALI_MONTHS[currentMonthIndex + 1] };
    }
};

export const getPreviousMonth = (year, month) => {
    const currentMonthIndex = NEPALI_MONTHS.indexOf(month.toLowerCase());
    if (currentMonthIndex === -1) return { year, month }; // Invalid month

    if (currentMonthIndex === 0) { // Baisakh (first month)
        return { year: parseInt(year) - 1, month: NEPALI_MONTHS[11] }; // Previous year, Chaitra
    } else {
        return { year: parseInt(year), month: NEPALI_MONTHS[currentMonthIndex - 1] };
    }
}; 