import { NextRequest, NextResponse } from 'next/server';
import { sendMessage } from '@/lib/kafka';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { emailId, recipientEmail, subject, body: emailBody, sender } = body;

        // Validate required fields
        if (!emailId || !recipientEmail || !subject) {
            return NextResponse.json(
                { error: 'Missing required fields: emailId, recipientEmail, subject' },
                { status: 400 }
            );
        }

        // Create email message
        const message = JSON.stringify({
            type: 'EMAIL_SENT',
            emailId,
            recipientEmail,
            subject,
            body: emailBody || '',
            sender: sender || 'noreply@example.com',
            timestamp: new Date().toISOString(),
        });

        // Send to emails topic
        await sendMessage('emails', `email-${emailId}`, message);

        return NextResponse.json({
            success: true,
            message: 'Email sent successfully',
            emailId,
        });
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json(
            { error: 'Failed to send email', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
