import { useState, useEffect, useCallback } from 'react';

// --- Configuration ---
const WEATHER_API_KEY = 'b2d26873fc0a40e486f192332251804'; // <<< Set API key
const CHECK_ON_MOUNT = true; // Check weather immediately when the hook is used
const FALLBACK_CITY = 'Kathmandu'; // Fallback city name

// --- Weather Conditions Data (Keep as is) ---
const weatherConditions = {
  rain: {
    keywords: ["rain", "drizzle", "showers"],
    overlayTexts: [
      "Babyy mastt paani paryo, masala chiya ra pakauda kham na [Weather: Rain]",
      "Babyy paani ma rujhna jani haina ni feri tyaa [Weather: Rain]",
      "I wanna dance in rain w you darlin [Weather: Rain]",
      "This rain makes me miss you more [Weather: Rain]"
    ],
    buttonText: "Im blushing hehe 🤭",
    image: "rain.png"
  },
  heat: {
    keywords: ["sunny", "clear", "hot"],
    overlayTexts: [
      "Babyy hyaa kasto garmi k haii, take care of yours!! [Weather: Sunny]",
      "baby bahira naniskeu tanned hunxau [Weather: Sunny]",
      "Sunscreen lagau aalu, bahira gham xa [Weather: Sunny]",
      "Umbrella liyera jau aalu, bahira gham xa [Weather: Sunny]"
    ],
    buttonText: "Huss BadaMaharani Sahiba",
    image: "heat.png"
  },
  cold: {
    keywords: ["cold", "freezing", "snow", "ice", "fog", "mist", "overcast", "cloudy", "partly cloudy"],
    overlayTexts: [
      "Babyy hyaa kasto chiso k haii, nyano vayera basa! [Weather: Cold]",
      "Baby Santa ley fridge khulla nai xodeko jasto chiso haii, take care of yours!! [Weather: Cold]",
      "Baby bahira naniskeu rugha khoki lagxa [Weather: Cold]",
      "Nyano lugha lagau aalu, birami parxa natra [Weather: Cold]",
      'Just like your other sidechicks said "tato paani khau" [Weather: Cold]'
    ],
    buttonText: "Huss Okiee",
    image: "cold.png"
  },
  wind: {
    keywords: ["wind", "breeze", "gale"], // WeatherAPI usually includes wind in text
    overlayTexts: [
      "Babyy hawa ley udaula timilai ni feri tya",
      "Babyy bessari hawa lageko xa, bahira najau",
      "Kasto dar lagdo hawa chaleko, i was worried for you"
    ],
    buttonText: "Guffadi Aalu",
    image: "wind.png"
  }
};

// --- Helper Functions ---
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Reverted fetchWeatherData for WeatherAPI.com
const fetchWeatherData = async (query) => {
  if (!WEATHER_API_KEY) {
    console.error('WeatherAPI key is missing in useWeatherPopup.js');
    return null;
  }
  const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${query}&aqi=no`;
  
  console.log(`Fetching WeatherAPI.com data: ${apiUrl}`);
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({})); // Try getting error details
        console.error('WeatherAPI Error Response:', errorData);
      throw new Error(`WeatherAPI error: ${response.status} ${response.statusText} - ${errorData?.error?.message || 'Unknown API error'}`);
    }
    const data = await response.json();
    console.log(`Weather data fetched for query '${query}':`, data);
    return data;
  } catch (error) {
    console.error(`Failed to fetch weather data for query '${query}':`, error);
    return null;
  }
};

// Reverted getConditionConfig for WeatherAPI.com response (uses condition.text)
const getConditionConfig = (weatherData) => {
    if (!weatherData?.current?.condition?.text) {
        console.log('Current weather condition text missing from API response.');
        return null;
    }
    const conditionText = weatherData.current.condition.text.toLowerCase();
    console.log(`Processing WeatherAPI Condition Text: "${conditionText}"`);

    for (const conditionKey in weatherConditions) {
        const condition = weatherConditions[conditionKey];
        if (condition.keywords.some(keyword => conditionText.includes(keyword))) {
            console.log(`Matched weather condition: ${conditionKey}`);
            return {
                ...condition, 
                text: getRandomItem(condition.overlayTexts)
            };
        }
    }
    console.log(`No matching weather category found for condition: "${conditionText}"`);
    return null;
};

// --- Hook Logic (adapted for WeatherAPI query format) ---
const useWeatherPopup = () => {
  const [popupConfig, setPopupConfig] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasChecked, setHasChecked] = useState(false); // Prevent multiple checks per session

  const attemptWeatherCheck = useCallback(async () => {
    if (hasChecked) return;
    setHasChecked(true);
    console.log('Attempting weather check...');

    let weatherData = null;
    let query = FALLBACK_CITY;

    // 1. Try Geolocation
    if ('geolocation' in navigator) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
        });
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        query = `${lat},${lon}`; // Use lat,lon format for query
        console.log(`Geolocation success: Query="${query}"`);
      } catch (geoError) {
        console.warn('Geolocation failed or permission denied:', geoError.message, '. Using fallback city.');
        // query remains FALLBACK_CITY
      }
    } else {
      console.warn('Geolocation not supported by this browser. Using fallback city.');
      // query remains FALLBACK_CITY
    }

    // 2. Fetch Weather Data using the determined query
    weatherData = await fetchWeatherData(query);

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
      // Removed the slight delay
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