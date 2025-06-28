
import React from 'react';
import { HourlyWeather } from '../types/weather';

interface HourlyForecastProps {
  hourlyData: HourlyWeather[];
}

const HourlyForecast: React.FC<HourlyForecastProps> = ({ hourlyData }) => {
  const formatHour = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-xl">
      <h3 className="text-xl font-semibold text-white mb-6">Next 5 Hours</h3>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {hourlyData.slice(1, 6).map((hour, index) => (
          <div
            key={index}
            className="flex-shrink-0 bg-white/10 rounded-2xl p-4 backdrop-blur-sm min-w-[120px] text-center hover:bg-white/15 transition-all duration-300 hover:scale-105"
          >
            <div className="text-white/80 text-sm mb-2 font-medium">
              {formatHour(hour.dt)}
            </div>
            <div className="text-white text-2xl font-semibold mb-2">
              {Math.round(hour.main.temp)}°
            </div>
            <div className="text-white/70 text-xs mb-1">
              Humidity
            </div>
            <div className="text-white text-sm font-medium">
              {hour.main.humidity}%
            </div>
            <div className="text-white/60 text-xs mt-2 capitalize">
              {hour.weather[0].description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourlyForecast;
