import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'group-b-consumer-1',
  brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'group-b' });

const handleNotification = (partition, message) => {
  console.log(`[Group-B | Consumer-1] 🔔 NOTIFICATION | partition=${partition} key=${message.key} value=${message.value}`);
};

const handlePayment = (partition, message) => {
  console.log(`[Group-B | Consumer-1] 💳 PAYMENT | partition=${partition} key=${message.key} value=${message.value}`);
};

const handleEmail = (partition, message) => {
  console.log(`[Group-B | Consumer-1] 📧 EMAIL | partition=${partition} key=${message.key} value=${message.value}`);
};

const run = async () => {
  await consumer.connect();
  console.log('[Group-B | Consumer-1] Connected');

  await consumer.subscribe({ topics: ['notification', 'payments', 'emails'], fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      switch (topic) {
        case 'notification':
          handleNotification(partition, message);
          break;
        case 'payments':
          handlePayment(partition, message);
          break;
        case 'emails':
          handleEmail(partition, message);
          break;
        default:
          console.warn(`[Group-B | Consumer-1] ⚠️ Unknown topic: ${topic}`);
      }
    }
  });
};

run().catch(err => console.error('[Group-B | Consumer-1] Error:', err));