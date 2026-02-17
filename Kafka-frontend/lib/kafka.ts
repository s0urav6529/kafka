import { Kafka, Producer } from 'kafkajs';

let producer: Producer | null = null;
let isConnecting = false;

const kafka = new Kafka({
    clientId: 'kafka-frontend-app',
    brokers: ['localhost:9092'],
    connectionTimeout: 3000, // 3 seconds
    requestTimeout: 5000, // 5 seconds
    retry: {
        initialRetryTime: 100,
        retries: 3
    }
});

export async function getProducer(): Promise<Producer> {
    if (producer && !isConnecting) {
        return producer;
    }

    if (isConnecting) {
        // Wait for the connection to complete
        while (isConnecting) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return producer!;
    }

    try {
        isConnecting = true;
        producer = kafka.producer();
        await producer.connect();
        console.log('Kafka producer connected successfully');
        isConnecting = false;
        return producer;
    } catch (error) {
        isConnecting = false;
        console.error('Failed to connect Kafka producer:', error);
        throw error;
    }
}

export async function sendMessage(topic: string, key: string, value: string) {
    try {
        const producerInstance = await getProducer();
        await producerInstance.send({
            topic,
            messages: [{ key, value }],
        });
        console.log(`Message sent to topic "${topic}": ${value}`);
        return { success: true };
    } catch (error) {
        console.error(`Failed to send message to topic "${topic}":`, error);
        throw error;
    }
}

// Cleanup function for graceful shutdown
export async function disconnectProducer() {
    if (producer) {
        await producer.disconnect();
        producer = null;
        console.log('Kafka producer disconnected');
    }
}
