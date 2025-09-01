# Supabase Authentication Setup Guide

This guide explains how to configure Supabase authentication with custom email templates and proper redirect URLs for both development and production environments.

## 🎯 Overview

The setup includes:
- **Environment-based configuration** for development vs production
- **Custom branded email templates** for all auth flows
- **Proper redirect URL handling** to avoid localhost issues
- **Responsive email design** that works across all email clients

## 🚀 Quick Start

### 1. Environment Variables

Create a `.env` file in your project root:

```bash
# Development
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=your-local-anon-key

# Production (override in production environment)
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key
```

### 2. Supabase Dashboard Configuration

#### Site URL Configuration
1. Go to **Authentication** > **URL Configuration**
2. Set **Site URL**:
   - **Development**: `http://localhost:3000`
   - **Production**: `https://foliotechinstitute.com`

#### Redirect URLs Configuration
1. In **Authentication** > **URL Configuration**
2. Add these **Redirect URLs**:
   ```
   http://localhost:3000/auth/callback
   https://foliotechinstitute.com/auth/callback
   http://localhost:3000/dashboard
   https://foliotechinstitute.com/dashboard
   http://localhost:3000/applications
   https://foliotechinstitute.com/applications
   ```

## 📧 Email Template Configuration

### 1. Email Confirmation Template

Go to **Authentication** > **Email Templates** > **Confirm signup**:

#### Subject
```
Confirm Your Email - FolioTech Institute
```

#### Content
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm Your Email - FolioTech Institute</title>
  <style>
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      line-height: 1.6; 
      color: #333; 
      max-width: 600px; 
      margin: 0 auto; 
      padding: 20px; 
      background-color: #f8fafc;
    }
    .container { 
      background-color: white; 
      border-radius: 12px; 
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
      overflow: hidden; 
    }
    .header { 
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); 
      color: white; 
      padding: 40px 30px; 
      text-align: center; 
    }
    .logo { 
      font-size: 28px; 
      font-weight: 700; 
      margin-bottom: 10px; 
    }
    .tagline { 
      font-size: 16px; 
      opacity: 0.9; 
    }
    .content { 
      padding: 40px 30px; 
      text-align: center; 
    }
    .title { 
      font-size: 24px; 
      color: #1f2937; 
      margin-bottom: 20px; 
      font-weight: 700; 
    }
    .message { 
      font-size: 16px; 
      color: #4b5563; 
      margin-bottom: 30px; 
      line-height: 1.7; 
    }
    .button { 
      display: inline-block; 
      background: #2563eb; 
      color: white; 
      text-decoration: none; 
      padding: 16px 32px; 
      border-radius: 8px; 
      font-weight: 600; 
      font-size: 16px; 
      margin: 20px 0; 
    }
    .security-notice { 
      background-color: #fef3c7; 
      border: 1px solid #f59e0b; 
      border-radius: 8px; 
      padding: 20px; 
      margin: 30px 0; 
      text-align: left; 
    }
    .security-notice h4 { 
      color: #92400e; 
      margin-bottom: 10px; 
      font-size: 16px; 
      font-weight: 600; 
    }
    .security-notice p { 
      color: #92400e; 
      font-size: 14px; 
      margin: 0; 
    }
    .footer { 
      background-color: #f8fafc; 
      padding: 30px; 
      text-align: center; 
      border-top: 1px solid #e2e8f0; 
      color: #6b7280; 
      font-size: 14px; 
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🎓 FolioTech Institute</div>
      <div class="tagline">Empowering the next generation of technology professionals</div>
    </div>
    
    <div class="content">
      <h1 class="title">Welcome to FolioTech Institute!</h1>
      <p class="message">Please confirm your email address to complete your account setup.</p>
      
      <a href="{{ .ConfirmationURL }}" class="button">Confirm Email</a>
      
      <div class="security-notice">
        <h4>🔒 Security Notice</h4>
        <p>If you didn't create an account, you can safely ignore this email.</p>
      </div>
      
      <p style="color: #6b7280; font-size: 14px;">
        This link will expire in 24 hours for security reasons.
      </p>
    </div>
    
    <div class="footer">
      <p><strong>FolioTech Institute</strong></p>
      <p>1, Sunmonu Animashaun St, Zina Estate, Addo Rd, Ajah, Lagos, Nigeria</p>
      <p>📧 info@foliotechinstitute.com | 📱 +234 708 861 6350</p>
      <p style="margin-top: 20px;">© 2024 FolioTech Institute. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
```

### 2. Password Reset Template

Go to **Authentication** > **Email Templates** > **Reset password**:

#### Subject
```
Reset Your Password - FolioTech Institute
```

#### Content
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password - FolioTech Institute</title>
  <style>
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      line-height: 1.6; 
      color: #333; 
      max-width: 600px; 
      margin: 0 auto; 
      padding: 20px; 
      background-color: #f8fafc;
    }
    .container { 
      background-color: white; 
      border-radius: 12px; 
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
      overflow: hidden; 
    }
    .header { 
      background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); 
      color: white; 
      padding: 40px 30px; 
      text-align: center; 
    }
    .logo { 
      font-size: 28px; 
      font-weight: 700; 
      margin-bottom: 10px; 
    }
    .tagline { 
      font-size: 16px; 
      opacity: 0.9; 
    }
    .content { 
      padding: 40px 30px; 
      text-align: center; 
    }
    .title { 
      font-size: 24px; 
      color: #1f2937; 
      margin-bottom: 20px; 
      font-weight: 700; 
    }
    .message { 
      font-size: 16px; 
      color: #4b5563; 
      margin-bottom: 30px; 
      line-height: 1.7; 
    }
    .button { 
      display: inline-block; 
      background: #dc2626; 
      color: white; 
      text-decoration: none; 
      padding: 16px 32px; 
      border-radius: 8px; 
      font-weight: 600; 
      font-size: 16px; 
      margin: 20px 0; 
    }
    .security-notice { 
      background-color: #fef3c7; 
      border: 1px solid #f59e0b; 
      border-radius: 8px; 
      padding: 20px; 
      margin: 30px 0; 
      text-align: left; 
    }
    .security-notice h4 { 
      color: #92400e; 
      margin-bottom: 10px; 
      font-size: 16px; 
      font-weight: 600; 
    }
    .security-notice p { 
      color: #92400e; 
      font-size: 14px; 
      margin: 0; 
    }
    .footer { 
      background-color: #f8fafc; 
      padding: 30px; 
      text-align: center; 
      border-top: 1px solid #e2e8f0; 
      color: #6b7280; 
      font-size: 14px; 
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🎓 FolioTech Institute</div>
      <div class="tagline">Empowering the next generation of technology professionals</div>
    </div>
    
    <div class="content">
      <h1 class="title">Password Reset Request</h1>
      <p class="message">We received a request to reset your password. Click the button below to create a new password.</p>
      
      <a href="{{ .ConfirmationURL }}" class="button">Reset Password</a>
      
      <div class="security-notice">
        <h4>🔒 Security Notice</h4>
        <p>If you didn't request this password reset, you can safely ignore this email.</p>
      </div>
      
      <p style="color: #6b7280; font-size: 14px;">
        This link will expire in 24 hours for security reasons.
      </p>
    </div>
    
    <div class="footer">
      <p><strong>FolioTech Institute</strong></p>
      <p>1, Sunmonu Animashaun St, Zina Estate, Addo Rd, Ajah, Lagos, Nigeria</p>
      <p>📧 info@foliotechinstitute.com | 📱 +234 708 861 6350</p>
      <p style="margin-top: 20px;">© 2024 FolioTech Institute. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
```

### 3. Magic Link Template

Go to **Authentication** > **Email Templates** > **Magic Link**:

#### Subject
```
Login to FolioTech Institute
```

#### Content
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login to FolioTech Institute</title>
  <style>
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      line-height: 1.6; 
      color: #333; 
      max-width: 600px; 
      margin: 0 auto; 
      padding: 20px; 
      background-color: #f8fafc;
    }
    .container { 
      background-color: white; 
      border-radius: 12px; 
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
      overflow: hidden; 
    }
    .header { 
      background: linear-gradient(135deg, #059669 0%, #047857 100%); 
      color: white; 
      padding: 40px 30px; 
      text-align: center; 
    }
    .logo { 
      font-size: 28px; 
      font-weight: 700; 
      margin-bottom: 10px; 
    }
    .tagline { 
      font-size: 16px; 
      opacity: 0.9; 
    }
    .content { 
      padding: 40px 30px; 
      text-align: center; 
    }
    .title { 
      font-size: 24px; 
      color: #1f2937; 
      margin-bottom: 20px; 
      font-weight: 700; 
    }
    .message { 
      font-size: 16px; 
      color: #4b5563; 
      margin-bottom: 30px; 
      line-height: 1.7; 
    }
    .button { 
      display: inline-block; 
      background: #059669; 
      color: white; 
      text-decoration: none; 
      padding: 16px 32px; 
      border-radius: 8px; 
      font-weight: 600; 
      font-size: 16px; 
      margin: 20px 0; 
    }
    .security-notice { 
      background-color: #fef3c7; 
      border: 1px solid #f59e0b; 
      border-radius: 8px; 
      padding: 20px; 
      margin: 30px 0; 
      text-align: left; 
    }
    .security-notice h4 { 
      color: #92400e; 
      margin-bottom: 10px; 
      font-size: 16px; 
      font-weight: 600; 
    }
    .security-notice p { 
      color: #92400e; 
      font-size: 14px; 
      margin: 0; 
    }
    .footer { 
      background-color: #f8fafc; 
      padding: 30px; 
      text-align: center; 
      border-top: 1px solid #e2e8f0; 
      color: #6b7280; 
      font-size: 14px; 
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🎓 FolioTech Institute</div>
      <div class="tagline">Empowering the next generation of technology professionals</div>
    </div>
    
    <div class="content">
      <h1 class="title">Your Login Link</h1>
      <p class="message">Click the button below to securely log in to your account.</p>
      
      <a href="{{ .ConfirmationURL }}" class="button">Login Now</a>
      
      <div class="security-notice">
        <h4>🔒 Security Notice</h4>
        <p>If you didn't request this login link, you can safely ignore this email.</p>
      </div>
      
      <p style="color: #6b7280; font-size: 14px;">
        This link will expire in 24 hours for security reasons.
      </p>
    </div>
    
    <div class="footer">
      <p><strong>FolioTech Institute</strong></p>
      <p>1, Sunmonu Animashaun St, Zina Estate, Addo Rd, Ajah, Lagos, Nigeria</p>
      <p>📧 info@foliotechinstitute.com | 📱 +234 708 861 6350</p>
      <p style="margin-top: 20px;">© 2024 FolioTech Institute. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
```

## ⚙️ Advanced Configuration

### 1. Email Provider Settings

In **Authentication** > **Email Templates** > **Settings**:

- **SMTP Host**: Configure your SMTP provider
- **SMTP Port**: Usually 587 or 465
- **SMTP User**: Your email address
- **SMTP Pass**: Your email password or app password
- **Sender Name**: FolioTech Institute
- **Sender Email**: noreply@foliotechinstitute.com

### 2. Security Settings

In **Authentication** > **Settings**:

- **Enable email confirmations**: ✅
- **Enable phone confirmations**: ✅ (if using phone auth)
- **Enable magic links**: ✅
- **Enable password resets**: ✅
- **Session timeout**: 3600 seconds (1 hour)
- **Refresh token rotation**: ✅

### 3. OAuth Providers (Optional)

If using Google, GitHub, or other OAuth providers:

1. Go to **Authentication** > **Providers**
2. Enable desired providers
3. Configure redirect URLs for each provider
4. Add client IDs and secrets

## 🔧 Development vs Production

### Development Environment
- **Site URL**: `http://localhost:3000`
- **Redirect URLs**: Include localhost variants
- **Email Templates**: Can use development-specific content

### Production Environment
- **Site URL**: `https://foliotechinstitute.com`
- **Redirect URLs**: Only production URLs
- **Email Templates**: Professional, branded content

## 🧪 Testing

### 1. Test Email Templates
1. Use Supabase's **Test Email** feature
2. Send test emails to your email address
3. Verify template rendering across email clients

### 2. Test Authentication Flow
1. Sign up with a test email
2. Check email confirmation
3. Test password reset flow
4. Verify redirect URLs work correctly

### 3. Test Responsiveness
1. Check emails on mobile devices
2. Test across different email clients (Gmail, Outlook, Apple Mail)
3. Verify button functionality

## 🚨 Troubleshooting

### Common Issues

#### 1. Emails Not Sending
- Check SMTP configuration
- Verify email provider settings
- Check Supabase logs for errors

#### 2. Redirect URL Errors
- Ensure URLs are added to Supabase dashboard
- Check for typos in URLs
- Verify protocol (http vs https)

#### 3. Template Rendering Issues
- Check HTML syntax
- Verify CSS compatibility
- Test with minimal content first

#### 4. Localhost Issues
- Ensure development URLs are configured
- Check environment variables
- Verify local Supabase instance is running

### Debug Steps

1. **Check Supabase Logs**
   - Go to **Logs** in dashboard
   - Filter by authentication events
   - Look for error messages

2. **Verify Configuration**
   - Double-check all URLs
   - Confirm environment variables
   - Verify email template syntax

3. **Test Incrementally**
   - Start with basic templates
   - Add complexity gradually
   - Test each change

## 📱 Email Client Compatibility

### Supported Features
- ✅ Responsive design
- ✅ Modern CSS (Flexbox, Grid)
- ✅ Custom fonts (fallback to system fonts)
- ✅ Background images and gradients
- ✅ Interactive buttons
- ✅ Dark mode support

### Email Client Support
- ✅ Gmail (web and mobile)
- ✅ Outlook (web and desktop)
- ✅ Apple Mail (iOS and macOS)
- ✅ Yahoo Mail
- ✅ Thunderbird
- ✅ Mobile email apps

## 🔒 Security Best Practices

1. **Use App Passwords** for email accounts
2. **Enable 2FA** on all accounts
3. **Regular Credential Rotation**
4. **Monitor Authentication Logs**
5. **Use HTTPS** for all production URLs
6. **Implement Rate Limiting** (handled by Supabase)

## 📊 Monitoring

### Key Metrics to Track
- Email delivery rates
- Authentication success rates
- User engagement with emails
- Error rates and types
- Performance metrics

### Tools for Monitoring
- Supabase dashboard analytics
- Email delivery tracking
- User behavior analytics
- Error logging and alerting

## 🚀 Future Enhancements

### Planned Features
- **Multi-language Support** for international users
- **Template Customization** through admin panel
- **A/B Testing** for email templates
- **Analytics Dashboard** for email performance
- **Automated Email Sequences** for user onboarding

### Scalability Considerations
- **Email Queue Management** for high volume
- **Template Caching** for performance
- **Dynamic Content** based on user data
- **Personalization** features

## 📞 Support

If you encounter issues:

1. **Check this documentation** for common solutions
2. **Review Supabase logs** for error details
3. **Test with minimal configuration** to isolate issues
4. **Contact the development team** with specific error information

## 📝 Changelog

### Version 1.0.0 (Current)
- ✅ Environment-based configuration
- ✅ Custom email templates for all auth flows
- ✅ Responsive email design
- ✅ Proper redirect URL handling
- ✅ Comprehensive documentation

### Future Versions
- 🔄 Multi-language support
- 🔄 Template customization panel
- 🔄 Advanced analytics
- 🔄 Automated email sequences
