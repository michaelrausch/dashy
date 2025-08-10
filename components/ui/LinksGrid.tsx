"use client";

import { LinkCard as LinkCardType } from '@/types';
import { LinkCard } from './LinkCard';

interface LinksGridProps {
  links: LinkCardType[];
  onLinkClick: (link: LinkCardType) => void;
  className?: string;
}

export const LinksGrid = ({ links, onLinkClick, className = "" }: LinksGridProps) => {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 mb-12 md:mb-16 max-w-7xl ${className}`}>
      {links.map((link, index) => (
        <LinkCard
          key={`${link.title}-${index}`}
          link={link}
          index={index}
          onClick={onLinkClick}
        />
      ))}
    </div>
  );
};