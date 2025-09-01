# Application Email Confirmation Edge Function

This Edge Function sends automated email confirmations when a new student application is submitted.

## Functionality

When triggered by a database webhook, this function:

1. **Receives the webhook payload** containing application form data
2. **Sends confirmation email to the applicant** with:
   - Thank you message
   - Application reference ID
   - Application summary (name, program, course, submission date)
   - Next steps information
   - Contact details
3. **Sends notification email to admin** with:
   - Application details
   - Quick action buttons (contact applicant, view application)
   - Review timeline reminder
4. **Implements retry logic** for reliability (3 attempts with exponential backoff)
5. **Returns appropriate success/error responses**

## Email Templates

### Applicant Confirmation Email
- **Subject**: "Application Submitted Successfully - FolioTech Institute"
- **Content**: Professional confirmation with application details and next steps
- **Design**: Branded with FolioTech colors and responsive layout

### Admin Notification Email
- **Subject**: "New Application Received: [Name] - [Program]"
- **Content**: Actionable notification with application summary
- **Design**: Alert-style header with clear call-to-action buttons

## Environment Variables

The following environment variables must be set in your Supabase project:

- `GMAIL_USER`: Your Gmail address
- `GMAIL_APP_PASSWORD`: Your Gmail app password (not your regular password)
- `ADMIN_EMAIL`: Admin email for notifications (optional, defaults to GMAIL_USER)
- `SUPABASE_URL`: Automatically set by Supabase
- `SUPABASE_SERVICE_KEY`: Automatically set by Supabase

## Webhook Configuration

This function is designed to be triggered by a database webhook when a new record is inserted into the `applications` table.

### Webhook Settings:
- **Name**: `application_confirmation_emails`
- **HTTP Method**: `POST`
- **URL**: `https://[YOUR_PROJECT_REF].supabase.co/functions/v1/application-email`
- **Schema**: `public`
- **Table**: `applications`
- **Events**: `INSERT`
- **HTTP Headers**:
  - Key: `Authorization`
  - Value: `Bearer [YOUR_SUPABASE_SERVICE_KEY]`

## Setup Instructions

### 1. Create Gmail App Password
1. Go to your [Google Account](https://myaccount.google.com/)
2. Navigate to Security > 2-Step Verification
3. Scroll down to "App passwords"
4. Create a new app password for "Mail" and "Other (Custom name)"
5. Name it "FolioTech Application Emails"
6. Copy the generated password

### 2. Set Environment Variables
In your Supabase project:
1. Go to Settings > API > Edge Functions
2. Add the following environment variables:
   - `GMAIL_USER`: Your Gmail address
   - `GMAIL_APP_PASSWORD`: The app password you generated
   - `ADMIN_EMAIL`: Admin email for notifications (optional)

### 3. Deploy the Edge Function
The Edge Function is located at `supabase/functions/application-email/index.ts`. Deploy it using the Supabase CLI or through the dashboard.

### 4. Set Up the Database Webhook
1. Go to Database > Webhooks in your Supabase dashboard
2. Create a new webhook with the settings listed above
3. Ensure the webhook is active and properly configured

### 5. Test the System
1. Submit a test application form
2. Check the Edge Function logs for execution details
3. Verify that emails were sent to both applicant and admin

## Error Handling

The function includes comprehensive error handling:

- **SMTP Connection Issues**: Automatic retry with exponential backoff
- **Invalid Data**: Validation of webhook payload
- **Email Sending Failures**: Graceful degradation without blocking application submission
- **Detailed Logging**: Comprehensive error details for debugging

## Security Considerations

- **SMTP over TLS**: Secure email transmission
- **App Password Authentication**: Uses Gmail app password, not main password
- **Webhook Authorization**: Secured with Supabase service key
- **Input Validation**: Validates all incoming data

## Monitoring

Monitor the function through:

1. **Supabase Dashboard**: Edge Function logs
2. **Email Delivery**: Check recipient inboxes
3. **Webhook Status**: Monitor webhook execution in database logs
4. **Error Tracking**: Review error logs for any issues

## Troubleshooting

### Common Issues:

1. **Emails Not Sending**:
   - Check Gmail app password is correct
   - Verify SMTP settings
   - Check Edge Function logs for errors

2. **Webhook Not Triggering**:
   - Verify webhook is active
   - Check webhook URL is correct
   - Ensure proper authorization headers

3. **Template Rendering Issues**:
   - Check application data structure
   - Verify all required fields are present
   - Review Edge Function logs for data validation errors

### Debug Steps:

1. Check Edge Function logs in Supabase dashboard
2. Verify webhook configuration
3. Test with sample data
4. Check environment variables are set correctly
5. Verify Gmail app password permissions

## Performance

- **Concurrent Processing**: Handles multiple applications simultaneously
- **Retry Logic**: 3 attempts with exponential backoff (1s, 2s, 4s delays)
- **Connection Management**: Properly closes SMTP connections
- **Error Recovery**: Continues processing even if individual emails fail

## Future Enhancements

Potential improvements:
- **Email Queue System**: For high-volume applications
- **Template Customization**: Admin-configurable email templates
- **Multi-language Support**: Localized email content
- **Analytics**: Track email open rates and engagement
- **SMS Notifications**: Additional notification channels
