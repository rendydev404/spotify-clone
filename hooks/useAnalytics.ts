import { event } from '@/components/GoogleAnalytics';

// Custom hook untuk tracking events
export const useAnalytics = () => {
  // Track music play events
  const trackMusicPlay = (trackName: string, artist: string, source: 'spotify' | 'youtube') => {
    event({
      action: 'play_music',
      category: 'music',
      label: `${trackName} - ${artist} (${source})`,
    });
  };

  // Track search events
  const trackSearch = (query: string, resultsCount: number) => {
    event({
      action: 'search',
      category: 'engagement',
      label: query,
      value: resultsCount,
    });
  };

  // Track playlist generation
  const trackPlaylistGeneration = (prompt: string, tracksCount: number) => {
    event({
      action: 'generate_playlist',
      category: 'ai',
      label: prompt,
      value: tracksCount,
    });
  };

  // Track social media clicks
  const trackSocialClick = (platform: string) => {
    event({
      action: 'social_click',
      category: 'engagement',
      label: platform,
    });
  };

  // Track profile photo click
  const trackProfilePhotoClick = () => {
    event({
      action: 'profile_photo_click',
      category: 'engagement',
      label: 'dev_info',
    });
  };

  // Track navigation
  const trackNavigation = (page: string) => {
    event({
      action: 'navigate',
      category: 'navigation',
      label: page,
    });
  };

  // Track button clicks
  const trackButtonClick = (buttonName: string, location: string) => {
    event({
      action: 'button_click',
      category: 'engagement',
      label: `${buttonName}_${location}`,
    });
  };

  // Track error events
  const trackError = (errorType: string, errorMessage: string) => {
    event({
      action: 'error',
      category: 'error',
      label: `${errorType}: ${errorMessage}`,
    });
  };

  return {
    trackMusicPlay,
    trackSearch,
    trackPlaylistGeneration,
    trackSocialClick,
    trackProfilePhotoClick,
    trackNavigation,
    trackButtonClick,
    trackError,
  };
}; 