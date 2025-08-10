export interface LinkCard {
  id: string;
  title: string;
  url: string;
  icon: string;
  color: string;
  gradient: string;
  type?: 'emails' | 'custom' | string;
}

export interface EmailAddress {
  id: string;
  userId: string;
  name: string;
  email: string;
  inboxUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Quote {
  text: string;
  author: string;
}

export interface TimeBasedContent {
  greeting: string;
  gradientClass: string;
}

export interface UserPreferences {
  id: string;
  userId: string;
  enabledLinks: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferencesState {
  enabledLinks: string[];
  hasSetPreferences: boolean;
}

export interface CustomLink {
  id: string;
  userId: string;
  title: string;
  url: string;
  icon: string;
  color: string;
  gradient: string;
  createdAt: Date;
  updatedAt: Date;
}