import express from "express";
import { Kafka } from "kafkajs";
import { WebSocketServer } from "ws";

const app = express();

// WebSocket server
const wss = new WebSocketServer({ port: 5001 });
console.log("🚀 WebSocket server running on port 5001");

// Kafka setup
const kafka = new Kafka({
  clientId: "consumer-api",
  brokers: ["localhost:9092"], // host-mapped Kafka broker
});

// Kafka consumer
const consumer = kafka.consumer({ groupId: "frontend-group" });

const runConsumer = async () => {
  try {
    await consumer.connect();
    console.log("✅ Kafka Consumer connected");

    await consumer.subscribe({ topic: "short-call", fromBeginning: true });
    console.log("📥 Subscribed to topic: short-call");

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const data = message.value.toString();
        console.log(`📩 Received message from ${topic}[${partition}]: ${data}`);

        // Broadcast to all WebSocket clients
        wss.clients.forEach((client) => {
          if (client.readyState === client.OPEN) {
            client.send(data);
          }
        });
      },
    });

    // Optional: Express API to check health
    app.get("/health", (req, res) => res.json({ status: "ok" }));
    app.listen(4001, () => console.log("🟢 Express server running on port 4001"));

  } catch (err) {
    console.error("❌ Kafka consumer error:", err);
    process.exit(1);
  }
};

runConsumer();
