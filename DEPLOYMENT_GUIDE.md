# 🚀 Deployment Guide - Analytics Dashboard

## ❌ Masalah 404 di Production

Jika Anda mendapatkan error 404 saat mengakses `/admin/analytics`, ikuti langkah-langkah berikut:

## 🔧 Solusi Langkah demi Langkah

### 1. Periksa File Structure
Pastikan file-file berikut ada di project Anda:

```
app/
├── admin/
│   ├── page.tsx                    # Redirect ke analytics
│   └── analytics/
│       └── page.tsx                # Dashboard analytics
├── api/
│   └── analytics/
│       └── route.ts                # API analytics
components/
├── AnalyticsDashboard.tsx          # Komponen dashboard
└── DevInfo.tsx                    # Developer info
```

### 2. Deploy Ulang ke Vercel
```bash
# Commit perubahan
git add .
git commit -m "Fix admin analytics page"
git push

# Atau deploy manual di Vercel Dashboard
```

### 3. Set Environment Variables di Vercel
Buka Vercel Dashboard → Project Settings → Environment Variables:

```bash
# Wajib untuk dashboard
ANALYTICS_PASSWORD=Rendy@123

# Opsional untuk data real-time
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
GA_PROPERTY_ID=123456789
GA_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----
GA_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
```

### 4. Test URL
Setelah deploy, test URL berikut:

```
https://your-domain.vercel.app/admin/analytics
```

**Password:** `Rendy@123`

## 🚨 Troubleshooting 404

### Jika masih 404:

1. **Cek Build Logs**
   - Buka Vercel Dashboard
   - Deployments → Latest deployment
   - Cek apakah ada error di build

2. **Cek File Structure**
   - Pastikan folder `app/admin/analytics/` ada
   - Pastikan file `page.tsx` ada di dalamnya

3. **Cek Import Errors**
   - Pastikan semua import di `AnalyticsDashboard.tsx` benar
   - Pastikan semua dependencies terinstall

4. **Clear Cache**
   - Di Vercel Dashboard: Settings → General → Clear Cache
   - Redeploy aplikasi

5. **Test di Development**
   ```bash
   npm run dev
   # Buka http://localhost:3000/admin/analytics
   ```

## ✅ Checklist Deployment

- [ ] File `app/admin/analytics/page.tsx` ada
- [ ] File `components/AnalyticsDashboard.tsx` ada
- [ ] File `app/api/analytics/route.ts` ada
- [ ] Environment variables diset di Vercel
- [ ] Deploy berhasil tanpa error
- [ ] URL `/admin/analytics` bisa diakses
- [ ] Password protection berfungsi

## 🔗 Quick Test

1. **Development:**
   ```
   http://localhost:3000/admin/analytics
   ```

2. **Production:**
   ```
   https://your-domain.vercel.app/admin/analytics
   ```

## 📞 Jika Masih Bermasalah

1. **Cek Console Browser**
   - F12 → Console
   - Lihat error yang muncul

2. **Cek Network Tab**
   - F12 → Network
   - Lihat request ke `/admin/analytics`

3. **Cek Vercel Logs**
   - Function logs di Vercel Dashboard
   - Cek apakah ada error di server

4. **Test API Endpoint**
   ```
   https://your-domain.vercel.app/api/analytics
   ```

## 🎯 Solusi Cepat

Jika masih 404, coba:

1. **Rename file:**
   ```bash
   # Rename dari page.tsx ke route.tsx
   mv app/admin/analytics/page.tsx app/admin/analytics/route.tsx
   ```

2. **Atau buat file baru:**
   ```bash
   # Buat file baru
   touch app/admin/analytics/page.tsx
   ```

3. **Redeploy:**
   ```bash
   git add .
   git commit -m "Fix admin page"
   git push
   ```

---

**Note:** Pastikan semua file ter-commit dan ter-push ke repository sebelum deploy. 