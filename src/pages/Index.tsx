
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
        // Mock data for Chennai
        const mockWeatherData: WeatherData = {
          coord: { lat: 13.0827, lon: 80.2707 },
          weather: [{ id: 802, main: 'Clouds', description: 'scattered clouds', icon: '03d' }],
          base: 'stations',
          main: {
            temp: 32,
            feels_like: 38,
            temp_min: 29,
            temp_max: 35,
            pressure: 1008,
            humidity: 68
          },
          visibility: 8000,
          wind: { speed: 4.5, deg: 210 },
          clouds: { all: 40 },
          dt: Math.floor(Date.now() / 1000),
          sys: { type: 1, id: 9218, country: 'IN', sunrise: 1640645400, sunset: 1640686800 },
          timezone: 19800,
          id: 1264527,
          name: 'Chennai',
          cod: 200
        };

        const mockForecastData: ForecastData = {
          cod: '200',
          message: 0,
          cnt: 40,
          list: Array.from({ length: 8 }, (_, i) => ({
            dt: Math.floor(Date.now() / 1000) + (i + 1) * 3600,
            main: {
              temp: 32 + Math.random() * 4 - 2,
              feels_like: 38 + Math.random() * 4 - 2,
              temp_min: 29,
              temp_max: 35,
              pressure: 1008,
              sea_level: 1008,
              grnd_level: 1008,
              humidity: 68 + Math.random() * 15 - 7,
              temp_kf: 0
            },
            weather: [{ id: 802, main: 'Clouds', description: 'scattered clouds', icon: '03d' }],
            clouds: { all: 40 },
            wind: { speed: 4.5, deg: 210, gust: 6.2 },
            visibility: 8000,
            pop: 0.2,
            sys: { pod: 'd' },
            dt_txt: new Date(Date.now() + (i + 1) * 3600000).toISOString()
          })),
          city: {
            id: 1264527,
            name: 'Chennai',
            coord: { lat: 13.0827, lon: 80.2707 },
            country: 'IN',
            population: 4646732,
            timezone: 19800,
            sunrise: 1640645400,
            sunset: 1640686800
          }
        };

        setCurrentWeather(mockWeatherData);
        setForecastData(mockForecastData);
        toast({
          title: "Demo Mode",
          description: "Showing demo data for Chennai. Add your OpenWeatherMap API key for real data.",
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
