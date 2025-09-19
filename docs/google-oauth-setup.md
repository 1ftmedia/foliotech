# Google OAuth Setup Guide for FolioTech Institute

## 🚨 Issue: "Continue with Google" Not Working

### **🎯 Root Cause**
Google OAuth is not properly configured in your Supabase dashboard. This requires both Google Cloud Console setup and Supabase configuration.

### **📋 Step-by-Step Fix**

#### **1. Google Cloud Console Setup**

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**
2. **Create a new project** or select existing one
3. **Enable Google+ API:**
   - Go to **APIs & Services** → **Library**
   - Search for "Google+ API" and enable it
4. **Create OAuth 2.0 Credentials:**
   - Go to **APIs & Services** → **Credentials**
   - Click **Create Credentials** → **OAuth 2.0 Client ID**
   - Choose **Web application**
   - Add these **Authorized redirect URIs:**
     ```
     https://your-project-ref.supabase.co/auth/v1/callback
     http://localhost:54321/auth/v1/callback
     ```

#### **2. Supabase Dashboard Configuration**

1. **Go to your Supabase Dashboard**
2. **Navigate to Authentication** → **Providers**
3. **Enable Google Provider:**
   - Toggle **Google** to **Enabled**
   - Enter your **Google Client ID** from Google Cloud Console
   - Enter your **Google Client Secret** from Google Cloud Console
4. **Configure Redirect URLs:**
   - Go to **Authentication** → **URL Configuration**
   - Add these URLs to **Redirect URLs:**
     ```
     http://localhost:5173/auth/callback
     http://localhost:5173/auth/success
     https://foliotechinstitute.com/auth/callback
     https://foliotechinstitute.com/auth/success
     ```

#### **3. Environment Variables (Optional)**

Add these to your `.env` file if needed:
```env
# Google OAuth (if using custom configuration)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### **🔧 Common Issues & Solutions**

#### **Issue 1: "Invalid redirect URI"**
- **Solution:** Ensure redirect URIs in Google Cloud Console match Supabase callback URLs
- **Format:** `https://your-project-ref.supabase.co/auth/v1/callback`

#### **Issue 2: "OAuth consent screen not configured"**
- **Solution:** Configure OAuth consent screen in Google Cloud Console
- **Required:** App name, support email, authorized domains

#### **Issue 3: "Google+ API not enabled"**
- **Solution:** Enable Google+ API in Google Cloud Console
- **Location:** APIs & Services → Library → Google+ API

#### **Issue 4: "Rate limit exceeded"**
- **Solution:** Wait a few minutes and try again
- **Prevention:** Implement proper error handling

### **✅ Testing Checklist**

1. **Test Google OAuth in development:**
   - Click "Continue with Google" button
   - Should redirect to Google OAuth consent screen
   - After authorization, should redirect back to your app

2. **Check browser console for errors:**
   - Open Developer Tools → Console
   - Look for OAuth-related errors
   - Check network tab for failed requests

3. **Verify Supabase configuration:**
   - Check Authentication → Providers in Supabase dashboard
   - Ensure Google is enabled and configured
   - Verify redirect URLs are correct

### **🎯 Current Implementation Status**

✅ **Code Implementation:** Google OAuth is properly implemented in the codebase
✅ **UI Components:** "Continue with Google" button is present and styled
✅ **Error Handling:** Proper error handling and user feedback
❌ **Supabase Configuration:** Google OAuth provider needs to be configured
❌ **Google Cloud Console:** OAuth credentials need to be set up

### **📱 User Experience Flow**

1. **User clicks "Continue with Google"**
2. **Redirects to Google OAuth consent screen**
3. **User authorizes the application**
4. **Redirects back to `/auth/callback`**
5. **Callback processes the OAuth response**
6. **Redirects to `/auth/success`**
7. **Success page shows confirmation and redirects to dashboard**

### **🚀 After Configuration**

Once properly configured:
- ✅ Google OAuth will work seamlessly
- ✅ Users can sign in with their Google accounts
- ✅ Proper redirect flow will be maintained
- ✅ Session management will work correctly

### **📞 Support**

If issues persist:
1. Check browser console for specific error messages
2. Verify all URLs are correctly configured
3. Test with a fresh browser session
4. Check Supabase logs for authentication errors

---

**The main issue is missing Google OAuth configuration in Supabase dashboard!** 🎯