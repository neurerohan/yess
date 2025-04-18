import { useState, useEffect, useCallback } from 'react';

// --- Configuration ---
const WEATHER_API_KEY = 'https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&daily=weather_code,rain_sum&hourly=temperature_2m,wind_speed_180m,temperature_180m,weather_code,rain,precipitation,apparent_temperature&forecast_days=1'; // <<< IMPORTANT: Replace with your actual key
const CHECK_ON_MOUNT = true; // Check weather immediately when the hook is used
const FALLBACK_CITY = 'Kathmandu';

// --- Weather Conditions Data ---
const weatherConditions = {
  rain: {
    keywords: ["rain", "drizzle", "showers"],
    overlayTexts: [
      "Babyy mastt paani paryo, masala chiya ra pakauda kham na",
      "Babyy paani ma rujhna jani haina ni feri",
      "wanna dance in rain w you darlin",
      "This rain makes me miss you more"
    ],
    buttonText: "Im blushing hehe 🤭",
    image: "rain.png"
  },
  heat: {
    keywords: ["sunny", "clear", "hot"],
    overlayTexts: [
      "Babyy hyaa kasto garmi k haiiii",
      "baby duita gham laagey jasto garmi haii",
      "baby bahira naniskeu tanned hunxau",
      "Sunscreen lagau aalu, bahira gham xa",
      "Umbrella liyera jau aalu, bahira gham xa"
    ],
    buttonText: "Huss BadaMaharani Sahiba",
    image: "heat.png"
  },
  cold: {
    keywords: ["cold", "freezing", "snow", "ice", "fog"],
    overlayTexts: [
      "Babyy hyaa kasto chiso k haiii",
      "baby Santa ley fridge khullei xodeko jasto chiso haii",
      "baby bahira naniskeu rugha khoki lagxa",
      "Nyano lugha lagau aalu, birami parxa natra",
      'Just like your other sidechicks said "tato paani khau"'
    ],
    buttonText: "Huss BadaMaharani Sahiba",
    image: "cold.png"
  },
  wind: {
    keywords: ["wind", "breeze", "gale"],
    overlayTexts: [
      "Babyy hawa ley udaula timilai ni feri tya",
      "Babyy bessari hawa lageko xa, bahira najau",
      "Kasto dar lagdo hawa chaleko, i was worried for you"
    ],
    buttonText: "Huss BadaMaharani Sahiba",
    image: "wind.png"
  }
};

// --- Helper Functions ---
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const fetchWeatherData = async (query) => {
  if (!WEATHER_API_KEY || WEATHER_API_KEY === 'YOUR_WEATHERAPI_COM_KEY') {
    console.warn('WeatherAPI key not set in useWeatherPopup.js');
    return null;
  }
  const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${query}&aqi=no`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`WeatherAPI error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    console.log(`Weather data fetched for query '${query}':`, data);
    return data;
  } catch (error) {
    console.error(`Failed to fetch weather data for query '${query}':`, error);
    return null;
  }
};

const getConditionConfig = (weatherData) => {
    if (!weatherData?.current?.condition?.text) {
        return null;
    }
    const conditionText = weatherData.current.condition.text.toLowerCase();

    for (const conditionKey in weatherConditions) {
        const condition = weatherConditions[conditionKey];
        if (condition.keywords.some(keyword => conditionText.includes(keyword))) {
            console.log(`Matched weather condition: ${conditionKey}`);
            return {
                ...condition, // Include keywords, texts etc.
                text: getRandomItem(condition.overlayTexts) // Pick one text randomly
            };
        }
    }
    console.log(`No matching weather category found for condition: "${conditionText}"`);
    return null;
};

// --- Hook Logic ---
const useWeatherPopup = () => {
  const [popupConfig, setPopupConfig] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasChecked, setHasChecked] = useState(false); // Prevent multiple checks per session

  const attemptWeatherCheck = useCallback(async () => {
    if (hasChecked) return;
    setHasChecked(true);
    console.log('Attempting weather check...');

    let weatherData = null;

    // 1. Try Geolocation
    if ('geolocation' in navigator) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
        });
        const { latitude, longitude } = position.coords;
        console.log(`Geolocation success: Lat=${latitude}, Lon=${longitude}`);
        weatherData = await fetchWeatherData(`${latitude},${longitude}`);
      } catch (geoError) {
        console.warn('Geolocation failed or permission denied:', geoError.message);
        // Proceed to fallback city
      }
    } else {
      console.warn('Geolocation not supported by this browser.');
      // Proceed to fallback city
    }

    // 2. Fallback to City if Geolocation/API failed
    if (!weatherData) {
        console.log(`Fetching weather for fallback city: ${FALLBACK_CITY}`);
        weatherData = await fetchWeatherData(FALLBACK_CITY);
    }

    // 3. Determine Condition and Show Popup
    if (weatherData) {
        const conditionConfig = getConditionConfig(weatherData);
        if (conditionConfig) {
            setPopupConfig(conditionConfig);
            setIsVisible(true);
            console.log('Weather popup triggered.', conditionConfig);
        }
    }

  }, [hasChecked]); // Dependency ensures it runs only if hasChecked changes

  // Effect to run the check on mount if configured
  useEffect(() => {
    if (CHECK_ON_MOUNT) {
      attemptWeatherCheck();
    }
  }, [attemptWeatherCheck]); // Run when the check function is ready

  // Function to manually dismiss the popup
  const dismissPopup = useCallback(() => {
    setIsVisible(false);
    console.log('Weather popup dismissed.');
  }, []);

  return { popupConfig, isVisible, dismissPopup };
};

export default useWeatherPopup; 