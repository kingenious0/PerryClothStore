import type { Order } from './types';

export function getOrderConfirmationEmailHTML(order: Order): string {
  const itemsList = order.items?.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
        <strong>${item.name}</strong><br>
        <span style="color: #6b7280; font-size: 14px;">
          ${item.size ? `Size: ${item.size}` : ''} 
          ${item.color ? `Color: ${item.color}` : ''} 
          Qty: ${item.quantity}
        </span>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
        GH₵${(item.price * item.quantity).toFixed(2)}
      </td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation - PerryStore</title>
      </head>
      <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 32px; font-weight: bold;">PerryStore</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Luxury and sophistication, redefined</p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="display: inline-block; background-color: #10b981; color: white; padding: 12px 24px; border-radius: 50px; font-weight: bold;">
                ✓ Order Confirmed
              </div>
            </div>

            <h2 style="color: #111827; margin: 0 0 10px 0;">Thank you for your order!</h2>
            <p style="color: #6b7280; margin: 0 0 30px 0;">
              Hi ${order.customer_name}, we've received your order and will process it soon. 
              You'll receive another email when your order ships.
            </p>

            <!-- Order Details -->
            <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
              <h3 style="margin: 0 0 15px 0; color: #111827; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Order Details</h3>
              <table style="width: 100%; font-size: 14px;">
                <tr>
                  <td style="padding: 5px 0; color: #6b7280;">Order Number:</td>
                  <td style="padding: 5px 0; text-align: right; font-weight: bold;">${order.orderNumber || order.id.slice(0, 8).toUpperCase()}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; color: #6b7280;">Order Date:</td>
                  <td style="padding: 5px 0; text-align: right; font-weight: bold;">${new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; color: #6b7280;">Payment Status:</td>
                  <td style="padding: 5px 0; text-align: right; font-weight: bold; color: #10b981;">Paid</td>
                </tr>
              </table>
            </div>

            <!-- Items -->
            <h3 style="margin: 0 0 15px 0; color: #111827;">Order Items</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
              ${itemsList}
              <tr>
                <td style="padding: 20px 12px 12px 12px; font-weight: bold; font-size: 18px;">Total</td>
                <td style="padding: 20px 12px 12px 12px; text-align: right; font-weight: bold; font-size: 18px; color: #667eea;">
                  GH₵${order.total.toFixed(2)}
                </td>
              </tr>
            </table>

            <!-- Shipping Address -->
            <h3 style="margin: 0 0 15px 0; color: #111827;">Shipping Address</h3>
            <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
              <p style="margin: 0; color: #374151; line-height: 1.6;">
                ${order.customer_name}<br>
                ${order.customer_address}<br>
                ${order.shippingAddress?.city || ''}, ${order.shippingAddress?.region || ''}<br>
                ${order.shippingAddress?.digitalAddress ? `Ghana Post: ${order.shippingAddress.digitalAddress}` : ''}
              </p>
            </div>

            <!-- Track Order Button -->
            <div style="text-align: center; margin: 40px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders/${order.id}" 
                 style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                Track Your Order
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
              Questions? Contact us at <a href="mailto:support@perrystore.com" style="color: #667eea; text-decoration: none;">support@perrystore.com</a>
            </p>
            <p style="margin: 0; color: #9ca3af; font-size: 12px;">
              © ${new Date().getFullYear()} PerryStore. All rights reserved.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function getOrderStatusUpdateEmailHTML(order: Order, newStatus: string): string {
  const statusMessages: Record<string, { title: string; message: string; color: string }> = {
    processing: {
      title: 'Your order is being processed',
      message: 'We\'re preparing your items for shipment.',
      color: '#3b82f6'
    },
    shipped: {
      title: 'Your order has shipped!',
      message: 'Your order is on its way to you.',
      color: '#8b5cf6'
    },
    delivered: {
      title: 'Your order has been delivered',
      message: 'We hope you enjoy your purchase!',
      color: '#10b981'
    },
  };

  const statusInfo = statusMessages[newStatus] || statusMessages.processing;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Order Update - PerryStore</title>
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; overflow: hidden;">
          <div style="background-color: ${statusInfo.color}; color: white; padding: 40px 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">${statusInfo.title}</h1>
          </div>
          <div style="padding: 40px 30px;">
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              Hi ${order.customer_name},
            </p>
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              ${statusInfo.message}
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders/${order.id}" 
                 style="display: inline-block; background-color: ${statusInfo.color}; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                View Order Details
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}
