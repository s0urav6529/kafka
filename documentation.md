# Kafka Event Streaming Platform

**An event-driven application demonstrating real-time message streaming with Apache Kafka, Node.js, and Next.js.**

Learn how to build a complete Kafka ecosystem: producers, consumers, multiple consumer groups, REST APIs, and web UI for monitoring.

## Quick Start

1. Start Kafka with Docker (`docker compose up -d`)
2. Create topics (`node admin.js`)
3. Run producer (`node producer.js`)
4. Start consumers and frontend
5. Open `http://localhost:3000`

## Key Components

- **Kafka Broker** - 3 topics with partitions (notification, payments, emails)
- **Producers** - Send messages to topics
- **Consumers** - 2 independent groups processing messages
- **Next.js API** - Order, payment, and email endpoints
- **Frontend UI** - Interactive dashboard with Tailwind CSS
- **Kafka-UI** - Monitoring dashboard at `http://localhost:8080`
- **Docker** - Complete containerized setup

---

## Architecture & Data Flow

**Message Flow:**

1. User submits form on frontend
2. Frontend calls API endpoint
3. API publishes message to Kafka topic
4. Consumer groups independently process messages
5. Kafka-UI shows real-time monitoring

---

## Prerequisites & Installation

### Requirements

- Docker Desktop (running)
- Node.js 16+
- npm
- 4GB RAM minimum

### Install Dependencies

```bash
cd kafka
npm install
cd Kafka-frontend && npm install && cd ..
```

---

## Running the Application

**Terminal 1: Start Kafka**

```bash
cd kafka-docker
docker compose up -d
sleep 30  # Wait for Kafka to be ready
cd ..
```

**Terminal 2: Create Topics**

```bash
node admin.js
```

**Terminal 3: Start Producer**

```bash
node producer.js
```

**Terminal 4: Start Consumers**

```bash
cd consumers/group-A && node consumer-1.js
```

**Terminal 5: Start Frontend**

```bash
cd Kafka-frontend
npm run dev
```

Open `http://localhost:3000` in browser.

---

## API Endpoints

### Health Check

```
GET /api/health
Response: { status: "connected", topics: [...] }
```

### Place Order

```
POST /api/order/place
Body: { orderId, customerName, productName, quantity, totalAmount }
Response: { success: true, orderId }
```

### Complete Payment

```
POST /api/payment/complete
Body: { paymentId, orderId, amount, status }
Response: { success: true, paymentId }
```

### Send Email

```
POST /api/email/send
Body: { emailId, recipientEmail, subject, body }
Response: { success: true, emailId }
```

---

## Consumer Groups

### Group A

- Located: `consumers/group-A/`
- Members: consumer-1.js, consumer-2.js
- Processes: All 3 topics (notification, payments, emails)

### Group B

- Located: `consumers/group-B/`
- Members: consumer-1.js
- Processes: All 3 topics independently

Each group processes messages separately. Messages are distributed among consumers within a group.

---

## Kafka Topics

| Topic        | Partitions | Purpose                        |
| ------------ | ---------- | ------------------------------ |
| notification | 2          | Order and system notifications |
| payments     | 2          | Payment transaction events     |
| emails       | 2          | Email sending events           |

---

## Monitoring

**Kafka-UI Dashboard:** `http://localhost:8080`

- View all topics and partitions
- Monitor consumer lag
- Explore message contents
- Check cluster health

---

## File Descriptions

| File                        | Purpose                                       |
| --------------------------- | --------------------------------------------- |
| admin.js                    | Creates notification, payments, emails topics |
| producer.js                 | Generates 10 test messages for each topic     |
| consumer-x.js               | Subscribes to topics and logs messages        |
| Kafka-frontend/lib/kafka.ts | Producer configuration and send logic         |
| Kafka-frontend/app/page.tsx | UI with order, payment, email forms           |
| docker-compose.yml          | Kafka broker + Kafka-UI configuration         |

---

## Key Concepts

**Topic** - Named message stream (e.g., notification, payments, emails)

**Partition** - Topic divided for parallel processing and scalability

**Producer** - Sends messages to topics (e.g., producer.js)

**Consumer** - Reads and processes messages (e.g., consumer-1.js)

**Consumer Group** - Multiple consumers sharing a topic (e.g., group-a, group-b)

**Offset** - Consumer's current position in a partition

**Message** - Data unit with key, value, topic, and partition

---

## Next Steps

- Explore Kafka-UI at `http://localhost:8080`
- Modify `producer.js` to send custom messages
- Create new consumer groups for different logic
- Add new topics for additional event types
- Integrate with databases, APIs, or external services

---

**Version:** 1.0.0  
**Last Updated:** February 2026  
**License:** ISC
