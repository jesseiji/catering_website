import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(req: NextRequest) {
  try {
    const { name, contact, message } = await req.json();

    if (!name || !contact || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const toEmail = process.env.CONTACT_EMAIL || 'hello@example.com';

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: toEmail,
      subject: `New inquiry from ${name}`,
      text: `Name: ${name}\nContact: ${contact}\n\nMessage:\n${message}`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Contact form error:', err);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
