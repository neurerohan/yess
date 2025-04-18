import React, { useState, useEffect, useCallback } from 'react';

const CHECK_DELAY_MS = 240 * 1000; // 4 minutes
const LOW_BATTERY_THRESHOLD = 0.20; // 20%
const HIGH_BATTERY_THRESHOLD = 0.90; // 90%

const CuteBatteryPrompt = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [promptShown, setPromptShown] = useState(false);
  const [promptConfig, setPromptConfig] = useState(null);

  const checkBattery = useCallback(async () => {
    if (promptShown || !('getBattery' in navigator)) {
        console.log('Battery API not supported or prompt already shown.');
      return;
    }

    try {
      const battery = await navigator.getBattery();
      const level = battery.level;
      // Optional: We could also check battery.charging here if needed

      console.log(`Battery level: ${level * 100}%`);

      let config = null;
      if (level <= LOW_BATTERY_THRESHOLD) {
        config = {
          image: '/20perc.png',
          text: "Babyy battery's low, jau charge gara guiye",
          buttonText: "Okiee Babyy",
        };
      } else if (level > HIGH_BATTERY_THRESHOLD) {
        config = {
          image: '/90perc.png',
          text: "Babyy ko phone's fully charged ohoo ohoo",
          buttonText: "Hehe najiskau aalu",
        };
      }

      if (config) {
        setPromptConfig(config);
        setIsVisible(true);
      }
    } catch (error) {
      console.error('Error accessing battery status:', error);
    }
  }, [promptShown]);

  // Set timer on mount
  useEffect(() => {
    const timerId = setTimeout(checkBattery, CHECK_DELAY_MS);
    console.log(`Battery check scheduled in ${CHECK_DELAY_MS / 1000} seconds.`);

    // Cleanup timer on unmount
    return () => clearTimeout(timerId);
  }, [checkBattery]); // Re-run if checkBattery changes (due to promptShown dependency)

  const handleClose = () => {
    setIsVisible(false);
    setPromptShown(true); // Mark as shown for this session
    console.log('Cute battery prompt closed and marked as shown for the session.');
  };

  if (!isVisible || !promptConfig) {
    return null; // Don't render anything if not visible or no config
  }

  // Popup UI with Tailwind CSS and basic animations
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 ease-in-out"
      style={{ opacity: isVisible ? 1 : 0 }} // Controlled fade
      onClick={handleClose} // Close on backdrop click
      role="dialog"
      aria-modal="true"
      aria-labelledby="battery-prompt-text"
    >
      <div 
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-xs sm:max-w-sm p-6 text-center transform transition-all duration-300 ease-in-out"
        style={{ scale: isVisible ? 1 : 0.95, opacity: isVisible ? 1 : 0 }} // Scale/fade effect
        onClick={(e) => e.stopPropagation()} // Prevent closing on popup click
      >
        {/* Image */}
        <img 
          src={promptConfig.image} 
          alt="Cute battery indicator" 
          className="w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-5 object-contain" 
        />

        {/* Text */}
        <p id="battery-prompt-text" className="text-lg font-medium text-gray-700 mb-6 leading-snug">
          {promptConfig.text}
        </p>

        {/* Button */}
        <button 
          onClick={handleClose}
          className="w-full px-4 py-3 bg-pink-500 text-white text-base font-semibold rounded-lg shadow-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 transition-colors duration-200 ease-in-out transform hover:scale-105"
        >
          {promptConfig.buttonText}
        </button>
      </div>
    </div>
  );
};

export default CuteBatteryPrompt; 