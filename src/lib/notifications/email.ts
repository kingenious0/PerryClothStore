// Resend Email Service

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Perry Store <noreply@perrystore.com>';

export interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

export interface SendEmailResponse {
  success: boolean;
  message: string;
  emailId?: string;
  error?: string;
}

/**
 * Send email via Resend
 */
export async function sendEmail(params: SendEmailParams): Promise<SendEmailResponse> {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: params.to,
      subject: params.subject,
      html: params.html,
      text: params.text,
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      message: 'Email sent successfully',
      emailId: data?.id,
    };
  } catch (error: any) {
    console.error('Resend email error:', error);
    return {
      success: false,
      message: 'Failed to send email',
      error: error.message,
    };
  }
}

/**
 * Send verification email
 */
export async function sendVerificationEmail(
  email: string,
  verificationLink: string
): Promise<SendEmailResponse> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Verify Your Email</h1>
          </div>
          <div class="content">
            <p>Hi there!</p>
            <p>Thank you for signing up with Perry Store. Please verify your email address by clicking the button below:</p>
            <p style="text-align: center;">
              <a href="${verificationLink}" class="button">Verify Email Address</a>
            </p>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #667eea;">${verificationLink}</p>
            <p>This link will expire in 24 hours.</p>
            <p>If you didn't create an account, you can safely ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Perry Store. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Verify your email address - Perry Store',
    html,
  });
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmationEmail(
  email: string,
  orderDetails: {
    orderNumber: string;
    customerName: string;
    items: Array<{ name: string; quantity: number; price: number }>;
    total: number;
    shippingAddress: string;
  }
): Promise<SendEmailResponse> {
  const itemsHtml = orderDetails.items
    .map(
      item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">GH₵${item.price.toFixed(2)}</td>
      </tr>
    `
    )
    .join('');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; }
          .order-number { font-size: 24px; font-weight: bold; color: #667eea; margin: 20px 0; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; background: white; }
          th { background: #667eea; color: white; padding: 10px; text-align: left; }
          .total { font-size: 20px; font-weight: bold; color: #667eea; text-align: right; margin-top: 20px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✓ Order Confirmed!</h1>
          </div>
          <div class="content">
            <p>Hi ${orderDetails.customerName},</p>
            <p>Thank you for your order! We're getting it ready for you.</p>
            <div class="order-number">Order #${orderDetails.orderNumber}</div>
            
            <h3>Order Summary</h3>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th style="text-align: center;">Quantity</th>
                  <th style="text-align: right;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
            
            <div class="total">Total: GH₵${orderDetails.total.toFixed(2)}</div>
            
            <h3>Shipping Address</h3>
            <p>${orderDetails.shippingAddress}</p>
            
            <p>Track your order at: <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders/${orderDetails.orderNumber}">View Order</a></p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Perry Store. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: `Order Confirmation #${orderDetails.orderNumber} - Perry Store`,
    html,
  });
}

/**
 * Send order status update email
 */
export async function sendOrderStatusEmail(
  email: string,
  orderNumber: string,
  status: string,
  customerName: string
): Promise<SendEmailResponse> {
  const statusMessages: Record<string, { title: string; message: string }> = {
    processing: {
      title: 'Order Processing',
      message: 'Your order is being prepared for shipment.',
    },
    shipped: {
      title: 'Order Shipped',
      message: 'Your order is on its way!',
    },
    delivered: {
      title: 'Order Delivered',
      message: 'Your order has been delivered. Enjoy your purchase!',
    },
    cancelled: {
      title: 'Order Cancelled',
      message: 'Your order has been cancelled.',
    },
  };

  const statusInfo = statusMessages[status] || { title: 'Order Update', message: 'Your order status has been updated.' };

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${statusInfo.title}</h1>
          </div>
          <div class="content">
            <p>Hi ${customerName},</p>
            <p>${statusInfo.message}</p>
            <p><strong>Order #${orderNumber}</strong></p>
            <p style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders/${orderNumber}" class="button">Track Order</a>
            </p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Perry Store. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: `${statusInfo.title} - Order #${orderNumber}`,
    html,
  });
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  resetLink: string
): Promise<SendEmailResponse> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Reset Your Password</h1>
          </div>
          <div class="content">
            <p>Hi there!</p>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            <p style="text-align: center;">
              <a href="${resetLink}" class="button">Reset Password</a>
            </p>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #667eea;">${resetLink}</p>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request a password reset, you can safely ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Perry Store. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Reset your password - Perry Store',
    html,
  });
}
