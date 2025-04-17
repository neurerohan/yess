import React, { useEffect, useState } from 'react';
import NepaliDate from 'nepali-date-converter';
import useNotificationPermission from '../hooks/useNotificationPermission'; // Assuming path
import { getStaticCalendarData } from '../utils/api'; // Assuming path
import { getUpcomingHolidays } from '../utils/holidayChecker'; // Assuming path
import { scheduleHolidayNotification } from '../utils/notificationScheduler'; // Assuming path

/**
 * A background component responsible for scheduling holiday notifications.
 * Renders null.
 */
const HolidayNotifier = () => {
  const { permissionStatus, requestPermission, canAskPermission } = useNotificationPermission();
  const [calendarData, setCalendarData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Effect 1: Potentially ask for permission on load (respecting cool-down)
  useEffect(() => {
    // If permission is default and we are allowed to ask (cool-down passed)
    // Request permission shortly after component mounts.
    // You might want to delay this further or tie it to a user action.
    if (permissionStatus === 'default' && canAskPermission) {
      const timerId = setTimeout(() => {
        console.log('Requesting notification permission...');
        requestPermission();
      }, 5000); // Ask after 5 seconds, adjust as needed

      return () => clearTimeout(timerId);
    }
  }, [permissionStatus, canAskPermission, requestPermission]);

  // Effect 2: Fetch calendar data for the current BS year
  useEffect(() => {
    const currentBsYear = new NepaliDate().getYear();
    setIsLoading(true);
    setError(null);

    getStaticCalendarData(currentBsYear)
      .then(data => {
        if (!data || Object.keys(data).length === 0) {
          throw new Error(`No calendar data returned for year ${currentBsYear}`);
        }
        setCalendarData({ [currentBsYear]: data }); // Store data keyed by year
        console.log(`HolidayNotifier: Successfully loaded calendar data for ${currentBsYear}`);
      })
      .catch(err => {
        console.error('HolidayNotifier: Failed to load calendar data:', err);
        setError(err.message || 'Could not load calendar data.');
        setCalendarData(null);
      })
      .finally(() => {
        setIsLoading(false);
      });

  }, []); // Fetch only on initial mount

  // Effect 3: Schedule notifications when permission is granted and data is available
  useEffect(() => {
    if (permissionStatus === 'granted' && calendarData && !isLoading && !error) {
      console.log('HolidayNotifier: Permission granted and data loaded. Checking for upcoming holidays...');
      const currentBsYear = new NepaliDate().getYear();
      const yearData = calendarData[currentBsYear];
      
      if(yearData) {
          // Check holidays for the next 3 days (adjust as needed)
          const upcoming = getUpcomingHolidays(calendarData, 3);
          
          if (upcoming.length > 0) {
              console.log(`HolidayNotifier: Found ${upcoming.length} upcoming holidays/Saturdays to schedule.`);
              upcoming.forEach(holiday => {
                  scheduleHolidayNotification(holiday);
              });
          } else {
              console.log('HolidayNotifier: No upcoming holidays/Saturdays found within the next 3 days.');
          }
      } else {
          console.warn('HolidayNotifier: Calendar data for current year missing after load.');
      }
    }
  }, [permissionStatus, calendarData, isLoading, error]);

  // This component does not render anything visible
  return null;
};

export default HolidayNotifier; 