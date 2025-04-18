import React, { useEffect, useState } from 'react';
import NepaliDate from 'nepali-date-converter';
import { getStaticCalendarData } from '../utils/api';
import { isPublicHoliday, isSaturday } from '../utils/holidayChecker';

const NOTIFICATION_CHECK_DAYS_AHEAD = 3; // Check today, tomorrow, day after
const NOTIFICATION_HOUR_2_DAYS_BEFORE = 20; // 8 PM
const NOTIFICATION_HOUR_1_DAY_BEFORE = 10; // 10 AM
const NOTIFICATION_HOUR_FALLBACK = 10; // 10 AM on the day
const LOCAL_STORAGE_PREFIX = 'onesignal_notified_holiday_';

const OneSignalHolidayNotifier = () => {
  const [calendarData, setCalendarData] = useState(null);
  const [error, setError] = useState(null);

  // 1. Load Calendar Data on Mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const today = new Date();
        // Estimate BS year - might need adjustment near year change
        const currentBsYear = new NepaliDate(today).getYear(); 
        const data = await getStaticCalendarData(currentBsYear);
        setCalendarData(data);
        console.log('[OneSignalNotifier] Loaded calendar data for:', currentBsYear);

        // Attempt to load next year's data as well for year-end checks
        try {
            const nextYearData = await getStaticCalendarData(currentBsYear + 1);
            // Merge or store separately if needed, for now just log
            console.log('[OneSignalNotifier] Also loaded next year data for:', currentBsYear + 1);
            // Simple merge (potential overwrite if keys clash, unlikely for month numbers)
            setCalendarData(prevData => ({...prevData, ...(nextYearData || {})}));
        } catch (nextYearError) {
            console.warn(`[OneSignalNotifier] Could not load next year (${currentBsYear + 1}) data:`, nextYearError.message);
        }

      } catch (err) {
        console.error('[OneSignalNotifier] Error loading calendar data:', err);
        setError('Could not load calendar data for notifications.');
      }
    };
    loadData();
  }, []);

  // 2. Check Holidays and Trigger Notifications (runs when calendarData is loaded)
  useEffect(() => {
    if (!calendarData || error) {
      console.log('[OneSignalNotifier] Skipping notification check (no data or error).');
      return;
    }

    console.log('[OneSignalNotifier] Running holiday check...');
    const now = new Date();

    for (let dayOffset = 0; dayOffset < NOTIFICATION_CHECK_DAYS_AHEAD; dayOffset++) {
      const checkDate = new Date(now);
      checkDate.setDate(now.getDate() + dayOffset);
      const checkDateStr = checkDate.toISOString().slice(0, 10); // YYYY-MM-DD

      let dayData = null;
      try {
        const nepaliVersion = new NepaliDate(checkDate);
        const bsYear = nepaliVersion.getYear();
        const bsMonthIndex = nepaliVersion.getMonth();
        const bsDate = nepaliVersion.getDate();

        // Find month key (e.g., "01", "10") - requires month mapping
        // We need NEPALI_MONTHS and the mapping from api.js
        const NEPALI_MONTHS_INTERNAL = [
            'baishakh', 'jestha', 'ashadh', 'shrawan',
            'bhadra', 'ashwin', 'kartik', 'mangsir',
            'poush', 'magh', 'falgun', 'chaitra'
        ];
        const monthNameToKeyMapping = {
            baishakh: "01", jestha: "02", ashadh: "03", shrawan: "04",
            bhadra: "05", ashwin: "06", kartik: "07", mangsir: "08",
            poush: "09", magh: "10", falgun: "11", chaitra: "12",
        };
        const bsMonthName = NEPALI_MONTHS_INTERNAL[bsMonthIndex]; // baishakh, etc.
        const monthKey = monthNameToKeyMapping[bsMonthName]; // "01", etc.
        
        // Access data: calendarData -> yearData (already handled by loading) -> monthData -> dayData
        const monthData = calendarData[monthKey]; // Get the array for the specific month

        if (Array.isArray(monthData)) {
            // Find the day within the month array using the AD date string
            // Ensure day.ad exists and matches checkDateStr
            dayData = monthData.find(d => d && d.ad === checkDateStr);
        }
         if (!dayData) {
            // console.warn(`[OneSignalNotifier] Day data not found for ${checkDateStr} (BS: ${bsYear}-${monthKey}-${bsDate})`);
         } 

      } catch (err) {
        console.error(`[OneSignalNotifier] Error processing date ${checkDateStr}:`, err);
        continue; // Skip to next day on error
      }

      if (!dayData) continue; // Skip if no data found for this day

      // --- 3. Identify Leave Day --- 
      const holidayCheck = isPublicHoliday(dayData);
      const saturdayCheck = isSaturday(dayData);

      if (holidayCheck.isHoliday || saturdayCheck) {
        // Prioritize holiday name, fallback to 'Sanibar' if Saturday only
        let eventName = holidayCheck.isHoliday ? dayData.events.find(event => event.jds?.gh === '1')?.jtl : 'Sanibar';
        if (!eventName) eventName = 'Holiday'; // Fallback if jtl missing

        const eventKeyBase = `${checkDateStr}_${eventName.replace(/\s+/g, '')}`;

        // --- 4. Calculate Target Times & Check Conditions --- 
        const holidayDate = new Date(checkDateStr + 'T00:00:00');

        // Target 1: 2 days before @ 8 PM
        const twoDaysBeforeTargetStart = new Date(holidayDate);
        twoDaysBeforeTargetStart.setDate(holidayDate.getDate() - 2);
        twoDaysBeforeTargetStart.setHours(NOTIFICATION_HOUR_2_DAYS_BEFORE, 0, 0, 0);

        // Target 2: 1 day before @ 10 AM
        const oneDayBeforeTargetStart = new Date(holidayDate);
        oneDayBeforeTargetStart.setDate(holidayDate.getDate() - 1);
        oneDayBeforeTargetStart.setHours(NOTIFICATION_HOUR_1_DAY_BEFORE, 0, 0, 0);
        
        // Target 3: Fallback on holiday day @ 10 AM
        const fallbackTargetStart = new Date(holidayDate);
        fallbackTargetStart.setHours(NOTIFICATION_HOUR_FALLBACK, 0, 0, 0);

        // --- 5. Send Notifications (using OneSignal.sendSelfNotification) --- 

        // Check Trigger 1 (2 days before)
        const trigger1Key = `${LOCAL_STORAGE_PREFIX}${eventKeyBase}_trigger1`;
        if (dayOffset === 2 && now >= twoDaysBeforeTargetStart) { // Check if it's the right day and time has passed
          if (!localStorage.getItem(trigger1Key)) {
            console.log(`[OneSignalNotifier] Condition MET for Trigger 1: ${eventName} (${checkDateStr})`);
            sendOneSignalNotification(
              'Upcoming Leave!',
              `Parsi ta '${eventName}' ko xutti, party hanna jaam baby!!`,
              trigger1Key
            );
          }
        }

        // Check Trigger 2 (1 day before)
        const trigger2Key = `${LOCAL_STORAGE_PREFIX}${eventKeyBase}_trigger2`;
        if (dayOffset === 1 && now >= oneDayBeforeTargetStart) { // Check day and time
           if (!localStorage.getItem(trigger2Key)) {
              console.log(`[OneSignalNotifier] Condition MET for Trigger 2: ${eventName} (${checkDateStr})`);
              sendOneSignalNotification(
                'Leave Tomorrow!',
                `Voli '${eventName}' ko xutti xa, moj gara`,
                trigger2Key
              );
           }
        }
        
        // Check Trigger 3 (Fallback on Holiday)
        const fallbackKey = `${LOCAL_STORAGE_PREFIX}${eventKeyBase}_fallback`;
        if (dayOffset === 0 && now >= fallbackTargetStart) { // Check day and time
            if (!localStorage.getItem(fallbackKey)) {
                console.log(`[OneSignalNotifier] Condition MET for Fallback: ${eventName} (${checkDateStr})`);
                sendOneSignalNotification(
                  'Happy Leave Day!',
                  `Babyy '${eventName}' ko xutti, have fun!!`,
                  fallbackKey
                );
            }
        }
      } // end if holiday/saturday
    } // end for loop (dayOffset)

  }, [calendarData, error]); // Rerun check when data loads

  // Helper to send notification via OneSignal and mark as sent
  const sendOneSignalNotification = (title, body, storageKey) => {
    // Ensure OneSignal is ready
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push(async function(OneSignal) {
        try {
            // Check permission (optional, OneSignal handles prompting)
            // const permission = await OneSignal.getNotificationPermission();
            // if (permission !== 'granted') {
            //     console.log('[OneSignalNotifier] Permission not granted, cannot send self-notification.');
            //     return;
            // }

            console.log(`[OneSignalNotifier] Sending: ${title} - ${body}`);
            await OneSignal.sendSelfNotification(
                /* Title */ title,
                /* Message */ body,
                /* URL to open, optional */ window.location.href, 
                /* Icon, optional */ '/icons/icon-192x192.png',
                {
                    // Optional data
                },
                // {
                //     // Optional buttons
                // }
            );
            console.log('[OneSignalNotifier] Self-notification sent successfully.');
             // Mark as sent in localStorage only AFTER successful sending attempt
             localStorage.setItem(storageKey, 'true');
        } catch (err) {
            console.error('[OneSignalNotifier] Error sending OneSignal self-notification:', err);
        }
    });
  };

  // This component doesn't render anything visual
  return null; 
};

export default OneSignalHolidayNotifier; 