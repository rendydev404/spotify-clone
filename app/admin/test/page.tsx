'use client';

import { useState } from 'react';
import { event } from '@/components/GoogleAnalytics';

export default function TestPage() {
  const [testResults, setTestResults] = useState<string[]>([]);

  const testGoogleAnalytics = () => {
    const results: string[] = [];
    
    // Test 1: Basic event
    try {
      event({
        action: 'test_event',
        category: 'test',
        label: 'Google Analytics Test',
        value: 1
      });
      results.push('✅ Test event sent successfully');
    } catch (error) {
      results.push('❌ Test event failed: ' + error);
    }

    // Test 2: Check if gtag exists and is callable
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      results.push('✅ gtag function is available');
    } else {
      results.push('❌ gtag function is not available');
    }

    // Test 3: Check dataLayer
    if (typeof window !== 'undefined' && window.dataLayer) {
      results.push('✅ dataLayer is available');
    } else {
      results.push('❌ dataLayer is not available');
    }

    setTestResults(results);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50">
          <h1 className="text-3xl font-bold text-white mb-6">Google Analytics Test Page</h1>
          
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Test Google Analytics</h2>
              <button
                onClick={testGoogleAnalytics}
                className="bg-primary hover:bg-primary/80 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Run Analytics Test
              </button>
            </div>

            {testResults.length > 0 && (
              <div className="bg-gray-700/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">Test Results:</h3>
                <div className="space-y-2">
                  {testResults.map((result, index) => (
                    <p key={index} className="text-sm font-mono">
                      {result}
                    </p>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-300 mb-3">Instructions:</h3>
              <ul className="text-blue-200 text-sm space-y-2">
                <li>• Click &quot;Run Analytics Test&quot; to test Google Analytics</li>
                <li>• Check browser console for debug logs</li>
                <li>• Wait 24-48 hours for data to appear in Google Analytics</li>
                <li>• Make sure Measurement ID is correct: G-L0V33E1LY5</li>
              </ul>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-yellow-300 mb-3">Troubleshooting:</h3>
              <ul className="text-yellow-200 text-sm space-y-2">
                <li>• Check if Google Analytics script is loaded in browser console</li>
                <li>• Verify Measurement ID in Google Analytics dashboard</li>
                <li>• Ensure website is accessible and not blocked by ad blockers</li>
                <li>• Check if environment variables are set correctly in Vercel</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 