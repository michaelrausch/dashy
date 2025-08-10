"use client";

import { LinkCard as LinkCardType } from '@/types';
import { LinkCard } from './LinkCard';
import { WeatherCard } from './WeatherCard';

interface LinksGridProps {
  links: LinkCardType[];
  onLinkClick: (link: LinkCardType) => void;
  userCity?: string | null;
  onWeatherClick?: (weather: any, city: string) => void;
  className?: string;
}

export const LinksGrid = ({ links, onLinkClick, userCity, onWeatherClick, className = "" }: LinksGridProps) => {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 mb-12 md:mb-16 max-w-7xl ${className}`}>
      {links.map((link, index) => {
        if (link.type === 'weather' && userCity) {
          return (
            <WeatherCard
              key={`weather-${index}`}
              city={userCity}
              index={index}
              onClick={onWeatherClick}
            />
          );
        }
        
        return (
          <LinkCard
            key={`${link.title}-${index}`}
            link={link}
            index={index}
            onClick={onLinkClick}
          />
        );
      })}
    </div>
  );
};