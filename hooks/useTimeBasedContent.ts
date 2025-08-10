import { useState, useEffect } from 'react';
import { Session } from 'next-auth';
import { TimeBasedContent } from '@/types';

export const useTimeBasedContent = (session: Session | null, status: string, timeOverride?: number | null) => {
  const [greeting, setGreeting] = useState("");
  const [timeGradient, setTimeGradient] = useState("");

  useEffect(() => {
    if (status === "loading") return;

    const updateTimeBasedContent = () => {
      const now = new Date();
      const hour = timeOverride !== null && timeOverride !== undefined ? timeOverride : now.getHours();
      
      // Set greeting based on time and authentication
      let greetingText = "";
      const getFirstName = (fullName: string) => {
        const firstName = fullName.split(' ')[0];
        return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
      };
      const userName = session?.user?.name 
        ? `, ${getFirstName(session.user.name)}` 
        : "";
      
      if (hour >= 5 && hour < 12) {
        greetingText = session ? `Good morning${userName}` : "Good morning";
      } else if (hour >= 12 && hour < 17) {
        greetingText = session ? `Good afternoon${userName}` : "Good afternoon";
      } else if (hour >= 17 && hour < 21) {
        greetingText = session ? `Good evening${userName}` : "Good evening";
      } else {
        greetingText = session ? `Good night${userName}` : "Good night";
      }
      
      setGreeting(greetingText);
      
      // Set gradient based on time
      let gradient = "";
      if (hour >= 5 && hour < 12) {
        // Morning: soft blues and purples
        gradient = "from-slate-900 via-blue-900/50 to-purple-900/30";
      } else if (hour >= 12 && hour < 17) {
        // Afternoon: warm oranges and yellows
        gradient = "from-slate-900 via-orange-900/40 to-yellow-900/20";
      } else if (hour >= 17 && hour < 21) {
        // Evening: deep purples and pinks
        gradient = "from-slate-900 via-purple-900/60 to-pink-900/40";
      } else {
        // Night: deep blues and indigos
        gradient = "from-slate-900 via-indigo-900/50 to-blue-900/30";
      }
      
      setTimeGradient(gradient);
    };

    updateTimeBasedContent();
    const interval = setInterval(updateTimeBasedContent, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [status, session, timeOverride]);

  // Get the gradient class based on time with subtle effects
  const getGradientClass = () => {
    const hour = timeOverride !== null && timeOverride !== undefined ? timeOverride : new Date().getHours();
    if (hour >= 5 && hour < 8) {
      // Sunrise: 5-8 AM
      return "sunrise-gradient";
    } else if (hour >= 8 && hour < 12) {
      // Morning: 8-12 PM
      return "morning-gradient";
    } else if (hour >= 12 && hour < 17) {
      // Afternoon: 12-5 PM
      return "afternoon-gradient";
    } else if (hour >= 17 && hour < 20) {
      // Sunset: 5-8 PM
      return "sunset-gradient";
    } else if (hour >= 20 && hour < 21) {
      // Evening: 8-9 PM
      return "evening-gradient";
    } else {
      // Night: 9 PM - 5 AM
      return "night-gradient";
    }
  };

  return {
    greeting,
    timeGradient,
    getGradientClass
  };
};