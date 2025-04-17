import NepaliDate from 'nepali-date-converter';

/**
 * Checks if a given day object from calendar data represents a public holiday.
 * ASSUMPTION: Holiday events have an 'isHoliday: true' property.
 * @param {object} day - The day object from calendar data.
 * @returns {{isHoliday: boolean, eventName: string|null}} - Whether it's a holiday and the primary event name.
 */
export const isPublicHoliday = (day) => {
  if (!day || !Array.isArray(day.events) || day.events.length === 0) {
    return { isHoliday: false, eventName: null };
  }
  // Find the first event marked as a holiday
  const holidayEvent = day.events.find(event => event.isHoliday === true);
  return {
    isHoliday: !!holidayEvent,
    eventName: holidayEvent ? holidayEvent.name : null,
  };
};

/**
 * Checks if a given day object from calendar data is a Saturday.
 * @param {object} day - The day object from calendar data.
 * @returns {boolean}
 */
export const isSaturday = (day) => {
  // Assuming day_of_week: 0 = Sunday, 6 = Saturday
  return day?.day_of_week === 6;
};

/**
 * Retrieves upcoming holidays (including Saturdays) within a specified date range.
 * @param {object} yearData - The full calendar data for the year (result of getStaticCalendarData).
 * @param {number} daysAhead - How many days into the future to check.
 * @returns {Array<object>} - An array of day objects that are holidays or Saturdays.
 */
export const getUpcomingHolidays = (yearData, daysAhead = 3) => {
  if (!yearData) {
    console.warn('getUpcomingHolidays: yearData is missing.');
    return [];
  }

  const upcomingHolidays = [];
  const today = new Date(); // Use AD date for iteration
  const nepaliToday = new NepaliDate(); // Get current BS date info if needed
  const currentBsYear = nepaliToday.getYear();

  console.log(`Checking for holidays up to ${daysAhead} days ahead from ${today.toISOString().slice(0, 10)}`);

  for (let i = 0; i <= daysAhead; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() + i);

    try {
      const nepaliVersion = new NepaliDate(checkDate);
      const bsYear = nepaliVersion.getYear();
      const bsMonthIndex = nepaliVersion.getMonth();
      const bsDate = nepaliVersion.getDate();

      // Ensure we're using the correct year data (handle year boundaries)
      const dataForYear = yearData[bsYear];
      if (!dataForYear) {
        // console.warn(`No calendar data available for year ${bsYear}`);
        continue; // Skip if data for that BS year isn't loaded
      }

      const nepaliMonths = Object.keys(dataForYear); // Get month names from data
      const bsMonthName = nepaliMonths[bsMonthIndex];
      
      const monthData = dataForYear[bsMonthName];
      if (!monthData || !monthData.days) {
        // console.warn(`Month data not found for ${bsMonthName} ${bsYear}`);
        continue;
      }

      // Find the specific day in the month data
      // Using bsDate (Nepali day number) for matching
      const dayData = monthData.days.find(d => d.bs_date === bsDate);

      if (dayData) {
        const holidayCheck = isPublicHoliday(dayData);
        const saturdayCheck = isSaturday(dayData);

        if (holidayCheck.isHoliday || saturdayCheck) {
          // Add eventName, defaulting to "Sanibar" for Saturdays if no other holiday
          const eventName = holidayCheck.eventName || (saturdayCheck ? 'Sanibar' : 'Holiday');
          upcomingHolidays.push({ ...dayData, primaryHolidayName: eventName });
          // console.log(`Found relevant day: ${dayData.ad_date_iso}, Event: ${eventName}`);
        }
      } else {
        // This might happen if date calculation/lookup is slightly off, or data is incomplete
        // console.warn(`Could not find day data for BS Date: ${bsYear}-${bsMonthName}-${bsDate} (AD: ${checkDate.toISOString().slice(0,10)})`);
      }
    } catch (error) {
      console.error(`Error processing date ${checkDate.toISOString()}:`, error);
    }
  }
  // console.log('Upcoming holidays found:', upcomingHolidays);
  return upcomingHolidays;
}; 