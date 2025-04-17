const NOTIFIED_EVENTS_KEY_PREFIX = 'notified_holiday_event_';

/**
 * Checks if a notification for a specific event date has already been sent.
 * @param {string} adDateIso - The AD date string (YYYY-MM-DD) of the event.
 * @param {string} eventName - The name of the event (e.g., "Dashain" or "Sanibar").
 * @returns {boolean}
 */
const hasBeenNotified = (adDateIso, eventName) => {
  const key = `${NOTIFIED_EVENTS_KEY_PREFIX}${adDateIso}_${eventName}`;
  try {
    return localStorage.getItem(key) === 'true';
  } catch (error) {
    console.error('localStorage access error in hasBeenNotified:', error);
    return false; // Assume not notified if localStorage fails
  }
};

/**
 * Marks a notification for a specific event date as sent.
 * @param {string} adDateIso - The AD date string (YYYY-MM-DD).
 * @param {string} eventName - The name of the event.
 */
const markAsNotified = (adDateIso, eventName) => {
  const key = `${NOTIFIED_EVENTS_KEY_PREFIX}${adDateIso}_${eventName}`;
  try {
    localStorage.setItem(key, 'true');
  } catch (error) {
    console.error('localStorage access error in markAsNotified:', error);
  }
};

/**
 * Shows a browser notification if permission is granted.
 * @param {string} title - The notification title.
 * @param {object} options - Notification options (body, icon, etc.).
 */
const showNotification = (title, options) => {
  if (Notification.permission === 'granted') {
    // Use service worker registration to show notification if available (more robust)
    // navigator.serviceWorker.getRegistration().then(reg => {
    //   if (reg) {
    //     reg.showNotification(title, options);
    //   } else {
    //     // Fallback to basic notification if SW registration not found
           new Notification(title, options);
    //   }
    // });
  } else {
    console.log('Notification permission not granted.');
  }
};

/**
 * Schedules notifications for a specific holiday event based on timing rules.
 * @param {object} holidayDayData - The day object from calendar data, including primaryHolidayName.
 */
export const scheduleHolidayNotification = (holidayDayData) => {
  const eventName = holidayDayData.primaryHolidayName;
  const holidayAdDateStr = holidayDayData.ad_date_iso; // Expecting YYYY-MM-DD

  if (!eventName || !holidayAdDateStr) {
    console.error('Invalid holiday data for scheduling:', holidayDayData);
    return;
  }

  // Requirement 3: Prevent duplicate notifications
  if (hasBeenNotified(holidayAdDateStr, eventName)) {
    // console.log(`Notification already sent/scheduled for ${eventName} on ${holidayAdDateStr}`);
    return;
  }

  const holidayDate = new Date(holidayAdDateStr + 'T00:00:00'); // Use start of day in local timezone
  const now = new Date();

  // --- Calculate Target Notification Times --- 

  // 1. Two Days Before @ 8:00 PM
  const twoDaysBefore = new Date(holidayDate);
  twoDaysBefore.setDate(holidayDate.getDate() - 2);
  twoDaysBefore.setHours(20, 0, 0, 0); // Set to 8:00 PM

  // 2. One Day Before @ 10:00 AM
  const oneDayBefore = new Date(holidayDate);
  oneDayBefore.setDate(holidayDate.getDate() - 1);
  oneDayBefore.setHours(10, 0, 0, 0); // Set to 10:00 AM

  // 3. Fallback: Today (check happens below)
  const isTodayHoliday = now.getFullYear() === holidayDate.getFullYear() &&
                         now.getMonth() === holidayDate.getMonth() &&
                         now.getDate() === holidayDate.getDate();

  // --- Scheduling Logic --- 

  let scheduled = false;

  // Check for 2 days before notification
  if (now < twoDaysBefore) {
    const delay = twoDaysBefore.getTime() - now.getTime();
    console.log(`Scheduling '2 days before' notification for ${eventName} (${holidayAdDateStr}) in ${Math.round(delay / 1000 / 60)} mins.`);
    setTimeout(() => {
      console.log(`Sending '2 days before' notification for ${eventName}`);
      showNotification(`Upcoming Leave!`, { 
          body: `Parsi ta '${eventName}' ko xutti, party hanna jaam baby!!`, 
          icon: '/icons/icon-192x192.png' // Optional: Add an icon 
      });
      markAsNotified(holidayAdDateStr, eventName); // Mark after attempting to send
    }, delay);
    scheduled = true;
  }
  
  // Check for 1 day before notification (only if 2-day wasn't scheduled for the *future*)
  // We still need to check this condition even if the 2-day time passed, in case the app just loaded.
  if (!scheduled && now < oneDayBefore) {
      const delay = oneDayBefore.getTime() - now.getTime();
      console.log(`Scheduling '1 day before' notification for ${eventName} (${holidayAdDateStr}) in ${Math.round(delay / 1000 / 60)} mins.`);
      setTimeout(() => {
        console.log(`Sending '1 day before' notification for ${eventName}`);
        showNotification(`Leave Tomorrow!`, { 
            body: `Voli '${eventName}' ko xutti xa, moj gara`, 
            icon: '/icons/icon-192x192.png' 
        });
        markAsNotified(holidayAdDateStr, eventName);
      }, delay);
      scheduled = true;
  }

  // Check for Fallback Notification (if today is the holiday AND 10 AM target has passed)
  // This runs only if the previous two notifications weren't scheduled for the future.
  if (!scheduled && isTodayHoliday && now >= oneDayBefore) { // Check if today is the day AND 10 AM passed
      console.log(`Sending 'Fallback (Today)' notification for ${eventName} (${holidayAdDateStr}) as 10AM deadline missed.`);
       // Send immediately (or with a tiny delay)
      setTimeout(() => {
          showNotification(`Happy Leave Day!`, { 
              body: `Babyy '${eventName}' ko xutti, have fun!!`, 
              icon: '/icons/icon-192x192.png' 
          });
          markAsNotified(holidayAdDateStr, eventName);
      }, 100); // Small delay to ensure it happens after current execution context
      scheduled = true;
  }

  // If a notification was scheduled for the future, mark it now to prevent re-scheduling on refresh
  if (scheduled && now < (oneDayBefore < twoDaysBefore ? oneDayBefore : twoDaysBefore)) {
      markAsNotified(holidayAdDateStr, eventName);
  }
  
  if (!scheduled) {
    // console.log(`No notification scheduled for ${eventName} on ${holidayAdDateStr} (conditions not met or time passed).`);
  }
}; 