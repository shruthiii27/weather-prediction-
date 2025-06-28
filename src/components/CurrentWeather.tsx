
import React from 'react';
import { WeatherData } from '../types/weather';

interface CurrentWeatherProps {
  weather: WeatherData;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ weather }) => {
  const formatTime = (timestamp: number, timezone: number) => {
    const date = new Date((timestamp + timezone) * 1000);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC'
    });
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-8 border border-white/20 shadow-xl">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-white mb-2">
          {weather.name}, {weather.sys.country}
        </h2>
        <p className="text-white/80 text-sm">
          {formatTime(weather.dt, weather.timezone)}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="text-center md:text-left">
          <div className="text-6xl md:text-7xl font-thin text-white mb-2">
            {Math.round(weather.main.temp)}°
          </div>
          <div className="text-white/80 text-lg mb-4">
            Feels like {Math.round(weather.main.feels_like)}°
          </div>
          <div className="text-xl text-white capitalize font-medium mb-4">
            {weather.weather[0].description}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
            <div className="text-white/80 text-sm mb-1">Humidity</div>
            <div className="text-white text-2xl font-semibold">{weather.main.humidity}%</div>
          </div>
          <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
            <div className="text-white/80 text-sm mb-1">Clouds</div>
            <div className="text-white text-2xl font-semibold">{weather.clouds.all}%</div>
          </div>
          <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
            <div className="text-white/80 text-sm mb-1">Wind</div>
            <div className="text-white text-2xl font-semibold">{weather.wind.speed} m/s</div>
          </div>
          <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
            <div className="text-white/80 text-sm mb-1">Pressure</div>
            <div className="text-white text-2xl font-semibold">{weather.main.pressure} mb</div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-white/20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-white/80 text-sm">Max Temp</div>
            <div className="text-white text-lg font-semibold">{Math.round(weather.main.temp_max)}°</div>
          </div>
          <div>
            <div className="text-white/80 text-sm">Min Temp</div>
            <div className="text-white text-lg font-semibold">{Math.round(weather.main.temp_min)}°</div>
          </div>
          <div>
            <div className="text-white/80 text-sm">Visibility</div>
            <div className="text-white text-lg font-semibold">{(weather.visibility / 1000).toFixed(1)} km</div>
          </div>
          <div>
            <div className="text-white/80 text-sm">UV Index</div>
            <div className="text-white text-lg font-semibold">N/A</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
