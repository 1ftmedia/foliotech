# Application Email Confirmation System Setup Guide

This guide explains how to set up the automated email confirmation system for student application submissions.

## 🎯 Overview

When a student submits an application form:

1. **Form data is saved** to the `applications` table in Supabase
2. **Confirmation emails are sent** to both the applicant and admin
3. **Emails include** application details, reference ID, and next steps
4. **System is fault-tolerant** - emails won't block form submission if they fail

## 🚀 Implementation Options

We've implemented **two approaches** for maximum reliability:

### Option 1: Direct API Integration (Recommended)
- **Location**: `src/server/services/applicationEmailService.js`
- **Trigger**: Directly from the `submitApplication` function
- **Pros**: Immediate execution, easier debugging
- **Cons**: Requires server-side email configuration

### Option 2: Supabase Edge Function + Webhook
- **Location**: `supabase/functions/application-email/index.ts`
- **Trigger**: Database webhook when new application is inserted
- **Pros**: Serverless, scalable, independent of main application
- **Cons**: Slight delay, requires webhook setup

## 📧 Email Templates

### Applicant Confirmation Email
- **Subject**: "Application Submitted Successfully - FolioTech Institute"
- **Content**:
  - Personalized greeting
  - Application reference ID
  - Application summary (name, program, course, date)
  - Next steps (review process, timeline)
  - Contact information
  - Professional branding

### Admin Notification Email
- **Subject**: "New Application Received: [Name] - [Program]"
- **Content**:
  - Alert-style notification
  - Complete application details
  - Quick action buttons
  - Review timeline reminder

## ⚙️ Setup Instructions

### Step 1: Configure Email Service

#### For Gmail (Recommended)
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification if not already enabled
3. Go to "App passwords"
4. Create new app password:
   - **App**: Mail
   - **Device**: Other (Custom name)
   - **Name**: "FolioTech Application Emails"
5. Copy the generated 16-character password

#### For Other SMTP Providers
Configure your SMTP settings in environment variables:
```bash
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_USER=your-email@yourprovider.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@yourdomain.com
SMTP_SECURE=false
```

### Step 2: Set Environment Variables

#### For Direct API Integration
Add to your `.env` file:
```bash
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
SMTP_FROM=your-email@gmail.com
SMTP_SECURE=false

# Admin Email (optional)
ADMIN_EMAIL=admin@foliotechinstitute.com
```

#### For Supabase Edge Function
In your Supabase project dashboard:
1. Go to **Settings** > **API** > **Edge Functions**
2. Add environment variables:
   - `GMAIL_USER`: Your Gmail address
   - `GMAIL_APP_PASSWORD`: Your Gmail app password
   - `ADMIN_EMAIL`: Admin email for notifications

### Step 3: Deploy Edge Function (Option 2)

If using the webhook approach:

1. **Deploy the function**:
   ```bash
   supabase functions deploy application-email
   ```

2. **Set up database webhook**:
   - Go to **Database** > **Webhooks** in Supabase dashboard
   - Create new webhook:
     - **Name**: `application_confirmation_emails`
     - **HTTP Method**: `POST`
     - **URL**: `https://[PROJECT_REF].supabase.co/functions/v1/application-email`
     - **Schema**: `public`
     - **Table**: `applications`
     - **Events**: `INSERT`
     - **HTTP Headers**:
       - Key: `Authorization`
       - Value: `Bearer [YOUR_SERVICE_KEY]`

### Step 4: Test the System

1. **Submit a test application** through your form
2. **Check email delivery**:
   - Applicant should receive confirmation email
   - Admin should receive notification email
3. **Verify logs**:
   - Check browser console for API integration logs
   - Check Supabase Edge Function logs for webhook approach

## 🔧 Configuration Options

### Customizing Email Templates

Edit the email templates in:
- **API Integration**: `src/server/config/applicationEmail.ts`
- **Edge Function**: `supabase/functions/application-email/index.ts`

### Modifying Email Content

Key customization points:
- **Branding colors** and styling
- **Contact information** and addresses
- **Next steps** and timeline information
- **Language** and tone of voice

### Adding New Email Recipients

To send emails to additional recipients:

1. **Modify the email service** to include new recipients
2. **Update environment variables** if needed
3. **Test email delivery** to new addresses

## 🚨 Troubleshooting

### Common Issues

#### 1. Emails Not Sending
**Symptoms**: No confirmation emails received
**Solutions**:
- Check SMTP credentials are correct
- Verify environment variables are set
- Check server logs for SMTP errors
- Test SMTP connection manually

#### 2. Webhook Not Triggering
**Symptoms**: Edge Function not executing
**Solutions**:
- Verify webhook is active in Supabase dashboard
- Check webhook URL is correct
- Ensure proper authorization headers
- Test webhook with sample data

#### 3. Template Rendering Errors
**Symptoms**: Emails sent but content is broken
**Solutions**:
- Check application data structure
- Verify all required fields are present
- Review email template syntax
- Test with minimal data

### Debug Steps

1. **Check Application Logs**:
   ```bash
   # For API integration
   tail -f your-app.log
   
   # For Edge Function
   # Check Supabase dashboard logs
   ```

2. **Test SMTP Connection**:
   ```bash
   # Test with telnet
   telnet smtp.gmail.com 587
   
   # Test with openssl
   openssl s_client -connect smtp.gmail.com:587 -starttls smtp
   ```

3. **Verify Data Flow**:
   - Check form submission in browser console
   - Verify data reaches Supabase
   - Check webhook execution logs
   - Monitor email delivery

## 📊 Monitoring & Maintenance

### Health Checks

Regular monitoring tasks:
- **Email delivery rates** (check spam folders)
- **Webhook execution** success/failure rates
- **SMTP connection** stability
- **Template rendering** errors

### Performance Metrics

Track these metrics:
- **Email send time** (should be < 5 seconds)
- **Webhook response time** (should be < 10 seconds)
- **Error rates** (should be < 1%)
- **Retry attempts** (should be minimal)

### Maintenance Tasks

Monthly maintenance:
- **Review email templates** for accuracy
- **Check SMTP credentials** expiration
- **Update contact information** if needed
- **Review error logs** for patterns

## 🔒 Security Considerations

### Email Security
- **Use app passwords** instead of main passwords
- **Enable 2FA** on email accounts
- **Use SMTP over TLS** for encryption
- **Limit email permissions** to minimum required

### Data Protection
- **Don't include sensitive data** in emails
- **Use secure webhook endpoints**
- **Validate all incoming data**
- **Log access attempts** for monitoring

### Access Control
- **Restrict admin email access** to authorized personnel
- **Use environment variables** for sensitive data
- **Regular credential rotation**
- **Monitor access patterns**

## 🚀 Future Enhancements

### Planned Features
- **Email queue system** for high-volume applications
- **Template customization** through admin panel
- **Multi-language support** for international students
- **Email analytics** and engagement tracking

### Scalability Improvements
- **Batch email processing** for multiple applications
- **Rate limiting** to prevent abuse
- **Email delivery tracking** and reporting
- **Automated retry logic** for failed emails

## 📞 Support

If you encounter issues:

1. **Check this documentation** for common solutions
2. **Review error logs** for specific error messages
3. **Test with minimal configuration** to isolate issues
4. **Contact the development team** with detailed error information

## 📝 Changelog

### Version 1.0.0 (Current)
- ✅ Basic email confirmation system
- ✅ Dual implementation approach
- ✅ Professional email templates
- ✅ Error handling and retry logic
- ✅ Comprehensive documentation

### Future Versions
- 🔄 Email queue system
- 🔄 Template customization
- 🔄 Multi-language support
- 🔄 Analytics dashboard
