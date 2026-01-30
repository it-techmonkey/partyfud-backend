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
      from: `"Party Fud" <${emailConfig.auth.user}>`,
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
