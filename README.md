# Spotify Clone - Platform Musik Streaming

Platform musik streaming gratis dengan fitur AI playlist generator, search musik, dan player musik yang responsif.

## 🚀 Fitur Utama

- **Musik Streaming Gratis**: Akses jutaan lagu hits tanpa biaya
- **AI Playlist Generator**: Buat playlist otomatis dengan AI canggih
- **Search Musik Cepat**: Temukan lagu favorit dengan mudah
- **Responsive Design**: Interface yang user-friendly di semua device
- **Google Analytics**: Tracking analytics untuk monitoring performa

## 🛠️ Setup & Konfigurasi

### 1. Environment Variables

Buat file `.env.local` di root project dan tambahkan:

```env
# Spotify API
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

# YouTube API
YOUTUBE_API_KEY=your_youtube_api_key

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-L0V33E1LY5
```

### 2. Google Analytics Setup

Website sudah dikonfigurasi dengan Google Analytics Measurement ID: `G-L0V33E1LY5`

**Events yang di-track:**
- `page_view`: Setiap halaman yang dikunjungi
- `play_song`: Ketika user memainkan lagu
- `search_music`: Ketika user melakukan pencarian
- `generate_ai_playlist`: Ketika user menggunakan AI playlist generator
- `ai_playlist_success`: Ketika AI berhasil generate playlist
- `play_ai_track`: Ketika user memainkan lagu dari AI playlist

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

## 📊 Analytics Dashboard

Akses dashboard analytics di `/admin/analytics` dengan password: `Rendy@123`

## 🎵 API Endpoints

- `/api/spotify`: Spotify API integration
- `/api/gemini`: AI playlist generation
- `/api/analytics`: Analytics data collection

## 🎨 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Analytics**: Google Analytics 4
- **AI**: Google Gemini API
- **Music**: Spotify Web API

## 📱 Responsive Design

Website dioptimalkan untuk:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔧 Development

### Struktur Project
```
├── app/                 # Next.js app directory
├── components/          # React components
├── hooks/              # Custom hooks
├── lib/                # Utility functions
├── types/              # TypeScript types
└── public/             # Static assets
```

### Custom Events Tracking

Website menggunakan custom events untuk tracking user behavior:

```typescript
import { event } from '@/components/GoogleAnalytics';

// Track custom event
event({
  action: 'play_song',
  category: 'music',
  label: 'Song Name - Artist',
  value: 1
});
```

## 🚀 Deployment

Website sudah di-deploy di Vercel dengan domain: `https://spotify-clone-by-rendydev.vercel.app/`

## 📈 Performance

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **Core Web Vitals**: Optimized
- **SEO**: Fully optimized dengan meta tags dan structured data

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 👨‍💻 Developer

**Rendy Dev**
- GitHub: [@rendydev404](https://github.com/rendydev404)
- LinkedIn: [Rendy Irawan](https://www.linkedin.com/in/rendi-irawan-93190732b/)

---

© 2025 Spotify Clone - Platform Musik Streaming
