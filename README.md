### Run Kafka on Docker

First confirm your Docker Desktop is running. Then execute the following command from the kafka-docker directory:

     docker compose up -d

The -d flag runs the docker container in detached mode which is similar to running Unix commands in the background by appending &. To confirm the container is running, run this command:

    docker logs kafka

For checking docker images running successfully-

    docker ps

You will see 2 images (kafka, kafka-ui) here.For using kafka-ui on the browser

    http://localhost:8080

Then go the topic, create topic and make fun.

---

### Run Kafka Producer UI

Go to the _kafka-frontend_ directory

    npm run dev

---

Run the consumer. First go to the _consumers_ directory then _group_ then run using below cmd-

    node consumer-x.js

_x_ is the consumer number.

---

### To shut down the kafka docker container, run

    docker compose down -v
