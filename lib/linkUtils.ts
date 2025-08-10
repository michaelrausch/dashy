import { LinkCard, CustomLink, TrainingWeek, TrainingDay, TrainingActivity } from '@/types';
import { availableLinks, emailsLink } from '@/config/links';

const trainingActivitiesNames: Record<TrainingActivity, { title: string, icon: string, color: string, gradient: string }> = {
  "rest": {
    title: "Rest Day",
    icon: "💤",
    color: "gray",
    gradient: "bg-gradient-to-br from-gray-500 to-gray-500"
  },
  "workout": {
    title: "Weight Training",
    icon: "💪",
    color: "blue",
    gradient: "bg-gradient-to-br from-blue-500 to-purple-500"
  },
  "run": {
    title: "Run Day",
    icon: "🏃",
    color: "green",
    gradient: "bg-gradient-to-br from-green-500 to-green-500"
  },
  "walk": {
    title: "Walk Day",
    icon: "🚶",
    color: "yellow",
    gradient: "bg-gradient-to-br from-yellow-500 to-yellow-500"
  },
  "other": {
    title: "Other Day",
    icon: "🤷",
    color: "red",
    gradient: "bg-gradient-to-br from-red-500 to-red-500"
  },
  "bike": {
    title: "Bike Day",
    icon: "🚴",
    color: "purple",
    gradient: "bg-gradient-to-br from-purple-500 to-purple-500"
  },
  "swim": {
    title: "Swim Day",
    icon: "🏊",
    color: "blue",
    gradient: "bg-gradient-to-br from-blue-500 to-blue-500"
  }
};

// Check if user is admin (should match backend logic) - this is a soft check, also happens on the backend
const isAdminUser = (userEmail?: string | null): boolean => {
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

const trainingDayToLinkCard = (activity: string): LinkCard  => {
  const activityData = trainingActivitiesNames[activity as keyof typeof trainingActivitiesNames];

  if (!activityData) {
    alert(`Training activity ${activity} not found`);
    console.error(`Training activity ${activity} not found`);
  }

  return {
    id: `training-${activity}`,
    title: activityData.title,
    url: '/',
    icon: activityData.icon,
    color: activityData.color,
    gradient: activityData.gradient,
    type: 'training-week'
  };
};

export const getFilteredLinks = (
  isAuthenticated: boolean,
  userEmail?: string | null,
  enabledLinks: string[] = [],
  hasSetPreferences: boolean = false,
  customLinks: CustomLink[] = [],
  trainingWeek: TrainingWeek | null = null,
  city?: string | null
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

  if (trainingWeek) {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const trainingDay = trainingWeek[today as keyof TrainingWeek];

    if (trainingDay) {
      filteredLinks.push(trainingDayToLinkCard(trainingDay));
    }
  }

  // Add weather card if city is set
  if (city && isAuthenticated) {
    filteredLinks.push({
      id: 'weather',
      title: 'Weather',
      url: '/',
      icon: '🌤️',
      color: 'blue',
      gradient: 'bg-gradient-to-br from-blue-500 to-cyan-500',
      type: 'weather'
    });
  }

  return filteredLinks;
};

export const getAllAvailableLinks = (): { availableLinks: LinkCard[] } => {
  return {
    availableLinks
  };
};