import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { mobile } = await req.json();

        if (!mobile || mobile.length < 10) {
            return NextResponse.json(
                { error: 'Valid mobile number is required' },
                { status: 400 }
            );
        }

        // MOCK: In a real scenario, integrate an SMS gateway here (e.g., MSG91, Twilio).
        // For testing, we just return success and log it.
        console.log(`[MOCK SMS] Sending OTP 1234 to mobile: ${mobile}`);

        return NextResponse.json({ 
            success: true, 
            message: 'OTP sent successfully (Mock: use 1234 to verify)' 
        }, { status: 200 });

    } catch (error: any) {
        console.error('Error sending OTP:', error);
        return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
    }
}
