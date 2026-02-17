import { NextRequest, NextResponse } from 'next/server';
import { sendMessage } from '@/lib/kafka';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { paymentId, orderId, amount, paymentMethod, status } = body;

        // Validate required fields
        if (!paymentId || !orderId || !amount) {
            return NextResponse.json(
                { error: 'Missing required fields: paymentId, orderId, amount' },
                { status: 400 }
            );
        }

        // Create payment message
        const message = JSON.stringify({
            type: 'PAYMENT_COMPLETED',
            paymentId,
            orderId,
            amount,
            paymentMethod: paymentMethod || 'unknown',
            status: status || 'completed',
            timestamp: new Date().toISOString(),
        });

        // Send to payments topic
        await sendMessage('payments', `payment-${paymentId}`, message);

        return NextResponse.json({
            success: true,
            message: 'Payment completed successfully',
            paymentId,
        });
    } catch (error) {
        console.error('Error completing payment:', error);
        return NextResponse.json(
            { error: 'Failed to complete payment', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
