# Supabase Email Configuration & Custom Templates Setup Guide

This guide will help you configure Supabase authentication emails to use custom branded templates and fix the redirect URL issues.

## 🎯 Overview

The setup includes:
- **Redirect URL Fix**: Update Supabase Auth settings to point to production domain
- **Custom Email Templates**: Replace default templates with branded FolioTech Institute designs
- **Local Development Support**: Maintain localhost testing capabilities
- **Production-Ready Configuration**: Ensure all templates work in production

## 🚀 Quick Start

### 1. Supabase Dashboard Configuration

#### Authentication Settings
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to **Authentication** > **Settings**
3. Update the following settings:

**Site URL:**
```
https://foliotechinstitute.com
```

**Redirect URLs:**
```
https://foliotechinstitute.com/auth/callback
http://localhost:3000/auth/callback
http://localhost:3000
```

**Additional Redirect URLs:**
```
https://foliotechinstitute.com/dashboard
https://foliotechinstitute.com/profile
http://localhost:3000/dashboard
http://localhost:3000/profile
```

#### Email Templates Configuration
1. Go to **Authentication** > **Email Templates**
2. For each template type, click **Customize** and paste the corresponding HTML content:

**Signup Confirmation:**
- Subject: `Confirm your email address - FolioTech Institute`
- Content: Use `supabase/templates/confirmation.html`

**Password Recovery:**
- Subject: `Reset your password - FolioTech Institute`
- Content: Use `supabase/templates/recovery.html`

**Magic Link:**
- Subject: `Your magic link - FolioTech Institute`
- Content: Use `supabase/templates/magic_link.html`

**Email Change:**
- Subject: `Confirm your new email address - FolioTech Institute`
- Content: Use `supabase/templates/email_change.html`

**Invite:**
- Subject: `You have been invited to join FolioTech Institute`
- Content: Use `supabase/templates/invite.html`

### 2. Environment Variables

Update your `.env` file with the correct Supabase configuration:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Production Site URL
VITE_SITE_URL=https://foliotechinstitute.com

# Local Development
VITE_LOCAL_URL=http://localhost:3000
```

### 3. SMTP Configuration (Optional)

If you want to use custom SMTP instead of Supabase's default email service:

1. Go to **Authentication** > **Settings** > **SMTP Settings**
2. Configure your SMTP provider:

```bash
SMTP Host: smtp.gmail.com
SMTP Port: 587
SMTP User: noreply@foliotechinstitute.com
SMTP Password: [your-app-password]
Sender Name: FolioTech Institute
```

## 🔧 Local Development Setup

### Development Environment
For local development, the configuration automatically supports:
- `http://localhost:3000` for local testing
- `http://localhost:3000/auth/callback` for auth callbacks
- Production URLs for actual email links

### Testing Email Templates
1. Start your local development server: `npm run dev`
2. Test signup flow with a test email
3. Check that confirmation emails use the custom template
4. Verify redirect URLs work correctly

## 📧 Email Template Features

### Design Features
- **Responsive Design**: Mobile-friendly with max 600px width
- **Branded Headers**: FolioTech Institute branding with gradient backgrounds
- **Action Buttons**: Prominent, styled CTA buttons
- **Security Notices**: Clear security warnings and information
- **Professional Footer**: Contact information and branding

### Template Types
1. **Confirmation** (Blue theme): Email signup confirmation
2. **Recovery** (Red theme): Password reset requests
3. **Magic Link** (Purple theme): Passwordless login
4. **Email Change** (Green theme): Email address updates
5. **Invite** (Orange theme): User invitations

### Template Variables
All templates use Supabase's standard template variables:
- `{{ .ConfirmationURL }}`: The confirmation/reset link
- `{{ .CurrentYear }}`: Current year for copyright
- `{{ .Email }}`: User's email address
- `{{ .TokenHash }}`: Security token hash

## 🚀 Production Deployment

### 1. Verify Configuration
Before deploying to production:
- [ ] All redirect URLs are correctly set
- [ ] Email templates are customized
- [ ] SMTP settings are configured (if using custom SMTP)
- [ ] Environment variables are set correctly

### 2. Test Production Flow
1. Deploy your application
2. Test signup flow with a real email
3. Verify confirmation emails are sent with custom templates
4. Confirm redirect URLs work correctly
5. Test password recovery and magic link flows

### 3. Monitor Email Delivery
- Check Supabase logs for email delivery status
- Monitor bounce rates and delivery failures
- Verify email authentication (SPF, DKIM, DMARC)

## 🔍 Troubleshooting

### Common Issues

#### Emails Still Using Default Template
- Ensure you've saved the custom template in Supabase dashboard
- Check that the template is active and not overridden
- Verify SMTP settings if using custom email provider

#### Redirect URL Errors
- Confirm redirect URLs are exactly as specified
- Check for trailing slashes or typos
- Ensure both production and localhost URLs are included

#### Email Not Sending
- Verify SMTP credentials are correct
- Check Supabase logs for error messages
- Ensure email templates are properly formatted

#### Local Development Issues
- Confirm localhost URLs are in redirect list
- Check that development environment variables are set
- Verify local Supabase instance configuration

### Debug Steps
1. Check Supabase dashboard logs
2. Verify environment variable configuration
3. Test with different email addresses
4. Check browser console for errors
5. Verify network requests in browser dev tools

## 📚 Additional Resources

### Supabase Documentation
- [Authentication Guide](https://supabase.com/docs/guides/auth)
- [Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates)
- [SMTP Configuration](https://supabase.com/docs/guides/auth/auth-smtp)

### Email Best Practices
- [Email Client Compatibility](https://www.campaignmonitor.com/dev-resources/guides/coding-html-emails/)
- [Responsive Email Design](https://www.emailonacid.com/blog/article/email-development/email-coding-best-practices/)
- [Email Authentication](https://dmarc.org/)

## 🎉 Success Checklist

- [ ] Supabase Auth settings updated with production URLs
- [ ] Local development URLs maintained
- [ ] Custom email templates configured
- [ ] All template types customized
- [ ] SMTP settings configured (if applicable)
- [ ] Environment variables updated
- [ ] Local development tested
- [ ] Production deployment verified
- [ ] Email delivery confirmed
- [ ] Redirect flows working correctly

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Supabase dashboard logs
3. Verify configuration settings
4. Test with different email providers
5. Contact Supabase support if needed

---

**Note**: This configuration ensures that your FolioTech Institute emails are professionally branded while maintaining full functionality for both local development and production environments.
