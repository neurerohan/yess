import { useState, useEffect, useCallback } from 'react';

// --- Configuration ---
// No API Key needed for basic Open-Meteo
const CHECK_ON_MOUNT = true; // Check weather immediately when the hook is used
const FALLBACK_LAT = 27.7172; // Kathmandu Latitude
const FALLBACK_LON = 85.3240; // Kathmandu Longitude

// Temperature/Wind thresholds for category matching
const HEAT_THRESHOLD_C = 28;
const COLD_THRESHOLD_C = 10;
const WIND_THRESHOLD_KPH = 20; // Roughly 5.5 m/s

// --- Weather Conditions Data (Keep as is) ---
const weatherConditions = {
  rain: {
    keywords: ["rain", "drizzle", "showers"], // Keywords are now illustrative, logic uses WMO codes
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
    keywords: ["sunny", "clear", "hot"], // Illustrative
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
    keywords: ["cold", "freezing", "snow", "ice", "fog"], // Illustrative
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
    keywords: ["wind", "breeze", "gale"], // Illustrative
    overlayTexts: [
      "Babyy hawa ley udaula timilai ni feri tya",
      "Babyy bessari hawa lageko xa, bahira najau",
      "Kasto dar lagdo hawa chaleko, i was worried for you"
    ],
    buttonText: "Huss BadaMaharani Sahiba",
    image: "wind.png"
  }
};

// WMO Weather Code Mappings (Simplified Categories)
const WMO_RAIN_CODES = [51, 53, 55, 61, 63, 65, 80, 81, 82];
const WMO_COLD_CODES = [45, 48, 71, 73, 75, 77, 85, 86];
const WMO_HEAT_CODES = [0]; // Clear sky - will also check temperature

// --- Helper Functions ---
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Updated fetchWeatherData for Open-Meteo
const fetchWeatherData = async (latitude, longitude) => {
  // Construct the URL using provided base and parameters
  const params = `latitude=${latitude}&longitude=${longitude}&current=weather_code,temperature_2m,apparent_temperature,wind_speed_10m&hourly=weather_code&forecast_days=1&timezone=auto`;
  const apiUrl = `https://api.open-meteo.com/v1/forecast?${params}`;
  
  console.log(`Fetching Open-Meteo data: ${apiUrl}`);
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Open-Meteo API error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    console.log(`Weather data fetched for Lat=${latitude}, Lon=${longitude}:`, data);
    return data;
  } catch (error) {
    console.error(`Failed to fetch weather data for Lat=${latitude}, Lon=${longitude}:`, error);
    return null;
  }
};

// Updated getConditionConfig for Open-Meteo response
const getConditionConfig = (weatherData) => {
    // Use `current` data if available
    const current = weatherData?.current;
    if (!current || typeof current.weather_code === 'undefined') {
        console.log('Current weather data or weather_code missing.');
        return null;
    }

    const code = current.weather_code;
    const apparentTemp = current.apparent_temperature;
    const windSpeedMs = current.wind_speed_10m; // Wind speed at 10m in m/s
    const windSpeedKph = windSpeedMs * 3.6; // Convert m/s to km/h

    console.log(`Processing Weather: Code=${code}, ApparentTemp=${apparentTemp}°C, Wind=${windSpeedKph.toFixed(1)} kph`);

    let conditionKey = null;

    // Prioritize rain/cold codes, then check temp/wind
    if (WMO_RAIN_CODES.includes(code)) {
        conditionKey = 'rain';
    } else if (WMO_COLD_CODES.includes(code) || (apparentTemp !== null && apparentTemp <= COLD_THRESHOLD_C)) {
        conditionKey = 'cold';
    } else if (WMO_HEAT_CODES.includes(code) && (apparentTemp !== null && apparentTemp >= HEAT_THRESHOLD_C)) {
        conditionKey = 'heat';
    } else if (windSpeedKph >= WIND_THRESHOLD_KPH) {
         conditionKey = 'wind';
    }

    if (conditionKey) {
        console.log(`Matched weather condition: ${conditionKey}`);
        const condition = weatherConditions[conditionKey];
        return {
            ...condition, // Include keywords, texts etc. from original structure
            text: getRandomItem(condition.overlayTexts) // Pick one text randomly
        };
    } else {
        console.log(`No matching weather category found for Code=${code}, Temp=${apparentTemp}, Wind=${windSpeedKph.toFixed(1)}`);
        return null;
    }
};

// --- Hook Logic (mostly unchanged, uses updated helpers) ---
const useWeatherPopup = () => {
  const [popupConfig, setPopupConfig] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasChecked, setHasChecked] = useState(false); // Prevent multiple checks per session

  const attemptWeatherCheck = useCallback(async () => {
    if (hasChecked) return;
    setHasChecked(true);
    console.log('Attempting weather check...');

    let weatherData = null;
    let lat = FALLBACK_LAT;
    let lon = FALLBACK_LON;

    // 1. Try Geolocation
    if ('geolocation' in navigator) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
        });
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        console.log(`Geolocation success: Lat=${lat}, Lon=${lon}`);
      } catch (geoError) {
        console.warn('Geolocation failed or permission denied:', geoError.message, '. Using fallback coordinates.');
        // lat/lon remain fallback values
      }
    } else {
      console.warn('Geolocation not supported by this browser. Using fallback coordinates.');
      // lat/lon remain fallback values
    }

    // 2. Fetch Weather Data using coordinates
    weatherData = await fetchWeatherData(lat, lon);

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
      // Add a small delay before checking to allow other things to load
      const timerId = setTimeout(attemptWeatherCheck, 1500); 
      return () => clearTimeout(timerId);
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