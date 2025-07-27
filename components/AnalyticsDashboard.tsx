'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, Music, Play, Search, Brain, TrendingUp, Activity } from 'lucide-react';

interface AnalyticsData {
  pageViews: number;
  musicPlays: number;
  searches: number;
  playlistGenerations: number;
  socialClicks: number;
  profileClicks: number;
  errors: number;
}

export default function AnalyticsDashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    pageViews: 0,
    musicPlays: 0,
    searches: 0,
    playlistGenerations: 0,
    socialClicks: 0,
    profileClicks: 0,
    errors: 0,
  });

  // Simulasi data analytics (dalam implementasi nyata, ini akan diambil dari Google Analytics API)
  useEffect(() => {
    if (isOpen) {
      // Simulasi loading data
      const timer = setTimeout(() => {
        setAnalyticsData({
          pageViews: Math.floor(Math.random() * 1000) + 500,
          musicPlays: Math.floor(Math.random() * 500) + 200,
          searches: Math.floor(Math.random() * 300) + 100,
          playlistGenerations: Math.floor(Math.random() * 50) + 20,
          socialClicks: Math.floor(Math.random() * 100) + 30,
          profileClicks: Math.floor(Math.random() * 80) + 20,
          errors: Math.floor(Math.random() * 10) + 2,
        });
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const metrics = [
    {
      title: 'Page Views',
      value: analyticsData.pageViews,
      icon: <BarChart3 size={20} />,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/30',
    },
    {
      title: 'Music Plays',
      value: analyticsData.musicPlays,
      icon: <Music size={20} />,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500/30',
    },
    {
      title: 'Searches',
      value: analyticsData.searches,
      icon: <Search size={20} />,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      borderColor: 'border-purple-500/30',
    },
    {
      title: 'AI Playlists',
      value: analyticsData.playlistGenerations,
      icon: <Brain size={20} />,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-500/30',
    },
    {
      title: 'Social Clicks',
      value: analyticsData.socialClicks,
      icon: <Users size={20} />,
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/20',
      borderColor: 'border-pink-500/30',
    },
    {
      title: 'Profile Clicks',
      value: analyticsData.profileClicks,
      icon: <Activity size={20} />,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/20',
      borderColor: 'border-indigo-500/30',
    },
  ];

  return (
    <>
      {/* Floating Analytics Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-32 md:bottom-32 right-4 md:right-8 z-40 bg-primary text-white rounded-full p-3 shadow-lg hover:shadow-primary/50 transition-all duration-300"
        title="Analytics Dashboard"
      >
        <TrendingUp size={24} />
      </motion.button>

      {/* Analytics Modal */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              duration: 0.3
            }}
            className="bg-zinc-900 rounded-2xl border border-white/20 shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <TrendingUp size={24} className="text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Analytics Dashboard</h2>
                    <p className="text-sm text-gray-400">Spotify Clone Performance Metrics</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <svg width={24} height={24} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {/* Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {metrics.map((metric, index) => (
                  <motion.div
                    key={metric.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-xl border ${metric.borderColor} ${metric.bgColor} backdrop-blur-sm`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                        <div className={metric.color}>
                          {metric.icon}
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">Last 30 days</span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-300 mb-1">{metric.title}</h3>
                    <p className="text-2xl font-bold text-white">{metric.value.toLocaleString()}</p>
                  </motion.div>
                ))}
              </div>

              {/* Error Rate */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-red-500/20">
                      <svg width={20} height={20} fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-red-400">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-300">Error Rate</span>
                  </div>
                  <span className="text-xs text-gray-400">Last 30 days</span>
                </div>
                <p className="text-2xl font-bold text-red-400">{analyticsData.errors}</p>
                <p className="text-xs text-gray-400 mt-1">Errors tracked and resolved</p>
              </motion.div>

              {/* Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mt-6 p-4 rounded-xl border border-blue-500/30 bg-blue-500/10 backdrop-blur-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/20">
                    <svg width={20} height={20} fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-blue-400">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white mb-1">Analytics Info</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      This dashboard shows simulated analytics data. In production, this would display real-time metrics from Google Analytics API. 
                      All user interactions are tracked anonymously to improve user experience.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
} 