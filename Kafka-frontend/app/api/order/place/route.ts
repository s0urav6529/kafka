import { NextRequest, NextResponse } from 'next/server';
import { sendMessage } from '@/lib/kafka';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { orderId, customerName, productName, quantity, totalAmount } = body;

        // Validate required fields
        if (!orderId || !customerName || !productName) {
            return NextResponse.json(
                { error: 'Missing required fields: orderId, customerName, productName' },
                { status: 400 }
            );
        }

        // Create notification message
        const message = JSON.stringify({
            type: 'ORDER_PLACED',
            orderId,
            customerName,
            productName,
            quantity: quantity || 1,
            totalAmount: totalAmount || 0,
            timestamp: new Date().toISOString(),
        });

        // Send to notification topic
        await sendMessage('notification', `order-${orderId}`, message);

        return NextResponse.json({
            success: true,
            message: 'Order placed successfully and notification sent',
            orderId,
        });
    } catch (error) {
        console.error('Error placing order:', error);
        return NextResponse.json(
            { error: 'Failed to place order', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
