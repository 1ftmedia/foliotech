# Google OAuth Debugging Guide

## 🚨 Google OAuth Not Working - Debugging Steps

### **Step 1: Check Browser Console**
1. Open your browser's Developer Tools (F12)
2. Go to the Console tab
3. Click "Continue with Google" button
4. Look for any error messages

### **Common Error Messages & Solutions:**

#### **Error: "Invalid redirect URI"**
- **Cause**: Google OAuth redirect URI not configured correctly
- **Solution**: 
  1. Go to [Google Cloud Console](https://console.cloud.google.com/)
  2. Navigate to APIs & Services > Credentials
  3. Edit your OAuth 2.0 Client ID
  4. Add these redirect URIs:
     ```
     https://dagdsvtidrwulrqdeibh.supabase.co/auth/v1/callback
     http://localhost:54321/auth/v1/callback
     ```

#### **Error: "OAuth consent screen not configured"**
- **Cause**: OAuth consent screen not set up
- **Solution**:
  1. Go to Google Cloud Console > APIs & Services > OAuth consent screen
  2. Configure the consent screen with:
     - App name: "FolioTech Institute"
     - User support email: your email
     - Authorized domains: your domain

#### **Error: "Google+ API not enabled"**
- **Cause**: Google+ API not enabled
- **Solution**:
  1. Go to Google Cloud Console > APIs & Services > Library
  2. Search for "Google+ API"
  3. Click "Enable"

#### **Error: "Client ID not found"**
- **Cause**: Google Client ID not configured in Supabase
- **Solution**:
  1. Go to your Supabase Dashboard
  2. Navigate to Authentication > Providers
  3. Enable Google provider
  4. Enter your Google Client ID and Client Secret

### **Step 2: Verify Supabase Configuration**

#### **Check Authentication Providers:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `dagdsvtidrwulrqdeibh`
3. Navigate to **Authentication** → **Providers**
4. Ensure **Google** is enabled
5. Verify Client ID and Client Secret are entered

#### **Check Redirect URLs:**
1. Go to **Authentication** → **URL Configuration**
2. Ensure these URLs are added:
   ```
   http://localhost:5173/auth/callback
   http://localhost:5173/auth/success
   https://foliotechinstitute.com/auth/callback
   https://foliotechinstitute.com/auth/success
   ```

### **Step 3: Test OAuth Flow**

#### **Manual Test:**
1. Open browser console
2. Run this command:
   ```javascript
   // Test OAuth initiation
   fetch('https://dagdsvtidrwulrqdeibh.supabase.co/auth/v1/authorize?provider=google&redirect_to=http://localhost:5173/auth/callback', {
     method: 'GET',
     headers: {
       'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhZ2RzdnRpZHJ3dWxycWRlaWJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3ODE3NTgsImV4cCI6MjA3MjM1Nzc1OH0.PwX4R4NOlYm07FQiRX9SnxP1AqYedjAzLqnbiwbZo8I'
     }
   }).then(r => r.text()).then(console.log)
   ```

### **Step 4: Check Network Tab**
1. Open Developer Tools > Network tab
2. Click "Continue with Google"
3. Look for failed requests
4. Check the response status and error messages

### **Step 5: Verify Environment Variables**
Make sure these are set in your `.env` file:
```env
VITE_SUPABASE_URL=https://dagdsvtidrwulrqdeibh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhZ2RzdnRpZHJ3dWxycWRlaWJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3ODE3NTgsImV4cCI6MjA3MjM1Nzc1OH0.PwX4R4NOlYm07FQiRX9SnxP1AqYedjAzLqnbiwbZo8I
```

### **Step 6: Test with Different Browsers**
- Try Chrome, Firefox, Edge
- Clear browser cache and cookies
- Try incognito/private mode

### **Step 7: Check Supabase Logs**
1. Go to Supabase Dashboard
2. Navigate to **Logs** → **Auth**
3. Look for authentication errors
4. Check for any rate limiting or configuration issues

## 🔧 Quick Fixes to Try:

### **Fix 1: Reset OAuth Configuration**
1. Disable Google provider in Supabase
2. Wait 30 seconds
3. Re-enable with correct credentials

### **Fix 2: Clear Browser Data**
1. Clear all site data for localhost:5173
2. Clear cookies and cache
3. Restart browser

### **Fix 3: Check CORS Settings**
Make sure your Google OAuth client allows:
- `http://localhost:5173`
- `https://foliotechinstitute.com`

### **Fix 4: Verify Redirect URI Format**
The redirect URI must be exactly:
```
https://dagdsvtidrwulrqdeibh.supabase.co/auth/v1/callback
```

## 📞 If Still Not Working:

1. **Check the exact error message** in browser console
2. **Screenshot the error** for debugging
3. **Test with a fresh browser profile**
4. **Verify all URLs are correct** (no typos)
5. **Check if Google OAuth is working** on other sites

## 🎯 Most Common Issues:

1. **Redirect URI mismatch** (90% of cases)
2. **OAuth consent screen not configured** (5% of cases)
3. **Google+ API not enabled** (3% of cases)
4. **Client ID/Secret not configured in Supabase** (2% of cases)

---

**Next Step**: Run through these debugging steps and let me know what specific error you see in the browser console when clicking "Continue with Google".
