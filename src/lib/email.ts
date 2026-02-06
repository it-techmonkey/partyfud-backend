import * as nodemailer from 'nodemailer';
import { generateOrderConfirmationPDF } from './pdfGenerator';

// Email configuration from environment variables
const emailConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASSWORD || '',
  },
};

// Create reusable transporter
const transporter = nodemailer.createTransport(emailConfig);

// Email sender addresses from environment variables
const EMAIL_ADDRESSES = {
  PARTNERSHIP: process.env.EMAIL_PARTNERSHIP || 'partnership@partyfud.com',
  ORDER: process.env.EMAIL_ORDER || 'order@partyfud.com',
};

export interface OrderConfirmationData {
  invoiceNo: string;
  date: string;
  user: {
    name: string;
    email: string;
    company?: string;
    address?: string;
  };
  caterer: {
    name: string;
    company?: string;
    address?: string;
  };
  items: Array<{
    description: string;
    unitPrice: number;
    quantity: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  taxRate: number;
  total: number;
  currency: string;
}

/**
 * Generate HTML email template for order confirmation
 * Matches the PDF design exactly
 */
export const generateOrderConfirmationHTML = (data: OrderConfirmationData): string => {
  const itemsHTML = data.items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${item.description}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #1f2937;">${data.currency} ${item.unitPrice.toLocaleString()}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center; color: #1f2937;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #1f2937;">${data.currency} ${item.total.toLocaleString()}</td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica', 'Arial', sans-serif; background-color: #ffffff;">
  <div style="max-width: 800px; margin: 0 auto; background-color: #ffffff; padding: 50px 40px;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 50px;">
      <h1 style="color: #268700; margin: 0; font-size: 36px; font-weight: bold; letter-spacing: 1px;">Party Fud</h1>
      <h2 style="color: #1f2937; margin: 15px 0 0 0; font-size: 24px; font-weight: bold; letter-spacing: 2px;">ORDER CONFIRMATION</h2>
    </div>

    <!-- Invoice Details -->
    <div style="margin-bottom: 40px;">
      <p style="margin: 8px 0; color: #6b7280; font-size: 12px; font-weight: normal;"><strong style="color: #1f2937;">Invoice No:</strong> ${data.invoiceNo}</p>
      <p style="margin: 8px 0; color: #6b7280; font-size: 12px; font-weight: normal;"><strong style="color: #1f2937;">Date:</strong> ${data.date}</p>
    </div>

    <!-- Issued To and Service Provider -->
    <div style="display: flex; justify-content: space-between; margin-bottom: 50px; gap: 40px;">
      <div style="flex: 1;">
        <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">ISSUED TO:</h3>
        <p style="margin: 8px 0; color: #1f2937; font-size: 12px; line-height: 1.6;">${data.user.name}</p>
        ${data.user.email ? `<p style="margin: 8px 0; color: #1f2937; font-size: 12px; line-height: 1.6;">${data.user.email}</p>` : ''}
        ${data.user.company ? `<p style="margin: 8px 0; color: #1f2937; font-size: 12px; line-height: 1.6;">${data.user.company}</p>` : ''}
        ${data.user.address ? `<p style="margin: 8px 0; color: #1f2937; font-size: 12px; line-height: 1.6;">${data.user.address}</p>` : ''}
      </div>
      <div style="flex: 1;">
        <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">SERVICE PROVIDER:</h3>
        <p style="margin: 8px 0; color: #1f2937; font-size: 12px; line-height: 1.6;">${data.caterer.name}</p>
        ${data.caterer.company ? `<p style="margin: 8px 0; color: #1f2937; font-size: 12px; line-height: 1.6;">${data.caterer.company}</p>` : ''}
        ${data.caterer.address ? `<p style="margin: 8px 0; color: #1f2937; font-size: 12px; line-height: 1.6;">${data.caterer.address}</p>` : ''}
      </div>
    </div>

    <!-- Items Table -->
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 40px;">
      <thead>
        <tr>
          <th style="padding: 12px 8px; text-align: left; border-bottom: 2px solid #e5e7eb; color: #1f2937; font-weight: bold; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">DESCRIPTION</th>
          <th style="padding: 12px 8px; text-align: right; border-bottom: 2px solid #e5e7eb; color: #1f2937; font-weight: bold; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">UNIT PRICE</th>
          <th style="padding: 12px 8px; text-align: center; border-bottom: 2px solid #e5e7eb; color: #1f2937; font-weight: bold; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">QTY</th>
          <th style="padding: 12px 8px; text-align: right; border-bottom: 2px solid #e5e7eb; color: #1f2937; font-weight: bold; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">TOTAL</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHTML}
      </tbody>
    </table>

    <!-- Totals -->
    <div style="margin-left: auto; width: 300px; margin-bottom: 50px;">
      <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
        <span style="color: #1f2937; font-weight: bold; font-size: 12px;">SUBTOTAL</span>
        <span style="color: #1f2937; font-weight: bold; font-size: 12px;">${data.currency} ${data.subtotal.toLocaleString()}</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
        <span style="color: #1f2937; font-size: 12px;">Tax ${data.taxRate}%</span>
        <span style="color: #1f2937; font-size: 12px;">${data.currency} ${data.tax.toLocaleString()}</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 15px 0; margin-top: 10px; border-top: 2px solid #e5e7eb;">
        <span style="color: #1f2937; font-size: 16px; font-weight: bold;">TOTAL</span>
        <span style="color: #268700; font-size: 16px; font-weight: bold;">${data.currency} ${data.total.toLocaleString()}</span>
      </div>
    </div>

    <!-- Footer -->
    <div style="border-top: 2px solid #e5e7eb; padding-top: 30px; text-align: center; color: #6b7280; font-size: 10px;">
      <p style="margin: 8px 0; color: #6b7280;">🌐 <a href="https://uae.partyfud.com" style="color: #268700; text-decoration: none;">uae.partyfud.com</a></p>
      <p style="margin: 8px 0; color: #6b7280;">✉️ <a href="mailto:info@partyfud.com" style="color: #268700; text-decoration: none;">info@partyfud.com</a></p>
      <p style="margin: 8px 0; color: #6b7280;">📞 0123 4567 8901</p>
      <p style="margin: 20px 0 0 0; font-style: italic; color: #6b7280;">PartyFud: Your trusted partner for premium catering services in Dubai and across UAE.</p>
    </div>
  </div>
</body>
</html>
  `;
};

/**
 * Send order confirmation email with PDF attachment
 */
export const sendOrderConfirmationEmail = async (data: OrderConfirmationData): Promise<void> => {
  try {
    // Verify transporter configuration
    if (!emailConfig.auth.user || !emailConfig.auth.pass) {
      console.warn('Email configuration missing. Skipping email send.');
      return;
    }

    await transporter.verify();

    const html = generateOrderConfirmationHTML(data);
    
    // Generate PDF attachment
    const pdfBuffer = await generateOrderConfirmationPDF(data);

    const mailOptions = {
      from: `"Party Fud" <${EMAIL_ADDRESSES.ORDER}>`,
      replyTo: EMAIL_ADDRESSES.ORDER,
      to: data.user.email,
      subject: `Order Confirmation - Invoice #${data.invoiceNo}`,
      html,
      attachments: [
        {
          filename: `Order-Confirmation-${data.invoiceNo}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent with PDF:', info.messageId);
  } catch (error: any) {
    console.error('Error sending order confirmation email:', error);
    // Don't throw error - email failure shouldn't break order creation
  }
};

// ============================================================================
// PARTNERSHIP EMAILS (from partnership@partyfud.com)
// ============================================================================

/**
 * Generate HTML email template for onboarding completion
 */
export const generateOnboardingCompletionHTML = (catererName: string): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Onboarding Complete</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica', 'Arial', sans-serif; background-color: #f9fafb;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 40px;">
      <h1 style="color: #268700; margin: 0; font-size: 32px; font-weight: bold;">Party Fud</h1>
    </div>

    <!-- Content -->
    <div style="margin-bottom: 40px;">
      <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">Welcome to PartyFud!</h2>
      
      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
        Dear ${catererName},
      </p>
      
      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
        Thank you for completing your onboarding process with PartyFud!
      </p>
      
      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
        We have received all your information and your application is now under review. Our team will carefully review your details and get back to you soon.
      </p>

      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 30px 0;">
        <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">What happens next?</h3>
        <ul style="color: #374151; font-size: 16px; line-height: 1.8; margin: 0; padding-left: 20px;">
          <li>Our admin team will review your application</li>
          <li>You'll receive an email notification once your account is approved</li>
          <li>Once approved, you can start creating packages and receiving orders</li>
        </ul>
      </div>

      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 30px 0 0 0;">
        If you have any questions, please don't hesitate to contact us at <a href="mailto:partnership@partyfud.com" style="color: #268700; text-decoration: none;">partnership@partyfud.com</a>.
      </p>
    </div>

    <!-- Footer -->
    <div style="border-top: 2px solid #e5e7eb; padding-top: 30px; text-align: center; color: #6b7280; font-size: 14px;">
      <p style="margin: 5px 0;">Best regards,</p>
      <p style="margin: 5px 0; font-weight: 600;">The PartyFud Team</p>
      <p style="margin: 20px 0 0 0;">🌐 <a href="https://uae.partyfud.com" style="color: #268700; text-decoration: none;">uae.partyfud.com</a></p>
    </div>
  </div>
</body>
</html>
  `;
};

/**
 * Send onboarding completion email to caterer
 */
export const sendOnboardingCompletionEmail = async (catererEmail: string, catererName: string): Promise<void> => {
  try {
    if (!emailConfig.auth.user || !emailConfig.auth.pass) {
      console.warn('Email configuration missing. Skipping email send.');
      return;
    }

    await transporter.verify();

    const html = generateOnboardingCompletionHTML(catererName);

    const mailOptions = {
      from: `"Party Fud Partnership" <${EMAIL_ADDRESSES.PARTNERSHIP}>`,
      replyTo: EMAIL_ADDRESSES.PARTNERSHIP,
      to: catererEmail,
      subject: 'Welcome to PartyFud - Your Onboarding is Complete!',
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Onboarding completion email sent:', info.messageId);
  } catch (error: any) {
    console.error('Error sending onboarding completion email:', error);
  }
};

/**
 * Generate HTML email template for caterer approval
 */
export const generateCatererApprovalHTML = (catererName: string, loginUrl: string): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Account Approved</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica', 'Arial', sans-serif; background-color: #f9fafb;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 40px;">
      <h1 style="color: #268700; margin: 0; font-size: 32px; font-weight: bold;">Party Fud</h1>
    </div>

    <!-- Content -->
    <div style="margin-bottom: 40px;">
      <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">Congratulations! Your Account Has Been Approved</h2>
      
      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
        Dear ${catererName},
      </p>
      
      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
        Great news! Your PartyFud account has been approved by our admin team.
      </p>

      <div style="background-color: #f0fdf4; border-left: 4px solid #268700; padding: 20px; margin: 30px 0;">
        <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">You can now:</h3>
        <ul style="color: #374151; font-size: 16px; line-height: 1.8; margin: 0; padding-left: 20px;">
          <li>Log in to your caterer dashboard</li>
          <li>Create and manage your dishes</li>
          <li>Set up packages for your customers</li>
          <li>Start receiving orders from customers</li>
        </ul>
      </div>

      <div style="text-align: center; margin: 40px 0;">
        <a href="${loginUrl}" style="display: inline-block; background-color: #268700; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Log In to Dashboard</a>
      </div>

      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 30px 0 0 0;">
        If you need any assistance, our support team is here to help at <a href="mailto:partnership@partyfud.com" style="color: #268700; text-decoration: none;">partnership@partyfud.com</a>.
      </p>

      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 20px 0 0 0;">
        Welcome to PartyFud!
      </p>
    </div>

    <!-- Footer -->
    <div style="border-top: 2px solid #e5e7eb; padding-top: 30px; text-align: center; color: #6b7280; font-size: 14px;">
      <p style="margin: 5px 0;">Best regards,</p>
      <p style="margin: 5px 0; font-weight: 600;">The PartyFud Team</p>
      <p style="margin: 20px 0 0 0;">🌐 <a href="https://uae.partyfud.com" style="color: #268700; text-decoration: none;">uae.partyfud.com</a></p>
    </div>
  </div>
</body>
</html>
  `;
};

/**
 * Send caterer approval email
 */
export const sendCatererApprovalEmail = async (catererEmail: string, catererName: string, loginUrl: string): Promise<void> => {
  try {
    if (!emailConfig.auth.user || !emailConfig.auth.pass) {
      console.warn('Email configuration missing. Skipping email send.');
      return;
    }

    await transporter.verify();

    const html = generateCatererApprovalHTML(catererName, loginUrl);

    const mailOptions = {
      from: `"Party Fud Partnership" <${EMAIL_ADDRESSES.PARTNERSHIP}>`,
      replyTo: EMAIL_ADDRESSES.PARTNERSHIP,
      to: catererEmail,
      subject: 'Congratulations! Your PartyFud Account Has Been Approved',
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Caterer approval email sent:', info.messageId);
  } catch (error: any) {
    console.error('Error sending caterer approval email:', error);
  }
};

// ============================================================================
// ORDER EMAILS (from order@partyfud.com)
// ============================================================================

export interface NewOrderNotificationData {
  orderNumber: string;
  orderDate: string;
  catererEmail: string;
  catererName: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  packageName: string;
  guestCount: number;
  eventDate?: string;
  eventTime?: string;
  location?: string;
  totalPrice: number;
  currency: string;
  items: Array<{
    description: string;
    quantity: number;
    price: number;
  }>;
  orderUrl: string;
}

/**
 * Generate HTML email template for new order notification to caterer
 */
export const generateNewOrderNotificationHTML = (data: NewOrderNotificationData): string => {
  const itemsHTML = data.items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${item.description}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center; color: #1f2937;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #1f2937;">${data.currency} ${item.price.toLocaleString()}</td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Order Received</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica', 'Arial', sans-serif; background-color: #f9fafb;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 40px;">
      <h1 style="color: #268700; margin: 0; font-size: 32px; font-weight: bold;">Party Fud</h1>
      <h2 style="color: #1f2937; margin: 15px 0 0 0; font-size: 20px; font-weight: 600;">New Order Received</h2>
    </div>

    <!-- Content -->
    <div style="margin-bottom: 40px;">
      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
        Dear ${data.catererName},
      </p>
      
      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
        You have received a new order!
      </p>

      <!-- Order Details -->
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">Order Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 40%;">Order Number:</td>
            <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">${data.orderNumber}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Order Date:</td>
            <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">${data.orderDate}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Package:</td>
            <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">${data.packageName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Number of Guests:</td>
            <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">${data.guestCount}</td>
          </tr>
          ${data.eventDate ? `
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Event Date:</td>
            <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">${data.eventDate}</td>
          </tr>
          ` : ''}
          ${data.eventTime ? `
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Event Time:</td>
            <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">${data.eventTime}</td>
          </tr>
          ` : ''}
          ${data.location ? `
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Location:</td>
            <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">${data.location}</td>
          </tr>
          ` : ''}
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Total Amount:</td>
            <td style="padding: 8px 0; color: #268700; font-size: 16px; font-weight: bold;">${data.currency} ${data.totalPrice.toLocaleString()}</td>
          </tr>
        </table>
      </div>

      <!-- Customer Information -->
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">Customer Information</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 40%;">Name:</td>
            <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">${data.customerName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Email:</td>
            <td style="padding: 8px 0; color: #1f2937; font-size: 14px;"><a href="mailto:${data.customerEmail}" style="color: #268700; text-decoration: none;">${data.customerEmail}</a></td>
          </tr>
          ${data.customerPhone ? `
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Phone:</td>
            <td style="padding: 8px 0; color: #1f2937; font-size: 14px;"><a href="tel:${data.customerPhone}" style="color: #268700; text-decoration: none;">${data.customerPhone}</a></td>
          </tr>
          ` : ''}
        </table>
      </div>

      <!-- Order Items -->
      <div style="margin-bottom: 30px;">
        <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">Order Items</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f3f4f6;">
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb; color: #1f2937; font-weight: 600; font-size: 12px;">DESCRIPTION</th>
              <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb; color: #1f2937; font-weight: 600; font-size: 12px;">QTY</th>
              <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb; color: #1f2937; font-weight: 600; font-size: 12px;">PRICE</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>
      </div>

      <!-- CTA Button -->
      <div style="text-align: center; margin: 40px 0;">
        <a href="${data.orderUrl}" style="display: inline-block; background-color: #268700; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">View Order in Dashboard</a>
      </div>

      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 30px 0 0 0;">
        Please log in to your dashboard to view full order details and manage this order.
      </p>
    </div>

    <!-- Footer -->
    <div style="border-top: 2px solid #e5e7eb; padding-top: 30px; text-align: center; color: #6b7280; font-size: 14px;">
      <p style="margin: 5px 0;">Best regards,</p>
      <p style="margin: 5px 0; font-weight: 600;">The PartyFud Team</p>
      <p style="margin: 20px 0 0 0;">🌐 <a href="https://uae.partyfud.com" style="color: #268700; text-decoration: none;">uae.partyfud.com</a></p>
    </div>
  </div>
</body>
</html>
  `;
};

/**
 * Send new order notification email to caterer
 */
export const sendNewOrderNotificationEmail = async (data: NewOrderNotificationData): Promise<void> => {
  try {
    if (!emailConfig.auth.user || !emailConfig.auth.pass) {
      console.warn('Email configuration missing. Skipping email send.');
      return;
    }

    await transporter.verify();

    const html = generateNewOrderNotificationHTML(data);

    const mailOptions = {
      from: `"Party Fud Orders" <${EMAIL_ADDRESSES.ORDER}>`,
      replyTo: EMAIL_ADDRESSES.ORDER,
      to: data.catererEmail,
      subject: `New Order Received - Order #${data.orderNumber}`,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('New order notification email sent:', info.messageId);
  } catch (error: any) {
    console.error('Error sending new order notification email:', error);
  }
};
