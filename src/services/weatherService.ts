
const API_KEY = 'demo-key'; // User will need to replace this with their OpenWeatherMap API key

export const searchCityCoordinates = async (cityName: string): Promise<{ lat: number; lon: number; name: string; country: string }> => {
  const response = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${API_KEY}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to search city');
  }
  
  const data = await response.json();
  
  if (data.length === 0) {
    throw new Error('City not found');
  }
  
  return {
    lat: data[0].lat,
    lon: data[0].lon,
    name: data[0].name,
    country: data[0].country
  };
};

export const getCurrentWeather = async (lat: number, lon: number) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  );
  
  if (!response.ok) {
    throw new Error('Failed to get current weather');
  }
  
  return response.json();
};

export const getHourlyForecast = async (lat: number, lon: number) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  );
  
  if (!response.ok) {
    throw new Error('Failed to get hourly forecast');
  }
  
  return response.json();
};
