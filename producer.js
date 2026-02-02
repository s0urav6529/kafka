import express from "express";
import { Kafka, logLevel } from "kafkajs";
import crypto from "crypto";

const app = express();
app.use(express.json());

// Kafka client setup
const kafka = new Kafka({
  clientId: "producer-api",
  brokers: [
    "localhost:9092", // broker1
    "localhost:9093", // broker2
  ],
  logLevel: logLevel.INFO,
});

// Create producer
const producer = kafka.producer({
  allowAutoTopicCreation: false, // safer in prod
  idempotent: true,              // exactly-once guarantees (best practice)
  retry: {
    retries: 5,
  },
});

const runProducer = async () => {
  try {
    await producer.connect();
    console.log("✅ Kafka Producer connected to cluster");

    // POST endpoint to send messages
    app.post("/produce", async (req, res) => {
      const { message } = req.body;

      if (!message) {
        return res.status(400).json({
          error: "Message is required in request body",
        });
      }

      try {
        await producer.send({
          topic: "notification",
          messages: [
            {
              key: crypto.randomUUID(),
              value: message,
            },
          ],
        });

        console.log(`📤 Message sent: ${message}`);
        res.json({
          status: "sent to kafka",
          brokerCount: 2,
          message,
        });
      } catch (err) {
        console.error("❌ Error sending message:", err);
        res.status(500).json({
          error: "Failed to send message to Kafka",
        });
      }
    });

    // Start Express server
    app.listen(4000, () =>
      console.log("🚀 Producer API running on port 4000")
    );
  } catch (err) {
    console.error("❌ Failed to connect Kafka producer:", err);
    process.exit(1);
  }
};

runProducer();
