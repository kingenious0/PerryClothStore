// Wigal SMS Service for Ghana

const WIGAL_API_KEY = process.env.WIGAL_API_KEY!;
const WIGAL_SENDER_ID = process.env.WIGAL_SENDER_ID || 'PerryStore';
const WIGAL_API_URL = process.env.WIGAL_API_URL || 'https://api.wigal.com.gh';

export interface SendSMSParams {
  to: string; // Phone number in E.164 format
  message: string;
}

export interface SendSMSResponse {
  success: boolean;
  message: string;
  messageId?: string;
  error?: string;
}

/**
 * Send SMS via Wigal API
 */
export async function sendSMS(params: SendSMSParams): Promise<SendSMSResponse> {
  try {
    const response = await fetch(`${WIGAL_API_URL}/v1/sms/send`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WIGAL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: WIGAL_SENDER_ID,
        recipient: params.to,
        message: params.message,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send SMS');
    }

    return {
      success: true,
      message: 'SMS sent successfully',
      messageId: data.messageId || data.id,
    };
  } catch (error: any) {
    console.error('Wigal SMS error:', error);
    return {
      success: false,
      message: 'Failed to send SMS',
      error: error.message,
    };
  }
}

/**
 * Send OTP SMS
 */
export async function sendOTPSMS(phoneNumber: string, code: string): Promise<SendSMSResponse> {
  const message = `Your Perry Store verification code is: ${code}. Valid for 10 minutes. Do not share this code with anyone.`;
  
  return sendSMS({
    to: phoneNumber,
    message,
  });
}

/**
 * Send order confirmation SMS
 */
export async function sendOrderConfirmationSMS(
  phoneNumber: string,
  orderNumber: string,
  total: number
): Promise<SendSMSResponse> {
  const message = `Thank you for your order! Order #${orderNumber} (GH₵${total.toFixed(2)}) has been confirmed. Track your order at perrystore.com/orders/${orderNumber}`;
  
  return sendSMS({
    to: phoneNumber,
    message,
  });
}

/**
 * Send order status update SMS
 */
export async function sendOrderStatusSMS(
  phoneNumber: string,
  orderNumber: string,
  status: string
): Promise<SendSMSResponse> {
  const statusMessages: Record<string, string> = {
    processing: 'Your order is being processed',
    shipped: 'Your order has been shipped',
    delivered: 'Your order has been delivered',
    cancelled: 'Your order has been cancelled',
  };

  const message = `Order #${orderNumber}: ${statusMessages[status] || status}. Track at perrystore.com/orders/${orderNumber}`;
  
  return sendSMS({
    to: phoneNumber,
    message,
  });
}

/**
 * Send promotional SMS
 */
export async function sendPromotionalSMS(
  phoneNumber: string,
  message: string
): Promise<SendSMSResponse> {
  return sendSMS({
    to: phoneNumber,
    message: `${message} - Perry Store`,
  });
}

/**
 * Send bulk SMS
 */
export async function sendBulkSMS(
  recipients: string[],
  message: string
): Promise<{ success: number; failed: number; results: SendSMSResponse[] }> {
  const results = await Promise.all(
    recipients.map(phone => sendSMS({ to: phone, message }))
  );

  const success = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  return { success, failed, results };
}
