import PDFDocument = require('pdfkit');
import { OrderConfirmationData } from './email';

/**
 * Generate PDF for order confirmation matching the design
 */
export const generateOrderConfirmationPDF = (data: OrderConfirmationData): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
      doc.on('error', reject);

      // Colors - PDFKit accepts hex colors directly
      const primaryColor = '#268700'; // Green
      const textColor = '#000000';
      const lightTextColor = '#6b7280';
      const lineColor = '#e5e7eb';
      const headerBgColor = '#268700'; // Green for table header

      // Header - ORDER CONFIRMATION (main title on left, logo space on right)
      doc.fontSize(28)
         .fillColor(textColor)
         .font('Helvetica-Bold')
         .text('ORDER', 50, 50);
      
      doc.fontSize(28)
         .fillColor(textColor)
         .font('Helvetica-Bold')
         .text('CONFIRMATION', 50, 78);

      // PartyFud logo (right side)
      doc.fontSize(24)
         .fillColor(primaryColor)
         .font('Helvetica-Bold')
         .text('PartyFud', 440, 60, { width: 150 });

      // Invoice Details (single line)
      let yPos = 130;
      doc.fontSize(11)
         .fillColor(textColor)
         .font('Helvetica')
         .text(`Invoice No: ${data.invoiceNo}`, 50, yPos);
      
      doc.fontSize(11)
         .fillColor(textColor)
         .font('Helvetica-Bold')
         .text(`Date: `, 190, yPos, { continued: true })
         .font('Helvetica')
         .text(data.date);

      // Issued To and Service Provider
      yPos = 170;
      const leftColumnX = 50;
      const rightColumnX = 320;

      // ISSUED TO
      doc.fontSize(11)
         .fillColor(textColor)
         .font('Helvetica-Bold')
         .text('ISSUED TO:', leftColumnX, yPos);
      
      yPos += 18;
      doc.fontSize(10)
         .fillColor(textColor)
         .font('Helvetica-Bold')
         .text(data.user.name.toUpperCase(), leftColumnX, yPos);
      yPos += 15;
      
      if (data.user.email) {
        doc.fontSize(10)
           .font('Helvetica')
           .text(data.user.email, leftColumnX, yPos);
        yPos += 15;
      }
      
      if (data.user.company) {
        doc.fontSize(10)
           .font('Helvetica')
           .text(data.user.company, leftColumnX, yPos);
        yPos += 15;
      }
      
      if (data.user.address) {
        doc.fontSize(10)
           .font('Helvetica')
           .text(data.user.address, leftColumnX, yPos);
      }

      // SERVICE PROVIDER
      yPos = 170;
      doc.fontSize(11)
         .fillColor(textColor)
         .font('Helvetica-Bold')
         .text('SERVICE PROVIDER:', rightColumnX, yPos);
      
      yPos += 18;
      doc.fontSize(10)
         .fillColor(textColor)
         .font('Helvetica-Bold')
         .text(data.caterer.name.toUpperCase(), rightColumnX, yPos);
      yPos += 15;
      
      if (data.caterer.company) {
        doc.fontSize(10)
           .font('Helvetica')
           .text(data.caterer.company, rightColumnX, yPos);
        yPos += 15;
      }
      
      if (data.caterer.address) {
        doc.fontSize(10)
           .font('Helvetica')
           .text(data.caterer.address, rightColumnX, yPos);
      }

      // Items Table
      yPos = 280;
      const tableTop = yPos;
      const tableLeft = 50;
      const tableWidth = 500;
      const colWidths = {
        description: 230,
        unitPrice: 90,
        qty: 80,
        total: 100
      };

      // Table Header with green background
      doc.rect(tableLeft, tableTop, tableWidth, 30)
         .fillColor(headerBgColor)
         .fill();

      doc.fontSize(11)
         .fillColor('#FFFFFF')
         .font('Helvetica-Bold')
         .text('DESCRIPTION', tableLeft + 10, tableTop + 10);
      doc.text('UNIT PRICE', tableLeft + colWidths.description + 10, tableTop + 10, { width: colWidths.unitPrice - 10, align: 'center' });
      doc.text('QTY', tableLeft + colWidths.description + colWidths.unitPrice + 10, tableTop + 10, { width: colWidths.qty - 10, align: 'center' });
      doc.text('TOTAL', tableLeft + colWidths.description + colWidths.unitPrice + colWidths.qty + 10, tableTop + 10, { width: colWidths.total - 10, align: 'right' });

      // Table Rows
      let currentY = tableTop + 45;
      
      data.items.forEach((item) => {
        doc.fontSize(10)
           .fillColor(textColor)
           .font('Helvetica')
           .text(item.description, tableLeft + 10, currentY, { width: colWidths.description - 10 });
        
        doc.text(`${item.unitPrice.toLocaleString()}`, 
                 tableLeft + colWidths.description + 10, currentY, 
                 { width: colWidths.unitPrice - 10, align: 'center' });
        
        doc.text(String(item.quantity), 
                 tableLeft + colWidths.description + colWidths.unitPrice + 10, currentY, 
                 { width: colWidths.qty - 10, align: 'center' });
        
        doc.text(`${data.currency} ${item.total.toLocaleString()}`, 
                 tableLeft + colWidths.description + colWidths.unitPrice + colWidths.qty + 10, currentY, 
                 { width: colWidths.total - 10, align: 'right' });

        currentY += 25;
      });

      // Totals Section
      const totalsY = currentY + 30;
      const totalsRight = tableLeft + tableWidth;
      const totalsLabelX = totalsRight - 250;
      const totalsValueX = totalsRight - 100;

      // SUBTOTAL
      doc.fontSize(11)
         .fillColor(textColor)
         .font('Helvetica-Bold')
         .text('SUBTOTAL', totalsLabelX, totalsY);
      doc.text(`${data.currency} ${data.subtotal.toLocaleString()}`, totalsValueX, totalsY, 
               { width: 100, align: 'right' });

      // Tax info (display only, not added to total)
      const taxY = totalsY + 20;
      doc.fontSize(10)
         .fillColor(textColor)
         .font('Helvetica')
         .text(`Tax`, totalsLabelX, taxY);
      doc.text(`${data.taxRate}%`, totalsRight - 150, taxY, { width: 50, align: 'right' });

      // Gray background for final TOTAL row
      const totalY = taxY + 30;
      doc.rect(totalsLabelX - 10, totalY - 5, 260, 25)
         .fillColor('#E5E7EB')
         .fill();

      // SUBTOTAL label (in gray box)
      doc.fontSize(11)
         .fillColor(textColor)
         .font('Helvetica-Bold')
         .text('SUBTOTAL', totalsLabelX, totalY);

      // TOTAL label and amount (in gray box) - same as subtotal since tax is included
      doc.fontSize(11)
         .fillColor(textColor)
         .font('Helvetica-Bold')
         .text('TOTAL', totalsRight - 150, totalY, { width: 50, align: 'center' });
      
      doc.fontSize(12)
         .fillColor(textColor)
         .font('Helvetica-Bold')
         .text(`${data.currency} ${data.subtotal.toLocaleString()}`, totalsValueX, totalY, 
               { width: 100, align: 'right' });

      // Footer
      const footerY = 720;
      
      // Website
      doc.fontSize(10)
         .fillColor(textColor)
         .font('Helvetica')
         .text('uae.partyfud.com', 50, footerY);
      
      // Email
      doc.fontSize(10)
         .fillColor(textColor)
         .font('Helvetica')
         .text('info@partyfud.com', 50, footerY + 15);
      
      // Phone
      doc.fontSize(10)
         .fillColor(textColor)
         .font('Helvetica')
         .text('0123 4567 8901', 50, footerY + 30);
      
      // Tagline
      doc.fontSize(9)
         .font('Helvetica')
         .fillColor(lightTextColor)
         .text('PartyFud: Your trusted partner for premium catering services in Dubai and across UAE.', 
               50, footerY + 55, { width: 400 });

      // Green diagonal design element in bottom right
      doc.save();
      doc.polygon(
        [550, 700],   // Top right corner
        [550, 842],   // Bottom right corner
        [400, 842]    // Bottom left point
      )
      .fillColor(primaryColor)
      .fillOpacity(0.3)
      .fill();
      doc.restore();

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
