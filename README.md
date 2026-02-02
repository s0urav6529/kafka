To run Kafka on Docker, first confirm your Docker Desktop is running. Then execute the following command from the kafka-on-docker directory:

     docker compose up -d

The -d flag runs the docker container in detached mode which is similar to running Unix commands in the background by appending &. To confirm the container is running, run this command:

    docker logs <broker_container_name>

Now let's produce and consume a message! To produce a message, let's open a command terminal on the Kafka any broker container:

    docker exec -it -w /opt/kafka/bin <broker_container_name> sh


Then create a topic:

     ./kafka-topics.sh --create --topic <topic_name> --partitions 2 --replication-factor 2 --bootstrap-server <broker_container_name>:29092

To shut down the container, run

    docker compose down -v

---

For see the topics that are in the kafka broker

    docker exec -it <broker_container_name> bash

then go

    /opt/kafka/bin/kafka-topics.sh --bootstrap-server <broker_container_name>:29092 --list

---

Run the produce

    node producer.js

Run the consume

    node consumer.js

---

**Open Postman for testing**

    curl -X POST http://localhost:4000/produce \
    -H "Content-Type: application/json" \
    -d '{"message":"Hello from postman."}'


Multiple consumers in the same group can consume simultaneously only if the **topic has ≥ number of partitions**.

Kafka guarantees:

1 partition → 1 consumer per group

A partition is never read by two consumers in the same group at the same time

Key rule:

    Max parallel consumers per group = number of partitions

Extra consumers ≠ more throughput. If **consumer > partitions** then rest of consumers become idle.

How to check partitions:

    docker exec -it <broker_container_name> bash

    /opt/kafka/bin/kafka-topics.sh --describe --topic <topic_name> --bootstrap-server <broker_container_name>:29092

How to increase partitions:

    docker exec -it <broker_container_name> bash

    /opt/kafka/bin/kafka-topics.sh --alter --topic <topic_name> --partitions 3 --bootstrap-server <broker_container_name>:29092

**Note:** can’t decrease partitions later.

If multiple consumer in one group then client id must me unique:

    KafkaJS uses clientId + groupId to identify members
    
    Same groupId → ✔️ load balancing (keep this)
    Different clientId → ✔️ required

