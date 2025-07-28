# 🎯 Google Analytics Setup Guide - Spotify Clone

## 📋 **Quick Setup Checklist**

### ✅ **Step 1: Google Analytics Account**
- [ ] Create Google Analytics account
- [ ] Get Measurement ID (G-XXXXXXXXXX)
- [ ] Get Property ID (10-digit number)

### ✅ **Step 2: Google Cloud Project**
- [ ] Create Google Cloud project
- [ ] Enable Google Analytics Data API
- [ ] Create service account
- [ ] Download JSON credentials

### ✅ **Step 3: Environment Setup**
- [ ] Extract credentials using script
- [ ] Add to .env.local
- [ ] Install @google-analytics/data package
- [ ] Deploy to production

---

## 🚀 **Detailed Setup Instructions**

### **1. Google Analytics Setup**

#### **1.1 Create Account**
1. Go to [Google Analytics](https://analytics.google.com/)
2. Click "Start measuring"
3. Fill in details:
   - Account name: `Spotify Clone Analytics`
   - Property name: `Spotify Clone`
   - Time zone: `Asia/Jakarta`
   - Currency: `IDR`

#### **1.2 Get Measurement ID**
1. Admin → Data Streams → Web
2. Copy Measurement ID: `G-XXXXXXXXXX`

#### **1.3 Get Property ID**
1. Admin → Property Settings
2. Copy Property ID: `123456789` (10 digits)

### **2. Google Cloud Project Setup**

#### **2.1 Create Project**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Project name: `spotify-clone-analytics`
4. Click "Create"

#### **2.2 Enable API**
1. APIs & Services → Library
2. Search: "Google Analytics Data API"
3. Click "Enable"

#### **2.3 Create Service Account**
1. APIs & Services → Credentials
2. Create Credentials → Service Account
3. Fill details:
   - Name: `spotify-clone-analytics`
   - ID: `spotify-clone-analytics`
   - Description: `Service account for Spotify Clone Analytics`
4. Click "Create and Continue"
5. Role: "Viewer"
6. Click "Done"

#### **2.4 Download Credentials**
1. Click on the service account
2. Keys tab → Add Key → Create new key
3. Key type: JSON
4. Click "Create"
5. File will download automatically

### **3. Extract Credentials**

#### **3.1 Using Script (Recommended)**
```bash
# Run the extractor script
node scripts/extract-ga-credentials.js ./your-downloaded-file.json
```

#### **3.2 Manual Extraction**
Open the downloaded JSON file and extract:
- `client_email`
- `private_key`
- `project_id`

### **4. Environment Variables**

#### **4.1 Create .env.local**
```bash
# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
GA_PROPERTY_ID=123456789
GA_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
GA_CLIENT_EMAIL=spotify-clone-analytics@spotify-clone-analytics.iam.gserviceaccount.com
```

#### **4.2 Install Package**
```bash
npm install @google-analytics/data
```

### **5. Grant Access in Google Analytics**

#### **5.1 Add Service Account**
1. Google Analytics → Admin → Property → Property Access Management
2. Click "+" → "Add users"
3. Email: `spotify-clone-analytics@spotify-clone-analytics.iam.gserviceaccount.com`
4. Role: "Viewer"
5. Click "Add"

---

## 🔧 **Testing Setup**

### **1. Local Testing**
```bash
# Start development server
npm run dev

# Test analytics endpoint
curl http://localhost:3000/api/analytics
```

### **2. Check Response**
Expected response:
```json
{
  "pageViews": 1250,
  "musicPlays": 450,
  "searches": 300,
  "playlistGenerations": 80,
  "socialClicks": 120,
  "profileClicks": 60,
  "errors": 5,
  "realTimeUsers": 25,
  "topPages": [...],
  "topEvents": [...]
}
```

---

## 🚀 **Production Deployment**

### **1. Vercel Deployment**
1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - `GA_PROPERTY_ID`
   - `GA_PRIVATE_KEY`
   - `GA_CLIENT_EMAIL`

### **2. Netlify Deployment**
1. Push code to GitHub
2. Connect to Netlify
3. Add environment variables in Netlify dashboard

### **3. Other Platforms**
Add the same environment variables to your hosting platform.

---

## 📊 **Accessing Analytics**

### **1. Google Analytics Dashboard**
- URL: https://analytics.google.com/
- Login with Google account
- Select your property

### **2. Custom Dashboard**
- Open your website
- Click floating analytics icon (📈)
- View real-time metrics

### **3. API Endpoint**
- URL: `https://yourdomain.com/api/analytics`
- Method: GET
- Returns JSON data

---

## 🔒 **Security Best Practices**

### **1. Environment Variables**
- Never commit `.env.local` to git
- Use `.gitignore` to exclude it
- Set variables in production hosting platform

### **2. Service Account**
- Use minimal permissions (Viewer role)
- Rotate keys regularly
- Monitor usage

### **3. API Security**
- Rate limiting
- Error handling
- Logging

---

## 🐛 **Troubleshooting**

### **Common Issues**

#### **1. "Invalid credentials"**
- Check service account email
- Verify private key format
- Ensure API is enabled

#### **2. "Property not found"**
- Verify Property ID
- Check service account access
- Confirm property exists

#### **3. "API not enabled"**
- Enable Google Analytics Data API
- Wait for propagation (5-10 minutes)

#### **4. "Permission denied"**
- Add service account to Google Analytics
- Grant "Viewer" role
- Check property access

### **Debug Steps**
1. Check environment variables
2. Verify API responses
3. Check Google Cloud Console logs
4. Test with curl or Postman

---

## 📈 **Analytics Features**

### **Tracked Events**
- ✅ Page views
- ✅ Music plays
- ✅ Search queries
- ✅ AI playlist generation
- ✅ Social media clicks
- ✅ Profile interactions
- ✅ Error tracking

### **Real-time Metrics**
- ✅ Active users
- ✅ Current sessions
- ✅ Live events
- ✅ Performance data

### **Custom Reports**
- ✅ User behavior
- ✅ Feature usage
- ✅ Error rates
- ✅ Conversion funnels

---

## 🎯 **Next Steps**

### **1. Monitor Analytics**
- Check Google Analytics dashboard daily
- Monitor custom events
- Track user engagement

### **2. Optimize Performance**
- Analyze page load times
- Identify bottlenecks
- Improve user experience

### **3. Feature Development**
- Use analytics data for decisions
- A/B test new features
- Measure success metrics

---

## 📞 **Support**

### **Resources**
- [Google Analytics Help](https://support.google.com/analytics/)
- [Google Cloud Documentation](https://cloud.google.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)

### **Community**
- Stack Overflow
- GitHub Issues
- Discord communities

---

**🎉 Congratulations! Your Google Analytics setup is complete!** 