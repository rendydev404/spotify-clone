 'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Lock,
  Eye,
  EyeOff,
  LogOut,
  RefreshCw
} from 'lucide-react';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import Image from 'next/image';
import spotifyLogo from "../../../public/spotify-logo.png";

export default function AdminAnalyticsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  // Simple password check (you can change this)
  const ADMIN_PASSWORD = 'Rendy@123'; // Ganti dengan password yang Anda inginkan

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPassword('');
    } else {
      setError('Password salah!');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Trigger a custom event to refresh analytics data
    window.dispatchEvent(new CustomEvent('refreshAnalytics'));
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // Login Form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md border border-gray-700/50"
        >
          <div className="text-center mb-8">
            <div className="bg-primary/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Image
                src={spotifyLogo}
                alt="Spotify Logo"
                width={32}
                height={32}
                className="rounded-full"
              />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Admin Analytics</h1>
            <p className="text-gray-400">Masukkan password untuk mengakses dashboard</p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Masukkan password admin"
                className="w-full pl-10 pr-10 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-500/30 rounded-lg p-3"
              >
                <p className="text-red-300 text-sm">{error}</p>
              </motion.div>
            )}

            <button
              onClick={handleLogin}
              disabled={!password.trim()}
              className="w-full bg-primary hover:bg-primary/80 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200"
            >
              Masuk ke Dashboard
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Halaman ini hanya untuk administrator
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-gray-700/50"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-primary/20 p-3 rounded-xl">
                <Image
                  src={spotifyLogo}
                  alt="Spotify Logo"
                  width={28}
                  height={28}
                  className="rounded-full"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Admin Analytics Dashboard</h1>
                <p className="text-gray-400">Real-time analytics & insights</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="bg-primary/20 hover:bg-primary/30 p-3 rounded-xl transition-colors disabled:opacity-50"
                title="Refresh Data"
              >
                <RefreshCw 
                  size={20} 
                  className={`text-primary ${isRefreshing ? 'animate-spin' : ''}`} 
                />
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500/20 hover:bg-red-500/30 p-3 rounded-xl transition-colors"
                title="Logout"
              >
                <LogOut size={20} className="text-red-400" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Analytics Dashboard */}
        <AnalyticsDashboard />
      </div>
    </div>
  );
}

