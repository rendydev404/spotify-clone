# 🎯 GA4 Custom Events Setup Guide

## 🔍 **Masalah Custom Events:**

### **1. GA4 vs GA3 Format**
- GA4 menggunakan format yang berbeda dari GA3
- Custom events perlu dikonfigurasi dengan benar
- Event names harus sesuai dengan GA4 format

### **2. Event Tracking Issues**
- Events mungkin tidak terkirim ke GA
- Event names mungkin tidak sesuai
- Perlu verifikasi di GA Console

## 🚀 **Setup Custom Events di GA4:**

### **Step 1: GA4 Console Setup**

1. **Buka Google Analytics Console**:
   ```
   https://analytics.google.com/
   ```

2. **Pilih Property kamu** (Property ID: 489524781)

3. **Admin → Property Settings → Data Streams**:
   - Pilih Web Stream
   - Klik "Configure" (gear icon)

4. **Enhanced Measurement**:
   - Enable semua events yang diperlukan
   - Page views, Scrolls, Outbound clicks, etc.

### **Step 2: Custom Definitions**

1. **Admin → Property Settings → Custom Definitions**:
   - Create Custom Dimensions
   - Create Custom Metrics

2. **Custom Dimensions yang dibutuhkan**:
   ```
   event_category (String)
   event_label (String)
   music_source (String)
   search_query (String)
   playlist_prompt (String)
   social_platform (String)
   ```

3. **Custom Metrics yang dibutuhkan**:
   ```
   event_value (Integer)
   search_results (Integer)
   playlist_tracks (Integer)
   ```

### **Step 3: Custom Events**

1. **Admin → Property Settings → Events**:
   - Create Custom Events

2. **Events yang perlu dibuat**:
   ```
   play_music
   search
   generate_playlist
   social_click
   profile_photo_click
   ```

### **Step 4: Event Parameters**

Untuk setiap custom event, set parameters:

#### **play_music Event**:
```
Event Name: play_music
Parameters:
- event_category (String)
- event_label (String)
- music_source (String)
- event_value (Integer)
```

#### **search Event**:
```
Event Name: search
Parameters:
- event_category (String)
- event_label (String)
- search_query (String)
- search_results (Integer)
```

#### **generate_playlist Event**:
```
Event Name: generate_playlist
Parameters:
- event_category (String)
- event_label (String)
- playlist_prompt (String)
- playlist_tracks (Integer)
```

## 🧪 **Testing Custom Events:**

### **1. Test Manual Events**:
```javascript
// Test music play
window.gtag("event", "play_music", {
  event_category: "music",
  event_label: "Test Song - Test Artist (spotify)",
  music_source: "spotify",
  event_value: 1
});

// Test search
window.gtag("event", "search", {
  event_category: "engagement",
  event_label: "test search",
  search_query: "test search",
  search_results: 5
});

// Test AI playlist
window.gtag("event", "generate_playlist", {
  event_category: "ai",
  event_label: "test prompt",
  playlist_prompt: "test prompt",
  playlist_tracks: 10
});
```

### **2. Check Network Tab**:
1. **DevTools → Network tab**
2. **Filter by "google-analytics"**
3. **Perform actions on website**
4. **Look for requests to**:
   - `google-analytics.com`
   - `/collect` (GA4)

### **3. Check GA Console**:
1. **Reports → Engagement → Events**
2. **Look for custom events**
3. **Check real-time data**

## 📊 **Expected Results:**

### **Immediate (5-10 minutes)**:
- ✅ Events should appear in GA Console
- ✅ Real-time data should show events
- ✅ Network requests should be sent

### **24-48 hours**:
- ✅ Custom events in Reports
- ✅ Custom dimensions/metrics data
- ✅ Dashboard should show real data

## 🔧 **Troubleshooting:**

### **❌ Problem: Events not appearing in GA**
**Solution**:
1. Check if events are being sent (Network tab)
2. Verify custom definitions are created
3. Wait 24-48 hours for data to appear
4. Check GA Console → DebugView

### **❌ Problem: Custom parameters not showing**
**Solution**:
1. Create custom dimensions/metrics in GA4
2. Map parameters to custom definitions
3. Wait for data to process

### **❌ Problem: Events not triggering**
**Solution**:
1. Check if gtag is loaded
2. Verify event names match exactly
3. Check browser console for errors

## 📋 **Checklist:**

- [ ] Enhanced Measurement enabled
- [ ] Custom Definitions created
- [ ] Custom Events created
- [ ] Event Parameters mapped
- [ ] Test manual events
- [ ] Check Network tab
- [ ] Verify in GA Console
- [ ] Wait 24-48 hours
- [ ] Check dashboard again

## 🎯 **Quick Test:**

1. **Open website** and perform actions
2. **Check Network tab** for GA requests
3. **Test manual events** in console
4. **Check GA Console** for real-time data
5. **Wait 24-48 hours** for processed data

---

**Note**: Custom events di GA4 membutuhkan setup yang lebih kompleks dari GA3. Pastikan semua custom definitions dan events sudah dibuat dengan benar! 