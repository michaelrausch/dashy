"use client";

import { WeatherResponse } from '@/types';

interface WeatherModalProps {
  isOpen: boolean;
  onClose: () => void;
  weather: WeatherResponse;
  city: string;
}

const getWeatherIcon = (condition: string) => {
  switch (condition.toLowerCase()) {
    case 'clear':
    case 'mostlyclear':
      return '☀️';
    case 'partlycloudy':
    case 'mostlycloudy':
      return '⛅';
    case 'cloudy':
    case 'overcast':
      return '☁️';
    case 'drizzle':
    case 'lightrain':
      return '🌦️';
    case 'rain':
    case 'heavyrain':
      return '🌧️';
    case 'snow':
    case 'lightsnow':
    case 'heavysnow':
      return '❄️';
    case 'thunderstorm':
      return '⛈️';
    case 'fog':
    case 'mist':
      return '🌫️';
    default:
      return '🌤️';
  }
};

const formatCondition = (condition: string) => {
  return condition.replace(/([A-Z])/g, ' $1').trim();
};

export const WeatherModal = ({ isOpen, onClose, weather, city }: WeatherModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-black rounded-2xl border border-white/10 animate-in fade-in-0 slide-in-from-bottom-4 duration-300 max-h-[90vh] overflow-y-auto">
        <div className="p-4 md:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-serif font-light text-white">Weather</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors duration-200 p-2 md:p-1 -m-2 md:m-0"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Current Weather */}
          <div className="text-center mb-4 md:mb-6">
            <div className="text-5xl md:text-6xl mb-3 md:mb-4">
              {getWeatherIcon(weather.current.condition)}
            </div>
            <h3 className="text-xl md:text-2xl font-light text-white mb-2 capitalize">
              {city}
            </h3>
            <div className="text-3xl md:text-4xl font-light text-white mb-2">
              {Math.round(weather.current.temperature)}°C
            </div>
            <div className="text-base md:text-lg text-gray-300 mb-1">
              {formatCondition(weather.current.condition)}
            </div>
            <div className="text-sm text-gray-400">
              Feels like {Math.round(weather.current.feelsLike)}°C
            </div>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-400 mb-1">Humidity</div>
              <div className="text-base md:text-lg text-white">{weather.current.humidity}%</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-400 mb-1">Wind</div>
              <div className="text-base md:text-lg text-white">{Math.round(weather.current.windSpeed)} km/h</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-400 mb-1">UV Index</div>
              <div className="text-base md:text-lg text-white">{weather.current.uvIndex}</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-400 mb-1">Precipitation</div>
              <div className="text-base md:text-lg text-white">{weather.current.precipitationIntensity}%</div>
            </div>
          </div>

          {/* 5-Day Forecast */}
          <div>
            <h4 className="text-base md:text-lg font-serif font-light text-white mb-3">5-Day Forecast</h4>
            <div className="space-y-2">
              {weather.forecast.map((day, index) => (
                <div key={index} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-xl md:text-2xl flex-shrink-0">{getWeatherIcon(day.condition)}</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-white font-medium text-sm md:text-base">{day.day}</div>
                      <div className="text-xs text-gray-400 truncate">{formatCondition(day.condition)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {day.precipitationChance > 0 && (
                      <div className="text-xs text-blue-400 min-w-[35px] text-center">
                        {Math.round(day.precipitationChance)}%
                      </div>
                    )}
                    <div className="text-right min-w-[45px]">
                      <div className="text-white text-sm md:text-base">{day.high}°</div>
                      <div className="text-gray-400 text-xs md:text-sm">{day.low}°</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};