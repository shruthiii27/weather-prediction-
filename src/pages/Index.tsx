
import React, { useState } from 'react';
import WeatherSearch from '../components/WeatherSearch';
import CurrentWeather from '../components/CurrentWeather';
import HourlyForecast from '../components/HourlyForecast';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { WeatherData, ForecastData } from '../types/weather';
import { searchCityCoordinates, getCurrentWeather, getHourlyForecast } from '../services/weatherService';
import { useToast } from '../hooks/use-toast';

const Index = () => {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSearch = async (cityName: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Searching for city:', cityName);
      
      // Note: This will fail in demo mode - user needs their own API key
      if (cityName.toLowerCase() === 'demo') {
        // Mock data for demo purposes
        const mockWeatherData: WeatherData = {
          coord: { lat: 40.7128, lon: -74.0060 },
          weather: [{ id: 801, main: 'Clouds', description: 'few clouds', icon: '02d' }],
          base: 'stations',
          main: {
            temp: 22,
            feels_like: 24,
            temp_min: 18,
            temp_max: 26,
            pressure: 1013,
            humidity: 65
          },
          visibility: 10000,
          wind: { speed: 3.5, deg: 230 },
          clouds: { all: 20 },
          dt: Math.floor(Date.now() / 1000),
          sys: { type: 1, id: 1234, country: 'US', sunrise: 1640682000, sunset: 1640718000 },
          timezone: -18000,
          id: 5128581,
          name: 'New York',
          cod: 200
        };

        const mockForecastData: ForecastData = {
          cod: '200',
          message: 0,
          cnt: 40,
          list: Array.from({ length: 8 }, (_, i) => ({
            dt: Math.floor(Date.now() / 1000) + (i + 1) * 3600,
            main: {
              temp: 22 + Math.random() * 6 - 3,
              feels_like: 24 + Math.random() * 6 - 3,
              temp_min: 18,
              temp_max: 26,
              pressure: 1013,
              sea_level: 1013,
              grnd_level: 1013,
              humidity: 65 + Math.random() * 20 - 10,
              temp_kf: 0
            },
            weather: [{ id: 801, main: 'Clouds', description: 'few clouds', icon: '02d' }],
            clouds: { all: 20 },
            wind: { speed: 3.5, deg: 230, gust: 4.5 },
            visibility: 10000,
            pop: 0.1,
            sys: { pod: 'd' },
            dt_txt: new Date(Date.now() + (i + 1) * 3600000).toISOString()
          })),
          city: {
            id: 5128581,
            name: 'New York',
            coord: { lat: 40.7128, lon: -74.0060 },
            country: 'US',
            population: 8175133,
            timezone: -18000,
            sunrise: 1640682000,
            sunset: 1640718000
          }
        };

        setCurrentWeather(mockWeatherData);
        setForecastData(mockForecastData);
        toast({
          title: "Demo Mode",
          description: "Showing demo data for New York. Add your OpenWeatherMap API key for real data.",
        });
        return;
      }

      // Real API calls (will fail without proper API key)
      const coords = await searchCityCoordinates(cityName);
      console.log('Found coordinates:', coords);
      
      const [weather, forecast] = await Promise.all([
        getCurrentWeather(coords.lat, coords.lon),
        getHourlyForecast(coords.lat, coords.lon)
      ]);
      
      console.log('Weather data:', weather);
      console.log('Forecast data:', forecast);
      
      setCurrentWeather(weather);
      setForecastData(forecast);
      
      toast({
        title: "Weather Updated",
        description: `Showing weather for ${weather.name}, ${weather.sys.country}`,
      });
      
    } catch (err) {
      console.error('Weather search error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather data';
      
      if (errorMessage.includes('401') || errorMessage.includes('Invalid API key')) {
        setError('Please add your OpenWeatherMap API key to get real weather data. Type "demo" to see sample data.');
      } else {
        setError(errorMessage);
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Weather Dashboard
          </h1>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto">
            Get real-time weather conditions and hourly forecasts for any city worldwide
          </p>
        </div>

        <WeatherSearch onSearch={handleSearch} isLoading={isLoading} />

        {isLoading && <LoadingSpinner />}

        {error && (
          <ErrorMessage message={error} onRetry={handleRetry} />
        )}

        {currentWeather && !isLoading && !error && (
          <div className="space-y-6">
            <CurrentWeather weather={currentWeather} />
            {forecastData && (
              <HourlyForecast hourlyData={forecastData.list} />
            )}
          </div>
        )}

        {!currentWeather && !isLoading && !error && (
          <div className="text-center text-white/80 py-12">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-semibold mb-4">Ready to explore the weather?</h3>
              <p className="mb-6">Enter any city name above to get started, or type "demo" to see sample data.</p>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-sm">
                <p className="font-medium mb-2">💡 Pro tip:</p>
                <p>Add your OpenWeatherMap API key in the weatherService.ts file for real weather data!</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
