import { LinkCard, CustomLink } from '@/types';
import { availableLinks, emailsLink } from '@/config/links';

// Check if user is admin (should match backend logic)
const isAdminUser = (userEmail?: string | null): boolean => {
  // This should match the ADMIN_EMAIL from environment
  // For frontend, we'll use the public version
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  return !!adminEmail && userEmail === adminEmail;
};

// Convert CustomLink to LinkCard format
const customLinkToLinkCard = (customLink: CustomLink): LinkCard => ({
  id: `custom-${customLink.id}`,
  title: customLink.title,
  url: customLink.url,
  icon: customLink.icon,
  color: customLink.color,
  gradient: customLink.gradient,
  type: 'custom'
});

export const getFilteredLinks = (
  isAuthenticated: boolean,
  userEmail?: string | null,
  enabledLinks: string[] = [],
  hasSetPreferences: boolean = false,
  customLinks: CustomLink[] = []
): LinkCard[] => {
  const isAdmin = isAdminUser(userEmail);
  let filteredLinks: LinkCard[];

  if (!hasSetPreferences) {
    // If no preferences have been set, show all available links
    filteredLinks = [...availableLinks];
  } else {
    // If preferences have been set, only show enabled links
    filteredLinks = availableLinks.filter(link => enabledLinks.includes(link.id));
  }

  // Always add emails link for admin users (regardless of preferences)
  if (isAdmin && isAuthenticated) {
    filteredLinks.push(emailsLink);
  }

  // Add custom links (always shown for authenticated users)
  if (isAuthenticated) {
    const customLinksAsLinkCards = customLinks.map(customLinkToLinkCard);
    filteredLinks.push(...customLinksAsLinkCards);
  }

  return filteredLinks;
};

export const getAllAvailableLinks = (): { availableLinks: LinkCard[] } => {
  return {
    availableLinks
  };
};