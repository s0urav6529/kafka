To run Kafka on Docker, first confirm your Docker Desktop is running. Then execute the following command from the kafka-docker directory:

     docker compose up -d

The -d flag runs the docker container in detached mode which is similar to running Unix commands in the background by appending &. To confirm the container is running, run this command:

    docker logs kafka

For checking docker using successfully-

    docker ps

For using kafka-ui on the browser

    http://localhost:8080

To shut down the container, run

    docker compose down -v

---

For see the topics that are in the kafka broker

    docker exec -it broker bash

then go

    /opt/kafka/bin/kafka-topics.sh --bootstrap-server broker:29092 --list

---

Run the produce

    node producer.js

Run the consume

    node consumer.js

---
