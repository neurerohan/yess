import React from 'react';

const TimeBasedPopup = ({ config, onClose }) => {
  if (!config) {
    return null;
  }

  const { image, text, buttonText } = config;
  const imagePath = `/${image}`; // Assumes images are in public/ root

  return (
    <div 
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-md transition-opacity duration-300 ease-in-out animate-fade-in"
      onClick={onClose} // Close on backdrop click
      role="dialog"
      aria-modal="true"
      aria-labelledby="time-popup-text"
    >
      {/* Re-declare animations for self-containment */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fadeIn 0.3s ease-in-out forwards; }
        @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-scale-in { animation: scaleIn 0.3s ease-in-out forwards; }
      `}</style>
      
      <div 
        className="relative bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 rounded-2xl shadow-xl w-full max-w-xs sm:max-w-sm p-6 pt-8 text-center transform transition-all duration-300 ease-in-out animate-scale-in"
        onClick={(e) => e.stopPropagation()} // Prevent closing on popup click
      >
        {/* Optional Close Button */}
        <button 
            onClick={onClose} 
            className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-700 bg-white/60 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-400"
            aria-label="Close time prompt"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>

        {/* Image */}
        <img 
          src={imagePath} 
          alt="Time of day illustration" 
          className="w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-5 object-contain drop-shadow-lg"
          onError={(e) => { e.target.style.display = 'none'; console.error(`Failed to load image: ${imagePath}`); }} // Hide if image fails
        />

        {/* Text */}
        <p id="time-popup-text" className="text-lg font-medium text-gray-800 mb-6 leading-relaxed px-1">
          {text} 
        </p>

        {/* Button */}
        <button 
          onClick={onClose}
          className="w-full px-4 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-base font-bold rounded-lg shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-100"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default TimeBasedPopup; 