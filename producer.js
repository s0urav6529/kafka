import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'my-nodejs-app',
  brokers: ['localhost:9092']
});

const producer = kafka.producer();

const run = async () => {
  await producer.connect();
  console.log('Producer connected');

  for (let i = 1; i <= 10; i++) {
    // notification topic
    await producer.send({
      topic: 'notification',
      messages: [{ key: `key-${i}`, value: `Notification message ${i}` }]
    });
    console.log(`Sent to notification: Message ${i}`);

    // payments topic
    await producer.send({
      topic: 'payments',
      messages: [{ key: `key-${i}`, value: `Payment message ${i}` }]
    });
    console.log(`Sent to payments: Message ${i}`);

    // emails topic
    await producer.send({
      topic: 'emails',
      messages: [{ key: `key-${i}`, value: `Email message ${i}` }]
    });
    console.log(`Sent to emails: Message ${i}`);
  }

  await producer.disconnect();
  console.log('Producer disconnected');
};

run().catch(err => console.error('Producer error:', err));