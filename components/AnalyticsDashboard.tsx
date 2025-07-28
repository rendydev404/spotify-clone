"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Play, 
  Search, 
  Users, 
  Zap, 
  TrendingUp, 
  User, 
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw
} from 'lucide-react';

interface AnalyticsData {
  pageViews: number;
  musicPlays: number;
  searches: number;
  playlistGenerations: number;
  socialClicks: number;
  profileClicks: number;
  errors: number;
  realTimeUsers: number;
  topPages: Array<{ page: string; views: number }>;
  topEvents: Array<{ event: string; count: number }>;
  isRealData: boolean;
  lastUpdated: string;
  message: string;
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/analytics');
      const analyticsData = await response.json();
      setData(analyticsData);
      setError(null);
    } catch (err) {
      setError('Gagal memuat data analytics');
      console.error('Analytics fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Auto-refresh setiap 30 detik
    const interval = setInterval(fetchData, 30000);
    
    // Listen for manual refresh event
    const handleManualRefresh = () => {
      fetchData();
    };
    
    window.addEventListener('refreshAnalytics', handleManualRefresh);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('refreshAnalytics', handleManualRefresh);
    };
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-gray-700/50">
        <div className="flex items-center justify-center h-32">
          <RefreshCw className="w-6 h-6 animate-spin text-green-400" />
          <span className="ml-2 text-gray-300">Memuat analytics...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-gray-700/50">
        <div className="flex items-center text-red-400 mb-4">
          <AlertTriangle className="w-5 h-5 mr-2" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const metrics = [
    {
      label: 'Page Views',
      value: data.pageViews,
      icon: BarChart3,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      label: 'Music Plays',
      value: data.musicPlays,
      icon: Play,
      color: 'bg-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20'
    },
    {
      label: 'Searches',
      value: data.searches,
      icon: Search,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20'
    },
    {
      label: 'Real-time Users',
      value: data.realTimeUsers,
      icon: Users,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20'
    },
    {
      label: 'AI Playlists',
      value: data.playlistGenerations,
      icon: Zap,
      color: 'bg-pink-500',
      bgColor: 'bg-pink-500/10',
      borderColor: 'border-pink-500/20'
    },
    {
      label: 'Social Clicks',
      value: data.socialClicks,
      icon: TrendingUp,
      color: 'bg-cyan-500',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/20'
    },
    {
      label: 'Profile Clicks',
      value: data.profileClicks,
      icon: User,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-500/10',
      borderColor: 'border-indigo-500/20'
    },
    {
      label: 'Errors',
      value: data.errors,
      icon: AlertTriangle,
      color: 'bg-red-500',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Status Message */}
      {data.message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl text-sm ${
            data.isRealData 
              ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
              : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {data.isRealData ? (
                <CheckCircle className="w-4 h-4 mr-2" />
              ) : (
                <AlertTriangle className="w-4 h-4 mr-2" />
              )}
              {data.message}
            </div>
            <div className="flex items-center text-xs opacity-70">
              <Clock className="w-3 h-3 mr-1" />
              {new Date(data.lastUpdated).toLocaleTimeString()}
            </div>
          </div>
        </motion.div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-xl border backdrop-blur-xl ${metric.bgColor} ${metric.borderColor}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs mb-1">{metric.label}</p>
                <p className="text-2xl font-bold text-white">{metric.value.toLocaleString()}</p>
              </div>
              <div className={`p-2 rounded-lg ${metric.color} bg-opacity-20`}>
                <metric.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Top Pages & Events */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
          <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
            <BarChart3 size={20} className="text-primary" />
            Top Pages
          </h3>
          <div className="space-y-3">
            {data.topPages.slice(0, 5).map((page, index) => (
              <motion.div
                key={page.page}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-primary font-bold">#{index + 1}</span>
                  <span className="text-gray-300 text-sm truncate">{page.page}</span>
                </div>
                <span className="text-white font-semibold">{page.views.toLocaleString()}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Top Events */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
          <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-primary" />
            Top Events
          </h3>
          <div className="space-y-3">
            {data.topEvents.slice(0, 5).map((event, index) => (
              <motion.div
                key={event.event}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-primary font-bold">#{index + 1}</span>
                  <span className="text-gray-300 text-sm capitalize">{event.event.replace('_', ' ')}</span>
                </div>
                <span className="text-white font-semibold">{event.count.toLocaleString()}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 