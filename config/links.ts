import { LinkCard } from '@/types';

export const availableLinks: LinkCard[] = [
  {
    id: "google",
    title: "Google",
    url: "https://www.google.com",
    icon: "🔍",
    color: "from-blue-500 to-blue-600",
    gradient: "bg-gradient-to-br from-blue-500 to-blue-600",
    displayByDefault: true
  },
  {
    id: "github",
    title: "GitHub",
    url: "https://github.com",
    icon: "🐙",
    color: "from-gray-700 to-gray-800",
    gradient: "bg-gradient-to-br from-gray-700 to-gray-800",
    displayByDefault: false
  },
  {
    id: "chatgpt",
    title: "ChatGPT",
    url: "https://chat.com",
    icon: "🤖",
    color: "from-emerald-500 to-emerald-600",
    gradient: "bg-gradient-to-br from-emerald-500 to-emerald-600",
    displayByDefault: true
  },
  {
    id: "youtube",
    title: "YouTube",
    url: "https://www.youtube.com",
    icon: "📺",
    color: "from-red-500 to-red-600",
    gradient: "bg-gradient-to-br from-red-500 to-red-600",
    displayByDefault: true
  },
  {
    id: "spotify",
    title: "Spotify",
    url: "https://www.spotify.com",
    icon: "🎧",
    color: "from-green-500 to-green-600",
    gradient: "bg-gradient-to-br from-green-500 to-green-600",
    displayByDefault: true
  },
  {
    id: "applemusic",
    title: "Apple Music",
    url: "https://music.apple.com/us/new",
    icon: "🎧",
    color: "from-purple-500 to-purple-600",
    gradient: "bg-gradient-to-br from-purple-500 to-purple-600",
    displayByDefault: false
  },
  {
    id: "outlook",
    title: "Outlook",
    url: "https://outlook.live.com",
    icon: "📧",
    color: "from-blue-500 to-blue-600",
    gradient: "bg-gradient-to-br from-blue-500 to-blue-600",
    displayByDefault: false
  }
];

// Special emails link - only available for me :)
export const emailsLink: LinkCard = {
  id: "emails",
  title: "Emails",
  url: "#",
  icon: "📬",
  color: "from-indigo-500 to-indigo-600",
  gradient: "bg-gradient-to-br from-indigo-500 to-indigo-600",
  type: "emails"
};

// For backward compatibility
export const publicLinks = availableLinks;
export const privateLinks: LinkCard[] = [];