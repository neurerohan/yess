import React, { useState, useEffect, useCallback } from 'react';
const InstallPwaPrompt = () => {
  // State to hold the deferred install prompt event
  const [installPromptEvent, setInstallPromptEvent] = useState(null);
  // State to control the visibility of the custom popup
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  // State to track if the prompt is currently in the cool-down period
  const [isCoolingDown, setIsCoolingDown] = useState(false);
  // State for the image carousel
  const [currentSlide, setCurrentSlide] = useState(0);

  // --- Configuration ---
  const POPUP_DELAY_MS = 5 * 60 * 1000; // 5 minutes
  const COOL_DOWN_PERIOD_MS = 3 * 7 * 24 * 60 * 60 * 1000; // 3 weeks
  const LOCAL_STORAGE_KEY = 'pwaInstallDismissedTimestamp';
  const carouselImages = [
    '/kalimatirate-app-download.png',
    '/kalimatirate-app-download-1.png',
    '/kalimatirate-app-download-2.png',
    '/kalimatirate-app-download-3.png',
  ];

  // --- Requirement 2: Installability Detection & Defer Prompt ---
  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      // Prevent the default browser install prompt
      event.preventDefault();
      // Store the event so it can be triggered later
      console.log("'beforeinstallprompt' event captured.");
      setInstallPromptEvent(event);
    };

    // Add the event listener
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // --- Requirement 6 & 9: Cool-Down Check ---
  useEffect(() => {
    try {
      const dismissedTimestamp = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (dismissedTimestamp) {
        const dismissedTime = parseInt(dismissedTimestamp, 10);
        const currentTime = Date.now();
        // Check if the cool-down period (3 weeks) is still active
        if (currentTime - dismissedTime < COOL_DOWN_PERIOD_MS) {
          console.log('PWA install prompt is in cool-down period.');
          setIsCoolingDown(true);
        } else {
          // Cool-down expired, remove the old timestamp
          console.log('PWA install cool-down period expired.');
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
      }
    } catch (error) {
      // Requirement 10: Error Handling for localStorage
      console.error('Could not access localStorage for cool-down check:', error);
      // Allow the prompt to potentially show if localStorage fails
      setIsCoolingDown(false);
    }
  }, []);

  // --- Requirement 1: Delayed Popup Trigger ---
  useEffect(() => {
    // Only set the timer if the prompt event is available AND not cooling down
    if (installPromptEvent && !isCoolingDown) {
      const timerId = setTimeout(() => {
        console.log('Popup delay finished. Showing install prompt.');
        setIsPopupVisible(true);
      }, POPUP_DELAY_MS);

      // Cleanup the timer if the component unmounts or dependencies change
      return () => clearTimeout(timerId);
    } else {
      console.log('Popup trigger conditions not met (no prompt event or cooling down).');
    }
    // Re-run this effect if the prompt event becomes available or cool-down status changes
  }, [installPromptEvent, isCoolingDown]);

  // --- Requirement 7: Handle "Install Now" Action ---
  const handleInstallClick = async () => {
    if (!installPromptEvent) {
      console.error('Install prompt event not available.');
      return;
    }

    // Show the browser's install prompt
    installPromptEvent.prompt();

    try {
      // Wait for the user to respond to the prompt
      const { outcome } = await installPromptEvent.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);

      // Handle the outcome (e.g., log analytics)
      if (outcome === 'accepted') {
        console.log('PWA installation accepted.');
        // Optionally: Clear the cool-down immediately if installed
        try {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
        } catch (error) {
            console.error('Could not remove cool-down timestamp after install:', error);
        }
      } else {
        console.log('PWA installation dismissed by user.');
        // Set cool-down if dismissed via the native prompt *here*?
        // Decision: Only set cool-down on "Maybe Later" button click for clarity.
      }
    } catch (error) {
      console.error('Error during PWA install prompt:', error);
    } finally {
      // Hide the custom popup regardless of outcome
      setIsPopupVisible(false);
      // Clear the stored prompt event (it can only be used once)
      setInstallPromptEvent(null);
    }
  };

  // --- Requirement 8 & 9: Handle "Maybe Later" (Dismissal) ---
  const handleDismissClick = () => {
    console.log('Custom PWA install prompt dismissed.');
    setIsPopupVisible(false);
    // Set the cool-down timestamp in localStorage
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, Date.now().toString());
      setIsCoolingDown(true); // Update state immediately
    } catch (error) {
      // Requirement 10: Error Handling for localStorage
      console.error('Could not set dismiss timestamp in localStorage:', error);
    }
  };

  // --- Requirement 5: Carousel Navigation ---
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? carouselImages.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Render nothing if the popup shouldn't be visible
  if (!isPopupVisible) {
    return null;
  }

  // --- Requirement 5: Render the Popup with Carousel ---
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity duration-300"
      aria-modal="true"
      role="dialog"
      aria-labelledby="pwa-install-title"
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all duration-300 scale-100">
        {/* Carousel Section */}
        <div className="relative w-full aspect-video overflow-hidden bg-gray-100">
          {/* Carousel Images */}
          {carouselImages.map((src, index) => (
            <div
              key={src}
              className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={src}
                alt={`PWA Install Step ${index + 1}`}
                className="w-full h-full object-contain" // Use object-contain to show full image
              />
            </div>
          ))}

          {/* Carousel Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1"
            aria-label="Previous Slide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1"
            aria-label="Next Slide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </button>

          {/* Carousel Pagination Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
            {carouselImages.map((_, index) => (
              <button
                key={`dot-${index}`}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-white w-4' : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 text-center">
          <h2 id="pwa-install-title" className="text-xl font-semibold text-gray-800 mb-2">
            Install KalimatiRate App?
          </h2>
          <p className="text-gray-600 mb-6 text-sm">
            Get quick access to Nepali Calendar, Kalimati Rates, and Date Converter directly from your home screen. Follow the steps above!
          </p>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleDismissClick}
              className="flex-1 bg-gray-100 text-gray-700 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1"
            >
              Maybe Later
            </button>
            <button
              onClick={handleInstallClick}
              className="flex-1 bg-green-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
            >
              Install Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallPwaPrompt; 