# Email Configuration Setup

This document explains how to configure the email confirmation system for order confirmations.

## Environment Variables

Add the following environment variables to your `.env` file:

```env
# SMTP Email Configuration (Single SMTP Server - Used for all emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Email Sender Addresses (These are the "from" addresses for different email types)
EMAIL_PARTNERSHIP=partnership@partyfud.com
EMAIL_ORDER=order@partyfud.com

# Frontend URL (Optional - for login links in emails)
FRONTEND_URL=https://uae.partyfud.com
```

### Important Notes:

1. **Single SMTP Configuration**: You only need ONE SMTP server configuration. The same SMTP credentials are used to send emails from both `EMAIL_PARTNERSHIP` and `EMAIL_ORDER` addresses.

2. **Email Address Setup**: 
   - The email addresses (`EMAIL_PARTNERSHIP` and `EMAIL_ORDER`) must be configured on your email server/domain
   - For Gmail: You can use Gmail aliases or set up these addresses as forwarding addresses
   - For custom domains: Configure these as email aliases or separate mailboxes on your mail server
   - The SMTP server must allow sending emails with these "from" addresses

3. **SMTP Authentication**: The `SMTP_USER` should be an email account that has permission to send emails from both addresses, or you can use a service account that has been granted this permission.

## Recommended Free SMTP Services

### 1. Gmail (Easiest - Recommended for Development)
**Free tier:** 500 emails/day

**Setup:**
1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this password in `SMTP_PASSWORD`

**Configuration:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-16-char-app-password
```

### 2. Brevo (Sendinblue) - Best for Production
**Free tier:** 300 emails/day (9,000/month)

**Setup:**
1. Sign up at https://www.brevo.com
2. Go to SMTP & API → SMTP
3. Create an SMTP key
4. Use the provided credentials

**Configuration:**
```env
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-brevo-email@example.com
SMTP_PASSWORD=your-smtp-key
```

### 3. Mailgun - Best Monthly Limit
**Free tier:** 5,000 emails/month (first 3 months), then 1,000/month

**Setup:**
1. Sign up at https://www.mailgun.com
2. Verify your domain (or use sandbox for testing)
3. Get SMTP credentials from Settings → Sending → SMTP credentials

**Configuration:**
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=postmaster@your-domain.mailgun.org
SMTP_PASSWORD=your-mailgun-password
```

### 4. SendGrid
**Free tier:** 100 emails/day

**Setup:**
1. Sign up at https://sendgrid.com
2. Create API key in Settings → API Keys
3. Use "apikey" as username and API key as password

**Configuration:**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
```

## Other Email Providers

### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASSWORD=your-password
```

### Zoho Mail
```env
SMTP_HOST=smtp.zoho.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@zoho.com
SMTP_PASSWORD=your-password
```

### Custom SMTP
```env
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-username
SMTP_PASSWORD=your-password
```

## Email Types

The application sends 4 types of emails:

1. **Onboarding Completion** (from `EMAIL_PARTNERSHIP`)
   - Sent to caterer when they complete onboarding
   
2. **Caterer Approval** (from `EMAIL_PARTNERSHIP`)
   - Sent to caterer when admin approves their account
   - Includes direct login link
   
3. **Order Confirmation** (from `EMAIL_ORDER`)
   - Sent to user when they place an order
   - Includes PDF attachment
   
4. **New Order Notification** (from `EMAIL_ORDER`)
   - Sent to caterer when a user places an order
   - Includes customer contact information and order details

## Testing

The email system will automatically send emails when:
- A caterer completes onboarding
- An admin approves a caterer
- A user places an order (both user and caterer receive emails)

If email configuration is missing, the system will log a warning but won't break the main functionality.

## Email Templates

All emails use HTML formatting and match the PartyFud brand design:

- **Order Confirmation Email**: Matches the PDF format and includes:
  - Invoice number (first 8 characters of order ID)
  - Order date
  - User details (name, email, company)
  - Service provider details (caterer information)
  - Order items table
  - Subtotal, tax (10%), and total
  - PDF attachment
  - Footer with contact information

- **Onboarding & Approval Emails**: Professional HTML templates with:
  - PartyFud branding
  - Clear messaging
  - Action buttons/links
  - Contact information

- **New Order Notification**: Includes:
  - Order details (number, date, package, guests, location)
  - Customer contact information (name, email, phone)
  - Order items list
  - Link to order dashboard
