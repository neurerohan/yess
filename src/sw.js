import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { BackgroundSyncPlugin } from 'workbox-background-sync';

// --- Service Worker State & Config ---
const SW_VERSION = 'v1.1'; // Increment this on significant SW changes
const IDB_NAME = 'holidayNotificationsDB';
const IDB_VERSION = 1;
const IDB_STORE_NAME = 'notifiedEvents';
// Constants for notification logic
const DAYS_TO_CHECK_AHEAD = 3; 
const NOTIFICATION_HOUR_2_DAYS_BEFORE = 20; // 8 PM
const NOTIFICATION_HOUR_1_DAY_BEFORE = 10; // 10 AM

// --- IndexedDB Helper Functions ---
/** Opens IndexedDB */
const openDB = () => {
  // Check if IndexedDB is supported
  if (!self.indexedDB) {
      console.warn('SW: IndexedDB not supported by this browser.');
      return Promise.reject('IndexedDB not supported');
  }
  return new Promise((resolve, reject) => {
    const request = self.indexedDB.open(IDB_NAME, IDB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(IDB_STORE_NAME)) {
        db.createObjectStore(IDB_STORE_NAME, { keyPath: 'id' });
        console.log('IndexedDB object store created:', IDB_STORE_NAME);
      }
    };
    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject('IndexedDB error: ' + event.target.errorCode);
  });
};

/** Checks if an event notification was sent */
const hasBeenNotifiedDB = async (eventId) => {
  try {
    const db = await openDB();
    const transaction = db.transaction(IDB_STORE_NAME, 'readonly');
    const store = transaction.objectStore(IDB_STORE_NAME);
    const request = store.get(eventId);
    return new Promise((resolve, reject) => {
      request.onsuccess = (event) => {
        resolve(!!event.target.result); // Resolve true if record exists
      };
      request.onerror = (event) => {
        console.error('IndexedDB get error:', event.target.errorCode);
        resolve(false); // Assume not notified on error
      };
    });
  } catch (error) {
    console.error('Error accessing IndexedDB in hasBeenNotifiedDB:', error);
    return false; // Assume not notified on error
  }
};

/** Marks an event notification as sent */
const markAsNotifiedDB = async (eventId) => {
  try {
    const db = await openDB();
    const transaction = db.transaction(IDB_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(IDB_STORE_NAME);
    store.put({ id: eventId, timestamp: Date.now() });
    console.log('Marked as notified in IndexedDB:', eventId);
    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = (event) => {
             console.error('IndexedDB put error:', event.target.errorCode);
             reject(event.target.error);
        }
    });
  } catch (error) {
    console.error('Error accessing IndexedDB in markAsNotifiedDB:', error);
  }
};

// --- Calendar Data & Holiday Logic (within SW) ---

// Basic holiday check (adapt if needed based on actual data structure)
const isPublicHolidaySW = (day) => {
  if (!day || !Array.isArray(day.events) || day.events.length === 0) {
    return { isHoliday: false, eventName: null };
  }
  // Use the logic from CalendarGrid.jsx
  const holidayEvent = day.events.find(event => event.jds?.gh === '1');
  return {
    isHoliday: !!holidayEvent,
    eventName: holidayEvent ? holidayEvent.name : null,
  };
};

const isSaturdaySW = (day) => day?.week_day === 6; // Assuming 1=Mon, ..., 6=Sat, 7=Sun

/** 
 * Fetches precached calendar data JSON for a specific BS year.
 * Includes a fallback mechanism for the previous year near year change.
 */
const getCalendarDataFromCache = async (bsYear) => {
  const url = `/src/data/${bsYear}-calendar.json`; // Path relative to the project root
  console.log(`SW: Trying to fetch precached calendar data from: ${url}`);
  try {
    // Fetch from the cache (or network if not precached, though it should be)
    const response = await caches.match(url);
    if (response && response.ok) { // Check if response is valid
      const data = await response.json();
      console.log(`SW: Successfully loaded calendar data for ${bsYear} from cache.`);
      return data; // This should be the object like { "01": [...days...], "02": [...days...] }
    }
    throw new Error(`Calendar data for ${bsYear} not found in cache.`);
  } catch (error) {
    console.warn(`SW: Could not load primary calendar data for ${bsYear} from cache:`, error);
    // Fallback: Try fetching the previous year's data if primary fails (useful near year change)
    const prevYear = bsYear - 1;
    const fallbackUrl = `/src/data/${prevYear}-calendar.json`;
    console.log(`SW: Attempting fallback fetch for previous year: ${fallbackUrl}`);
    try {
        const fallbackResponse = await caches.match(fallbackUrl);
        if (fallbackResponse && fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            console.log(`SW: Successfully loaded fallback calendar data for ${prevYear} from cache.`);
            return fallbackData; // Return previous year's data
        }
        console.error(`SW: Fallback calendar data for ${prevYear} also not found in cache.`);
        return null;
    } catch (fallbackError) {
         console.error(`SW: Error loading fallback calendar data for ${prevYear} from cache:`, fallbackError);
         return null;
    }
  }
};

// Helper to safely parse AD date string from calendar data
const parseAdDate = (adDateStr) => {
  if (!adDateStr || typeof adDateStr !== 'string') return null;
  try {
    // Assume YYYY-MM-DD format. Append time to ensure local timezone.
    return new Date(adDateStr + 'T00:00:00');
  } catch (e) {
    console.error(`SW: Error parsing AD date string: ${adDateStr}`, e);
    return null;
  }
};

// --- Notification Scheduling Logic (within SW) ---

const checkAndNotifyUpcomingHolidays = async () => {
  console.log('SW: Running checkAndNotifyUpcomingHolidays...');
  const permission = await self.navigator.permissions.query({ name: 'notifications' });
  if (permission.state !== 'granted') {
    console.log('SW: Notification permission not granted. Skipping check.');
    return;
  }

  const now = new Date();
  // --- Determine current BS year (approximation, consider edge cases near year change) ---
  // This is a rough estimate. For accuracy near year-end/start, a proper library or API is better.
  const estimatedBsYear = now.getFullYear() + 57; 
  // Fetch data for the estimated BS year from cache
  const yearData = await getCalendarDataFromCache(estimatedBsYear);

  if (!yearData) {
    console.error('SW: Cannot check holidays, failed to get calendar data.');
    return;
  }

  for (let i = 0; i < DAYS_TO_CHECK_AHEAD; i++) {
    const checkDate = new Date();
    checkDate.setDate(now.getDate() + i);
    checkDate.setHours(0, 0, 0, 0); // Normalize checkDate to start of day
    const checkDateStr = checkDate.toISOString().slice(0, 10);

    // --- Find matching day data by iterating (simplified approach) ---
    let dayData = null;
    // Use try-catch for safety in case yearData format is unexpected
    try {
      for (const monthKey in yearData) {
        const monthDays = yearData[monthKey]; // Should be an array of day objects
        if(Array.isArray(monthDays)) {
            // Find the day where the AD date matches checkDateStr
            dayData = monthDays.find(d => d.ad === checkDateStr);
            if (dayData) {
                break; // Found the day, exit month loop
            }
        }
      }
    } catch (parseError) {
      console.error('SW: Error iterating through calendar data structure:', parseError);
      continue; // Skip to next day if current year data parsing fails
    }
    // --- End day data finding ---

    if (dayData) {
      const holidayCheck = isPublicHolidaySW(dayData);

      if (holidayCheck.isHoliday) {
        const eventName = holidayCheck.eventName || 'Holiday';
        const eventId = `${checkDateStr}_${eventName}`;

        const notified = await hasBeenNotifiedDB(eventId);
        if (notified) {
          // console.log(`SW: Already notified for ${eventId}. Skipping.`);
          continue;
        }

        // Calculate target times relative to the *holiday date* (checkDate)
        // Use normalized checkDate (which is already start of day)
        const holidayDate = checkDate; 
        const twoDaysBeforeTarget = new Date(holidayDate);
        twoDaysBeforeTarget.setDate(holidayDate.getDate() - 2);
        twoDaysBeforeTarget.setHours(NOTIFICATION_HOUR_2_DAYS_BEFORE, 0, 0, 0);

        const oneDayBeforeTarget = new Date(holidayDate);
        oneDayBeforeTarget.setDate(holidayDate.getDate() - 1);
        oneDayBeforeTarget.setHours(NOTIFICATION_HOUR_1_DAY_BEFORE, 0, 0, 0);

        let notificationTitle = '';
        let notificationBody = '';
        let shouldNotifyNow = false;

        // Check conditions based on *CURRENT TIME* (now)
        // Is it currently the time slot for the 2-days-before notification?
        if (now >= twoDaysBeforeTarget && now < oneDayBeforeTarget && i === 2) { 
            // Only trigger if today is exactly 2 days before
            console.log(`SW: Condition met for '2 days before' notification for ${eventName}`);
            notificationTitle = 'Upcoming Leave!';
            notificationBody = `Parsi ta '${eventName}' ko xutti, party hanna jaam baby!!`;
            shouldNotifyNow = true;
        }
        // Is it currently the time slot for the 1-day-before notification?
        else if (now >= oneDayBeforeTarget && now < holidayDate && i === 1) { 
            // Only trigger if today is exactly 1 day before 
            // Ensure we haven't passed midnight of the holiday itself
            console.log(`SW: Condition met for '1 day before' notification for ${eventName}. Now: ${now.toISOString()}, Target Start: ${oneDayBeforeTarget.toISOString()}, Target End: ${holidayDate.toISOString()}`);
            notificationTitle = 'Leave Tomorrow!';
            notificationBody = `Voli '${eventName}' ko xutti xa, moj gara`;
            shouldNotifyNow = true;
        }
        // Is it the fallback condition (holiday today, missed 10 AM deadline)?
        // Check if today IS the holiday (i === 0) AND the 10 AM deadline from yesterday has passed
        else if (i === 0 && now >= oneDayBeforeTarget) { 
            console.log(`SW: Condition met for 'Fallback (Today)' notification for ${eventName}. Now: ${now.toISOString()}, 10AM Deadline Passed: ${oneDayBeforeTarget.toISOString()}`);
            notificationTitle = 'Happy Leave Day!';
            notificationBody = `Babyy '${eventName}' ko xutti, have fun!!`;
            shouldNotifyNow = true;
        }

        if (shouldNotifyNow) {
          console.log(`SW: Showing notification for ${eventId}`);
          try {
            await self.registration.showNotification(notificationTitle, {
              body: notificationBody,
              icon: '/icons/icon-192x192.png', // Ensure icon exists
              tag: eventId, // Use unique tag to prevent duplicates if check runs quickly
            });
            await markAsNotifiedDB(eventId); // Mark as notified only after successful show
          } catch (err) {
             console.error(`SW: Error showing notification for ${eventId}:`, err);
          }
        }
      }
    }
  }
  console.log('SW: Finished checkAndNotifyUpcomingHolidays.');
};

// --- Service Worker Lifecycle Events ---
self.addEventListener('install', (event) => {
  console.log('SW Install event', SW_VERSION);
  // Optional: Force immediate activation of new SW
  // event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  console.log('SW Activate event', SW_VERSION);
  // Claim clients immediately allows the new SW to control open pages faster
  event.waitUntil(self.clients.claim());
  // *** Run the holiday check when the service worker activates ***
  event.waitUntil(checkAndNotifyUpcomingHolidays());
});

// --- Fetch Event (Handles Caching Strategies) ---
// NOTE: Workbox caching strategies are defined below this point
// using registerRoute, as in the original file.

// --- Precache the App Shell ---
// This line injects the list of files generated by Vite build to be precached.
// 'self.__WB_MANIFEST' is a placeholder that vite-plugin-pwa replaces.
precacheAndRoute(self.__WB_MANIFEST);

// --- Cleanup Old Caches ---
// Remove outdated precached assets during activation
cleanupOutdatedCaches();

// --- Runtime Caching Strategies ---

// 1. Cache First for Static Assets (Fonts, Images)
registerRoute(
  ({ request }) => request.destination === 'font' || request.destination === 'image',
  new CacheFirst({
    cacheName: 'static-assets-cache',
    plugins: [
      // Ensure only valid responses are cached (status 0 for opaque responses, 200 for normal)
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      // Set expiration for cached assets (e.g., 30 days)
      new ExpirationPlugin({
        maxEntries: 60, // Max number of entries in this cache
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  })
);

// 2. Network First for API Calls (e.g., Kalimati Prices)
// Tries network first, uses cache if offline.
// NOTE: The /api/ route rule might be removed if no other APIs are used.
// Keep it if other parts of the app fetch from /api/ endpoints.
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'), 
  new NetworkFirst({
    cacheName: 'api-cache',
    networkTimeoutSeconds: 10, // How long to wait for network before falling back to cache
    plugins: [
      // Ensure only valid responses are cached
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      // Set expiration for cached API responses (e.g., 1 day)
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 1 * 24 * 60 * 60, // 1 Day
      }),
      // Use the Background Sync plugin to retry failed requests
      new BackgroundSyncPlugin('api-retry-queue', { // Define plugin inline
           maxRetentionTime: 24 * 60 
      }),
    ],
  })
);

// --- Basic Navigation Handling (Optional but Recommended) ---
// This helps ensure that navigation requests (e.g., for HTML pages)
// are handled correctly, especially in offline scenarios.
// You might adjust this based on your app's structure.
/*
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'navigation-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [200],
      }),
    ],
  })
);
*/

// Optional: Add skipWaiting and clientsClaim for faster updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// You might need clientsClaim if you want the updated service worker
// to take control of existing pages immediately.
// self.clients.claim(); 