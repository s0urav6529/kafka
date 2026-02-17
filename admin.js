import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'admin-client',
  brokers: ['localhost:9092']
});

const admin = kafka.admin();

const TOPICS = [
  { topic: 'notification', numPartitions: 2, replicationFactor: 1 },
  { topic: 'payments',     numPartitions: 2, replicationFactor: 1 },
  { topic: 'emails',       numPartitions: 2, replicationFactor: 1 },
];

const run = async () => {
  await admin.connect();
  console.log('Admin connected');

  // Check which topics already exist
  const existingTopics = await admin.listTopics();
  console.log('Existing topics:', existingTopics);

  const topicsToCreate = TOPICS.filter(t => !existingTopics.includes(t.topic));

  if (topicsToCreate.length === 0) {
    console.log('All topics already exist, nothing to create.');
  } else {
    await admin.createTopics({ topics: topicsToCreate });
    console.log('Created topics:', topicsToCreate.map(t => t.topic).join(', '));
  }

  await admin.disconnect();
  console.log('Admin disconnected');
};

run().catch(err => console.error('Admin error:', err));