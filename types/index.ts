export interface LinkCard {
  id: string;
  title: string;
  url: string;
  icon: string;
  color: string;
  gradient: string;
  type?: 'emails' | 'custom' | 'training' | string;
  displayByDefault?: boolean;
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

export type TrainingActivity = "rest" | "workout" | "run" | "bike" | "swim" | "walk" | "other";

export interface TrainingDay {
  dayOfWeek: string;
  activity: TrainingActivity;
}

export interface TrainingWeek {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

export interface WeatherCurrent {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  uvIndex: number;
  precipitationIntensity: number;
}

export interface WeatherForecastDay {
  day: string;
  high: number;
  low: number;
  condition: string;
  precipitationChance: number;
}

export interface WeatherResponse {
  current: WeatherCurrent;
  forecast: WeatherForecastDay[];
}