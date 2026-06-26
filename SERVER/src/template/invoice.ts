export const invoiceTemplate = (order: any) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    html, body {
        height: 100%;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    body {
        font-family: 'Inter', sans-serif;
        color: #1f2937;
        background-color: #ffffff;
    }
    .invoice-box {
        max-width: 800px;
        display: flex;
        flex-direction: column;
        height: 100%;
        justify-content: space-between;
        margin: auto;
        background: #ffffff;
        padding: 40px;
        border-radius: 0;
        box-sizing: border-box;
    }
    .header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        border-bottom: 2px solid #1f2937;
        padding-bottom: 20px;
        margin-bottom: 30px;
    }
    .header-left h1 {
        font-size: 28px;
        font-weight: 700;
        margin: 0;
        color: #111827;
        letter-spacing: -0.5px;
    }
    .header-left p {
        margin: 4px 0 0 0;
        color: #4b5563;
        font-size: 14px;
    }
    .header-right {
        text-align: right;
    }
    .header-right h2 {
        font-size: 22px;
        font-weight: 700;
        color: #111827;
        margin: 0 0 6px 0;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    .info-grid {
        display: flex;
        justify-content: space-between;
        margin-bottom: 30px;
        gap: 20px;
    }
    .info-section {
        flex: 1;
        background: #ffffff;
        border: 1px solid #e5e7eb;
        padding: 16px;
        border-radius: 6px;
    }
    .info-section h3 {
        font-size: 13px;
        font-weight: 700;
        color: #1f2937;
        margin: 0 0 10px 0;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    .info-section p {
        margin: 4px 0;
        font-size: 13px;
        line-height: 1.5;
        color: #4b5563;
    }
    .info-section strong {
        color: #111827;
    }
    table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 30px;
    }
    th {
        border-top: 1px solid #111827;
        border-bottom: 1px solid #111827;
        color: #111827;
        font-weight: 700;
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        padding: 10px 8px;
        text-align: left;
    }
    th.right, td.right {
        text-align: right;
    }
    th.center, td.center {
        text-align: center;
    }
    td {
        padding: 12px 8px;
        border-bottom: 1px solid #e5e7eb;
        color: #374151;
        font-size: 13px;
        vertical-align: middle;
    }
    td.product-details .title {
        font-weight: 600;
        color: #111827;
        margin-bottom: 4px;
        display: block;
    }
    td.product-details .meta {
        font-size: 11px;
        color: #6b7280;
    }
    .summary-container {
        display: flex;
        justify-content: flex-end;
    }
    .summary-box {
        width: 300px;
    }
    .summary-row {
        display: flex;
        justify-content: space-between;
        padding: 10px 0;
        border-bottom: 1px solid #f3f4f6;
        font-size: 13px;
        color: #4b5563;
    }
    .summary-row.total {
        border-top: 1px solid #111827;
        border-bottom: 1px solid #111827;
        padding: 12px 0;
        font-size: 16px;
        font-weight: 700;
        color: #111827;
        margin-top: 6px;
    }
    .summary-row.total .amount {
        color: #111827;
    }
    .footer {
        margin-top: 40px;
        text-align: center;
        padding-top: 20px;
        border-top: 1px solid #e5e7eb;
        color: #6b7280;
        font-size: 13px;
    }
    .badge {
        font-weight: 600;
        text-transform: uppercase;
        font-size: 11px;
    }
    .badge-paid {
        color: #16a34a;
    }
    .badge-unpaid {
        color: #dc2626;
    }
</style>
</head>
<body>
    <div class="invoice-box">
        <div>
        <div class="header">
            <div class="header-left">
                <h1>VASTRA_VERSE</h1>
                <p>Premium Clothing for you</p>
            </div>
            <div class="header-right">
                <h2>TAX INVOICE</h2>
                <p style="color: #6b7280; font-size: 14px; margin: 0;">#${order.orderNumber || order.invoiceNumber || 'N/A'}</p>
                <p style="color: #6b7280; font-size: 14px; margin: 4px 0 0 0;">${new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
        </div>

        <div class="info-grid">
            <div class="info-section">
                <h3>Billed To</h3>
                <p><strong>${order.shippingAddress?.fullName || 'Customer Name'}</strong></p>
                <p>${order.shippingAddress?.addressLine1 || ''}</p>
                ${order.shippingAddress?.addressLine2 ? `<p>${order.shippingAddress.addressLine2}</p>` : ''}
                <p>${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''} - ${order.shippingAddress?.pincode || ''}</p>
                <p>${order.shippingAddress?.country || 'India'}</p>
                <p style="margin-top: 8px;">Phone: ${order.shippingAddress?.phone || 'N/A'}</p>
            </div>
            <div class="info-section">
                <h3>Payment Info</h3>
                <p><strong>Method:</strong> <span style="text-transform: uppercase;">${order.paymentMethod || 'N/A'}</span></p>
                <p><strong>Status:</strong> 
                    <span class="badge ${order.paymentStatus === 'paid' ? 'badge-paid' : 'badge-unpaid'}">
                        ${order.paymentStatus || 'Pending'}
                    </span>
                </p>
                <p><strong>Order Status:</strong> <span style="text-transform: capitalize;">${order.orderStatus || 'Pending'}</span></p>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Item Description</th>
                    <th class="center">Qty</th>
                    <th class="right">Price</th>
                    <th class="right">Total</th>
                </tr>
            </thead>
            <tbody>
                ${(order.items || []).map((item: any) => `
                <tr>
                    <td class="product-details">
                        <span class="title">${item.title || item.name || 'Product'}</span>
                        ${(item.size || item.color) ? `<span class="meta">Size: ${item.size || 'N/A'} | Color: ${item.color || 'N/A'}</span>` : ''}
                    </td>
                    <td class="center">${item.quantity || 1}</td>
                    <td class="right">₹${Number(item.discountPrice || item.price || 0).toFixed(2)}</td>
                    <td class="right">₹${(Number(item.quantity || 1) * Number(item.discountPrice || item.price || 0)).toFixed(2)}</td>
                </tr>
                `).join("")}
            </tbody>
        </table>

        <div class="summary-container">
            <div class="summary-box">
                <div class="summary-row">
                    <span>Subtotal</span>
                    <span>₹${Number(order.subtotal || 0).toFixed(2)}</span>
                </div>
                <div class="summary-row">
                    <span>Shipping Fee</span>
                    <span>₹${Number(order.shippingFee || 0).toFixed(2)}</span>
                </div>
                ${order.gstAmount ? `
                <div class="summary-row">
                    <span>GST (${order.gst || 0}%)</span>
                    <span>₹${Number(order.gstAmount).toFixed(2)}</span>
                </div>
                ` : ''}
                ${order.discount ? `
                <div class="summary-row">
                    <span>Discount</span>
                    <span style="color: #16a34a;">-₹${Number(order.discount).toFixed(2)}</span>
                </div>
                ` : ''}
                <div class="summary-row total">
                    <span>Grand Total</span>
                    <span class="amount">₹${Number(order.totalAmount || 0).toFixed(2)}</span>
                </div>
            </div>
        </div>
        </div>
        <div class="footer">
            <p>Thank you for shopping with VASTRA_VERSE!</p>
            <p style="font-size: 12px; color: #9ca3af;">If you have any questions concerning this invoice, contact our support team.</p>
        </div>
    </div>
</body>
</html>`