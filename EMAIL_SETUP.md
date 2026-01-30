# Email Configuration Setup

This document explains how to configure the email confirmation system for order confirmations.

## Environment Variables

Add the following environment variables to your `.env` file:

```env
# SMTP Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

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

## Testing

The email system will automatically send confirmation emails when orders are created. If email configuration is missing, the system will log a warning but won't break order creation.

## Email Template

The email template matches the PDF format provided and includes:
- Invoice number (first 8 characters of order ID)
- Order date
- User details (name, email, company)
- Service provider details (caterer information)
- Order items table
- Subtotal, tax (10%), and total
- Footer with contact information
