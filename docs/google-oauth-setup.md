# Google OAuth Setup Guide for FolioTech Institute

This guide will help you configure Google OAuth authentication for the FolioTech Institute application.

## 🎯 Overview

The Google OAuth implementation includes:
- **Google Sign-In Button** in the authentication dialog
- **Automatic redirect handling** after successful authentication
- **User profile integration** with existing user management
- **Development and production** environment support

## 🚀 Quick Setup

### 1. Google Cloud Console Setup

#### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name: `FolioTech Institute`
4. Click "Create"

#### Step 2: Enable Google+ API
1. In the Google Cloud Console, go to **APIs & Services** > **Library**
2. Search for "Google+ API"
3. Click on it and press "Enable"

#### Step 3: Create OAuth 2.0 Credentials
1. Go to **APIs & Services** > **Credentials**
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add the following **Authorized redirect URIs**:

**For Development:**
```
http://localhost:3000/auth/callback
http://localhost:5173/auth/callback
http://localhost:5174/auth/callback
http://localhost:5175/auth/callback
```

**For Production:**
```
https://foliotechinstitute.com/auth/callback
```

5. Click "Create"
6. Copy the **Client ID** and **Client Secret** (you'll need these for Supabase)

### 2. Supabase Configuration

#### Step 1: Enable Google Provider
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to **Authentication** > **Providers**
3. Find "Google" in the list
4. Toggle **Enable Google provider**

#### Step 2: Configure Google OAuth
1. In the Google provider settings, enter:
   - **Client ID**: (from Google Cloud Console)
   - **Client Secret**: (from Google Cloud Console)
2. Click "Save"

#### Step 3: Update Redirect URLs
1. Go to **Authentication** > **URL Configuration**
2. Ensure these URLs are in your **Redirect URLs** list:
   ```
   http://localhost:3000/auth/callback
   http://localhost:5173/auth/callback
   http://localhost:5174/auth/callback
   http://localhost:5175/auth/callback
   https://foliotechinstitute.com/auth/callback
   ```

### 3. Environment Variables

Create a `.env` file in your project root (if it doesn't exist):

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Google OAuth (optional - for additional configuration)
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

## 🔧 Implementation Details

### Current Implementation

The Google OAuth is already implemented in the codebase:

1. **AuthDialog Component** (`src/components/auth/AuthDialog.tsx`):
   - Contains Google sign-in button
   - Handles OAuth flow initiation
   - Shows loading states and error handling

2. **GoogleSignIn Component** (`src/components/auth/GoogleSignIn.tsx`):
   - Dedicated Google sign-in component
   - Proper Google branding and styling
   - Error handling and loading states

3. **Social Auth Function** (`src/lib/supabase/auth.ts`):
   - `signInWithSocial()` function handles OAuth flow
   - Redirects to Google OAuth consent screen
   - Handles redirect back to application

4. **Auth Callback** (`src/pages/auth/Callback.tsx`):
   - Processes OAuth callback from Google
   - Handles user creation and session management
   - Redirects to appropriate page after authentication

### How It Works

1. **User clicks "Continue with Google"**
2. **Application calls** `signInWithSocial('google')`
3. **User is redirected** to Google OAuth consent screen
4. **User grants permission** to the application
5. **Google redirects back** to `/auth/callback` with authorization code
6. **Supabase exchanges** the code for user information
7. **User is signed in** and redirected to the intended page

## 🧪 Testing

### Development Testing

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Navigate to the application**:
   - Go to `http://localhost:5173` (or whatever port Vite assigns)
   - Click "Sign In" or "Get Started"

3. **Test Google OAuth**:
   - Click "Continue with Google"
   - You should be redirected to Google's consent screen
   - After granting permission, you should be redirected back to the app

### Production Testing

1. **Deploy the application** to your production domain
2. **Test the OAuth flow** on the live site
3. **Verify user creation** in Supabase dashboard
4. **Check redirect URLs** are working correctly

## 🚨 Troubleshooting

### Common Issues

#### 1. "redirect_uri_mismatch" Error
- **Cause**: The redirect URI in Google Cloud Console doesn't match the one in Supabase
- **Solution**: Ensure both have the exact same URLs (including protocol and port)

#### 2. "invalid_client" Error
- **Cause**: Incorrect Client ID or Client Secret
- **Solution**: Double-check the credentials in Supabase dashboard

#### 3. "access_denied" Error
- **Cause**: User denied permission or OAuth consent screen issues
- **Solution**: Check Google Cloud Console OAuth consent screen configuration

#### 4. Redirect Loop
- **Cause**: Incorrect redirect URL configuration
- **Solution**: Verify all redirect URLs in both Google Cloud Console and Supabase

### Debug Steps

1. **Check Browser Console** for JavaScript errors
2. **Check Supabase Logs** in the dashboard
3. **Verify Environment Variables** are set correctly
4. **Test with Different Browsers** to rule out browser-specific issues

## 📱 User Experience

### What Users See

1. **Sign In Dialog**: Clean, professional sign-in modal
2. **Google Button**: Properly branded "Continue with Google" button
3. **Loading States**: Clear feedback during the OAuth process
4. **Error Handling**: User-friendly error messages
5. **Success Flow**: Automatic redirect to intended page

### User Data

When users sign in with Google, the following information is collected:
- **Email address** (primary identifier)
- **Full name** (from Google profile)
- **Profile picture** (if available)
- **Google account ID** (for linking accounts)

## 🔒 Security Considerations

1. **HTTPS Required**: OAuth only works over HTTPS in production
2. **Redirect URL Validation**: Only authorized URLs can be used
3. **Client Secret Protection**: Never expose client secret in frontend code
4. **Token Management**: Supabase handles token refresh automatically
5. **User Data Privacy**: Only collect necessary user information

## 📚 Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Supabase Dashboard](https://supabase.com/dashboard)

## ✅ Checklist

- [ ] Google Cloud Console project created
- [ ] Google+ API enabled
- [ ] OAuth 2.0 credentials created
- [ ] Redirect URIs configured in Google Cloud Console
- [ ] Google provider enabled in Supabase
- [ ] Client ID and Secret added to Supabase
- [ ] Redirect URLs added to Supabase
- [ ] Development environment tested
- [ ] Production environment tested
- [ ] User flow verified end-to-end

