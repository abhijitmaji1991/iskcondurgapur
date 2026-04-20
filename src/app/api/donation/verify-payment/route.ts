import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = await req.json();

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json({ error: 'Missing payment details' }, { status: 400 });
        }

        // Verify signature using HMAC-SHA256
        const body = `${razorpay_order_id}|${razorpay_payment_id}`;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
            .update(body)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
        }

        // Payment is verified ✓
        return NextResponse.json({
            success: true,
            paymentId: razorpay_payment_id,
            message: 'Payment verified successfully. Thank you for your seva!',
        });
    } catch (error: unknown) {
        console.error('Payment verification error:', error);
        const message = error instanceof Error ? error.message : 'Verification failed';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
