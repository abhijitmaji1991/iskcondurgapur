import Razorpay from 'razorpay';
import { NextRequest, NextResponse } from 'next/server';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
    try {
        const { amount, currency = 'INR', cause, donorInfo } = await req.json();

        if (!amount || amount < 1) {
            return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
        }

        // Razorpay expects amount in paise (1 INR = 100 paise)
        const order = await razorpay.orders.create({
            amount: Math.round(amount * 100),
            currency,
            receipt: `donation_${cause}_${Date.now()}`,
            notes: {
                cause,
                donorName: donorInfo?.name || '',
                donorEmail: donorInfo?.email || '',
                donorPhone: donorInfo?.phone || '',
                donorPan: donorInfo?.pan || '',
            },
        });

        return NextResponse.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error: unknown) {
        console.error('Razorpay order creation error:', error);
        const message = error instanceof Error ? error.message : 'Failed to create order';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
