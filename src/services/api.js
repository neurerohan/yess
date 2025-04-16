import axios from 'axios';

const API_BASE_URL = 'https://api.kalimatirate.nyure.com.np/api/vegetables';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = {
      message: 'Something went wrong. Please try again later.',
      status: error.response?.status || 500,
      data: error.response?.data || null
    };

    if (error.code === 'ECONNABORTED') {
      customError.message = 'Request timed out. Please check your internet connection.';
    } else if (error.response) {
      switch (error.response.status) {
        case 404:
          customError.message = 'Resource not found.';
          break;
        case 500:
          customError.message = 'Server error. Please try again later.';
          break;
        default:
          customError.message = error.response.data?.message || customError.message;
      }
    } else if (error.request) {
      customError.message = 'Network error. Please check your internet connection.';
    }

    return Promise.reject(customError);
  }
);

let cachedData = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// API endpoints
export const vegetableAPI = {
  getAll: async () => {
    const now = new Date().getTime();
    if (cachedData && cacheTimestamp && (now - cacheTimestamp < CACHE_DURATION)) {
      return cachedData;
    }

    try {
      const response = await apiClient.get('/');
      
      // Validate response data
      if (!response.data || !Array.isArray(response.data.results)) {
        throw new Error('Invalid data format received from API');
      }
      
      // Format and validate each vegetable entry
      const formattedData = response.data.results.map(vegetable => ({
        id: vegetable.id,
        name_nepali: vegetable.name_nepali || 'Unknown',
        unit: vegetable.unit || 'N/A',
        min_price: parseFloat(vegetable.min_price) || 0,
        max_price: parseFloat(vegetable.max_price) || 0,
        avg_price: parseFloat(vegetable.avg_price) || 0
      }));

      cachedData = formattedData;
      cacheTimestamp = now;

      return formattedData;
    } catch (error) {
      throw error;
    }
  }
};

export default apiClient;