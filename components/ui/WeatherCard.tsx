"use client";

import { useState, useEffect } from 'react';
import { WeatherResponse } from '@/types';

interface WeatherCardProps {
  city: string;
  index?: number;
  onClick?: (weather: WeatherResponse, city: string) => void;
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

export const WeatherCard = ({ city, index = 0, onClick }: WeatherCardProps) => {
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('City not found');
          }
          throw new Error('Weather data not available');
        }
        
        const data: WeatherResponse = await response.json();
        setWeather(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load weather');
      } finally {
        setLoading(false);
      }
    };

    if (city) {
      fetchWeather();
    }
  }, [city]);

  if (loading) {
    return (
      <div 
        className="group relative overflow-hidden rounded-2xl glass glass-hover transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-black/50 text-center cursor-pointer animate-in fade-in-0 slide-in-from-bottom-4"
        style={{ 
          animationDelay: `${index * 100}ms`,
          animationDuration: '600ms',
          animationFillMode: 'both'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 opacity-0 group-hover:opacity-10 group-focus:opacity-8 transition-all duration-500"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative p-6 md:p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/50 mx-auto mb-4"></div>
          <h3 className="text-white font-sans font-light text-lg md:text-xl tracking-wide">
            Loading Weather...
          </h3>
        </div>
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-sm"></div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div 
        className="group relative overflow-hidden rounded-2xl glass glass-hover transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-black/50 text-center cursor-pointer animate-in fade-in-0 slide-in-from-bottom-4"
        style={{ 
          animationDelay: `${index * 100}ms`,
          animationDuration: '600ms',
          animationFillMode: 'both'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-orange-500 opacity-0 group-hover:opacity-10 group-focus:opacity-8 transition-all duration-500"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative p-6 md:p-8">
          <div className="text-4xl md:text-5xl mb-3 md:mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 group-focus:scale-105">
            🌡️
          </div>
          <h3 className="text-white font-sans font-light text-lg md:text-xl tracking-wide">
            Weather Unavailable
          </h3>
        </div>
        <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-sm"></div>
      </div>
    );
  }

  return (
    <button
      onClick={() => onClick?.(weather, city)}
      className="group relative overflow-hidden rounded-2xl glass glass-hover transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-black/50 text-center cursor-pointer animate-in fade-in-0 slide-in-from-bottom-4 w-full"
      style={{ 
        animationDelay: `${index * 100}ms`,
        animationDuration: '600ms',
        animationFillMode: 'both'
      }}
      tabIndex={0}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-10 group-focus:opacity-8 transition-all duration-500"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative p-6 md:p-8 text-center">
        <div className="text-4xl md:text-5xl mb-3 md:mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 group-focus:scale-105">
          {getWeatherIcon(weather.current.condition)}
        </div>
        <h3 className="text-white font-sans font-light text-lg md:text-xl group-hover:text-white group-focus:text-gray-200 transition-colors duration-500 tracking-wide">
          {Math.round(weather.current.temperature)}°C
        </h3>
      </div>
      {/* Subtle glow effect on hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-sm"></div>
    </button>
  );
};