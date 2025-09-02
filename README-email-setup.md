# 🎓 FolioTech Institute - Supabase Email Setup

This project has been configured with custom branded email templates and proper redirect URL configuration for Supabase authentication.

## ✨ What's Been Set Up

### 1. **Redirect URL Fix** ✅
- **Production**: `https://foliotechinstitute.com/auth/callback`
- **Development**: `http://localhost:3000/auth/callback`
- **Local**: `http://localhost:3000`

### 2. **Custom Email Templates** ✅
- **Signup Confirmation** - Blue theme with welcome message
- **Password Recovery** - Red theme with security info
- **Magic Link** - Purple theme for passwordless login
- **Email Change** - Green theme for email updates
- **Invite** - Orange theme for user invitations

### 3. **Branded Design Features** ✅
- FolioTech Institute branding and colors
- Mobile-responsive design (max 600px width)
- Professional gradient headers
- Clear call-to-action buttons
- Security notices and information
- Contact information in footer

## 🚀 Quick Start

### Option 1: Run the Setup Script (Windows)
```powershell
.\scripts\setup-supabase-emails.ps1
```

### Option 2: Manual Setup
1. **Update Supabase Dashboard**:
   - Go to Authentication > Settings
   - Set Site URL: `https://foliotechinstitute.com`
   - Add redirect URLs (see configuration guide)

2. **Configure Email Templates**:
   - Go to Authentication > Email Templates
   - Copy content from `supabase/templates/` files
   - Update subjects and content for each type

3. **Test Locally**:
   - Start development server: `npm run dev`
   - Test signup flow with test email
   - Verify custom templates are used

## 📁 File Structure

```
supabase/
├── config.toml                 # Local development config
├── production-config.toml      # Production-ready config
└── templates/                  # Custom email templates
    ├── confirmation.html       # Signup confirmation
    ├── recovery.html          # Password reset
    ├── magic_link.html        # Magic link login
    ├── email_change.html      # Email change confirmation
    └── invite.html            # User invitations

docs/
└── supabase-email-setup.md    # Detailed setup guide

scripts/
├── setup-supabase-emails.sh   # Linux/Mac setup script
└── setup-supabase-emails.ps1  # Windows PowerShell script
```

## 🔧 Configuration

### Environment Variables
Add these to your `.env` file:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Site URLs
VITE_SITE_URL=https://foliotechinstitute.com
VITE_LOCAL_URL=http://localhost:3000
```

### Supabase Dashboard Settings
- **Site URL**: `https://foliotechinstitute.com`
- **Redirect URLs**: Include both production and localhost
- **Email Templates**: Customize with HTML from template files
- **SMTP** (Optional): Configure for custom email delivery

## 🧪 Testing

### Local Development Testing
1. Start development server: `npm run dev`
2. Test signup flow with test email
3. Check email for custom template
4. Verify redirect URLs work correctly

### Production Testing
1. Deploy application
2. Test with real email addresses
3. Verify custom templates are used
4. Confirm redirect URLs work in production

## 📧 Email Template Features

### Design Features
- **Responsive**: Mobile-friendly design
- **Branded**: FolioTech Institute colors and branding
- **Professional**: Clean, modern layout
- **Accessible**: Clear typography and contrast
- **Secure**: Security notices and information

### Template Variables
All templates use Supabase standard variables:
- `{{ .ConfirmationURL }}`: Action link
- `{{ .CurrentYear }}`: Current year
- `{{ .Email }}`: User's email
- `{{ .TokenHash }}`: Security token

## 🚨 Troubleshooting

### Common Issues
- **Default templates still showing**: Check template is saved in dashboard
- **Redirect errors**: Verify URLs are exactly as specified
- **Emails not sending**: Check SMTP settings and logs
- **Local development issues**: Confirm localhost URLs are configured

### Debug Steps
1. Check Supabase dashboard logs
2. Verify environment variables
3. Test with different email addresses
4. Check browser console for errors
5. Verify network requests

## 📚 Documentation

- **Setup Guide**: `docs/supabase-email-setup.md`
- **Production Config**: `supabase/production-config.toml`
- **Template Examples**: `supabase/templates/`

## 🎯 Next Steps

1. **Configure Supabase Dashboard** with the settings above
2. **Test email flow** locally with development server
3. **Deploy to production** when ready
4. **Monitor email delivery** and user experience
5. **Customize templates** further if needed

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section
2. Review Supabase dashboard logs
3. Verify configuration settings
4. Test with different email providers
5. Contact Supabase support if needed

---

**Status**: ✅ **Complete** - All email templates and configuration files are ready for use.

**Last Updated**: $(Get-Date -Format "yyyy-MM-dd")
**Version**: 1.0.0
