import express from "express";
import { Kafka, logLevel } from "kafkajs";

const app = express();

const kafka = new Kafka({
  clientId: "consumer-api-2", // 🔑 UNIQUE
  brokers: ["localhost:9092", "localhost:9093"],
  logLevel: logLevel.INFO,
});

const consumer = kafka.consumer({
  groupId: "frontend-group", // ✅ SAME GROUP
});

const runConsumer = async () => {
  await consumer.connect();
  console.log("✅ Consumer-2 connected");

  await consumer.subscribe({
    topic: "notification",
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(
        `🔵 Consumer-2 | ${topic}[${partition}] → ${message.value?.toString()}`
      );
    },
  });

  app.listen(4002, () =>
    console.log("🔵 Consumer-2 server running on port 4002")
  );
};

runConsumer();

process.on("SIGINT", async () => {
  await consumer.disconnect();
  process.exit(0);
});
