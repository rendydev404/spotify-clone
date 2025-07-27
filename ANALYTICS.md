# Google Analytics Implementation

## Overview
Spotify Clone telah diintegrasikan dengan Google Analytics untuk tracking user behavior dan analytics yang komprehensif.

## Setup

### 1. Environment Variables
Buat file `.env.local` di root project dan tambahkan:

```env
# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# API Keys lainnya...
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
YOUTUBE_API_KEY=your_youtube_api_key
GEMINI_API_KEY=your_gemini_api_key
```

### 2. Google Analytics Setup
1. Buka [Google Analytics](https://analytics.google.com/)
2. Buat property baru atau gunakan yang sudah ada
3. Dapatkan Measurement ID (format: G-XXXXXXXXXX)
4. Masukkan ke environment variable `NEXT_PUBLIC_GA_MEASUREMENT_ID`

## Features

### 📊 **Automatic Tracking**
- **Page Views**: Otomatis track setiap halaman yang dikunjungi
- **Navigation**: Track perpindahan antar halaman
- **Session Duration**: Waktu yang dihabiskan user di website

### 🎵 **Music Events**
- **Play Music**: Track ketika user memainkan lagu
  - Track name dan artist
  - Source (Spotify/YouTube)
- **Search**: Track pencarian lagu
  - Query yang dicari
  - Jumlah hasil yang ditemukan

### 🤖 **AI Features**
- **Playlist Generation**: Track penggunaan AI playlist generator
  - Prompt yang digunakan
  - Jumlah lagu yang dihasilkan
- **Error Tracking**: Track error yang terjadi saat generate playlist

### 👤 **User Engagement**
- **Social Media Clicks**: Track klik pada social media links
  - Platform yang diklik (Instagram, GitHub, Email, LinkedIn)
- **Profile Photo Click**: Track ketika user klik foto profil
- **Button Clicks**: Track interaksi dengan berbagai button

### 🎯 **Custom Events**
- **Navigation**: Track perpindahan antar halaman
- **Error Events**: Track error yang terjadi di aplikasi
- **Button Interactions**: Track klik pada berbagai button

## Usage

### Basic Usage
```typescript
import { useAnalytics } from '@/hooks/useAnalytics';

const { trackMusicPlay, trackSearch, trackButtonClick } = useAnalytics();

// Track music play
trackMusicPlay('Shape of You', 'Ed Sheeran', 'spotify');

// Track search
trackSearch('rock music', 25);

// Track button click
trackButtonClick('play_button', 'home_page');
```

### Available Tracking Functions

#### Music Tracking
```typescript
trackMusicPlay(trackName: string, artist: string, source: 'spotify' | 'youtube')
```

#### Search Tracking
```typescript
trackSearch(query: string, resultsCount: number)
```

#### AI Features
```typescript
trackPlaylistGeneration(prompt: string, tracksCount: number)
```

#### Social Media
```typescript
trackSocialClick(platform: string)
```

#### User Engagement
```typescript
trackProfilePhotoClick()
trackButtonClick(buttonName: string, location: string)
```

#### Navigation
```typescript
trackNavigation(page: string)
```

#### Error Tracking
```typescript
trackError(errorType: string, errorMessage: string)
```

## Analytics Dashboard

### 📈 **Key Metrics to Monitor**
1. **User Engagement**
   - Page views per session
   - Time on site
   - Bounce rate

2. **Music Behavior**
   - Most played tracks
   - Search patterns
   - Popular genres

3. **AI Usage**
   - Playlist generation frequency
   - Popular prompts
   - Success rate

4. **Social Engagement**
   - Social media click rates
   - Profile interaction
   - User journey

### 🎯 **Custom Reports**
Buat custom reports di Google Analytics untuk:
- Music listening patterns
- AI feature adoption
- User engagement funnel
- Error tracking and resolution

## Privacy & Compliance

### 🔒 **GDPR Compliance**
- Analytics hanya track anonymized data
- Tidak menyimpan personal information
- User consent dapat diimplementasikan jika diperlukan

### 🛡️ **Data Protection**
- Data dikirim ke Google Analytics secara aman
- Tidak ada sensitive information yang ditrack
- Menggunakan HTTPS untuk semua requests

## Troubleshooting

### Common Issues

1. **Analytics tidak muncul**
   - Pastikan `NEXT_PUBLIC_GA_MEASUREMENT_ID` sudah diset
   - Cek console untuk error
   - Pastikan Google Analytics sudah aktif

2. **Events tidak ter-track**
   - Cek network tab untuk requests ke Google Analytics
   - Pastikan gtag function tersedia
   - Cek environment variables

3. **Page views tidak ter-track**
   - Pastikan `useGoogleAnalytics` hook digunakan
   - Cek routing configuration
   - Pastikan Google Analytics script sudah load

### Debug Mode
Untuk debugging, tambahkan ke console:
```javascript
// Cek apakah gtag tersedia
console.log('gtag available:', typeof window !== 'undefined' && window.gtag);

// Cek measurement ID
console.log('GA ID:', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);
```

## Performance Impact

### ⚡ **Optimization**
- Analytics script load secara async
- Minimal impact pada performance
- Lazy loading untuk analytics functions
- Error handling untuk mencegah crashes

### 📊 **Monitoring**
- Track analytics script load time
- Monitor impact pada Core Web Vitals
- Optimize jika diperlukan

## Future Enhancements

### 🚀 **Planned Features**
- Enhanced music analytics
- User behavior heatmaps
- A/B testing integration
- Real-time analytics dashboard
- Custom event tracking
- Conversion funnel analysis

---

**Note**: Pastikan untuk selalu mengikuti Google Analytics Terms of Service dan Privacy Policy terbaru. 