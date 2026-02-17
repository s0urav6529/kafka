import { NextResponse } from 'next/server';
import { Kafka } from 'kafkajs';

export async function GET() {
    try {
        const kafka = new Kafka({
            clientId: 'kafka-health-check',
            brokers: ['localhost:9092'],
            connectionTimeout: 3000,
            requestTimeout: 5000,
        });

        const admin = kafka.admin();

        // Try to connect with timeout
        const connectPromise = admin.connect();
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Connection timeout')), 5000)
        );

        await Promise.race([connectPromise, timeoutPromise]);

        // Try to list topics to verify connection
        const topics = await admin.listTopics();
        await admin.disconnect();

        return NextResponse.json({
            status: 'connected',
            message: 'Successfully connected to Kafka',
            topics: topics,
            broker: 'localhost:9092'
        });
    } catch (error) {
        console.error('Kafka health check failed:', error);
        return NextResponse.json(
            {
                status: 'disconnected',
                error: error instanceof Error ? error.message : 'Unknown error',
                details: 'Make sure Kafka is running on localhost:9092'
            },
            { status: 503 }
        );
    }
}
