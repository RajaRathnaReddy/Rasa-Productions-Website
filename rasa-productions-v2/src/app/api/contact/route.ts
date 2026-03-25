import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { name, email, phone, message } = await req.json();

        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Log the enquiry (in production, integrate with an email service like Resend or Nodemailer)
        console.log(`[Contact Form] New enquiry from: ${name} (${email})`);
        console.log(`Phone: ${phone}`);
        console.log(`Message: ${message}`);

        // TODO: Integrate with email service
        // Example with Resend:
        // await resend.emails.send({
        //   from: 'noreply@rasaproductions.com',
        //   to: 'rasaproductions@email.com',
        //   subject: `New Enquiry from ${name}`,
        //   text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\n${message}`,
        // });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error('[Contact API] Error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
