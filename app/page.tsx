"use client";

import { useState, useMemo } from "react";
import { useSession, signOut } from "next-auth/react";
import { LinkCard as LinkCardType, TrainingWeek } from '@/types';
import { inspirationalQuotes } from '@/config/data';
import { useTimeBasedContent } from '@/hooks/useTimeBasedContent';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useGetPreferencesQuery, useGetCustomLinksQuery, useGetTrainingWeekQuery } from '@/lib/store/api';
import { getFilteredLinks } from '@/lib/linkUtils';
import { BackgroundEffects } from '@/components/layout/BackgroundEffects';
import { LoadingScreen } from '@/components/layout/LoadingScreen';
import { AuthButton } from '@/components/navigation/AuthButton';
import { QuoteDisplay } from '@/components/ui/QuoteDisplay';
import { LinksGrid } from '@/components/ui/LinksGrid';
import { SearchBar } from '@/components/ui/SearchBar';
import { SignOutConfirmationModal } from '@/components/modals/SignOutConfirmationModal';
import { EmailsModal } from '@/components/modals/EmailsModal';
import { PreferencesModal } from '@/components/modals/PreferencesModal';
import { TimeDebugger } from '@/components/debug/TimeDebugger';
import { TrainingPlanModal } from "@/components/modals/TrainingPlanModal";
import { WeatherModal } from "@/components/modals/WeatherModal";



export default function Home() {
  const { data: session, status } = useSession();
  const [showEmails, setShowEmails] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [timeOverride, setTimeOverride] = useState<number | null>(null);
  const [showTraining, setShowTraining] = useState(false);
  const [showWeather, setShowWeather] = useState(false);
  const [weatherData, setWeatherData] = useState<{ weather: any; city: string } | null>(null);
  
  // Custom hooks
  const { greeting, getGradientClass } = useTimeBasedContent(session, status, timeOverride);
  
  const { 
    data: preferences = { enabledLinks: [], hasSetPreferences: false }, 
    isLoading: preferencesLoading,
    refetch: refetchPreferences 
  } = useGetPreferencesQuery(undefined, { skip: status !== 'authenticated' });
  
  const { 
    data: customLinks = [], 
    isLoading: customLinksLoading,
    refetch: refetchCustomLinks 
  } = useGetCustomLinksQuery(undefined, { skip: status !== 'authenticated' });

  const { 
    data: trainingWeek = {}, 
    isLoading: trainingWeekLoading,
    refetch: refetchTrainingWeek 
  } = useGetTrainingWeekQuery(undefined, { skip: status !== 'authenticated' });

  // Handler functions
  const handleSearch = (query: string) => {
    const searchUrl = `https://csh-search-api.fly.dev/search?q=${encodeURIComponent(query)}`;
    window.open(searchUrl, "_blank", "noopener,noreferrer");
  };

  const handleLinkClick = (link: LinkCardType) => {
    if (link.type === "training" || link.type === "training-week") {
      setShowTraining(true);
      return;
    }

    if (link.type === "emails") {
      setShowEmails(true);
    } else {
      window.open(link.url, "_blank", "noopener,noreferrer");
    }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Sign out error:", error);
      setIsSigningOut(false);
    }
  };

  const confirmSignOut = () => {
    setShowSignOutConfirm(true);
  };

  const handleWeatherClick = (weather: any, city: string) => {
    setWeatherData({ weather, city });
    setShowWeather(true);
  };

  const copyToClipboard = (email: string) => {
    navigator.clipboard.writeText(email);
  };

  const openInbox = (inboxUrl: string) => {
    window.open(inboxUrl, "_blank", "noopener,noreferrer");
  };

  // Get appropriate link set based on authentication status and user preferences
  const visibleLinks = useMemo(() => {
    return getFilteredLinks(
      !!session,
      session?.user?.email,
      preferences.enabledLinks,
      preferences.hasSetPreferences,
      customLinks,
      trainingWeek as TrainingWeek,
      preferences.city
    );
  }, [session, preferences.enabledLinks, preferences.hasSetPreferences, customLinks, trainingWeek, preferences.city]);

  // Setup keyboard shortcuts
  useKeyboardShortcuts({
    showSignOutConfirm,
    isSigningOut,
    setShowSignOutConfirm,
    setSearchQuery: () => {}, // SearchBar component manages its own state now
    handleSignOut
  });


  // Show loading state
  if (status === "loading" || (status === "authenticated" && (preferencesLoading || customLinksLoading || trainingWeekLoading))) {
    return <LoadingScreen gradientClass={getGradientClass()} timeOverride={timeOverride} />;
  }

  return (
    <div className={`min-h-screen ${getGradientClass()} relative overflow-hidden`}>
      <BackgroundEffects timeOverride={timeOverride} />
      
      <AuthButton
        isAuthenticated={!!session}
        isSigningOut={isSigningOut}
        onSignOut={confirmSignOut}
        onOpenSettings={session ? () => setShowPreferences(true) : undefined}
      />

      <div className="relative z-10 min-h-screen flex flex-col justify-center p-8 md:p-12 lg:p-16 py-20">
        {/* Header - Left aligned with animation */}
        <div className="mb-12 md:mb-16 max-w-4xl animate-in fade-in-0 slide-in-from-bottom-4" style={{ animationDuration: '800ms' }}>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-light bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent tracking-tight leading-tight">
            {greeting}
          </h1>
          <QuoteDisplay quotes={inspirationalQuotes} />
        </div>

        <LinksGrid
          links={visibleLinks}
          onLinkClick={handleLinkClick}
          userCity={preferences.city}
          onWeatherClick={handleWeatherClick}
        />

        <SearchBar onSearch={handleSearch} />
      </div>

      <EmailsModal
        isOpen={showEmails && !!session}
        onClose={() => setShowEmails(false)}
        onCopyEmail={copyToClipboard}
        onOpenInbox={openInbox}
      />

      <SignOutConfirmationModal
        isOpen={showSignOutConfirm}
        isSigningOut={isSigningOut}
        onConfirm={handleSignOut}
        onCancel={() => setShowSignOutConfirm(false)}
      />

      <PreferencesModal
        isOpen={showPreferences}
        onClose={() => setShowPreferences(false)}
        onPreferencesSaved={() => {
          // RTK Query will automatically invalidate and refetch data
        }}
      />

      <TrainingPlanModal
        isOpen={showTraining}
        onClose={() => setShowTraining(false)}
      />

      {weatherData && (
        <WeatherModal
          isOpen={showWeather}
          onClose={() => setShowWeather(false)}
          weather={weatherData.weather}
          city={weatherData.city}
        />
      )}

      <TimeDebugger
        onTimeOverride={setTimeOverride}
        currentHour={timeOverride}
      />
    </div>
  );
}
