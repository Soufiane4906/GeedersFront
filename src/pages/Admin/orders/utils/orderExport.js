// orderExportUtils.js
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

// Format date for export
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

// Generate PDF for a single order
export const generateOrderPDF = (order, ambassador, guest) => {
    const doc = new jsPDF();

    // Add header
    doc.setFontSize(20);
    doc.setTextColor(37, 99, 235); // Primary blue color
    doc.text('Order Details', 14, 22);

    // Add order info
    doc.setFontSize(12);
    doc.setTextColor(51, 65, 85); // Text color

    const orderInfo = [
        ['Order ID:', order._id],
        ['Service:', order.title],
        ['Status:', order.isCompleted ? 'Completed' : 'Pending'],
        ['Created Date:', formatDate(order.createdAt)],
        ['Location:', order.location || 'N/A'],
        ['Duration:', order.duration ? `${order.duration} hours` : 'N/A'],
        ['Base Price:', `$${order.price}`],
        ['Total Price:', `$${order.totalprice || order.price}`],
        ['Payment ID:', order.payment_intent || 'N/A']
    ];

    doc.autoTable({
        startY: 30,
        head: [['Property', 'Value']],
        body: orderInfo,
        theme: 'grid',
        headStyles: {
            fillColor: [37, 99, 235],
            textColor: [255, 255, 255]
        },
        styles: {
            fontSize: 10
        }
    });

    // Add Ambassador info if available
    if (ambassador) {
        doc.setFontSize(16);
        doc.setTextColor(37, 99, 235);
        doc.text('Ambassador Details', 14, doc.autoTable.previous.finalY + 20);

        const ambassadorInfo = [
            ['Username:', ambassador.username],
            ['Email:', ambassador.email],
            ['Country:', ambassador.country],
            ['Phone:', ambassador.phone || 'Not provided']
        ];

        doc.autoTable({
            startY: doc.autoTable.previous.finalY + 25,
            body: ambassadorInfo,
            theme: 'grid',
            styles: {
                fontSize: 10
            }
        });
    }

    // Add Guest info if available
    if (guest) {
        doc.setFontSize(16);
        doc.setTextColor(37, 99, 235);
        doc.text('Guest Details', 14, doc.autoTable.previous.finalY + 20);

        const guestInfo = [
            ['Username:', guest.username],
            ['Email:', guest.email],
            ['Country:', guest.country],
            ['Phone:', guest.phone || 'Not provided']
        ];

        doc.autoTable({
            startY: doc.autoTable.previous.finalY + 25,
            body: guestInfo,
            theme: 'grid',
            styles: {
                fontSize: 10
            }
        });
    }

    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(128, 128, 128);
        doc.text(
            `Page ${i} of ${pageCount} - Generated on ${new Date().toLocaleDateString()}`,
            doc.internal.pageSize.width / 2,
            doc.internal.pageSize.height - 10,
            { align: 'center' }
        );
    }

    // Save the PDF
    doc.save(`Order_${order._id}.pdf`);
};

// Generate Excel for a single order
export const generateOrderExcel = (order, ambassador, guest) => {
    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Prepare order data
    const orderData = [
        ['Order Details', ''],
        ['Order ID', order._id],
        ['Service', order.title],
        ['Status', order.isCompleted ? 'Completed' : 'Pending'],
        ['Created Date', formatDate(order.createdAt)],
        ['Location', order.location || 'N/A'],
        ['Duration', order.duration ? `${order.duration} hours` : 'N/A'],
        ['Base Price', `$${order.price}`],
        ['Total Price', `$${order.totalprice || order.price}`],
        ['Payment ID', order.payment_intent || 'N/A'],
        ['', ''] // Empty row for spacing
    ];

    // Add ambassador data if available
    if (ambassador) {
        orderData.push(
            ['Ambassador Details', ''],
            ['Username', ambassador.username],
            ['Email', ambassador.email],
            ['Country', ambassador.country],
            ['Phone', ambassador.phone || 'Not provided'],
            ['', ''] // Empty row for spacing
        );
    }

    // Add guest data if available
    if (guest) {
        orderData.push(
            ['Guest Details', ''],
            ['Username', guest.username],
            ['Email', guest.email],
            ['Country', guest.country],
            ['Phone', guest.phone || 'Not provided']
        );
    }

    // Create worksheet from data
    const ws = XLSX.utils.aoa_to_sheet(orderData);

    // Set column widths
    const wscols = [
        { wch: 20 },  // Column A width
        { wch: 50 }   // Column B width
    ];
    ws['!cols'] = wscols;

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Order Details');

    // Write and save the Excel file
    XLSX.writeFile(wb, `Order_${order._id}.xlsx`);
};

// Generate PDF for multiple orders
export const generateOrdersPDF = (orders) => {
    const doc = new jsPDF('landscape');

    // Add header
    doc.setFontSize(20);
    doc.setTextColor(37, 99, 235); // Primary blue color
    doc.text('Orders Report', 14, 22);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 30);

    // Prepare table data
    const tableHeaders = [
        'Order ID',
        'Service',
        'Status',
        'Date',
        'Location',
        'Price',
        'Payment ID',
        'Guest',
        'Ambassador'
    ];

    const tableData = orders.map(order => [
        order._id.substring(0, 10) + '...',
        order.title,
        order.isCompleted ? 'Completed' : 'Pending',
        formatDate(order.createdAt),
        order.location || 'N/A',
        `$${order.totalprice || order.price}`,
        (order.payment_intent ? order.payment_intent.substring(0, 10) + '...' : 'N/A'),
        order.guestName || order.buyer || 'N/A',
        order.ambassadorName || order.seller || 'N/A'
    ]);

    // Add table
    doc.autoTable({
        startY: 40,
        head: [tableHeaders],
        body: tableData,
        theme: 'grid',
        headStyles: {
            fillColor: [37, 99, 235],
            textColor: [255, 255, 255],
            fontSize: 9
        },
        styles: {
            fontSize: 8,
            cellPadding: 2
        },
        columnStyles: {
            0: { cellWidth: 30 }, // Order ID
            1: { cellWidth: 40 }, // Service
            6: { cellWidth: 30 }, // Payment ID
        }
    });

    // Add footer with pagination
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(128, 128, 128);
        doc.text(
            `Page ${i} of ${pageCount} - Total Orders: ${orders.length}`,
            doc.internal.pageSize.width / 2,
            doc.internal.pageSize.height - 10,
            { align: 'center' }
        );
    }

    // Save the PDF
    doc.save(`Orders_Report_${new Date().toISOString().split('T')[0]}.pdf`);
};

// Generate Excel for multiple orders
export const generateOrdersExcel = (orders) => {
    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Prepare data
    const tableHeaders = [
        'Order ID',
        'Service',
        'Status',
        'Date',
        'Location',
        'Duration',
        'Base Price',
        'Total Price',
        'Payment ID',
        'Guest',
        'Ambassador'
    ];

    const tableData = orders.map(order => [
        order._id,
        order.title,
        order.isCompleted ? 'Completed' : 'Pending',
        formatDate(order.createdAt),
        order.location || 'N/A',
        order.duration ? `${order.duration} hours` : 'N/A',
        order.price,
        order.totalprice || order.price,
        order.payment_intent || 'N/A',
        order.guestName || order.buyer || 'N/A',
        order.ambassadorName || order.seller || 'N/A'
    ]);

    // Add header row to the data
    tableData.unshift(tableHeaders);

    // Create worksheet from data
    const ws = XLSX.utils.aoa_to_sheet(tableData);

    // Set column widths
    const wscols = [
        { wch: 24 },  // Order ID
        { wch: 30 },  // Service
        { wch: 10 },  // Status
        { wch: 12 },  // Date
        { wch: 15 },  // Location
        { wch: 10 },  // Duration
        { wch: 10 },  // Base Price
        { wch: 10 },  // Total Price
        { wch: 24 },  // Payment ID
        { wch: 20 },  // Guest
        { wch: 20 }   // Ambassador
    ];
    ws['!cols'] = wscols;

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Orders');

    // Write and save the Excel file
    XLSX.writeFile(wb, `Orders_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
};

// Print order function
export const printOrder = (order, ambassador, guest) => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');

    // Style for the print view
    const style = `
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 20px;
                color: #333;
            }
            .order-header {
                border-bottom: 2px solid #2563eb;
                padding-bottom: 10px;
                margin-bottom: 20px;
            }
            h1 {
                color: #2563eb;
                margin: 0;
            }
            .print-date {
                color: #666;
                font-size: 12px;
                margin-top: 5px;
            }
            .section {
                margin-bottom: 20px;
                padding-bottom: 10px;
            }
            .section-title {
                color: #2563eb;
                border-bottom: 1px solid #e5e7eb;
                padding-bottom: 5px;
                margin-bottom: 10px;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
            }
            th, td {
                text-align: left;
                padding: 8px;
                border-bottom: 1px solid #e5e7eb;
            }
            th {
                background-color: #f3f4f6;
                font-weight: bold;
            }
            .label {
                font-weight: bold;
                width: 150px;
            }
            @media print {
                .no-print {
                    display: none;
                }
            }
            .status {
                display: inline-block;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 14px;
                font-weight: bold;
            }
            .completed {
                background-color: #dcfce7;
                color: #166534;
            }
            .pending {
                background-color: #fee2e2;
                color: #991b1b;
            }
            .footer {
                margin-top: 30px;
                text-align: center;
                font-size: 12px;
                color: #666;
                border-top: 1px solid #e5e7eb;
                padding-top: 10px;
            }
        </style>
    `;

    // Generate the content for the print window
    let content = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Order ${order._id}</title>
            ${style}
        </head>
        <body>
            <div class="no-print" style="margin-bottom: 20px; text-align: right;">
                <button onclick="window.print()">Print</button>
                <button onclick="window.close()">Close</button>
            </div>

            <div class="order-header">
                <h1>Order Details</h1>
                <div class="print-date">Printed on ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</div>
            </div>

            <div class="section">
                <h2 class="section-title">Order Information</h2>
                <table>
                    <tr>
                        <td class="label">Order ID:</td>
                        <td>${order._id}</td>
                    </tr>
                    <tr>
                        <td class="label">Service:</td>
                        <td>${order.title}</td>
                    </tr>
                    <tr>
                        <td class="label">Status:</td>
                        <td><span class="status ${order.isCompleted ? 'completed' : 'pending'}">${order.isCompleted ? 'Completed' : 'Pending'}</span></td>
                    </tr>
                    <tr>
                        <td class="label">Created Date:</td>
                        <td>${formatDate(order.createdAt)}</td>
                    </tr>
                    <tr>
                        <td class="label">Location:</td>
                        <td>${order.location || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td class="label">Duration:</td>
                        <td>${order.duration ? `${order.duration} hours` : 'N/A'}</td>
                    </tr>
                    <tr>
                        <td class="label">Base Price:</td>
                        <td>$${order.price}</td>
                    </tr>
                    <tr>
                        <td class="label">Total Price:</td>
                        <td>$${order.totalprice || order.price}</td>
                    </tr>
                    <tr>
                        <td class="label">Payment ID:</td>
                        <td>${order.payment_intent || 'N/A'}</td>
                    </tr>
                </table>
            </div>
    `;

    // Add Ambassador information if available
    if (ambassador) {
        content += `
            <div class="section">
                <h2 class="section-title">Ambassador Details</h2>
                <table>
                    <tr>
                        <td class="label">Username:</td>
                        <td>${ambassador.username}</td>
                    </tr>
                    <tr>
                        <td class="label">Email:</td>
                        <td>${ambassador.email}</td>
                    </tr>
                    <tr>
                        <td class="label">Country:</td>
                        <td>${ambassador.country}</td>
                    </tr>
                    <tr>
                        <td class="label">Phone:</td>
                        <td>${ambassador.phone || 'Not provided'}</td>
                    </tr>
                </table>
            </div>
        `;
    }

    // Add Guest information if available
    if (guest) {
        content += `
            <div class="section">
                <h2 class="section-title">Guest Details</h2>
                <table>
                    <tr>
                        <td class="label">Username:</td>
                        <td>${guest.username}</td>
                    </tr>
                    <tr>
                        <td class="label">Email:</td>
                        <td>${guest.email}</td>
                    </tr>
                    <tr>
                        <td class="label">Country:</td>
                        <td>${guest.country}</td>
                    </tr>
                    <tr>
                        <td class="label">Phone:</td>
                        <td>${guest.phone || 'Not provided'}</td>
                    </tr>
                </table>
            </div>
        `;
    }

    // Complete the HTML structure
    content += `
            <div class="footer">
                This is a system-generated document for Order ID: ${order._id}
            </div>
        </body>
        </html>
    `;

    // Write the content to the new window and trigger print
    printWindow.document.open();
    printWindow.document.write(content);
    printWindow.document.close();

    // Auto-print when ready
    printWindow.onload = function() {
        setTimeout(() => {
            printWindow.focus();
        }, 100);
    };
};