import { useState, useEffect, useCallback } from 'react';

// --- Configuration ---
const MORNING_START_HOUR = 6; // 6 AM
const MORNING_END_HOUR = 10; // Up to 9:59 AM
const AFTERNOON_START_HOUR = 12; // 12 PM
const AFTERNOON_END_HOUR = 16; // Up to 3:59 PM
const NIGHT_START_HOUR = 18; // 6 PM
const NIGHT_END_HOUR = 23; // Up to 10:59 PM

const POPUP_DATA = {
  morning: {
    texts: [
      "Babyy utha utha bihana vo",
      "Mero kuchupuchu babyy utha na kkk",
      "Babyy utha na kkk😭, else jau breakup!!",
      "Mero babyy kasto kumbhakaran kk",
      "Hyaa aalu babyy utha, ani wish me gm🌅"
    ],
    buttonText: "hehe okiee bbg",
    image: "morning.png"
  },
  afternoon: {
    texts: [
      "Babyy alxi lagyo yr",
      "Babyy khaja khayeu?? kasto busy ho k",
      "Babyy bhokkk lagyo huhu😭",
      "Yrr I'm missing you, be in my arms already",
      "jau busy huni guiye, nabola ma sanga",
      "Babe break vo ho?? khaja khau jau"
    ],
    buttonText: "hehe okiee bbg",
    image: "day.png"
  },
  night: {
    texts: [
      "Babyy goodnight, Iloveeeeyoualot😭",
      "Babyy goodnight, I loveeee you a lot😭",
      "La mero kuchupuchu bachha nunu gara",
      "Babyy aaja ko day kasto vayo??",
      "Babyy aaja ko day stressful ta vayena ni?",
      "Timilai thaxa I missed you whole day?"
    ],
    buttonText: "hehe okiee bbg",
    image: "night.png"
  }
};

const LOCAL_STORAGE_PREFIX = 'lastShown_time_popup_';

// --- Helper Functions ---
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getTodayDateString = () => new Date().toISOString().slice(0, 10); // YYYY-MM-DD

// --- Hook Logic ---
const useTimeBasedPopup = () => {
  const [popupConfig, setPopupConfig] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const checkTimeAndTriggerPopup = useCallback(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const todayStr = getTodayDateString();
    
    let currentPeriod = null; // 'morning', 'afternoon', 'night'

    if (currentHour >= MORNING_START_HOUR && currentHour < MORNING_END_HOUR) {
      currentPeriod = 'morning';
    } else if (currentHour >= AFTERNOON_START_HOUR && currentHour < AFTERNOON_END_HOUR) {
      currentPeriod = 'afternoon';
    } else if (currentHour >= NIGHT_START_HOUR && currentHour < NIGHT_END_HOUR) {
      currentPeriod = 'night';
    }

    if (currentPeriod) {
      const storageKey = `${LOCAL_STORAGE_PREFIX}${currentPeriod}`;
      try {
        const lastShownDate = localStorage.getItem(storageKey);
        if (lastShownDate !== todayStr) {
          // Not shown today for this period
          console.log(`Time condition met for: ${currentPeriod}. Triggering popup.`);
          const periodData = POPUP_DATA[currentPeriod];
          setPopupConfig({
            text: getRandomItem(periodData.texts),
            image: periodData.image,
            buttonText: periodData.buttonText,
          });
          setIsVisible(true);
          // Mark as shown for today
          localStorage.setItem(storageKey, todayStr);
        } else {
          // console.log(`Popup for ${currentPeriod} already shown today (${todayStr}).`);
        }
      } catch (error) {
        console.error('Error accessing localStorage:', error);
        // Decide if you want to show the popup even if localStorage fails
      }
    } else {
       // console.log('Current time is outside defined popup periods.');
    }
  }, []); // No dependencies needed as it reads current time each call

  // Effect to run the check on mount and when tab becomes visible
  useEffect(() => {
    checkTimeAndTriggerPopup(); // Check immediately on mount

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // console.log('Tab became visible, checking time...');
        checkTimeAndTriggerPopup();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup listener on unmount
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [checkTimeAndTriggerPopup]); // Dependency on the check function

  // Function to manually dismiss the popup
  const dismissPopup = useCallback(() => {
    setIsVisible(false);
    console.log('Time-based popup dismissed.');
  }, []);

  return { popupConfig, isVisible, dismissPopup };
};

export default useTimeBasedPopup; 