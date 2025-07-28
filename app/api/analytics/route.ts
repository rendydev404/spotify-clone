import { NextRequest, NextResponse } from 'next/server';

// Google Analytics API configuration
const GA_PROPERTY_ID = process.env.GA_PROPERTY_ID;
const GA_PRIVATE_KEY = process.env.GA_PRIVATE_KEY;
const GA_CLIENT_EMAIL = process.env.GA_CLIENT_EMAIL;

// Optional: Add authentication for analytics dashboard
const ANALYTICS_PASSWORD = process.env.ANALYTICS_PASSWORD;

export async function GET(request: NextRequest) {
  try {
    // Optional: Check for authentication
    if (ANALYTICS_PASSWORD) {
      const authHeader = request.headers.get('authorization');
      const url = new URL(request.url);
      const password = url.searchParams.get('password');
      
      if (!authHeader && !password) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }
      
      const providedPassword = password || authHeader?.replace('Bearer ', '');
      if (providedPassword !== ANALYTICS_PASSWORD) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 403 }
        );
      }
    }

    // Check if Google Analytics credentials are available
    if (!GA_PROPERTY_ID || !GA_PRIVATE_KEY || !GA_CLIENT_EMAIL) {
      console.log('⚠️ Google Analytics credentials not found, using simulated data');
      console.log('Missing:', {
        GA_PROPERTY_ID: !!GA_PROPERTY_ID,
        GA_PRIVATE_KEY: !!GA_PRIVATE_KEY,
        GA_CLIENT_EMAIL: !!GA_CLIENT_EMAIL
      });
      
      // Return simulated data if GA credentials not available
      return NextResponse.json({
        pageViews: Math.floor(Math.random() * 1000) + 500,
        musicPlays: Math.floor(Math.random() * 500) + 200,
        searches: Math.floor(Math.random() * 300) + 100,
        playlistGenerations: Math.floor(Math.random() * 50) + 20,
        socialClicks: Math.floor(Math.random() * 100) + 30,
        profileClicks: Math.floor(Math.random() * 80) + 20,
        errors: Math.floor(Math.random() * 10) + 2,
        realTimeUsers: Math.floor(Math.random() * 50) + 5,
        topPages: [
          { page: '/', views: 1200 },
          { page: '/search', views: 800 },
          { page: '/playlist', views: 600 },
        ],
        topEvents: [
          { event: 'play_music', count: 450 },
          { event: 'search', count: 300 },
          { event: 'generate_playlist', count: 80 },
        ],
        isRealData: false,
        lastUpdated: new Date().toISOString(),
        message: 'Using simulated data - Google Analytics credentials not configured'
      });
    }

    console.log('🔍 Fetching real Google Analytics data...');

    // Google Analytics API implementation
    try {
      // Use dynamic import to avoid constructor issues
      const { BetaAnalyticsDataClient } = await import('@google-analytics/data');
      
      const analyticsDataClient = new BetaAnalyticsDataClient({
        credentials: {
          client_email: GA_CLIENT_EMAIL,
          private_key: GA_PRIVATE_KEY.replace(/\\n/g, '\n'),
        },
      });

      console.log('✅ Google Analytics client initialized');

      // Get page views for last 30 days
      const [pageViewsResponse] = await analyticsDataClient.runReport({
        property: `properties/${GA_PROPERTY_ID}`,
        dateRanges: [
          {
            startDate: '30daysAgo',
            endDate: 'today',
          },
        ],
        metrics: [
          {
            name: 'screenPageViews',
          },
        ],
      });

      // Get real-time users
      const [realTimeResponse] = await analyticsDataClient.runRealtimeReport({
        property: `properties/${GA_PROPERTY_ID}`,
        metrics: [
          {
            name: 'activeUsers',
          },
        ],
      });

      // Get custom events for last 30 days
      const [eventsResponse] = await analyticsDataClient.runReport({
        property: `properties/${GA_PROPERTY_ID}`,
        dateRanges: [
          {
            startDate: '30daysAgo',
            endDate: 'today',
          },
        ],
        metrics: [
          {
            name: 'eventCount',
          },
        ],
        dimensions: [
          {
            name: 'eventName',
          },
        ],
      });

      // Get top pages for last 30 days
      const [topPagesResponse] = await analyticsDataClient.runReport({
        property: `properties/${GA_PROPERTY_ID}`,
        dateRanges: [
          {
            startDate: '30daysAgo',
            endDate: 'today',
          },
        ],
        metrics: [
          {
            name: 'screenPageViews',
          },
        ],
        dimensions: [
          {
            name: 'pagePath',
          },
        ],
        limit: 10,
      });

      console.log('✅ All Google Analytics data fetched successfully');

      // Process real data
      const pageViews = parseInt(pageViewsResponse.rows?.[0]?.metricValues?.[0]?.value || '0');
      const realTimeUsers = parseInt(realTimeResponse.rows?.[0]?.metricValues?.[0]?.value || '0');
      
      // Process events data
      const eventsData = eventsResponse.rows || [];
      const musicPlays = eventsData.find((row: any) => row.dimensionValues?.[0]?.value === 'play_music')?.metricValues?.[0]?.value || '0';
      const searches = eventsData.find((row: any) => row.dimensionValues?.[0]?.value === 'search')?.metricValues?.[0]?.value || '0';
      const playlistGenerations = eventsData.find((row: any) => row.dimensionValues?.[0]?.value === 'generate_playlist')?.metricValues?.[0]?.value || '0';
      const socialClicks = eventsData.find((row: any) => row.dimensionValues?.[0]?.value === 'social_click')?.metricValues?.[0]?.value || '0';
      const profileClicks = eventsData.find((row: any) => row.dimensionValues?.[0]?.value === 'profile_photo_click')?.metricValues?.[0]?.value || '0';
      const errors = eventsData.find((row: any) => row.dimensionValues?.[0]?.value === 'error')?.metricValues?.[0]?.value || '0';

      // Process top pages
      const topPages = topPagesResponse.rows?.map((row: any) => ({
        page: row.dimensionValues?.[0]?.value || '/',
        views: parseInt(row.metricValues?.[0]?.value || '0')
      })) || [];

      // Process top events
      const topEvents = eventsData
        .sort((a: any, b: any) => parseInt(b.metricValues?.[0]?.value || '0') - parseInt(a.metricValues?.[0]?.value || '0'))
        .slice(0, 5)
        .map((row: any) => ({
          event: row.dimensionValues?.[0]?.value || 'unknown',
          count: parseInt(row.metricValues?.[0]?.value || '0')
        }));

      const realData = {
        pageViews,
        musicPlays: parseInt(musicPlays),
        searches: parseInt(searches),
        playlistGenerations: parseInt(playlistGenerations),
        socialClicks: parseInt(socialClicks),
        profileClicks: parseInt(profileClicks),
        errors: parseInt(errors),
        realTimeUsers,
        topPages,
        topEvents,
        isRealData: true,
        lastUpdated: new Date().toISOString(),
        message: 'Real Google Analytics data'
      };

      console.log('📊 Real data processed:', {
        pageViews,
        realTimeUsers,
        musicPlays: parseInt(musicPlays),
        searches: parseInt(searches)
      });

      return NextResponse.json(realData);

    } catch (gaError) {
      console.error('❌ Google Analytics API Error:', gaError);
      
      // Get error message safely
      const errorMessage = gaError instanceof Error ? gaError.message : 'Unknown Google Analytics error';
      
      // Return error with simulated data as fallback
      return NextResponse.json({
        pageViews: Math.floor(Math.random() * 1000) + 500,
        musicPlays: Math.floor(Math.random() * 500) + 200,
        searches: Math.floor(Math.random() * 300) + 100,
        playlistGenerations: Math.floor(Math.random() * 50) + 20,
        socialClicks: Math.floor(Math.random() * 100) + 30,
        profileClicks: Math.floor(Math.random() * 80) + 20,
        errors: Math.floor(Math.random() * 10) + 2,
        realTimeUsers: Math.floor(Math.random() * 50) + 5,
        topPages: [
          { page: '/', views: 1200 },
          { page: '/search', views: 800 },
          { page: '/playlist', views: 600 },
        ],
        topEvents: [
          { event: 'play_music', count: 450 },
          { event: 'search', count: 300 },
          { event: 'generate_playlist', count: 80 },
        ],
        isRealData: false,
        lastUpdated: new Date().toISOString(),
        message: `Google Analytics API Error: ${errorMessage}`,
        error: errorMessage
      });
    }
    

  } catch (error) {
    console.error('❌ Analytics API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch analytics data',
        message: error instanceof Error ? error.message : 'Unknown error',
        isRealData: false,
        lastUpdated: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 