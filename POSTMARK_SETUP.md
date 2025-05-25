# Postmark Configuration Guide

This guide explains how to configure Postmark to send real test emails from the InboxInsights application.

## Prerequisites

1. A Postmark account (sign up at [postmarkapp.com](https://postmarkapp.com))
2. A verified sender signature or domain in Postmark
3. Access to your application's environment variables

## Step 1: Get Your Postmark Server Token

1. **Log in to your Postmark account**
2. **Navigate to Servers** in the left sidebar
3. **Select your server** (or create a new one)
4. **Go to the API Tokens tab**
5. **Copy your Server Token** (it starts with something like `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

## Step 2: Set Up Sender Signature

1. **Go to Sender Signatures** in your Postmark account
2. **Add a new signature** with the email address you want to send from
3. **Verify the email address** by clicking the confirmation link sent to your email
4. **Wait for approval** (usually instant for most email providers)

## Step 3: Configure Environment Variables

Add the following variables to your `.env.local` file:

```bash
# Postmark Configuration
POSTMARK_SERVER_TOKEN=your_actual_server_token_here
POSTMARK_FROM_EMAIL=demo@inboxinsights.me
```

### Important Notes:

- **POSTMARK_SERVER_TOKEN**: Replace `your_actual_server_token_here` with your actual Postmark server token
- **POSTMARK_FROM_EMAIL**: This should match a verified sender signature in your Postmark account
- **Security**: Never commit your actual server token to version control

## Step 4: Test the Configuration

1. **Restart your development server** after updating environment variables
2. **Sign in to your application**
3. **Click "Send Test Email"** in the navigation
4. **Check the status indicator** in the modal:
   - ✅ Green: Postmark is configured and ready
   - ⚠️ Yellow: Using simulation mode (Postmark not configured)
5. **Send a test email** and verify it appears in your Postmark activity log

### Email Format

Test emails are sent as **plain text only** with preserved whitespace formatting:

- No HTML content for clean processing by the mood tracking system
- Preserves line breaks and spacing from the original message
- Optimized for AI analysis and data extraction

## Step 5: Verify Email Delivery

1. **Check Postmark Activity** in your dashboard
2. **Look for the test email** in the activity stream
3. **Verify delivery status** (should show as "Delivered")
4. **Check the recipient inbox** (the mood tracking email address)

## Troubleshooting

### Common Issues:

**"Postmark token is invalid"**

- Double-check your server token is correct
- Ensure you're using a Server Token, not an Account Token
- Verify the token has sending permissions

**"Sender signature not verified"**

- Make sure the FROM email address is verified in Postmark
- Check your sender signatures in the Postmark dashboard
- Ensure the email address matches exactly

**"API rate limit exceeded"**

- Postmark has sending limits based on your plan
- Check your account limits in the Postmark dashboard
- Consider upgrading your plan if needed

### Fallback Behavior:

If Postmark is not configured or fails:

- The application automatically falls back to simulation mode
- Test emails are logged to the console instead of being sent
- Users still get feedback that the "email was sent"
- No functionality is lost

## Production Considerations

### Security:

- Use environment variables for sensitive data
- Never expose your server token in client-side code
- Consider using different tokens for development and production

### Monitoring:

- Set up webhooks in Postmark to track delivery status
- Monitor your sending reputation and bounce rates
- Set up alerts for failed deliveries

### Scaling:

- Consider your sending volume limits
- Monitor your monthly email quota
- Plan for growth in your Postmark plan

## Alternative Email Services

If you prefer not to use Postmark, you can modify the email service to use:

- **SendGrid**: Popular alternative with good API
- **Mailgun**: Developer-friendly email service
- **Amazon SES**: Cost-effective for high volume
- **SMTP**: Any SMTP provider (Gmail, Outlook, etc.)

To switch providers, modify the `lib/services/postmark.ts` file to use your preferred email service's API.

## Support

- **Postmark Documentation**: [postmarkapp.com/developer](https://postmarkapp.com/developer)
- **Postmark Support**: Available through their dashboard
- **Application Issues**: Check the browser console and server logs for detailed error messages
