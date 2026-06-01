import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { mobile, otp } = await req.json();

        if (!mobile || !otp) {
            return NextResponse.json(
                { error: 'Mobile number and OTP are required' },
                { status: 400 }
            );
        }

        // MOCK: Verify against the hardcoded test OTP
        if (otp === '1234') {
            return NextResponse.json({ 
                success: true, 
                message: 'OTP verified successfully',
                // In a real app, you might return a secure signed URL or token here
                downloadUrl: '/downloads/IDC_Certificate.pdf' // Example dummy link
            }, { status: 200 });
        } else {
            return NextResponse.json({ 
                success: false, 
                error: 'Invalid OTP' 
            }, { status: 400 });
        }

    } catch (error: any) {
        console.error('Error verifying OTP:', error);
        return NextResponse.json({ error: 'Failed to verify OTP' }, { status: 500 });
    }
}
